# Deployment Guide for Next.js on VPS

This guide explains how to deploy your Next.js application to a VPS (like DigitalOcean, Linode, or AWS) using **PM2** and **Nginx**.

---

### 1. Initial Server Setup
Connect to your VPS via SSH and install the necessary tools.

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (Version 20 or 22 recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (to keep your app running)
sudo npm install -g pm2

# Install Nginx (for reverse proxy)
sudo apt install nginx -y
```

### 2. Deploy Your Code
On your VPS, clone your repository and install dependencies.

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL_HERE>
cd diit-nextjs2026

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root on the server to store your secrets.

```bash
nano .env
```

Paste your secrets (copy from your local `.env.local`):
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_secure_random_key_2026
```
*Press `Ctrl + O`, `Enter`, and `Ctrl + X` to save and exit.*

### 4. Build and Start the Application
We use the `standalone` output mode for efficiency.

```bash
# Build the project
npm run build

# Start the application with PM2
# Standalone mode generates a 'server.js' inside the standalone folder
pm2 start .next/standalone/server.js --name "diit-website"

# Ensure PM2 restarts on server reboot
pm2 save
pm2 startup
```

### 5. Configure Nginx (Connect to your Domain)
Configure Nginx to route traffic from your domain to the Next.js app.

```bash
sudo nano /etc/nginx/sites-available/diit.edu.bd
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name diit.edu.bd www.diit.edu.bd;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/diit.edu.bd /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Set up SSL (HTTPS)
Secure your site with a free SSL certificate from Let's Encrypt.

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d diit.edu.bd -d www.diit.edu.bd
```

---

### 🚀 Update Command
Run this command on your VPS whenever you push new changes to GitHub:

```bash
git pull origin main && npm install && npm run build && pm2 restart diit-website
```

### 💡 Important Tips
- **Port Management**: To change the port, use `PORT=4000 pm2 start .next/standalone/server.js`.
- **MongoDB Access**: Add your VPS IP to the MongoDB Atlas Network Access allow-list.
- **Images**: Ensure the `standalone` build correctly handles public assets. If images don't load, copy the `public` and `.next/static` folders into `.next/standalone`.