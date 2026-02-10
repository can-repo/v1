import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true, // Allow access from network
      allowedHosts: true, // Allow all hosts (ngrok, cloudflare tunnel, etc)
      // Dynamic proxy based on VITE_PROXY_TARGET env variable
      proxy: env.VITE_PROXY_TARGET ? {
        '/api': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          secure: false,
        }
      } : undefined,
    },
  };
});