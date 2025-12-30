# Deployment Masterclass: Hosting Next.js with Docker on Hostinger

This document is designed for beginners. We now cover **Self-Hosted Database** and **File Storage**.

---

## 🏗️ The New Architecture (Self-Hosted)

We are now putting everything on one server.

1.  **The Box**: Your Hostinger VPS.
2.  **Container 1 (App)**: The Job Portal website.
3.  **Container 2 (DB)**: MongoDB (Running inside the same VPS).
4.  **Storage (Volumes)**:
    *   `./uploads` -> Holds the CV PDF files.
    *   `./mongo-data` -> Holds the User/Job database records.

---

## 📂 Part 1: File Storage (Where do files go?)

You asked: *"Where should the files storage be?"*

### Option A: Local Disk (What we are doing now)
*   **How it works**: We map a folder on the server (`/var/www/app/uploads`) to the container.
*   **Pros**: Free, Fast, Easiest to set up.
*   **Cons**: If you delete the VPS without a backup, **you lose all CVs**.
*   **Verdict**: Perfect for starting out.
*   **Configuration**:
    ```yaml
    volumes:
      - ./uploads:/app/public/uploads
    ```

### Option B: Cloud Storage (AWS S3 / R2) - *Advanced*
*   **How it works**: The app sends files to Amazon S3 or Cloudflare R2.
*   **Pros**: Infinite space, files can't be lost if server dies.
*   **Cons**: Costs money ($$), requires complex code changes.
*   **Verdict**: Upgrade to this later if you have >10,000 users.

---

## 🗄️ Part 2: Database (Cloud vs. Self-Hosted)

You asked: *"What if the DB is hosted in that VPS as well?"*

### The Trade-off
| | Cloud (Atlas) | Self-Hosted (VPS) |
| :--- | :--- | :--- |
| **Cost** | Free tier (Small) -> Expensive | **Free** (Included in VPS RAM) |
| **Speed** | Good | **Fastest** (Zero latency) |
| **Backups** | Automatic | **MANUAL** (You must do it) |
| **Risk** | Low | **Medium** (If VPS disk fails, DB is lost) |

---

## 🛠️ Updated Deployment Steps (Self-Hosted DB)

Since you chose **Self-Hosted**, here is how the setup changes.

### 1. `docker-compose.yml` (Updated)
I have updated this file for you. It now starts **two** containers:
1.  `web`: Your site.
2.  `mongo`: Your database.

### 2. Update Environment Variables
On your server (in `.env.production.local`), you **DO NOT** need the `MONGODB_URI` anymore, because `docker-compose.yml` sets it automatically to:
`mongodb://root:examplepassword@mongo:27017/jobportal?authSource=admin`

*(Note: Change `examplepassword` in docker-compose.yml to something stronger before deploying!)*

### 3. Start the Server
Run the same command as before:
```bash
docker compose up -d --build
```
This time, you will see it pull `mongo` and start it alongside your app.

### 4. ⚠️ CRITICAL: How to Backup
Since you are the host, you must backup your data.
**To backup your database:**
```bash
# Creates a backup folder inside your VPS
docker exec jop-portal-db mongodump --username root --password examplepassword --out /data/db/backup
```
Actual data files are safely stored in the `./mongo-data` folder on your VPS. **Copy this folder to your computer occasionally** to be safe.

---

## ✅ Summary Checklist

1.  [ ] Buy VPS & Domain.
2.  [ ] SSH into VPS & Install Docker.
3.  [ ] Clone Repo.
4.  [ ] **Edit `docker-compose.yml`**: Change `examplepassword` to a real password.
5.  [ ] `docker compose up`.
6.  [ ] Configure Nginx & SSL.
7.  [ ] **Scheduled Task**: Backup `./uploads` and `./mongo-data` regularly.
