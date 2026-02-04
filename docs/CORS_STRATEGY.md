# Strategi Interact API Tanpa CORS (Local Development)

Ringkasan ini menjelaskan cara proyek ini berinteraksi dengan API lokal tanpa terkena masalah CORS (_Cross-Origin Resource Sharing_) menggunakan fitur **Vite Proxy**.

## 1. Konfigurasi Vite Proxy

Bagian terpenting ada di `vite.config.ts`. Vite bertindak sebagai "jembatan" antara Frontend dan Backend.

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: process.env.VITE_PROXY_TARGET
      ? {
          // Semua request yang dimulai dengan '/api' akan di-forward
          "/api": {
            target: process.env.VITE_PROXY_TARGET, // Dari .env: http://localhost:8080
            changeOrigin: true, // Mengubah 'origin' header ke target URL
            secure: false, // Set false jika menggunakan self-signed certificate
            // Optional: Hilangkan '/api' sebelum dikirim ke backend
            // rewrite: (path) => path.replace(/^\/api/, ''),
          },
        }
      : undefined,
  },
});
```

### Mengapa ini berhasil?

Browser hanya memblokir CORS jika Frontend (misal: `localhost:5173`) mencoba memanggil API secara langsung ke port/domain berbeda (misal: `192.168.1.10:1968`).
Dengan proxy, Frontend memanggil dirinya sendiri (`localhost:5173/api/...`), lalu server Node.js (Vite) yang meneruskannya ke backend. Server-to-server communication **tidak terkena aturan CORS**.

### ⚠️ Limitasi Vite Proxy

**PENTING:** Vite Proxy **HANYA** bekerja di local development server (`npm run dev`).

**Tidak bekerja di:**

- ❌ Akses via Telegram (melalui ngrok/cloudflare tunnel)
- ❌ Production build (`npm run build`)
- ❌ Akses dari device lain via tunnel

**Untuk akses via Telegram/tunnel:** Gunakan **Direct URL Mode** dengan mengisi `VITE_API_BASE_URL`.

## 2. Environment Variables (.env)

Gunakan `.env` untuk mempermudah penggantian antara mode Development dan Production.

```env
# Development: Kosongkan VITE_API_BASE_URL agar menggunakan path relatif (Vite Proxy)
# Isi VITE_PROXY_TARGET dengan alamat backend lokal
VITE_API_BASE_URL=
VITE_PROXY_TARGET=http://localhost:8080

# Production: Ganti dengan URL asli
# VITE_API_BASE_URL=https://api.produksi.com
# VITE_PROXY_TARGET=
```

## 3. Implementasi di Services (Axios/Fetch)

Saat melakukan fetch, gunakan logic untuk mendeteksi apakah kita menggunakan Proxy atau Direct URL.

```typescript
// src/services/http.ts
const apiClient = axios.create({
  // Jika VITE_API_BASE_URL kosong, gunakan path relatif '/api'
  // yang akan ditangkap oleh Vite Proxy
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 4. Setup HTTPS Lokal (Penting untuk Telegram Mini App)

Telegram Mini App membutuhkan HTTPS. Gunakan plugin `vite-plugin-mkcert`.

1. Install: `npm install -D vite-plugin-mkcert`
2. Tambahkan di `vite.config.ts`:

   ```typescript
   import mkcert from "vite-plugin-mkcert";

   export default defineConfig({
     plugins: [mkcert()],
     server: {
       https: true, // Aktifkan HTTPS
     },
   });
   ```

## 5. Expose ke Internet (Testing Mobile)

Gunakan tool tunnel untuk agar HP bisa mengakses server lokal Anda:

- **ngrok**: `ngrok http 5173`
- **Cloudflare Tunnel (cloudflared)**: `cloudflared tunnel --url http://localhost:5173`

---

**Kesimpulan:**
Gunakan **Vite Proxy** untuk development lokal agar tidak perlu mengubah configurasi CORS di sisi Backend (terutama jika API backend kaku/legacy). Cukup panggil endpoint relatif dari Frontend.
