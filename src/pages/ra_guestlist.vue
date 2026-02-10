<template>
  <div class="app-container">
    <!-- Header -->
    <AppHeader
      title="Guest List"
      :subtitle="displayName"
      @back="goBack"
      @logout="handleLogout"
    />

    <!-- Content -->
    <div class="content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading guest data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
        <button @click="refreshData" class="retry-btn">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="guests.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No guest data available</p>
        <button @click="refreshData" class="retry-btn">Refresh Data</button>
      </div>

      <!-- Data Table -->
      <div v-else class="table-wrapper">
        <table class="guest-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Type</th>
              <th>Status</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Guest Name</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(guest, index) in guests"
              :key="guest.Room"
              :class="{ 'row-light': index % 2 === 1 }"
            >
              <td class="room-col">{{ guest.Room }}</td>
              <td>{{ guest.RoomType }}</td>
              <td class="status-col">{{ guest.StatusALL }}</td>
              <td>{{ formatDate(guest.ArrivalDate) }}</td>
              <td>{{ formatDate(guest.DepartureDate) }}</td>
              <td class="guest-name">{{ guest.Guestname }}</td>
              <td class="message-col">{{ guest.NoteRoommessage || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Guest Count Badge -->
      <div v-if="guests.length > 0" class="guest-count-badge">
        Total: {{ guests.length }} guest{{ guests.length > 1 ? "s" : "" }}
      </div>
    </div>

    <!-- Refresh Icon -->
    <div class="refresh-container">
      <button class="refresh-btn" @click="refreshData" :disabled="loading">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12C4 16.4183 7.58172 20 12 20C15.5 20 18.5 17.8 19.5 14.5"
            stroke="#4fa4d8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20 12C20 7.58172 16.4183 4 12 4C8.5 4 5.5 6.2 4.5 9.5"
            stroke="#4fa4d8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 12L20 12L20 8"
            stroke="#4fa4d8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 12L4 12L4 16"
            stroke="#4fa4d8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Bottom Nav -->
    <AppFooter :items="footerItems" @navigate="handleFooterNav" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { dataService } from "@/services/dataService";
import { useUserStore } from "@/stores/userStore";
import { useTMA } from "@/composables/useTMA";
import type { RoomDetail } from "@/types/room-attendant.types";
import AppHeader from "@/components/ui/AppHeader.vue";
import AppFooter, { type FooterItem } from "@/components/ui/AppFooter.vue";

const router = useRouter();
const userStore = useUserStore();
const { webApp } = useTMA();
const guests = ref<RoomDetail[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const sRoom = ref("");
const eRoom = ref("zzzz");

// Get display name from user store
const displayName = computed(() => userStore.displayName);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log("Fetching guest data...");
    const data = await dataService.getAllRoomDetails(sRoom.value, eRoom.value);
    console.log("Data received:", data);
    console.log("Number of guests:", data.length);
    guests.value = data;
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value =
      "Failed to load data. Please ensure the API server is running and try again.";
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  fetchData();
};

const formatDate = (date: string | Date): string => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const goBack = () => {
  router.back();
};

const goToDashboard = () => {
  router.push("/dashboard");
};

const goToRoom = () => {
  router.push("/room-search");
};

const footerItems = computed<FooterItem[]>(() => [
  { label: "Dashboard", value: "dashboard", active: false },
  { label: "Room", value: "room", active: false },
]);

const handleFooterNav = (value: string) => {
  if (value === "dashboard") {
    goToDashboard();
  } else if (value === "room") {
    goToRoom();
  }
};

const handleLogout = async () => {
  const confirmed = await new Promise<boolean>((resolve) => {
    if (webApp?.showConfirm) {
      webApp.showConfirm("Are you sure you want to logout?", (result) => {
        resolve(result);
      });
    } else {
      resolve(confirm("Are you sure you want to logout?"));
    }
  });

  if (confirmed) {
    userStore.logout(router);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Table */

/* Table */
.table-wrapper {
  overflow-x: auto;
  background: white;
}

.guest-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.guest-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.guest-table th {
  background-color: #bdd7ee;
  color: #000;
  padding: 10px 8px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  border-right: 1px solid white;
  white-space: nowrap;
}

.guest-table th:last-child {
  border-right: none;
}

.guest-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  vertical-align: middle;
}

.guest-table tbody tr {
  background-color: white;
  transition: background-color 0.2s;
}

.guest-table tbody tr:hover {
  background-color: #f0f7fb;
}

.guest-table tbody tr.row-light {
  background-color: #f9f9f9;
}

.guest-table tbody tr.row-light:hover {
  background-color: #e8f4f8;
}

.room-col {
  font-weight: 600;
  color: #4fa4d8;
  text-align: center;
}

.status-col {
  text-align: center;
  font-weight: 500;
}

.guest-name {
  font-weight: 500;
  color: #1a1a1a;
}

.message-col {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
  font-size: 12px;
}

/* Guest Count Badge */
.guest-count-badge {
  position: sticky;
  bottom: 70px;
  display: block;
  width: fit-content;
  margin: 16px 16px 0 auto;
  padding: 8px 16px;
  background-color: #4fa4d8;
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(79, 164, 216, 0.3);
}
</style>
