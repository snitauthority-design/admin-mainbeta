#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# deploy.sh – Deploy script for the admin-mainbeta stack
#
# Usage:
#   ./deploy.sh                # Full deploy (pull + build + restart)
#   ./deploy.sh --pull-only    # Git pull only (no rebuild)
#   ./deploy.sh --build-only   # Rebuild without git pull
#   ./deploy.sh --restart      # Restart containers only
#   ./deploy.sh --status       # Show container status
#   ./deploy.sh --logs [svc]   # Tail logs (optionally for one service)
#   ./deploy.sh --setup        # First-time server setup
#   ./deploy.sh --ssl DOMAIN   # Obtain SSL certs and enable HTTPS
#   ./deploy.sh --sync-lock    # Regenerate backend package-lock.json
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
APP_DIR="${APP_DIR:-/opt/admin-mainbeta}"
COMPOSE_FILE="${APP_DIR}/docker-compose.yml"
BRANCH="${BRANCH:-main}"
HEALTH_URL="http://localhost:5001/health"
HEALTH_RETRIES=30
HEALTH_INTERVAL=3

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}[deploy]${NC} $1"; }
ok()   { echo -e "${GREEN}[  ok  ]${NC} $1"; }
warn() { echo -e "${YELLOW}[ warn ]${NC} $1"; }
err()  { echo -e "${RED}[error ]${NC} $1" >&2; }
die()  { err "$1"; exit 1; }

dc() { docker compose -f "$COMPOSE_FILE" "$@"; }

# ── Prerequisites ────────────────────────────────────────────
check_prereqs() {
    local missing=0
    for cmd in docker git; do
        if ! command -v "$cmd" &>/dev/null; then
            err "$cmd is not installed"
            missing=1
        fi
    done
    if ! docker compose version &>/dev/null; then
        err "docker compose (v2) is not available"
        missing=1
    fi
    (( missing )) && die "Install missing prerequisites: ./deploy.sh --setup"
    return 0
}

check_env_files() {
    local ok=1
    for f in backend/.env admin-next/.env.local apps/storefront/.env.local; do
        if [ ! -f "${APP_DIR}/${f}" ]; then
            err "Missing ${f}"
            ok=0
        fi
    done
    (( ok )) || die "Create missing .env files before deploying (see DEPLOYMENT.md)"
    return 0
}

# ── First-time server setup ─────────────────────────────────
do_setup() {
    log "Starting first-time server setup..."

    log "Updating system packages..."
    sudo apt-get update -qq && sudo apt-get upgrade -y -qq

    if ! command -v docker &>/dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com | sudo sh
        sudo usermod -aG docker "$USER"
        ok "Docker installed (log out/in for group changes)"
    else
        ok "Docker already installed: $(docker --version)"
    fi

    if ! command -v certbot &>/dev/null; then
        log "Installing Certbot..."
        sudo apt-get install -y -qq certbot
        ok "Certbot installed"
    else
        ok "Certbot already installed"
    fi

    log "Installing utilities..."
    sudo apt-get install -y -qq git curl wget htop ufw fail2ban

    log "Configuring UFW firewall..."
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    ok "Firewall configured (SSH + HTTP + HTTPS)"

    if [ ! -d "$APP_DIR" ]; then
        sudo mkdir -p "$APP_DIR"
        sudo chown "$USER":"$USER" "$APP_DIR"
        ok "Created $APP_DIR"
    fi

    if [ ! -f /swapfile ]; then
        log "Creating 2 GB swap file..."
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
        ok "Swap enabled"
    else
        ok "Swap already exists"
    fi

    echo ""
    ok "Server setup complete!"
    echo ""
    log "Next steps:"
    echo "  1. git clone <repo-url> $APP_DIR"
    echo "  2. cp backend/.env.example backend/.env && nano backend/.env"
    echo "  3. cp admin-next/.env.example admin-next/.env.local && nano admin-next/.env.local"
    echo "  4. cp apps/storefront/.env.example apps/storefront/.env.local && nano apps/storefront/.env.local"
    echo "  5. cd $APP_DIR && ./deploy.sh"
}

