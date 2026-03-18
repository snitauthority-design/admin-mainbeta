# Ubuntu VPS Deployment Roadmap

> Full step-by-step guide for deploying the **admin-mainbeta** monorepo on an Ubuntu VPS (DigitalOcean, Hetzner, Contabo, etc.) using Docker.

---

## Architecture Overview

```
                         ┌──────────────────────────────────────┐
                         │          Ubuntu VPS Server            │
                         │                                      │
  Internet ──▶ :80/:443  │  ┌──────────────────────────────┐   │
                         │  │         Nginx (proxy)         │   │
                         │  │  admin.* → :3000              │   │
                         │  │  api.*   → :5001              │   │
                         │  │  store.* → :3001              │   │
                         │  │  assets.* → /var/www/uploads  │   │
                         │  │  *.domain → :3001 (tenants)   │   │
                         │  └──────────┬───────────────────┘   │
                         │             │                        │
                         │  ┌──────────▼───────────────────┐   │
                         │  │    Docker Compose Network     │   │
                         │  │                               │   │
                         │  │  ┌─────────┐  ┌───────────┐  │   │
                         │  │  │ Backend  │  │   Admin   │  │   │
                         │  │  │ :5001    │  │   :3000   │  │   │
                         │  │  └────┬─────┘  └───────────┘  │   │
                         │  │       │                        │   │
                         │  │  ┌────▼─────┐  ┌───────────┐  │   │
                         │  │  │ MongoDB  │  │Storefront │  │   │
                         │  │  │  (ext)   │  │  :3001    │  │   │
                         │  │  └──────────┘  └───────────┘  │   │
                         │  │                               │   │
                         │  │   Shared Volume: /uploads     │   │
                         │  └───────────────────────────────┘   │
                         └──────────────────────────────────────┘
```

**Services:**

| Service      | Port | Description                            |
|-------------|------|----------------------------------------|
| `backend`   | 5001 | Express.js API (Node 20)               |
| `admin`     | 3000 | Next.js Admin Dashboard                |
| `storefront`| 3001 | Next.js Storefront (SSG/ISR)           |
| `nginx`     | 80/443| Reverse proxy, SSL, static assets     |

---

## Phase 0 – VPS Requirements

### Minimum specs

| Resource | Minimum  | Recommended |
|---------|----------|-------------|
| CPU     | 2 vCPU   | 4 vCPU      |
| RAM     | 4 GB     | 8 GB        |
| Disk    | 40 GB SSD| 80 GB SSD   |
| OS      | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

### Domain setup

You need **one domain** (e.g., `yourdomain.com`) with these DNS records pointing to your VPS IP:

| Type | Name                  | Value (your VPS IP) |
|------|-----------------------|---------------------|
| A    | `api.yourdomain.com`  | `YOUR_VPS_IP`       |
| A    | `admin.yourdomain.com`| `YOUR_VPS_IP`       |
| A    | `store.yourdomain.com`| `YOUR_VPS_IP`       |
| A    | `assets.yourdomain.com`| `YOUR_VPS_IP`      |
| A    | `*.yourdomain.com`   | `YOUR_VPS_IP`       |

> **Wildcard `*` record** is important – it routes all tenant subdomains (e.g., `myshop.yourdomain.com`) to the storefront.

---

## Phase 1 – Server Setup

### 1.1 Connect to your VPS

```bash
ssh root@YOUR_VPS_IP
```

### 1.2 Create a deploy user (don't run Docker as root)

```bash
adduser deploy
usermod -aG sudo deploy
# Copy SSH keys
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
su - deploy
```

### 1.3 Run automated setup

The repo includes a one-command setup script:

```bash
# Download and run setup
curl -fsSL https://raw.githubusercontent.com/YOUR_ORG/admin-mainbeta/main/deploy.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh --setup
```

This installs: **Docker**, **Certbot**, **UFW firewall**, **fail2ban**, and creates a **2 GB swap file**.

### 1.4 Or manual setup

<details>
<summary>Click to expand manual steps</summary>

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker (official method)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect

# Verify Docker
docker --version
docker compose version

# Install Certbot for SSL
sudo apt-get install -y certbot

