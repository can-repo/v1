# Production Deployment Guide

Panduan lengkap untuk deploy aplikasi ke production.

## 🎯 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Backend API accessible via public URL
- [ ] No console errors
- [ ] Build successfully
- [ ] Performance optimized

## 🏗️ Build Process

### 1. Update Environment Variables

Edit `.env.production`:

```env
# Production configuration
VITE_API_BASE_URL=https://your-production-backend.com/api
VITE_PROXY_TARGET=
```

### 2. Build Application

```bash
# Clean previous build
rm -rf dist

# Build for production
npm run build

# Output:
# dist/
# ├── assets/
# ├── index.html
# └── ...
```

### 3. Test Build Locally

```bash
# Serve built files
npx serve -s dist -l 3000

# Test di browser
http://localhost:3000
```

**Verify:**

- ✅ App loads correctly
- ✅ API calls work (direct to backend)
- ✅ No console errors
- ✅ All features functional

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros:** Free, auto-deploy, CDN, easy setup

**Steps:**

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy:**

   ```bash
   # Login
   vercel login

   # Deploy
   vercel --prod
   ```

3. **Configure:**
   - Environment: Add `VITE_API_BASE_URL` di Vercel dashboard
   - Custom domain (optional)

4. **Update Telegram Bot:**
   ```
   /myapps → Edit Web App URL
   https://your-app.vercel.app
   ```

**Auto-deploy from Git:**

```bash
# Connect repo
vercel --prod

# Future updates: Just push to git
git push → Auto deploy
```

---

### Option 2: Netlify

**Pros:** Free tier, form handling, serverless functions

**Steps:**

1. **Build settings:**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Deploy:**

   ```bash
   # Via CLI
   npm install -g netlify-cli
   netlify deploy --prod

   # Or via web UI
   # Drag & drop dist/ folder
   ```

3. **Environment:**
   - Site settings → Build & deploy → Environment
   - Add: `VITE_API_BASE_URL`

---

### Option 3: GitHub Pages

**Pros:** Free, simple for static sites

**Setup:**

1. **Update vite.config.ts:**

   ```typescript
   export default defineConfig({
     base: "/repository-name/", // Repo name
     // ...
   });
   ```

2. **Build & deploy:**

   ```bash
   npm run build

   # Deploy to gh-pages branch
   npx gh-pages -d dist
   ```

3. **GitHub settings:**
   - Repo → Settings → Pages
   - Source: gh-pages branch
   - URL: `https://username.github.io/repository-name/`

---

### Option 4: Self-Hosted (VPS/Cloud)

**Requirements:** Server dengan NGINX/Apache

**Steps:**

1. **Build locally:**

   ```bash
   npm run build
   ```

2. **Upload to server:**

   ```bash
   # Via SCP
   scp -r dist/ user@server:/var/www/html/miniapp

   # Via FTP
   # Upload dist/ folder
   ```

3. **NGINX config:**

   ```nginx
   server {
       listen 80;
       server_name miniapp.yourdomain.com;

       root /var/www/html/miniapp;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Enable HTTPS:**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d miniapp.yourdomain.com
   ```

---

### Option 5: Cloudflare Pages

**Pros:** Free, fast CDN, DDoS protection

**Steps:**

1. **Connect Git repo:**
   - Dashboard → Pages → Create project
   - Connect repository

2. **Build settings:**

   ```
   Framework: Vite
   Build command: npm run build
   Output directory: dist
   ```

3. **Environment variables:**
   - Add `VITE_API_BASE_URL`

4. **Deploy:**
   - Push to git → Auto deploy

---

## 🔐 Security Considerations

### Environment Variables

**Never commit:**

- `.env.production` with real credentials
- `.env.local` files

**Use platform secrets:**

- Vercel: Environment Variables
- Netlify: Environment Variables
- GitHub: Secrets (for actions)

### HTTPS

**Required for Telegram Mini Apps!**

All deployment options above provide auto HTTPS.

**Self-hosted:** Use Let's Encrypt certbot

### Content Security Policy

Add to `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self' https://telegram.org; script-src 'self' https://telegram.org 'unsafe-inline'"
/>
```

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install & Build
        run: |
          npm ci
          npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📊 Monitoring

### Error Tracking

**Option: Sentry**

```typescript
// main.ts
import * as Sentry from "@sentry/vue";

Sentry.init({
  app,
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### Analytics

**Option: Google Analytics**

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_ID");
</script>
```

## 🔍 Post-Deployment Verification

### Checklist

1. **Accessibility:**

   ```bash
   curl https://your-deployed-url.com
   # Should return HTML
   ```

2. **HTTPS:**
   - URL must be `https://`
   - No mixed content warnings

3. **API Connectivity:**
   - Open browser console
   - Check Network tab
   - Verify API requests succeed

4. **Telegram Integration:**
   - Update bot URL in BotFather
   - Test in Telegram Desktop
   - Test in Telegram Mobile

5. **Performance:**
   - Run Lighthouse audit
   - Target: 90+ score

### Testing

**Production URL:**

```
https://your-deployed-url.com
```

**Telegram Bot:**

```
/myapps → Update URL → Test
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### API Not Working

**Check:**

- CORS enabled on backend
- API URL correct in `.env.production`
- Backend allows `X-TgDataInit` header

### Telegram Not Loading

**Check:**

- URL must be HTTPS
- No console errors
- Telegram script loaded
- initData available

## 🔄 Update Process

### Deploying Updates

1. **Make changes locally**
2. **Test thoroughly**
3. **Build:**
   ```bash
   npm run build
   ```
4. **Deploy:**
   - Vercel/Netlify: `git push` (auto-deploy)
   - Manual: Upload new `dist/`
5. **Verify in Telegram**

### Rollback

**Git-based platforms:**

```bash
# Revert commit
git revert HEAD
git push

# Or redeploy previous version
vercel --prod [deployment-url]
```

**Manual:**

- Keep backup of previous `dist/`
- Upload backup if needed

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
