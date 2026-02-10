<script setup lang="ts">
import { ref, onMounted } from "vue";
import { viewport } from "@tma.js/sdk-vue";
import { useRouter } from "vue-router";
import type { AppMenuItem } from "@/types";

const router = useRouter();

// State
const searchQuery = ref("");

// Mock Data for "My app"
const apps = ref<AppMenuItem[]>([
  {
    code: "RA",
    name: "Room Attendant",
    description: "Room Attendant Mini App",
  },
  {
    code: "POS",
    name: "Point-of-sale Order",
    description: "Point-of-sale Order Mini App",
  },
]);

// Methods
const handleCreateApp = () => {
  console.log("Create new app clicked");
};

const handleAppClick = (app: AppMenuItem) => {
  console.log("Clicked app:", app.name);
  if (app.code === "RA") {
    goToRAStatus();
  }
};

onMounted(() => {
  if (viewport.mount.isAvailable()) {
    viewport.mount();
    viewport.expand();
  }
});

const goToHome = () => {
  router.push("/");
};

const goToRAStatus = () => {
  router.push("/Status");
};
</script>

<template>
  <div class="tg-page">
    <!-- Fixed Header Section -->
    <div class="header-section">
      <div class="avatar-container">
        <img
          src="@/assets/icons/PowerProLogo.png"
          alt="PowerPro"
          class="avatar-img"
        />
      </div>
      <h1 class="page-title">Power Pro Mini App</h1>
      <p class="page-description">
        Power Pro Mini App is the one app to rule them all
        <a href="#" class="link">Learn more ></a>
      </p>
    </div>

    <!-- Fixed Search Section -->
    <div class="search-container">
      <div class="search-bar">
        <svg
          class="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="search-input"
        />
      </div>
    </div>

    <!-- Fixed Section Title -->
    <div class="section-title">My Apps</div>

    <!-- Scrollable List (only this part scrolls) -->
    <div class="list-scroll-container">
      <div class="list-group">
        <!-- Create New App Action -->
        <div class="list-item clickable" @click="handleCreateApp">
          <div class="item-icon-container">
            <svg
              class="plus-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div class="item-content">
            <div class="item-title action-text">Register New App</div>
          </div>
        </div>

        <!-- Existing Apps List -->
        <div
          v-for="app in apps"
          :key="app.code"
          class="list-item clickable"
          @click="handleAppClick(app)"
        >
          <div class="item-content">
            <div class="item-title">{{ app.name }}</div>
            <div class="item-subtitle">{{ app.description }}</div>
          </div>
          <div class="item-arrow">
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 13L7 7L1 1"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Footer Actions -->
    <div class="tg-footer-actions">
      <button @click="goToHome" class="tg-button">Back to Home</button>
    </div>
  </div>
</template>

<style scoped>
/* Header Section - Fixed at top */
.header-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px 12px;
  text-align: center;
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
}

/* Search Section - Fixed */
.search-container {
  flex-shrink: 0;
  padding: 8px 16px;
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
}

/* Section Title - Fixed */
.section-title {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 20px;
  font-weight: 700;
  color: var(--tg-theme-text-color, var(--fallback-text-color));
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
}

/* Scrollable List Container */
.list-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* Only show scrollbar when needed */
  overscroll-behavior: contain;
  padding: 0 16px 16px;
}

.avatar-container {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--tg-theme-secondary-bg-color, #2c2c2e);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.page-description {
  margin: 0;
  font-size: 15px;
  line-height: 1.4;
  color: var(--tg-theme-hint-color, #8e8e93);
  max-width: 320px;
}

.link {
  color: var(--tg-theme-link-color, #3390ec);
  text-decoration: none;
  cursor: pointer;
}

/* Search Section */
.search-container {
  padding: 8px 16px;
  margin-bottom: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--tg-theme-secondary-bg-color, #2c2c2e);
  border-radius: 12px;
  padding: 8px 12px;
}

.search-icon {
  color: var(--tg-theme-hint-color, #8e8e93);
  margin-right: 8px;
}

.search-input {
  background: none;
  border: none;
  color: var(--tg-theme-text-color, #fff);
  font-size: 17px;
  width: 100%;
  outline: none;
}

.search-input::placeholder {
  color: var(--tg-theme-hint-color, #8e8e93);
}

/* Section Title */
.section-title {
  padding: 8px 16px;
  font-size: 20px;
  font-weight: 700;
  color: var(--tg-theme-text-color, #fff);
}

/* List Group - inside scroll container so no margin needed */
.list-group {
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  border-radius: 14px;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.list-item:last-child {
  border-bottom: none;
}

/* Action Item - Page specific */
.item-icon-container {
  width: 40px;
  display: flex;
  justify-content: center;
  margin-right: 12px;
}

.plus-icon {
  color: var(--tg-theme-link-color, #3390ec);
}

.action-text {
  color: var(--tg-theme-link-color, #3390ec) !important;
}

/* Item Content */
.item-content {
  flex: 1;
}

.item-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #fff);
}

.item-subtitle {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #8e8e93);
}

.item-arrow {
  color: var(--tg-theme-hint-color, #8e8e93);
  opacity: 0.5;
}
/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
