# 🛡️ VPN & Network Security Concept

This guide explains how you *would* implement a VPN-like security layer for your Job Portal.

## The Goal
To make the **Admin Panel** (`/admin`) and **Database** invisible to the public internet, accessible only to staff connected to a secure "tunnel" (VPN).

---

## Method 1: The "Soft VPN" (IP Allowlist) via Nginx
The easiest way to simulate a VPN without installing VPN software is to only allow access from your Office's static IP address.

**How to set it up in `nginx/default.conf`:**

```nginx
# Inside your server block
location /admin {
    # 1. Deny everyone by default
    # 2. Allow only your specific IP (e.g., Office IP)
    allow 123.45.67.89; 
    deny all; 
    
    # Pass to app
    proxy_pass http://web:3000;
}
```
**Effect:** If a hacker visits `jobs.daralshai.com/admin`, they get a **403 Forbidden** error. You (at the office) see the login page.

---

## Method 2: The "Real VPN" (WireGuard / Tailscale)
For this, you install a VPN service directly on the VPS.

**Scenario:** You want to connect to the MongoDB database securely from your laptop using Compass.

1.  **Install WireGuard** on the VPS (Ubuntu):
    ```bash
    apt install wireguard
    ```
2.  **Configure Docker**:
    Ensure the MongoDB port (`27017`) is **NOT** listed in `ports:` section of `docker-compose.yml` (so it's not public).
    ```yaml
    mongo:
      ports:
        # - "27017:27017" <--- COMMENT THIS OUT to hide it from the world
        - "127.0.0.1:27017:27017" # Only listen locally
    ```
3.  **Connect**:
    *   You turn on WireGuard on your laptop.
    *   Your laptop is now "virtually" inside the server's network.
    *   You connect MongoDB Compass to `10.0.0.1:27017` (Internal VPN IP).

## Summary
*   **Public Users**: Connect via standard HTTPS (Port 443).
*   **Admins**: Connect via VPN Tunnel -> Access Admin Panel & DB.