# Install common tools
sudo apt-get install -y git curl wget htop ufw fail2ban

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Create swap (for VPS with ≤4 GB RAM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

</details>

---

## Phase 2 – Clone & Configure

### 2.1 Clone the repository

```bash
cd /opt
sudo mkdir -p admin-mainbeta
sudo chown $USER:$USER admin-mainbeta
git clone https://github.com/YOUR_ORG/admin-mainbeta.git admin-mainbeta
cd admin-mainbeta
```

### 2.2 Create environment files

**Backend** (`backend/.env`):

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Fill in your values:

```env
# ── REQUIRED ──────────────────────────────────────────────
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_DB_NAME=admin_mainbeta
JWT_SECRET=generate-a-64-char-random-string-here

# ── Domain Configuration ──────────────────────────────────
PRIMARY_DOMAIN=yourdomain.com
COOKIE_DOMAIN=.yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
STOREFRONT_URL=https://store.yourdomain.com
ALLOWED_ORIGINS=https://admin.yourdomain.com,https://store.yourdomain.com
```

> **Generate a strong JWT_SECRET:**
> ```bash
> openssl rand -base64 48
> ```

**Admin Dashboard** (`admin-next/.env.local`):

```bash
cp admin-next/.env.example admin-next/.env.local
nano admin-next/.env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_PRIMARY_DOMAIN=yourdomain.com
NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo
# Add Firebase, CDN, and AI keys as needed
```

**Storefront** (`apps/storefront/.env.local`):

```bash
cp apps/storefront/.env.example apps/storefront/.env.local
nano apps/storefront/.env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_PRIMARY_DOMAIN=yourdomain.com
NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo
```

### 2.3 Update Nginx config with your domain

```bash
# Copy the SSL-ready template
cp nginx/nginx.ssl.conf nginx/nginx.conf

# Replace placeholder with your actual domain
sed -i 's/YOURDOMAIN\.com/yourdomain.com/g' nginx/nginx.conf
```

---

## Phase 3 – SSL Certificates

### 3.1 Get a wildcard certificate with Let's Encrypt

```bash
# Stop anything on port 80 first
sudo systemctl stop nginx 2>/dev/null || true

# Get certificates for your domain + wildcard
sudo certbot certonly \
    --standalone \
    -d yourdomain.com \
    -d "*.yourdomain.com" \
    --email admin@yourdomain.com \
    --agree-tos \
    --no-eff-email
```

> **Note:** Wildcard certs require DNS validation. Certbot will guide you through adding a TXT record.  
> If using Cloudflare DNS, install the Cloudflare plugin:
> ```bash
> sudo apt-get install python3-certbot-dns-cloudflare
> # Create /etc/letsencrypt/cloudflare.ini with your API token
> sudo certbot certonly \
>     --dns-cloudflare \
>     --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
>     -d yourdomain.com \
>     -d "*.yourdomain.com"
> ```

### 3.2 Verify certificates

```bash
sudo ls -la /etc/letsencrypt/live/yourdomain.com/
# Should show: fullchain.pem, privkey.pem, cert.pem, chain.pem
```

### 3.3 Auto-renewal cron

```bash
# Add auto-renewal that also reloads nginx
echo '0 3 * * * certbot renew --quiet --deploy-hook "docker compose -f /opt/admin-mainbeta/docker-compose.yml exec nginx nginx -s reload"' | sudo tee /etc/cron.d/certbot-renew
```

---

## Phase 4 – Deploy!

### 4.1 First deployment

```bash
cd /opt/admin-mainbeta

# Build and start all services
docker compose build --parallel
docker compose up -d
```

### 4.2 Verify everything is running

```bash
# Check all containers
docker compose ps

# Expected output:
# NAME         SERVICE      STATUS
# backend      backend      running (healthy)
# admin        admin        running
# storefront   storefront   running
# nginx        nginx        running
```

### 4.3 Test each service

```bash
# Backend API health check
curl -s https://api.yourdomain.com/health | head -c 200

# Admin Dashboard
curl -sI https://admin.yourdomain.com | head -5

# Storefront
curl -sI https://store.yourdomain.com | head -5
```

### 4.4 View logs if something fails

```bash
# All services
docker compose logs -f --tail=50

# Specific service
docker compose logs -f backend
docker compose logs -f admin
docker compose logs -f nginx
```

---

## Phase 5 – MongoDB Setup

### Option A: MongoDB Atlas (Recommended for production)

1. Create a free/paid cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your VPS IP in Network Access
3. Create a database user
4. Copy the connection string into `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/admin_mainbeta?retryWrites=true&w=majority
   ```

### Option B: Self-hosted MongoDB on the VPS

```bash
# Add MongoDB to docker-compose.yml (add this service):
# mongo:
#   image: mongo:7
#   ports:
#     - "27017:27017"
#   volumes:
#     - mongo_data:/data/db
#   environment:
#     MONGO_INITDB_ROOT_USERNAME: admin
#     MONGO_INITDB_ROOT_PASSWORD: your-secure-password
#   restart: unless-stopped

# Then in backend/.env:
# MONGODB_URI=mongodb://admin:your-secure-password@mongo:27017
```

---

## Phase 6 – Custom Tenant Domains

The repo includes a script to add custom domains for tenants:

```bash
# Add a custom domain for a tenant
sudo bash backend/scripts/setup-custom-domain.sh customershop.com tenant123 setup

# Verify DNS before setup
sudo bash backend/scripts/setup-custom-domain.sh customershop.com tenant123 verify

# Remove a custom domain
sudo bash backend/scripts/setup-custom-domain.sh customershop.com tenant123 remove
```

This script:
- Validates DNS (works with direct DNS and Cloudflare proxy)
- Creates an Nginx virtual host
- Obtains a Let's Encrypt SSL certificate
- Adds `X-Tenant-Id` header for the backend

---

## Phase 7 – Subsequent Deployments

After the initial setup, future deployments are one command:

```bash
cd /opt/admin-mainbeta
./deploy.sh
```

Or step by step:

```bash
./deploy.sh --pull-only   # Just update code
./deploy.sh --build-only  # Just rebuild images
./deploy.sh --restart     # Just restart containers
./deploy.sh --status      # Check what's running
./deploy.sh --logs        # Tail all logs
```

### Deploy from a different branch

```bash
BRANCH=staging ./deploy.sh
```

---

## Phase 8 – Monitoring & Maintenance

### 8.1 Health monitoring

The backend exposes a health endpoint with server metrics:

```bash
# Quick health check
curl -s https://api.yourdomain.com/health | python3 -m json.tool

# Returns: cpuUsage, memoryUsage, diskUsage, uptime
```

### 8.2 Container resource monitoring

```bash
# Live resource usage
docker stats

# Disk usage
docker system df
```

### 8.3 Log rotation

```bash
# Add Docker log rotation (edit /etc/docker/daemon.json)
sudo tee /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
sudo systemctl restart docker
```

### 8.4 Backup MongoDB

```bash
# If using Atlas: use Atlas built-in backups

# If self-hosted:
docker compose exec mongo mongodump --out /dump/$(date +%Y%m%d)
docker cp $(docker compose ps -q mongo):/dump ./backups/
```

### 8.5 Backup uploads

```bash
# Backup the shared uploads volume
docker run --rm -v admin-mainbeta_uploads:/data -v $(pwd)/backups:/backup \
    alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz -C /data .
```

---

## Phase 9 – CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/admin-mainbeta
            ./deploy.sh
```

**Required GitHub Secrets:**

| Secret       | Value                    |
|-------------|--------------------------|
| `VPS_HOST`  | Your VPS IP address      |
| `VPS_USER`  | `deploy`                 |
| `VPS_SSH_KEY`| SSH private key contents |

---

## Troubleshooting

### Container won't start

```bash
# Check logs for the specific service
docker compose logs backend --tail=50
docker compose logs admin --tail=50

# Common issues:
# - Missing .env file → copy from .env.example
# - MongoDB unreachable → check MONGODB_URI and network
# - Port in use → check with: sudo lsof -i :5001
```

### Build fails with memory error

```bash
# Increase Docker memory (edit /etc/docker/daemon.json):
# "default-shm-size": "256m"

# Or increase swap:
sudo fallocate -l 4G /swapfile
```

### SSL certificate issues

```bash
# Check cert expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Verify cert files exist
sudo ls -la /etc/letsencrypt/live/yourdomain.com/
```

### Nginx returns 502 Bad Gateway

```bash
# Check if upstream services are running
docker compose ps

# Test backend directly
docker compose exec backend wget -qO- http://localhost:5001/health

# Check nginx logs
docker compose logs nginx --tail=50
```

### Reset everything

```bash
# Nuclear option: stop all, remove volumes, rebuild
docker compose down -v
docker compose build --no-cache --parallel
docker compose up -d
```

---

## Quick Reference

| Task                              | Command                                          |
|----------------------------------|--------------------------------------------------|
| Full deploy                       | `./deploy.sh`                                    |
| View status                       | `./deploy.sh --status`                           |
| View logs                         | `./deploy.sh --logs`                             |
| Restart only                      | `./deploy.sh --restart`                          |
| SSH into backend                  | `docker compose exec backend sh`                 |
| SSH into admin                    | `docker compose exec admin sh`                   |
| Backend logs                      | `docker compose logs -f backend`                 |
| Rebuild single service            | `docker compose build admin && docker compose up -d admin` |
| Check SSL certs                   | `sudo certbot certificates`                      |
| Add tenant custom domain          | `sudo bash backend/scripts/setup-custom-domain.sh domain.com tenant_id setup` |
| Backup uploads                    | See Phase 8.5                                    |

---

## File Reference

| File                              | Purpose                                          |
|----------------------------------|--------------------------------------------------|
| `docker-compose.yml`             | Defines all 4 services and shared volume         |
| `backend/Dockerfile`             | Backend API container build                      |
| `admin-next/Dockerfile`          | Admin Dashboard multi-stage build                |
| `apps/storefront/Dockerfile`     | Storefront multi-stage build                     |
| `nginx/nginx.conf`               | Active Nginx config (HTTP-only for dev)          |
| `nginx/nginx.ssl.conf`           | SSL-ready Nginx config template                  |
| `deploy.sh`                      | Automated deployment script                      |
| `backend/.env.example`           | Backend env var template                         |
| `admin-next/.env.example`        | Admin env var template                           |
| `apps/storefront/.env.example`   | Storefront env var template                      |
| `backend/scripts/setup-custom-domain.sh` | Custom domain + SSL for tenants          |
