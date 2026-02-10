<script setup lang="ts">
import { viewport } from "@tma.js/sdk-vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getProfile, getRAStatus } from "@/api";
import type { RA_Status } from "@/types";
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
const roomStatuses = ref<RA_Status[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Default room status template with zero values
const defaultStatuses: RA_Status[] = [
  { Status: "RUSH", Text: "Rush Room (CIQ)", Sec: 0, Total: 0 },
  { Status: "D", Text: "Dirty", Sec: 0, Total: 0 },
  { Status: "C", Text: "Clean", Sec: 0, Total: 0 },
  { Status: "R", Text: "Ready", Sec: 0, Total: 0 },
  { Status: "-", Text: "", Sec: 0, Total: 0 },
  { Status: "OD", Text: "Occupied Dirty", Sec: 0, Total: 0 },
  { Status: "EA", Text: "Expected Arrival", Sec: 0, Total: 0 },
  { Status: "ED", Text: "Expected Departure", Sec: 0, Total: 0 },
  { Status: "-", Text: "", Sec: 0, Total: 0 },
  { Status: "V", Text: "Vacant", Sec: 0, Total: 0 },
  { Status: "O", Text: "Occupied", Sec: 0, Total: 0 },
  { Status: "-", Text: "", Sec: 0, Total: 0 },
  { Status: "M", Text: "Out of Order", Sec: 0, Total: 0 },
  { Status: "X", Text: "Out of Inventory", Sec: 0, Total: 0 },
  { Status: "-", Text: "", Sec: 0, Total: 0 },
];

// Computed
const userID = computed(() => profileStore.profileData?.userID);

const displayStatuses = computed(() => {
  return roomStatuses.value.length > 0 ? roomStatuses.value : defaultStatuses;
});

const footerItems = computed<FooterItem[]>(() => [
  { label: "Status", value: "status", active: true },
  { label: "Room", value: "room", active: false },
]);

// Methods
const fetchRoomStatus = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log("Fetching room status data...");
    const data = await getRAStatus();
    console.log("Room status received:", data);
    roomStatuses.value = data;
  } catch (err) {
    console.error("Error fetching room status:", err);
    error.value = "Failed to load room status. Please try again.";
  } finally {
    loading.value = false;
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

const shouldBeLight = (index: number): boolean => {
  // Count only non-spacer rows before this index
  let nonSpacerCount = 0;
  for (let i = 0; i < index; i++) {
    if (displayStatuses.value[i].Status !== "-") {
      nonSpacerCount++;
    }
  }
  // Apply zebra striping to non-spacer rows
  return nonSpacerCount % 2 === 1;
};

const handleFooterNav = (value: string) => {
  // Navigation handler for future implementation
  console.log("Navigate to:", value);
  if (value === "room") {
    goToRASearchRoom();
  }
};

const goToRASearchRoom = () => {
  router.push("/Search");
};

const refreshData = () => {
  fetchRoomStatus();
};

// Lifecycle
onMounted(async () => {
  // Expand viewport if available
  if (viewport.mount.isAvailable()) {
    viewport.mount();
    viewport.expand();
  }

  // Load profile first if not already loaded
  await loadProfile();

  // Fetch initial data
  await fetchRoomStatus();
});
</script>

<template>
  <div class="tg-page">
    <!-- Fixed Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="tg-title-large">Room Attendant</h1>
        <p class="tg-caption" v-if="userID">{{ userID }}</p>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="tg-page-content">
      <!-- Loading State -->
      <div v-if="loading" class="state-card loading-card">
        <div class="tg-centered">
          <div class="loading-spinner">⏳</div>
          <p class="tg-body">Loading room status...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-card error-card">
        <div class="tg-centered">
          <div class="error-icon">⚠️</div>
          <p class="tg-body error-text">{{ error }}</p>
          <button @click="fetchRoomStatus" class="tg-button">
            🔄 Try Again
          </button>
        </div>
      </div>

      <!-- Status Table -->
      <div v-else class="table-container">
        <table class="status-table">
          <thead>
            <tr>
              <th class="col-section">Section</th>
              <th class="col-desc">Description</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(status, index) in displayStatuses" :key="index">
              <!-- Spacer row -->
              <tr v-if="status.Status === '-'" class="spacer-row">
                <td colspan="3"><span class="tiny-dot">.</span></td>
              </tr>
              <!-- Regular data row -->
              <tr v-else :class="{ 'row-alt': shouldBeLight(index) }">
                <td class="col-section">{{ status.Sec }}</td>
                <td class="col-desc">{{ status.Text }}</td>
                <td class="col-total">{{ status.Total }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Floating Refresh Button -->
    <button
      class="floating-refresh-btn"
      @click="refreshData"
      :disabled="loading"
      :class="{ spinning: loading }"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path
          d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
        />
      </svg>
    </button>

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
.dashboard-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
  border-bottom: 1px solid var(--fallback-separator-color);
}

.header-content {
  flex: 1;
  text-align: center;
}

.logout-btn {
  background: none;
  border: none;
  color: var(--tg-theme-link-color, var(--fallback-link-color));
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
}

.logout-btn:active {
  opacity: 0.7;
}

/* State Cards */
.state-card {
  margin: 24px 16px;
  padding: 32px 16px;
  border-radius: 12px;
  text-align: center;
}

.loading-card {
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
}

.loading-spinner {
  font-size: 48px;
  margin-bottom: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.error-card {
  background-color: rgba(244, 67, 54, 0.1);
  border: 2px solid rgba(244, 67, 54, 0.3);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-text {
  color: var(--tg-theme-hint-color, var(--fallback-hint-color));
  margin: 16px 0;
}

/* Table Container */
.table-container {
  padding: 16px;
  overflow-x: auto;
}

.status-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  border-radius: 12px;
  overflow: hidden;
}

.status-table thead {
  background-color: var(--tg-theme-link-color, var(--fallback-link-color));
  color: white;
}

.status-table th {
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-table th.col-section {
  width: 25%;
}

.status-table th.col-desc {
  width: 50%;
}

.status-table th.col-total {
  width: 25%;
}

.status-table td {
  padding: 12px 8px;
  font-size: 15px;
  color: var(--tg-theme-text-color, var(--fallback-text-color));
  border-bottom: 1px solid var(--fallback-separator-color);
}

.status-table tbody tr:last-child td {
  border-bottom: none;
}

.status-table td.col-section {
  text-align: center;
  font-weight: 500;
}

.status-table td.col-desc {
  text-align: left;
  font-weight: 400;
}

.status-table td.col-total {
  text-align: center;
  font-weight: 600;
  color: var(--tg-theme-link-color, var(--fallback-link-color));
}

.row-alt {
  background-color: rgba(255, 255, 255, 0.03);
}

.spacer-row td {
  text-align: center;
  padding: 0;
  height: 16px;
  vertical-align: middle;
  border: none;
}

.tiny-dot {
  font-size: 8px;
  color: transparent;
  visibility: hidden;
}

/* Floating Refresh Button */
.floating-refresh-btn {
  position: fixed;
  bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  right: 20px;
  width: 56px;
  height: 56px;
  background: transparent;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 100;
  opacity: 0.9;
  color: var(--tg-theme-button-color, var(--fallback-button-color));
}

.floating-refresh-btn:hover {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.floating-refresh-btn:active {
  transform: scale(0.95);
}

.floating-refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.floating-refresh-btn.spinning svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
</style>
