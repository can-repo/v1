# Development Setup Guide

Panduan lengkap untuk setup development environment.

## 🔧 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)

   ```bash
   node --version  # Check version
   ```

2. **Package Manager**
   - npm (comes with Node.js)
   - atau yarn: `npm install -g yarn`

3. **Git**

   ```bash
   git --version
   ```

4. **Code Editor**
   - VS Code (recommended)
   - Install extension: Volar (Vue Language Features)

### Optional Tools

- **ngrok** - For exposing local server to internet
- **Telegram Desktop** - For testing Mini App

## 📦 Initial Setup

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd v1

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 2. Environment Configuration

#### Create .env.local

```bash
# Copy template
cp .env.local.example .env.local

# Edit file
code .env.local
```

#### Configuration Examples

**Opsi A: Development dengan Backend Cloudflare**

```env
# .env.local
VITE_API_BASE_URL=
VITE_PROXY_TARGET=https://parker-potato-consist-ranks.trycloudflare.com
```

**Opsi B: Development dengan Backend Localhost**

```env
# .env.local
VITE_API_BASE_URL=
VITE_PROXY_TARGET=http://localhost:8080
```

**Opsi C: Direct URL (No Proxy)**

```env
# .env.local
VITE_API_BASE_URL=https://your-backend.com/api
VITE_PROXY_TARGET=
```

### 3. Backend Setup

Pastikan backend sudah running dan accessible:

**Test Backend:**

```bash
# Test via curl
curl https://your-backend.com/api/auth/v2/profile

# Atau buka di browser
https://your-backend.com/api/auth/v2/profile
```

## 🚀 Running Development Server

### Standard Development

```bash
# Start dev server
npm run dev

# Output:
# VITE v5.4.11  ready in 500ms
# ➜  Local:   http://localhost:5173/
```

Access: http://localhost:5173

### Testing di Telegram

#### Step 1: Expose Local Server

**Menggunakan ngrok:**

```bash
# Di terminal terpisah
ngrok http 5173

# Copy forwarding URL
# Forwarding: https://abc123.ngrok-free.app -> http://localhost:5173
```

**Menggunakan Cloudflare Tunnel:**

```bash
cloudflared tunnel --url http://localhost:5173
```

#### Step 2: Update Telegram Bot

1. Open Telegram → Search `@BotFather`
2. Send command: `/myapps`
3. Select your Mini App
4. Select "Edit Web App URL"
5. Paste ngrok URL: `https://abc123.ngrok-free.app`
6. Done!

#### Step 3: Test di Telegram

1. Open Telegram Desktop/Mobile
2. Search your bot
3. Open Mini App
4. Test functionality

## 🐛 Development Debugging

### Enable Eruda (Debug Tool)

Eruda otomatis aktif di development mode. Check console:

```
Telegram → Open Mini App → Check bottom-right corner
```

Features:

- Console logs
- Network requests
- Element inspector
- Storage viewer

### Check Logs

**Browser Console:**

```javascript
// initData check
console.log(window.Telegram.WebApp.initData);

// Backend response
// Check Network tab → XHR → Response
```

**Vite Terminal:**

```
# Proxy logs akan muncul di sini
🔄 Proxying: GET /api/auth/v2/profile → ...
```

### Common Issues

#### 1. Vite tidak start

```bash
# Clear cache
rm -rf node_modules
npm install

# Or
npm cache clean --force
npm install
```

#### 2. Port 5173 sudah dipakai

Edit `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000, // Ganti port
    // ...
  },
});
```

#### 3. Proxy tidak jalan

**Check:**

1. `VITE_PROXY_TARGET` ada value
2. Backend accessible
3. Restart dev server

**Debug:**

```typescript
// vite.config.ts - tambah logging
proxy: {
  '/api': {
    target: process.env.VITE_PROXY_TARGET,
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq, req) => {
        console.log('Proxying:', req.url);
      });
    }
  }
}
```

## 🔄 Hot Module Replacement (HMR)

Vite automatically reloads on file changes:

- `.vue` files → Component reload
- `.ts` files → Full reload
- `.css` files → Style injection

**If HMR not working:**

```bash
# Restart dev server
# Ctrl+C → npm run dev
```

## 📝 Development Workflow

### Typical Development Cycle

1. **Start servers:**

   ```bash
   # Terminal 1: Dev server
   npm run dev

   # Terminal 2: Ngrok (optional)
   ngrok http 5173
   ```

2. **Make changes:**
   - Edit files in `src/`
   - Changes auto-reload

3. **Test:**
   - Browser: http://localhost:5173
   - Telegram: Via ngrok URL

4. **Debug:**
   - Browser console
   - Vite terminal
   - Eruda debug tool

5. **Commit:**
   ```bash
   git add .
   git commit -m "Description"
   git push
   ```

## 🧪 Testing

### Manual Testing Checklist

- [ ] App loads di browser
- [ ] App loads di Telegram
- [ ] Profile data tampil
- [ ] No console errors
- [ ] API requests berhasil
- [ ] Responsive di mobile

### Build Test

```bash
# Test production build locally
npm run build
npx serve -s dist -l 3000

# Test di browser
http://localhost:3000
```

## 📚 Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) untuk production deployment
- Read [API.md](./API.md) untuk API documentation
- Read [CORS_STRATEGY.md](./CORS_STRATEGY.md) untuk CORS handling

## 🆘 Getting Help

**Issues:**

- Check console errors
- Check Network tab
- Check this documentation

**Backend Issues:**

- Contact backend team
- Check backend logs
- Verify API endpoints
