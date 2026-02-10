<script setup lang="ts">
import { viewport } from "@tma.js/sdk-vue";
import { computed, onMounted, onUnmounted, watch, ref, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getProfile, getRASearchRoom, putUpdateRoom } from "@/api";
import type { RA_SearchRoom } from "@/types";
import { useProfileStore } from "@/stores/profile";

// Types
interface RoomFlag {
  key: string;
  label: string;
  icon: string;
}

// Router and stores
const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();

// State
const roomData = ref<RA_SearchRoom | null>(null);
const loading = ref(false);
const updating = ref(false);
const error = ref<string | null>(null);

// Swipe state
const sliderContainer = ref<HTMLElement | null>(null);
const swipePosition = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const sliderWidth = ref(350); // Default fallback

const updateSliderWidth = () => {
  if (sliderContainer.value) {
    const width = sliderContainer.value.clientWidth;
    if (width > 0) {
      sliderWidth.value = width;
    }
  }
};

// Room flags configuration
const roomFlags = ref<RoomFlag[]>([
  { key: "FlagDND", label: "DND", icon: "🚫" },
  { key: "FlagDoubleLock", label: "Double Lock", icon: "🔒" },
  { key: "FlagGuestHandicap", label: "Handicap", icon: "♿" },
  { key: "FlagNL", label: "No Luggage", icon: "🌙" },
  { key: "FlagGuestSick", label: "Sick", icon: "🤒" },
  { key: "FlagRejectCleaning", label: "No Clean", icon: "⛔" },
  { key: "BorrowedItem", label: "Borrowed", icon: "📦" },
  { key: "History", label: "History", icon: "📜" },
  { key: "FlagMsg", label: "Message", icon: "💬" },
  { key: "FlagGuestNoInfo", label: "No Info", icon: "❓" },
  { key: "FlagHoneymooner", label: "Honeymoon", icon: "💑" },
  { key: "FlagComplain", label: "Complain", icon: "😠" },
  { key: "FlagSleepOut", label: "Sleep Out", icon: "🚪" },
  { key: "FlagLockedMinibar", label: "Locked MB", icon: "🔐" },
  { key: "FlagMR", label: "Maintenance Req.", icon: "🔧" },
  { key: "FlagTransactionClose", label: "Closed Trans.", icon: "💳" },
]);

// Computed
const roomNumber = computed(() => route.params.roomNumber as string);
const userID = computed(() => profileStore.profileData?.userID);

// Status labels and classes
const statusFOLabel = computed(() => {
  const status = roomData.value?.StatusFO || "V";
  const labels: Record<string, string> = {
    O: "OCC",
    V: "VAC",
    X: "OOI",
    M: "OOO",
  };
  return labels[status] || "VAC";
});

const statusFOClass = computed(() => {
  const status = roomData.value?.StatusFO || "V";
  const classes: Record<string, string> = {
    O: "fo-occupied",
    V: "fo-vacant",
    X: "fo-ooi",
    M: "fo-ooo",
  };
  return classes[status] || "fo-vacant";
});

const statusHKButtonLabel = computed(() => {
  const status = roomData.value?.StatusHK || "D";
  const labels: Record<string, string> = {
    D: "Dirty",
    C: "Clean",
    R: "Ready",
  };
  return labels[status] || "Dirty";
});

const nextStatusHK = computed(() => {
  const status = roomData.value?.StatusHK || "D";
  const next: Record<string, string> = {
    D: "CLEAN",
    C: "READY",
    R: "DIRTY",
  };
  return next[status] || "CLEAN";
});

const nextStatusHKCode = computed(() => {
  const status = roomData.value?.StatusHK || "D";
  const next: Record<string, string> = {
    D: "C", // Dirty -> Clean
    C: "R", // Clean -> Ready
    R: "D", // Ready -> Dirty
  };
  return next[status] || "C";
});

const statusHKClass = computed(() => {
  const status = roomData.value?.StatusHK || "D";
  const classes: Record<string, string> = {
    D: "hk-dirty",
    C: "hk-clean",
    R: "hk-ready",
  };
  return classes[status] || "hk-dirty";
});

// Methods
const getCurrentTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getFlagValue = (flagKey: string): boolean => {
  if (!roomData.value) return false;
  const value = (roomData.value as unknown as Record<string, unknown>)[flagKey];
  return value === 1 || value === true;
};

const fetchRoomData = async (roomNum: string) => {
  loading.value = true;
  error.value = null;

  try {
    const data = await getRASearchRoom(roomNum, roomNum);

    if (data && data.length > 0) {
      roomData.value = data[0];
    } else {
      error.value = "Room not found";
    }
  } catch (err) {
    console.error("Error fetching room detail:", err);
    error.value = "Failed to load room details";
  } finally {
    loading.value = false;
  }
};

// Swipe handlers
const handleTouchStart = (e: TouchEvent) => {
  if (updating.value) return;
  isDragging.value = true;
  startX.value = e.touches[0].clientX - swipePosition.value;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || updating.value) return;

  const currentX = e.touches[0].clientX - startX.value;
  const maxSwipe = sliderWidth.value - 60;
  swipePosition.value = Math.max(0, Math.min(currentX, maxSwipe));
};

