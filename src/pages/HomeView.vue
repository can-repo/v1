<script setup lang="ts">
import { initData, miniApp, viewport } from "@tma.js/sdk-vue";
import { getProfile, type ProfileResponse } from "../api";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
  isLoading.value = true;
  profileError.value = null;

  try {
    const response = await getProfile();

    // Response langsung berisi data (tanpa wrapper)
    if (response.userID) {
      profileData.value = response;
    } else {
      profileError.value = "No profile data returned";
    }
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    if (err.response?.status === 401) {
      profileError.value = "⚠️ Unauthorized: Please authenticate first";
    } else if (err.response?.status) {
      profileError.value = `⚠️ Error ${err.response.status}: ${err.response.data?.message || err.message}`;
    } else {
      profileError.value = `⚠️ Network error: ${err.message || "Unknown error"}`;
    }
    console.error("API Error:", error);
  } finally {
    isLoading.value = false;
  }
};

const closeApp = () => {
  if (miniApp.mount.isAvailable()) {
    miniApp.close();
  }
};

const goToMenu = () => {
  router.push("/menu");
};
</script>

<template>
  <div class="container">
    <h1>Halo, {{ userData?.first_name || "Guest" }}!</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <p>⏳ Loading profile...</p>
    </div>

    <!-- Success State - Show Profile -->
    <div v-else-if="profileData && !profileError" class="profile-success">
      <h2>✅ Profile Loaded</h2>
      <div class="profile-info">
        <p><strong>User ID:</strong> {{ profileData.userID }}</p>
        <p><strong>Full Name:</strong> {{ profileData.fullName }}</p>
        <p><strong>Account Name:</strong> {{ profileData.account_name }}</p>
        <p>
          <strong>Timestamp:</strong>
          {{ new Date(profileData.timeStamp).toLocaleString() }}
        </p>

        <div v-if="profileData.Configs?.FOConfig?.[0]" class="hotel-info">
          <h3>🏨 Hotel Information</h3>
          <p>
            <strong>Hotel:</strong>
            {{ profileData.Configs.FOConfig[0].HotelName }}
          </p>
          <p>
            <strong>Address:</strong>
            {{ profileData.Configs.FOConfig[0].Address }}
          </p>
          <p>
            <strong>System Date:</strong>
            {{ profileData.Configs.FOConfig[0].FOSysDate }}
          </p>
          <p>
            <strong>Shift:</strong>
            {{ profileData.Configs.FOConfig[0].FOShift }}
          </p>
        </div>
      </div>
    </div>

    <!-- Error State - Show Warning -->
    <div v-else-if="profileError" class="profile-error">
      <h2>❌ Error</h2>
      <p class="error-message">{{ profileError }}</p>
      <button @click="loadProfile" class="retry-btn">🔄 Retry</button>
    </div>

    <button @click="closeApp" class="close-btn">Tutup Aplikasi</button>
    <button @click="goToMenu" class="menu-btn">Menu</button>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.loading {
  margin: 20px 0;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 8px;
}

.profile-success {
  margin: 20px 0;
  padding: 20px;
  background: #e8f5e9;
  border: 2px solid #4caf50;
  border-radius: 8px;
  text-align: left;
}

.profile-success h2 {
  color: #2e7d32;
  margin-top: 0;
}

.profile-info {
  margin-top: 15px;
}

.profile-info p {
  margin: 8px 0;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.profile-error {
  margin: 20px 0;
  padding: 20px;
  background: #ffebee;
  border: 2px solid #f44336;
  border-radius: 8px;
}

.profile-error h2 {
  color: #c62828;
  margin-top: 0;
}

.error-message {
  color: #d32f2f;
  font-weight: 500;
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.retry-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.retry-btn:hover {
  background: #1976d2;
}

.close-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.close-btn:hover {
  background: #757575;
}

.menu-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.menu-btn:hover {
  background: #1976d2;
}
</style>
