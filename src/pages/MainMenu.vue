<script setup lang="ts">
import { ref, onMounted } from "vue";
import { miniApp, viewport, backButton } from "@tma.js/sdk-vue";

// Page state
const selectedItems = ref<string[]>([]);
const isLoading = ref(false);

// Lifecycle
onMounted(() => {
  // Expand viewport
  if (viewport.mount.isAvailable()) {
    viewport.mount();
    viewport.expand();
  }

  // Setup back button
  if (backButton.mount.isAvailable()) {
    backButton.mount();
    backButton.show();
    backButton.onClick(() => {
      // Handle back navigation
      console.log("Back button clicked");
    });
  }
});

// Methods
const handleAddItem = () => {
  console.log("Add item clicked");
  // TODO: Implement add item logic
};

const handleRemoveItem = (item: string) => {
  selectedItems.value = selectedItems.value.filter((i) => i !== item);
};

const handlePrimaryAction = () => {
  console.log("Primary action clicked");
  // TODO: Implement primary action
};
</script>

<template>
  <div class="main-menu">
    <!-- Header -->
    <header class="header">
      <div class="header-title">
        <h1></h1>
        <span class="subtitle"></span>
      </div>

      <button class="info-btn">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M12 16v-4m0-4h.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="icon-container">
        <!-- Replace with your icon/image -->
        <div class="placeholder-icon">
          <img
            src="@/assets/icons/Power Pro Logo.png"
            alt="Power Pro Logo "
            style="width: 120px; height: 120px; background-color: transparent"
          />
        </div>
      </div>

      <h2 class="hero-title">Power Pro Mini App</h2>
      <p class="hero-subtitle">
        Welcome to Power Pro Mini App, please select your menu.
        <a href="#" class="learn-more">Learn More ›</a>
      </p>
    </section>

    <!-- Items Section -->
    <section class="items-section">
      <div class="section-header">
        <span class="section-title">Menu</span>
      </div>

      <!-- Item List -->
      <div class="item-list">
        <!-- Item 1 -->
        <div class="item">
          <div class="item-icon">
            <span class="icon-placeholder">⚙️</span>
          </div>
          <div class="item-content">
            <h3 class="item-title">Room Attendant</h3>
            <p class="item-description">Room attendant menu</p>
          </div>
          <button class="item-remove" @click="handleRemoveItem('item1')">
            🗑️
          </button>
        </div>

        <!-- Item 2 -->
        <div class="item">
          <div class="item-icon">
            <span class="icon-placeholder">🔋</span>
          </div>
          <div class="item-content">
            <h3 class="item-title">Another Item</h3>
            <p class="item-description">Another description</p>
          </div>
          <button class="item-remove" @click="handleRemoveItem('item2')">
            🗑️
          </button>
        </div>
      </div>

      <!-- Add More Button -->
      <button class="add-more-btn" @click="handleAddItem">
        <span class="plus-icon">+</span>
        Add More
      </button>
    </section>

    <!-- Bottom Actions -->
    <div class="bottom-actions">
      <button
        class="primary-btn"
        @click="handlePrimaryAction"
        :disabled="isLoading"
      >
        {{ isLoading ? "Loading..." : "Primary Action" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.main-menu {
  min-height: 100vh;
  background: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
  padding-bottom: 80px;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--tg-theme-hint-color, #e5e5e5);
}

.cancel-btn,
.info-btn {
  background: none;
  border: none;
  color: var(--tg-theme-link-color, #007aff);
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.header-title h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.subtitle {
  font-size: 12px;
  color: var(--tg-theme-hint-color, #999);
}

/* Hero Section */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  text-align: center;
}

.icon-container {
  margin-bottom: 24px;
}

.placeholder-icon {
  font-size: 80px;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 24px;
}

.hero-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000);
}

.hero-subtitle {
  margin: 0;
  font-size: 15px;
  color: var(--tg-theme-hint-color, #999);
}

.learn-more {
  color: var(--tg-theme-link-color, #007aff);
  text-decoration: none;
  font-weight: 500;
}

/* Items Section */
.items-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.section-header {
  padding: 16px 0 8px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-theme-hint-color, #999);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-list {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--tg-theme-bg-color, #fff);
  border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-placeholder {
  font-size: 24px;
}

.item-content {
  flex: 1;
}

.item-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--tg-theme-text-color, #000);
}

.item-description {
  margin: 0;
  font-size: 14px;
  color: var(--tg-theme-hint-color, #999);
}

.item-remove {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.item-remove:hover {
  opacity: 1;
}

.add-more-btn {
  width: 100%;
  padding: 12px;
  background: var(--tg-theme-bg-color, #fff);
  border: 2px dashed var(--tg-theme-hint-color, #ccc);
  border-radius: 12px;
  color: var(--tg-theme-link-color, #007aff);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.add-more-btn:hover {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.plus-icon {
  font-size: 20px;
  font-weight: 300;
}

/* Bottom Actions */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--tg-theme-bg-color, #fff);
  border-top: 1px solid var(--tg-theme-hint-color, #e5e5e5);
}

.primary-btn {
  width: 100%;
  padding: 16px;
  background: var(--tg-theme-button-color, #007aff);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.primary-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 375px) {
  .hero-title {
    font-size: 20px;
  }

  .placeholder-icon {
    font-size: 60px;
    width: 100px;
    height: 100px;
  }
}
</style>
