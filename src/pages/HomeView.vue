<script setup lang="ts">
import { initData, miniApp, viewport } from "@tma.js/sdk-vue";
import { getProfile } from "../api";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile";

const router = useRouter();
const profileStore = useProfileStore();

// Mengambil data user dari Telegram
const userData = computed(() => initData.state()?.user);

onMounted(async () => {
  // Expand viewport jika tersedia
  if (viewport.mount.isAvailable()) {
    viewport.mount();
    viewport.expand();
  }

  // Call Profile API
  await loadProfile();
});

const loadProfile = async () => {
  profileStore.setLoading(true);

  try {
    const response = await getProfile();

    // Response langsung berisi data (tanpa wrapper)
    if (response.userID) {
      profileStore.setProfile(response);
    } else {
      profileStore.setError("No profile data returned");
    }
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    if (err.response?.status === 401) {
      profileStore.setError("⚠️ Unauthorized: Please authenticate first");
    } else if (err.response?.status) {
      profileStore.setError(
        `⚠️ Error ${err.response.status}: ${err.response.data?.message || err.message}`,
      );
    } else {
      profileStore.setError(
        `⚠️ Network error: ${err.message || "Unknown error"}`,
      );
    }
    console.error("API Error:", error);
  } finally {
    profileStore.setLoading(false);
  }
};

const goToMenu = () => {
  router.push("/menu");
};
</script>

<template>
  <div class="tg-page">
    <!-- Page Content (scrollable) -->
    <div class="tg-page-content">
      <div class="tg-container">
        <!-- Header -->
        <div class="header-section">
          <h1 class="tg-title-large">Welcome</h1>
          <p class="tg-body greeting">
            {{ userData?.first_name || "Guest" }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="profileStore.isLoading" class="state-card loading-card">
          <div class="tg-centered">
            <div class="loading-spinner">⏳</div>
            <p class="tg-body">Loading profile...</p>
          </div>
        </div>

        <!-- Success State -->
        <div
          v-else-if="profileStore.profileData && !profileStore.error"
          class="tg-section"
        >
          <!-- Profile Card -->
          <div class="profile-card">
            <div class="card-header">
              <h2 class="tg-title-medium">Profile</h2>
              <span class="status-badge success">✓ Active</span>
            </div>

            <div class="tg-list-group">
              <div class="tg-list-item">
                <div class="tg-item-content">
                  <div class="tg-item-title">
                    {{ profileStore.profileData.fullName }}
                  </div>
                  <div class="tg-item-subtitle">
                    {{ profileStore.profileData.account_name }}
                  </div>
                </div>
              </div>

              <div class="tg-list-item">
                <div class="tg-item-content">
                  <div class="tg-item-subtitle">User ID</div>
                  <div class="tg-item-title">
                    {{ profileStore.profileData.userID }}
                  </div>
                </div>
              </div>

              <div class="tg-list-item">
                <div class="tg-item-content">
                  <div class="tg-item-subtitle">Last Updated</div>
                  <div class="tg-caption">
                    {{
                      new Date(
                        profileStore.profileData.timeStamp,
                      ).toLocaleString()
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hotel Info (if available) -->
          <div
            v-if="profileStore.profileData.Configs?.FOConfig?.[0]"
            class="profile-card"
          >
            <div class="card-header">
              <h2 class="tg-title-medium">🏨 Hotel Information</h2>
            </div>

            <div class="tg-list-group">
              <div class="tg-list-item">
                <div class="tg-item-content">
                  <div class="tg-item-subtitle">Hotel Name</div>
                  <div class="tg-item-title">
                    {{ profileStore.profileData.Configs.FOConfig[0].HotelName }}
                  </div>
                </div>
              </div>

              <div class="tg-list-item">
                <div class="tg-item-content">
                  <div class="tg-item-subtitle">Address</div>
                  <div class="tg-caption">
                    {{ profileStore.profileData.Configs.FOConfig[0].Address }}
                  </div>
                </div>
              </div>

              <div class="tg-list-item">
                <div class="tg-item-content">
                  <div class="tg-item-subtitle">System Date</div>
                  <div class="tg-caption">
                    {{ profileStore.profileData.Configs.FOConfig[0].FOSysDate }}
                  </div>
                </div>
              </div>

              <div class="tg-list-item">
                <div class="tg-item-content">
                  <div class="tg-item-subtitle">Current Shift</div>
                  <div class="tg-caption">
                    {{ profileStore.profileData.Configs.FOConfig[0].FOShift }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="profileStore.error" class="state-card error-card">
          <div class="tg-centered">
            <div class="error-icon">⚠️</div>
            <h2 class="tg-title-medium">Error</h2>
            <p class="tg-body error-text">{{ profileStore.error }}</p>
            <button @click="loadProfile" class="tg-button tg-margin-bottom-md">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Footer Actions -->
    <div class="tg-footer-actions">
      <button @click="goToMenu" class="tg-button">Open Menu</button>
    </div>
  </div>
</template>

<style scoped>
/* Page-specific customizations */
.header-section {
  text-align: center;
  padding: 32px 0 24px;
}

.greeting {
  color: var(--tg-theme-hint-color, #8e8e93);
  margin-top: 8px;
}

/* State Cards */
.state-card {
  margin: 24px 0;
  padding: 32px 24px;
  border-radius: 14px;
  text-align: center;
}

.loading-card {
  background-color: var(--tg-theme-secondary-bg-color, #2c2c2e);
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
  color: var(--tg-theme-hint-color, #8e8e93);
  margin: 16px 0;
}

/* Profile Cards */
.profile-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 12px;
}

.card-header h2 {
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.success {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
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