const handleTouchEnd = async () => {
  if (!isDragging.value || updating.value) return;
  isDragging.value = false;

  const threshold = sliderWidth.value - 70;
  if (swipePosition.value >= threshold) {
    // Swipe completed - update status
    await handleStatusUpdate();
    swipePosition.value = 0;
  } else {
    // Reset position with animation
    swipePosition.value = 0;
  }
};

const handleStatusUpdate = async () => {
  if (updating.value || !roomData.value) return;

  const confirmed = confirm(
    `Update room ${roomNumber.value} status to ${nextStatusHK.value}?`,
  );

  if (!confirmed) return;

  updating.value = true;

  try {
    await putUpdateRoom(
      roomNumber.value,
      nextStatusHKCode.value, // Use status code (C, R, D) instead of label
      profileStore.profileData?.userID || "",
      getCurrentTimestamp(),
      `Status changed from Telegram Mini App`, // Add meaningful log note
      0, // LogSource: 1 = Telegram Mini App
    );

    // Refresh room data to get updated status
    await fetchRoomData(roomNumber.value);
  } catch (err) {
    console.error("Error updating status:", err);
    alert("❌ Failed to update room status. Please try again.");
  } finally {
    updating.value = false;
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  } catch {
    return dateString;
  }
};

const goToAmenities = () => {
  if (roomNumber.value) {
    router.push(`/room-detail/${roomNumber.value}/amenities`);
  }
};

const goToMiniBar = () => {
  if (roomNumber.value) {
    router.push(`/room-detail/${roomNumber.value}/minibar`);
  }
};

const loadProfile = async () => {
  if (profileStore.profileData?.userID) return;

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
  if (viewport.mount.isAvailable()) {
    viewport.mount();
    viewport.expand();
  }

  await loadProfile();

  if (roomNumber.value) {
    await fetchRoomData(roomNumber.value);
  }

  // Wait for DOM to be ready before measuring
  await nextTick();
  updateSliderWidth();
  window.addEventListener("resize", updateSliderWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSliderWidth);
});

// Watch for room number changes
watch(roomNumber, async (newRoomNumber) => {
  if (newRoomNumber) {
    await fetchRoomData(newRoomNumber);
  }
});
</script>

<template>
  <div class="tg-page">
    <!-- Compact Header -->
    <div class="compact-header">
      <div class="header-top">
        <p class="user-id" v-if="userID">{{ userID }}</p>
        <div class="room-status-row">
          <span class="status-chip" :class="statusFOClass">{{
            statusFOLabel
          }}</span>
          <h1 class="room-number">{{ roomNumber }}</h1>
          <span class="status-chip" :class="statusHKClass">{{
            statusHKButtonLabel
          }}</span>
        </div>
      </div>
    </div>

    <!-- Scrollable Content (Compact) -->
    <div class="tg-page-content compact">
      <!-- Loading State -->
      <div v-if="loading" class="state-compact">
        <div class="loading-spinner">⏳</div>
        <p>Loading...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-compact error">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="fetchRoomData(roomNumber)" class="tg-button-sm">
          Retry
        </button>
      </div>

      <!-- Room Data (Compact Layout) -->
      <div v-else-if="roomData" class="compact-content">
        <!-- Guest Info Row -->
        <div class="guest-row">
          <div class="guest-info">
            <h2 class="guest-name">{{ roomData.GuestName || "No Guest" }}</h2>
            <div class="dates-inline">
              <span class="date-item">
                <span class="date-label">In:</span>
                <span class="date-val">{{
                  formatDate(roomData.ArrivalDate)
                }}</span>
              </span>
              <span class="date-divider">•</span>
              <span class="date-item">
                <span class="date-label">Out:</span>
                <span class="date-val">{{
                  formatDate(roomData.DepartureDate)
                }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Room Flags (Compact Grid) -->
        <div class="flags-section">
          <div class="section-label">Room Flags</div>
          <div class="flags-grid-compact">
            <div
              v-for="flag in roomFlags"
              :key="flag.key"
              class="flag-item-compact"
            >
              <div
                class="flag-check"
                :class="{ active: getFlagValue(flag.key) }"
              >
                <span v-if="getFlagValue(flag.key)">✓</span>
              </div>
              <span class="flag-text">{{ flag.label }}</span>
            </div>
          </div>
        </div>

        <!-- Room Message -->
        <div class="compact-section">
          <div class="section-label">Room Message</div>
          <div class="section-text">
            {{ roomData.NoteRoomMessage || "No message" }}
          </div>
        </div>

        <!-- Guest Preference -->
        <div class="compact-section">
          <div class="section-label">Guest Preference</div>
          <div class="section-text">
            {{ roomData.NotePrefer || "No preference" }}
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Swipe Button -->
    <div v-if="roomData" class="swipe-section">
      <div
        class="swipe-container"
        ref="sliderContainer"
        :class="nextStatusHKCode"
      >
        <div class="swipe-background">
          <span class="swipe-text">{{
            updating ? "Updating..." : `Swipe to ${nextStatusHK}`
          }}</span>
        </div>
        <div
          class="swipe-button"
          :style="{ transform: `translateX(${swipePosition}px)` }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          :class="{ dragging: isDragging, disabled: updating }"
        >
          <span class="swipe-icon">→</span>
        </div>
      </div>
    </div>

    <!-- Fixed Footer -->
    <div class="room-footer">
      <button @click="goToAmenities" class="footer-btn">Amenities</button>
      <button @click="goToMiniBar" class="footer-btn">Mini Bar</button>
    </div>
  </div>
</template>

<style scoped>
/* Compact Header */
.compact-header {
  flex-shrink: 0;
  padding: 12px 16px 8px 16px;
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
  border-bottom: 1px solid var(--fallback-separator-color);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  text-align: center;
  flex-direction: column;
  gap: 8px;
}

.room-status-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.room-number {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  color: var(--tg-theme-text-color, var(--fallback-text-color));
  text-align: center;
  line-height: 1;
}

.status-mini {
  display: none;
}

.status-chip {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-chip.fo-occupied {
  background: #fbbf24;
  color: #78350f;
}

.status-chip.fo-vacant {
  background: #60a5fa;
  color: #1e3a8a;
}

.status-chip.fo-ooi,
.status-chip.fo-ooo {
  background: #f87171;
  color: #7f1d1d;
}

.status-chip.hk-dirty {
  background: #3b82f6;
  color: white;
}

.status-chip.hk-clean {
  background: #22c55e;
  color: white;
}

.status-chip.hk-ready {
  background: #f97316;
  color: white;
}

.user-id {
  text-align: center;
  font-size: 12px;
  opacity: 0.6;
  margin: 0;
}

/* Compact Content */
.tg-page-content.compact {
  padding: 0;
}

.compact-content {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Guest Row */
.guest-row {
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.guest-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--tg-theme-text-color, var(--fallback-text-color));
  text-align: center;
}

.dates-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
}

.date-item {
  display: flex;
  gap: 4px;
}

.date-label {
  opacity: 0.6;
}

.date-val {
  font-weight: 600;
}

.date-divider {
  opacity: 0.4;
}

/* Flags Section (Compact Grid) */
.flags-section {
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  border-radius: 12px;
  padding: 14px 16px;
}

.flags-grid-compact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 8px;
}