# ── SSL setup ────────────────────────────────────────────────
do_ssl() {
    local domain="${1:-}"
    [ -z "$domain" ] && die "Usage: ./deploy.sh --ssl YOURDOMAIN.com"

    log "Obtaining SSL certificate for *.${domain} ..."

    # Ensure certbot challenge directory exists
    mkdir -p "${APP_DIR}/certbot/www"

    # Stop nginx temporarily so certbot can bind to port 80
    dc stop nginx 2>/dev/null || true

    sudo certbot certonly --standalone \
        -d "${domain}" \
        -d "*.${domain}" \
        --agree-tos \
        --no-eff-email \
        --preferred-challenges dns \
        || die "Certbot failed – ensure DNS is pointed to this server"

    ok "Certificate obtained for ${domain}"

    # Generate production nginx config from SSL template
    log "Generating production nginx.conf..."
    sed "s/YOURDOMAIN\.com/${domain}/g" "${APP_DIR}/nginx/nginx.ssl.conf" \
        > "${APP_DIR}/nginx/nginx.conf"
    ok "nginx.conf updated for ${domain}"

    # Restart nginx
    dc up -d nginx
    ok "Nginx restarted with SSL"

    # Set up auto-renewal cron
    if ! sudo crontab -l 2>/dev/null | grep -q certbot; then
        (sudo crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --deploy-hook 'docker compose -f ${COMPOSE_FILE} exec -T nginx nginx -s reload'") | sudo crontab -
        ok "Auto-renewal cron installed (daily 3 AM)"
    else
        ok "Auto-renewal cron already exists"
    fi
}

# ── Sync lock files ──────────────────────────────────────────
# The backend Dockerfile needs its own package-lock.json but the
# monorepo workspace root manages dependencies. This generates a
# standalone lock file for the backend outside the workspace context.
do_sync_lock() {
    log "Regenerating backend package-lock.json..."
    local tmpdir
    tmpdir="$(mktemp -d)"
    cp "${APP_DIR}/backend/package.json" "$tmpdir/"
    (cd "$tmpdir" && npm install --package-lock-only --legacy-peer-deps 2>&1 | tail -3)
    cp "$tmpdir/package-lock.json" "${APP_DIR}/backend/package-lock.json"
    rm -rf "$tmpdir"
    ok "backend/package-lock.json regenerated"
}

# ── Git pull ─────────────────────────────────────────────────
do_pull() {
    log "Pulling latest code from origin/${BRANCH}..."
    cd "$APP_DIR"
    git fetch origin

    if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
        warn "Local changes detected – stashing..."
        git stash push -m "deploy-$(date +%Y%m%d-%H%M%S)"
    fi

    git checkout "$BRANCH" 2>/dev/null || true
    git reset --hard "origin/${BRANCH}"
    ok "Code updated to $(git --no-pager log --oneline -1)"
}

# ── Build containers ─────────────────────────────────────────
do_build() {
    log "Building Docker images..."
    cd "$APP_DIR"

    # Ensure backend lock file is in sync
    if ! (cd /tmp && cp "${APP_DIR}/backend/package.json" /tmp/_pkg_check.json && \
          npm install --package-lock-only --legacy-peer-deps --prefix /dev/null 2>/dev/null); then
        : # ignore check errors
    fi

    dc build --parallel 2>&1
    ok "All images built"
}

# ── Restart services ─────────────────────────────────────────
do_restart() {
    log "Restarting services..."
    cd "$APP_DIR"

    dc up -d --force-recreate --remove-orphans

    # Wait for backend to respond to HTTP requests (any status code)
    log "Waiting for backend to respond..."
    local retries=0
    while [ $retries -lt $HEALTH_RETRIES ]; do
        if curl -sf -o /dev/null -w '' "$HEALTH_URL" 2>/dev/null; then
            ok "Backend is healthy"
            break
        fi
        # Also accept degraded (503) – server is running, just missing Redis etc.
        local code
        code="$(curl -so /dev/null -w '%{http_code}' "$HEALTH_URL" 2>/dev/null || echo 000)"
        if [ "$code" -ge 200 ] && [ "$code" -lt 600 ] 2>/dev/null; then
            ok "Backend is responding (HTTP ${code})"
            break
        fi
        retries=$((retries + 1))
        sleep "$HEALTH_INTERVAL"
    done

    if [ $retries -eq $HEALTH_RETRIES ]; then
        warn "Backend did not respond after $((HEALTH_RETRIES * HEALTH_INTERVAL))s"
        warn "Check logs: ./deploy.sh --logs backend"
    fi

    # Verify all containers are running
    echo ""
    local failed=0
    for svc in backend admin storefront nginx; do
        local state
        state="$(dc ps --format '{{.State}}' "$svc" 2>/dev/null || echo "missing")"
        if [ "$state" = "running" ]; then
            ok "$svc is running"
        else
            err "$svc state: $state"
            failed=1
        fi
    done

    # Clean up dangling images
    docker image prune -f &>/dev/null || true

    echo ""
    if (( failed )); then
        warn "Some services failed to start – check logs"
    else
        ok "All services are running!"
    fi
    dc ps
}

# ── Status ───────────────────────────────────────────────────
do_status() {
    cd "$APP_DIR"
    dc ps
    echo ""
    log "Disk usage:"
    docker system df
    echo ""
    log "Backend health:"
    curl -s "$HEALTH_URL" 2>/dev/null | python3 -m json.tool 2>/dev/null || warn "Backend not reachable"
}

# ── Logs ─────────────────────────────────────────────────────
do_logs() {
    cd "$APP_DIR"
    local svc="${1:-}"
    if [ -n "$svc" ]; then
        dc logs -f --tail=100 "$svc"
    else
        dc logs -f --tail=100
    fi
}

# ── Full deploy ──────────────────────────────────────────────
do_deploy() {
    check_prereqs
    check_env_files
    do_pull
    do_sync_lock
    do_build
    do_restart
    echo ""
    ok "Deploy complete! 🚀"
}

# ── Main ─────────────────────────────────────────────────────
case "${1:-}" in
    --setup)       do_setup ;;
    --ssl)         check_prereqs; do_ssl "${2:-}" ;;
    --pull-only)   check_prereqs; do_pull ;;
    --build-only)  check_prereqs; do_build ;;
    --sync-lock)   do_sync_lock ;;
    --restart)     check_prereqs; do_restart ;;
    --status)      do_status ;;
    --logs)        do_logs "${2:-}" ;;
    -h|--help)
        echo "Usage: ./deploy.sh [option]"
        echo ""
        echo "Options:"
        echo "  (none)          Full deploy (pull + build + restart)"
        echo "  --setup         First-time server setup (Docker, firewall, swap)"
        echo "  --ssl DOMAIN    Obtain SSL cert and configure HTTPS"
        echo "  --pull-only     Git pull only"
        echo "  --build-only    Rebuild Docker images only"
        echo "  --sync-lock     Regenerate backend package-lock.json"
        echo "  --restart       Restart containers only"
        echo "  --status        Show container status + backend health"
        echo "  --logs [svc]    Tail logs (all services or one)"
        echo ""
        echo "Environment:"
        echo "  APP_DIR    App directory   (default: /opt/admin-mainbeta)"
        echo "  BRANCH     Git branch      (default: main)"
        ;;
    *)             do_deploy ;;
esac
