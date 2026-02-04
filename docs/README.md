# Telegram Mini App - Power Pro Solution

> Telegram Mini App untuk sistem manajemen Hotel Power Pro Solution

## 📋 Overview

Aplikasi ini adalah Telegram Mini App yang terintegrasi dengan backend Power Pro Solution Hotel Management System. Aplikasi memungkinkan staff hotel untuk mengakses informasi profile dan konfigurasi sistem langsung dari Telegram.

## 🛠️ Tech Stack

- **Frontend Framework**: Vue.js 3 + TypeScript
- **Build Tool**: Vite 5
- **Telegram SDK**: @tma.js/sdk-vue
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Styling**: CSS (Vanilla)

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm atau yarn
- Telegram Bot (untuk testing)

### Setup

```bash
# Clone repository
git clone <repository-url>
cd v1

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local sesuai kebutuhan
```

## 🔧 Configuration

### Environment Variables

Project menggunakan 3 environment files untuk different modes:

#### 1. Development Mode (`.env.development`)

Untuk development lokal dengan Vite proxy:

```env
# Proxy mode - requests go through Vite dev server
VITE_API_BASE_URL=
VITE_PROXY_TARGET=https://your-backend-tunnel.trycloudflare.com
```

#### 2. Production Mode (`.env.production`)

Untuk production build dengan direct URL:

```env
# Direct URL mode - no proxy
VITE_API_BASE_URL=https://your-backend.com/api
VITE_PROXY_TARGET=
```

#### 3. Local Override (`.env.local`)

Copy dari `.env.local.example` dan adjust sesuai kebutuhan.

### CORS Strategy

Project menggunakan **Vite Proxy** untuk bypass CORS di development:

**Development Flow:**

```
Browser → Vite Dev Server (:5173) → Vite Proxy → Backend
```

**Production Flow:**

```
Browser → Static Files → Direct to Backend API
```

Detail: See [CORS_STRATEGY.md](./CORS_STRATEGY.md)

## 🚀 Usage

### Development Mode

```bash
# Start dev server dengan proxy
npm run dev

# Akses di browser
http://localhost:5173
```

**Untuk testing di Telegram:**

1. Expose dev server:

   ```bash
   ngrok http 5173
   ```

2. Update Telegram Bot URL di BotFather:

   ```
   /myapps → Select App → Edit Web App URL
   Paste: https://your-ngrok-url.ngrok-free.app
   ```

3. Test di Telegram Desktop/Mobile

### Production Build

```bash
# Build untuk production
npm run build

# Preview build locally
npx serve -s dist -l 3000

# Deploy static files ke hosting
# (Upload folder dist/ ke server)
```

## 🌐 Deployment

### Option 1: Static Hosting (Recommended)

**Platforms:** Vercel, Netlify, GitHub Pages, Cloudflare Pages

**Steps:**

1. Build project: `npm run build`
2. Deploy `dist/` folder
3. Update `.env.production` dengan backend URL
4. Update Telegram Bot URL dengan deployed URL

### Option 2: Testing dengan Ngrok

**Development:**

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Ngrok
ngrok http 5173
```

**Production Build:**

```bash
# Build & serve
npm run build
npx serve -s dist -l 3000

# Terminal 2: Ngrok
ngrok http 3000
```

## 🔐 Authentication

App menggunakan Telegram `initData` untuk authentication:

- Header: `X-TgDataInit`
- Value: Telegram init data (query_id, user, auth_date, hash)
- Auto-injected via Axios interceptor

Backend harus validate signature menggunakan Bot Token.

## 📡 API Integration

### Endpoints

**Profile API:**

```
GET /api/auth/v2/profile
Headers:
  X-TgDataInit: <telegram-init-data>

Response:
{
  "userID": "string",
  "fullName": "string",
  "account_name": "string",
  "timeStamp": "ISO8601",
  "Configs": {
    "FOConfig": [{
      "HotelName": "string",
      "Address": "string",
      "FOSysDate": "string",
      "FOShift": "string"
    }]
  }
}
```

### Adding New Endpoints

1. Define type di `src/api/index.ts`:

   ```typescript
   export interface NewResponse {
     // fields
   }
   ```

2. Add function:

   ```typescript
   export const getNewData = async () => {
     const response = await api.get<NewResponse>("/path");
     return response.data;
   };
   ```

3. Use di component:
   ```typescript
   import { getNewData } from "@/api";
   const data = await getNewData();
   ```

## 🐛 Troubleshooting

### CORS Errors

**Problem:** Request blocked by CORS

**Solution:**

- Development: Ensure `VITE_PROXY_TARGET` is set
- Production: Backend must allow origin and `X-TgDataInit` header

### 401 Unauthorized

**Problem:** API returns 401

**Causes:**

- initData expired (> 5 minutes old)
- Bot token mismatch di backend
- Invalid signature

**Solution:**

- Refresh Telegram app
- Check backend bot token
- Verify initData validation logic

### Data Not Displaying

**Problem:** API success tapi UI kosong

**Solution:**

- Check browser console for errors
- Verify response structure matches interface
- Check field mapping di template

## 📁 Project Structure

```
v1/
├── docs/              # Documentation
├── public/            # Static assets
├── src/
│   ├── api/          # API client & types
│   ├── assets/       # Images, styles
│   ├── composables/  # Vue composables
│   ├── pages/        # Page components
│   ├── router/       # Vue Router config
│   ├── stores/       # Pinia stores
│   ├── App.vue       # Root component
│   ├── main.ts       # Entry point
│   ├── init.ts       # Telegram SDK init
│   └── mockEnv.ts    # Mock for dev
├── .env.development   # Dev env vars
├── .env.production    # Prod env vars
├── vite.config.ts     # Vite config
└── package.json
```

## 📚 Additional Resources

- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [@tma.js/sdk-vue](https://github.com/Telegram-Mini-Apps/tma.js)
- [Vite Documentation](https://vitejs.dev)
- [Vue.js Documentation](https://vuejs.org)

## 📝 License

Private - Power Pro Solution © 2026
