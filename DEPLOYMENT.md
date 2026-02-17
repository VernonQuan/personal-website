# Render Backend Deployment Guide

## Backend Setup on Render

### 1. Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `VernonQuan/personal-website`
4. Configure the service:

**Settings:**
- **Name**: `personal-website-api` (or your preference)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free tier is fine to start

### 2. Environment Variables
Add these in Render dashboard under **Environment**:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=8787
RESUME_PATH=./resume.md
CORS_ORIGIN=https://vernonquan.dev,https://www.vernonquan.dev
```

**Optional:**
```
CHAT_API_KEY=your_secret_key_here
```

### 3. Deploy
- Click **Create Web Service**
- Render will automatically deploy from GitHub
- Your API URL will be: `https://personal-website-api.onrender.com` (or custom subdomain)

---

## Frontend Setup on Render (Static Site)

### 1. Create Static Site
1. In Render Dashboard → **New +** → **Static Site**
2. Connect the same GitHub repo
3. Configure:

**Settings:**
- **Name**: `personal-website`
- **Branch**: `main`
- **Root Directory**: Leave empty (root)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 2. Environment Variables
Add in Render dashboard:

```
VITE_CHAT_API_URL=https://personal-website-api.onrender.com/api/chat
VITE_CHAT_API_KEY=your_secret_key_here
```

### 3. Custom Domain Setup

#### For Frontend (vernonquan.dev):
1. In your static site settings → **Custom Domains**
2. Add both:
   - `vernonquan.dev`
   - `www.vernonquan.dev`
3. Add these DNS records at your domain registrar:

**For root domain (vernonquan.dev):**
```
Type: A
Name: @
Value: 216.24.57.1
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: <your-site-name>.onrender.com
```

#### For Backend API (api.vernonquan.dev):
1. In your web service settings → **Custom Domains**
2. Add: `api.vernonquan.dev`
3. Add DNS record:

```
Type: CNAME
Name: api
Value: personal-website-api.onrender.com
```

4. Update frontend env var:
```
VITE_CHAT_API_URL=https://api.vernonquan.dev/api/chat
```

And update backend CORS:
```
CORS_ORIGIN=https://vernonquan.dev,https://www.vernonquan.dev
```

---

## Alternative: Frontend on Vercel/Netlify

If you prefer Vercel or Netlify for the frontend:

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add environment variables (same as above)
5. Add custom domain in Vercel settings

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. New site from Git → Select repo
3. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variables
5. Add custom domain in Netlify settings

---

## Post-Deployment Checklist

- [ ] Backend API is running at your Render URL
- [ ] Test API endpoint: `https://your-api.onrender.com/health`
- [ ] Frontend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] Custom domain DNS records are configured
- [ ] SSL certificates are active (Render handles this automatically)
- [ ] CORS is configured to allow frontend domain
- [ ] Test the chat feature end-to-end

---

## Useful Commands

**Test backend locally:**
```bash
cd server
npm install
npm start
```

**Test frontend locally:**
```bash
npm install
npm start
```

**Update environment variables:**
- Changes to env vars in Render trigger automatic redeployment

**Monitor logs:**
- Go to Render Dashboard → Your Service → Logs tab
