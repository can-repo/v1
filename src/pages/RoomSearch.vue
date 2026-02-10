<script setup lang="ts">
import { viewport } from "@tma.js/sdk-vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getProfile, getRASearchRoom } from "@/api";
import { useProfileStore } from "@/stores/profile";

// Types
interface FooterItem {
  label: string;
  value: string;
  active: boolean;
}

// Router and stores
const router = useRouter();
const profileStore = useProfileStore();

// State
const searchInput = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

// Computed
const userID = computed(() => profileStore.profileData?.userID);

const footerItems = computed<FooterItem[]>(() => [
  { label: "Status", value: "status", active: false },
  { label: "Room", value: "room", active: true },
]);

// Methods
const append = (num: string) => {
  searchInput.value += num;
};

const clearInput = () => {
  searchInput.value = "";
};

const deleteLastChar = () => {
  searchInput.value = searchInput.value.slice(0, -1);
};

const showAlert = (message: string, callback?: () => void) => {
  alert(message);
  if (callback) callback();
};

const handleOK = async () => {
  if (!searchInput.value) return;

  loading.value = true;
  error.value = null;

  try {
    console.log("Searching room:", searchInput.value);
    const roomData = await getRASearchRoom(
      searchInput.value,
      searchInput.value,
    );

    if (roomData && roomData.length > 0) {
      const room = roomData[0];
      console.log("Room found:", room);

      // Navigate to RoomDetail page
      router.push({
        name: "RoomDetail",
        params: { roomNumber: searchInput.value },
      });
    } else {
      showAlert(
        `Room ${searchInput.value} not found. Please try another room number.`,
        () => {
          searchInput.value = "";
        },
      );
    }
  } catch (err) {
    console.error("Error fetching room detail:", err);
    showAlert("Failed to fetch room detail. Please try again.");
    error.value = "Failed to fetch room detail.";
  } finally {
    loading.value = false;
  }
};

const handleList = () => {
  router.push("/guest-list");
};

const handleFooterNav = (value: string) => {
  if (value === "status") {
    router.push("/Status");
  }
};

const loadProfile = async () => {
  // Skip if already loaded
  if (profileStore.profileData?.userID) {
    return;
  }

  try {
    const response = await getProfile();
    if (response.userID) {
      profileStore.setProfile(response);
    }
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
};

// Lifecycle
onMounted(async () => {
  // Expand viewport if available
  if (viewport.mount.isAvailable()) {
    viewport.mount();
    viewport.expand();
  }

  // Load profile if not already loaded
  await loadProfile();
});
</script>

<template>
  <div class="tg-page">
    <!-- Fixed Header -->
    <div class="search-header">
      <div class="header-content">
        <h1 class="tg-title-large">Room Search</h1>
        <p class="tg-caption" v-if="userID">{{ userID }}</p>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="tg-page-content">
      <div class="search-container">
        <!-- Room Input Display -->
        <div class="input-section">
          <label class="input-label tg-body">Room No.</label>
          <div class="input-display">
            <input
              v-model="searchInput"
              type="text"
              class="room-input"
              readonly
              placeholder="Enter room number"
            />
          </div>
        </div>

        <!-- Keypad -->
        <div class="keypad-grid">
          <!-- Row 1 -->
          <button class="keypad-btn" @click="append('7')">7</button>
          <button class="keypad-btn" @click="append('8')">8</button>
          <button class="keypad-btn" @click="append('9')">9</button>
          <button class="keypad-btn btn-action btn-list" @click="handleList">
            List
          </button>

          <!-- Row 2 -->
          <button class="keypad-btn" @click="append('4')">4</button>
          <button class="keypad-btn" @click="append('5')">5</button>
          <button class="keypad-btn" @click="append('6')">6</button>

          <!-- Row 3 -->
          <button class="keypad-btn" @click="append('1')">1</button>
          <button class="keypad-btn" @click="append('2')">2</button>
          <button class="keypad-btn" @click="append('3')">3</button>
          <button class="keypad-btn btn-action" @click="clearInput">
            Clear
          </button>

          <!-- Row 4 -->
          <button class="keypad-btn" @click="append('0')">0</button>
          <button
            class="keypad-btn btn-primary btn-ok"
            @click="handleOK"
            :disabled="loading"
          >
            {{ loading ? "..." : "OK" }}
          </button>
          <button class="keypad-btn btn-action" @click="deleteLastChar">
            Del
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <p class="tg-caption">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Fixed Footer with Navigation -->
    <div class="dashboard-footer">
      <div class="nav-tabs">
        <div
          v-for="item in footerItems"
          :key="item.value"
          class="nav-tab"
          :class="{ active: item.active }"
          @click="handleFooterNav(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fixed Header */
.search-header {
  flex-shrink: 0;
  padding: 16px;
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
  border-bottom: 1px solid var(--fallback-separator-color);
  text-align: center;
}

.header-content h1 {
  margin: 0;
}

.header-content p {
  margin: 4px 0 0 0;
  opacity: 0.7;
}

/* Search Container */
.search-container {
  padding: 20px 16px;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}

/* Input Section */
.input-section {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--tg-theme-text-color, var(--fallback-text-color));
}

.input-display {
  width: 100%;
}

.room-input {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  border: 2px solid var(--tg-theme-link-color, var(--fallback-link-color));
  border-radius: 12px;
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  color: var(--tg-theme-text-color, var(--fallback-text-color));
  outline: none;
  transition: all 0.2s;
}

.room-input:focus {
  border-color: var(--tg-theme-button-color, var(--fallback-button-color));
  box-shadow: 0 0 0 3px
    rgba(var(--tg-theme-button-color-rgb, 51, 144, 236), 0.1);
}

/* Keypad Grid */
.keypad-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.keypad-btn {
  height: 64px;
  border: none;
  border-radius: 12px;
  background-color: var(--tg-theme-button-color, var(--fallback-button-color));
  color: var(--tg-theme-button-text-color, white);
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.keypad-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.keypad-btn:active {
  transform: translateY(0);
  opacity: 0.8;
}

.keypad-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action {
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  color: var(--tg-theme-text-color, var(--fallback-text-color));
  font-size: 18px;
  font-weight: 500;
}

.btn-list {
  grid-row: span 2;
  font-size: 20px;
  height: auto;
}

.btn-ok {
  grid-column: span 2;
}

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--tg-theme-button-color, var(--fallback-button-color)),
    var(--tg-theme-link-color, var(--fallback-link-color))
  );
  font-size: 20px;
}

/* Error Message */
.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  text-align: center;
  color: #f44336;
}

/* Fixed Footer */
.dashboard-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
  border-top: 1px solid var(--fallback-separator-color);
}

.nav-tabs {
  flex: 1;
  display: flex;
  gap: 8px;
}

.nav-tab {
  flex: 1;
  padding: 10px 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: var(--tg-theme-hint-color, var(--fallback-hint-color));
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-tab:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-tab.active {
  color: white;
  background-color: var(--tg-theme-link-color, var(--fallback-link-color));
}

/* Responsive */
@media (max-width: 360px) {
  .keypad-btn {
    height: 56px;
    font-size: 20px;
  }

  .room-input {
    height: 48px;
    font-size: 20px;
  }
}
</style>
