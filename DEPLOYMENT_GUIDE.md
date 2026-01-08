# Deployment Masterclass: Hosting Next.js with Docker on Hostinger

This document is designed for beginners. We now cover **Self-Hosted Database**, **File Storage**, and **Domain Setup**.

---

## 🌐 Part 1: Domain & SSL Setup (Making it Real)

You asked: *"so when I will set the doamin for real production how it will be ?"*

Here is the exact process to go from `localhost:8080` to `jobportal.com`.

### 1. The Concept
In production, your users trigger this flow:
`User` -> `Internet (DNS)` -> `Hostinger VPS` -> `Nginx (Port 80/443)` -> `Next.js App (Port 3000)`

### 2. DNS Configuration (At your Domain Registrar)
Go to where you bought your domain (GoDaddy, Namecheap, Hostinger) and set an **A Record**:
*   **Type**: `A`
*   **Name**: `@` (or `www`)
*   **Value**: `YOUR_VPS_IP_ADDRESS` (e.g., `123.45.67.89`)

### 3. Nginx Configuration
We verify the request is for *your* domain.
Modify `nginx/default.conf` on the server:

```nginx
server {
    listen 80;
    server_name example.com www.example.com; # <--- CHANGE THIS

    location / {
        proxy_pass http://web:3000;
        # ... (rest of the proxy settings)
    }
}
```

### 4. Enable HTTPS (The Lock Icon)
You don't want an "Unsecure" warning. We use **Certbot** (free).

**Steps:**
1.  SSH into your VPS.
2.  Install Certbot: `apt-get install certbot python3-certbot-nginx`
3.  Run it: `certbot --nginx -d example.com -d www.example.com`
4.  Certbot will automatically edit your Nginx config to turn on SSL (Port 443).

---

## 🏗️ Part 2: The Architecture (Self-Hosted)

1.  **The Box**: Your Hostinger VPS.
2.  **Container 1 (App)**: The Job Portal website (`web`).
3.  **Container 2 (DB)**: MongoDB (`mongo`).
4.  **Container 3 (Nginx)**: The Gatekeeper (`nginx`).
5.  **Storage**:
    *   `./uploads` -> Holds CVs.
    *   `./mongo-data` -> Holds Database.

---

## 📂 Part 3: Database & Storage Strategy

### File Storage (CVs)
*   **Location**: `./uploads` folder on the VPS.
*   **Pros**: Free, fast.
*   **Risk**: If you delete the VPS, files are gone. **BACKUP REQUIRED**.
*   **Config**: Mapped via `docker-compose.yml` volumes.

### Database (MongoDB)
*   **Location**: `./mongo-data` folder on the VPS.
*   **Credentials**: Defined in `docker-compose.yml`.
*   **Connection String**: `mongodb://root:examplepassword@mongo:27017/jobportal?authSource=admin`

---

## 🛠️ Step-by-Step Deployment Checklist

1.  [ ] **Buy VPS & Domain**.
2.  [ ] **Point DNS**: Set A Record to VPS IP.
3.  [ ] **SSH into VPS**: Install Docker & Docker Compose.
4.  [ ] **Clone Repo**: Get your code on the server.
5.  [ ] **Configure Env**:
    *   Rename `.env.production.local` to `.env`.
    *   Update `NEXTAUTH_URL` to `https://example.com`.
6.  [ ] **Secure Database**: Edit `docker-compose.yml` and change `examplepassword`.
7.  [ ] **Start Containers**:
    ```bash
    docker compose up -d --build
    ```
8.  [ ] **Setup SSL**: Run `certbot` for HTTPS.

---

## ⚠️ Important Production Warnings

1.  **Change Passwords**: Never leave `admin123` or `examplepassword` in production files.
2.  **Backups**: You are your own cloud provider now. You MUST copy the `mongo-data` and `uploads` folders to your laptop or Google Drive once a week.