.flag-item-compact {
  display: flex;
  align-items: center;
  gap: 6px;
}

.flag-check {
  width: 18px;
  height: 18px;
  border: 2px solid var(--tg-theme-hint-color, var(--fallback-hint-color));
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
  font-size: 12px;
}

.flag-check.active {
  background-color: var(--tg-theme-button-color, var(--fallback-button-color));
  border-color: var(--tg-theme-button-color, var(--fallback-button-color));
  color: white;
}

.flag-text {
  font-size: 12px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
  margin-bottom: 8px;
}

/* Compact Sections */
.compact-section {
  background-color: var(
    --tg-theme-secondary-bg-color,
    var(--fallback-secondary-bg-color)
  );
  border-radius: 12px;
  padding: 10px 12px;
}

.section-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--tg-theme-text-color, var(--fallback-text-color));
  min-height: 80px;
  padding: 8px;
}

/* State Cards */
.state-compact {
  padding: 40px 20px;
  text-align: center;
}

.state-compact.error {
  color: #ef4444;
}

.loading-spinner {
  font-size: 36px;
  margin-bottom: 12px;
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

.error-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.tg-button-sm {
  margin-top: 12px;
  padding: 8px 16px;
  background: var(--tg-theme-button-color, var(--fallback-button-color));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

/* Fixed Swipe Section */
.swipe-section {
  flex-shrink: 0;
  padding: 12px 16px;
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
  border-top: 1px solid var(--fallback-separator-color);
}

/* Swipe Container */
.swipe-container {
  position: relative;
  width: 100%;
  height: 56px;
  border-radius: 28px;
  overflow: hidden;
  user-select: none;
  touch-action: none;
}

.swipe-container.D {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
}

.swipe-container.C {
  background: linear-gradient(135deg, #15803d, #22c55e);
}

.swipe-container.R {
  background: linear-gradient(135deg, #c2410c, #f97316);
}

.swipe-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  pointer-events: none;
}

.swipe-text {
  font-size: 15px;
  font-weight: 600;
  color: white;
  opacity: 0.9;
}

.swipe-button {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.swipe-button.dragging {
  cursor: grabbing;
  transition: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.swipe-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.swipe-icon {
  font-size: 20px;
  color: var(--tg-theme-button-color, var(--fallback-button-color));
  font-weight: 700;
}

/* Fixed Footer */
.room-footer {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
  border-top: 1px solid var(--fallback-separator-color);
}

.footer-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: var(--tg-theme-button-color, var(--fallback-button-color));
  color: var(--tg-theme-button-text-color, white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.footer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.footer-btn:active {
  transform: translateY(0);
}
</style>
