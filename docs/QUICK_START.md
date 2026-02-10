# Quick Reference: Development Configuration

## 🔧 Current Setup (Dynamic Proxy)

Konfigurasi sekarang sudah menggunakan **dynamic proxy** dari environment variable.

### Ketika Backend URL Berubah

**Cukup update `.env.development` saja!** Tidak perlu edit `vite.config.ts` lagi.

```bash
# .env.development
VITE_API_BASE_URL=
VITE_PROXY_TARGET=https://your-new-backend-url.ngrok-free.app
```

Kemudian **restart dev server**:

```bash
# Ctrl+C to stop
npm run dev
```

---

## 📝 Development Workflow

### 1. Start Backend dengan Tunnel

**Option A: Ngrok**

```bash
# Terminal 1: Backend
npm run dev  # or your backend command

# Terminal 2: Ngrok
ngrok http 8080

# Copy URL: https://abc123.ngrok-free.app
```

**Option B: Cloudflare Tunnel**

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Cloudflare
cloudflared tunnel --url http://localhost:8080

# Copy URL: https://xyz-abc.trycloudflare.com
```

### 2. Update Environment

Edit `.env.development`:

```bash
VITE_PROXY_TARGET=https://[PASTE-BACKEND-URL-HERE]
```

### 3. Start Frontend

```bash
npm run dev
# Running at http://localhost:5173
```

### 4. Expose Frontend untuk Telegram

```bash
# Terminal 3: Ngrok for frontend
ngrok http 5173

# Copy URL: https://frontend-xyz.ngrok-free.app
```

### 5. Update Telegram Bot

```
/myapps → Edit Web App URL
Paste: https://frontend-xyz.ngrok-free.app
```

---

## 🎯 Quick Commands

```bash
# Start all in separate terminals:

# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Backend tunnel (ngrok)
ngrok http 8080

# Terminal 3: Frontend
cd frontend && npm run dev

# Terminal 4: Frontend tunnel (ngrok)
ngrok http 5173
```

**Then:**

1. Copy backend URL → `.env.development`
2. Restart frontend dev server
3. Copy frontend URL → Telegram BotFather

---

## ⚡ Environment Variables Reference

### Development (`.env.development`)

```bash
# Proxy mode - all API requests go through Vite proxy
VITE_API_BASE_URL=
VITE_PROXY_TARGET=https://backend-tunnel-url.example.com
```

**How it works:**

```
Browser → http://localhost:5173/api/profile
      ↓ (Vite proxy)
Backend → https://backend-tunnel-url.example.com/api/profile
```

### Production (`.env.production`)

```bash
# Direct mode - API requests go directly to backend
VITE_API_BASE_URL=https://api.production.com/api
VITE_PROXY_TARGET=
```

**How it works:**

```
Browser → https://api.production.com/api/profile
      ↓ (direct)
Backend → https://api.production.com/api/profile
```

---

## 🐛 Troubleshooting

### Proxy not working?

1. **Check `.env.development`:**

   ```bash
   # Must be set
   VITE_PROXY_TARGET=https://...

   # Must be empty
   VITE_API_BASE_URL=
   ```

2. **Restart dev server:**

   ```bash
   # Changes to .env require restart
   Ctrl+C
   npm run dev
   ```

3. **Check backend URL:**
   ```bash
   # Test backend directly
   curl https://your-backend-url.ngrok-free.app/api/profile
   ```

### 401 Errors?

- Backend tunnel URL correct?
- Backend accepting `X-TgDataInit` header?
- Try in Telegram (not just browser)

### CORS Errors?

- Should NOT happen in development (proxy bypasses CORS)
- If happening, backend might be rejecting proxy requests
- Check backend CORS settings

---

## 📚 Files to Remember

```
Configuration:
├── vite.config.ts         → Dynamic proxy config (don't touch)
├── .env.development       → Update VITE_PROXY_TARGET here
├── .env.production        → Production API URL
└── .env.local.example     → Template reference

API Client:
└── src/api/index.ts       → Auto uses proxy in dev
```

---

## 💡 Pro Tips

1. **Keep `.env.local`** for personal overrides
2. **Don't commit** `.env.local` to git
3. **Use same ngrok account** for persistent URLs (paid feature)
4. **Save tunnel URLs** in notes for quick reference
5. **Test in Telegram** before sharing with team

---

## 🔄 Daily Workflow

**Every day when starting development:**

1. Start backend tunnel → Copy URL
2. Paste to `.env.development`
3. Restart frontend dev server
4. Start frontend tunnel → Copy URL
5. Update Telegram bot (if frontend URL changed)
6. Test in Telegram

**Time:** ~2 minutes ⚡

---

Need help? Check:

- `docs/DEVELOPMENT.md` - Detailed setup guide
- `docs/DEPLOYMENT.md` - Production deployment
- `.env.local.example` - Config examples
