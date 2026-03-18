#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# deploy.sh – Zero-downtime deploy for the admin-mainbeta stack
#
# Usage:
#   ./deploy.sh              # Full deploy (pull + build + restart)
#   ./deploy.sh --pull-only  # Git pull only (no rebuild)
#   ./deploy.sh --build-only # Rebuild without git pull
#   ./deploy.sh --restart    # Restart containers only
#   ./deploy.sh --status     # Show container status
#   ./deploy.sh --logs       # Tail logs from all services
#   ./deploy.sh --setup      # First-time server setup
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
APP_DIR="${APP_DIR:-/opt/admin-mainbeta}"
COMPOSE_FILE="${APP_DIR}/docker-compose.yml"
BRANCH="${BRANCH:-main}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()  { echo -e "${BLUE}[deploy]${NC} $1"; }
ok()   { echo -e "${GREEN}[  ok  ]${NC} $1"; }
warn() { echo -e "${YELLOW}[ warn ]${NC} $1"; }
err()  { echo -e "${RED}[error ]${NC} $1"; }

# ── Helper: check prerequisites ──────────────────────────────
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
    if [ $missing -eq 1 ]; then
        err "Install missing prerequisites first. Run: ./deploy.sh --setup"
        exit 1
    fi
}

# ── First-time server setup ──────────────────────────────────
do_setup() {
    log "Starting first-time server setup..."

    # Update system
    log "Updating system packages..."
    sudo apt-get update && sudo apt-get upgrade -y

    # Install Docker
    if ! command -v docker &>/dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com | sudo sh
        sudo usermod -aG docker "$USER"
        ok "Docker installed. You may need to log out and back in for group changes."
    else
        ok "Docker already installed: $(docker --version)"
    fi

    # Install Certbot
    if ! command -v certbot &>/dev/null; then
        log "Installing Certbot..."
        sudo apt-get install -y certbot
        ok "Certbot installed."
    else
        ok "Certbot already installed: $(certbot --version 2>&1)"
    fi

    # Install common tools
    log "Installing utilities..."
    sudo apt-get install -y git curl wget htop ufw fail2ban

    # Firewall
    log "Configuring UFW firewall..."
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    sudo ufw --force enable
    ok "Firewall configured (SSH + HTTP + HTTPS)"

    # Create app directory
    if [ ! -d "$APP_DIR" ]; then
        sudo mkdir -p "$APP_DIR"
        sudo chown "$USER":"$USER" "$APP_DIR"
        ok "Created $APP_DIR"
    fi

    # Swap file (2GB) for small VPS instances
    if [ ! -f /swapfile ]; then
        log "Creating 2GB swap file..."
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
    echo "  1. Clone the repo:    git clone <your-repo-url> $APP_DIR"
    echo "  2. Configure env:     cp backend/.env.example backend/.env && nano backend/.env"
    echo "  3. Configure admin:   cp admin-next/.env.example admin-next/.env.local && nano admin-next/.env.local"
    echo "  4. Configure store:   cp apps/storefront/.env.example apps/storefront/.env.local && nano apps/storefront/.env.local"
    echo "  5. Deploy:            cd $APP_DIR && ./deploy.sh"
}

# ── Git pull ─────────────────────────────────────────────────
do_pull() {
    log "Pulling latest code from origin/${BRANCH}..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard "origin/${BRANCH}"
    ok "Code updated to $(git log --oneline -1)"
}

# ── Build containers ─────────────────────────────────────────
do_build() {
    log "Building Docker images..."
    cd "$APP_DIR"
    docker compose -f "$COMPOSE_FILE" build --parallel
    ok "All images built"
}

# ── Restart with zero downtime ───────────────────────────────
do_restart() {
    log "Restarting services..."
    cd "$APP_DIR"

    # Start in dependency order; --force-recreate ensures new images are used
    docker compose -f "$COMPOSE_FILE" up -d --force-recreate --remove-orphans

    # Wait for backend health
    log "Waiting for backend health check..."
    local retries=0
    while [ $retries -lt 30 ]; do
        if docker compose -f "$COMPOSE_FILE" exec -T backend wget -qO- http://localhost:5001/health &>/dev/null; then
            ok "Backend is healthy"
            break
        fi
        retries=$((retries + 1))
        sleep 2
    done

    if [ $retries -eq 30 ]; then
        warn "Backend health check timed out (may still be starting)"
    fi

    # Clean up old images
    docker image prune -f &>/dev/null || true

    echo ""
    ok "All services are running!"
    docker compose -f "$COMPOSE_FILE" ps
}

# ── Status ───────────────────────────────────────────────────
do_status() {
    cd "$APP_DIR"
    docker compose -f "$COMPOSE_FILE" ps
    echo ""
    log "Disk usage:"
    docker system df
}

# ── Logs ─────────────────────────────────────────────────────
do_logs() {
    cd "$APP_DIR"
    docker compose -f "$COMPOSE_FILE" logs -f --tail=100
}

# ── Full deploy ──────────────────────────────────────────────
do_deploy() {
    check_prereqs
    do_pull
    do_build
    do_restart
    echo ""
    ok "Deploy complete! 🚀"
}

# ── Main ─────────────────────────────────────────────────────
case "${1:-}" in
    --setup)      do_setup ;;
    --pull-only)  check_prereqs; do_pull ;;
    --build-only) check_prereqs; do_build ;;
    --restart)    check_prereqs; do_restart ;;
    --status)     do_status ;;
    --logs)       do_logs ;;
    -h|--help)
        echo "Usage: ./deploy.sh [option]"
        echo ""
        echo "Options:"
        echo "  (none)        Full deploy (pull + build + restart)"
        echo "  --setup       First-time server setup"
        echo "  --pull-only   Git pull only"
        echo "  --build-only  Rebuild images only"
        echo "  --restart     Restart containers only"
        echo "  --status      Show container status"
        echo "  --logs        Tail all service logs"
        echo ""
        echo "Environment:"
        echo "  APP_DIR       App directory (default: /opt/admin-mainbeta)"
        echo "  BRANCH        Git branch to deploy (default: main)"
        ;;
    *)            do_deploy ;;
esac
