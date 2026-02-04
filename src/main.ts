import './mockEnv';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { init } from './init';
import { errorHandler } from './errorHandler';

// Initialize Telegram SDK
init({
  debug: import.meta.env.DEV,
  eruda: import.meta.env.DEV,
  mockForMacOS: false,
}).then(() => {
  const app = createApp(App);
  
  app.config.errorHandler = errorHandler;
  app.use(createPinia());
  app.use(router);
  
  app.mount('#app');
}).catch((error) => {
  console.error('Failed to initialize Telegram SDK:', error);
});