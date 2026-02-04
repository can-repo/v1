# API Documentation

dokumentasi lengkap API endpoints dan integration.

## 🔐 Authentication

Semua API requests require authentication via Telegram `initData`.

### Header Format

```
X-TgDataInit: <telegram-init-data-raw>
```

### Example

```
X-TgDataInit: query_id=AAHQUoZBAAAAANBShkH0Y8nh&user=%7B%22id%22%3A1099322064...&auth_date=1770094749&hash=5da548...
```

### Validation

Backend must validate:

1. **Signature** - menggunakan Bot Token
2. **Timestamp** - auth_date tidak expired (< 5 menit)
3. **Hash** - SHA256 validation

## 📡 Endpoints

### Get User Profile

Mendapatkan informasi profile user dan konfigurasi hotel.

**Endpoint:**

```
GET /api/auth/v2/profile
```

**Headers:**

```
Content-Type: application/json
X-TgDataInit: <telegram-init-data>
```

**Response Success (200):**

```json
{
  "userID": "ICHSAN",
  "fullName": "Ichsan",
  "account_name": "Ichsan",
  "timeStamp": "2026-02-03T13:51:40.173Z",
  "Configs": {
    "FOConfig": [
      {
        "FOSysDate": "2020-01-05",
        "HotelName": "Power Pro Solution",
        "FOShift": "1",
        "Address": "Jl. Gading Kirana Utara Blok F10 No.20"
      }
    ]
  }
}
```

**Response Error (401):**

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired initData"
}
```

**Response Error (404):**

```json
{
  "Message": "Not Found"
}
```

### TypeScript Interface

```typescript
export interface ProfileResponse {
  userID: string;
  fullName: string;
  account_name: string;
  timeStamp: string;
  Configs?: {
    FOConfig?: Array<{
      FOSysDate: string;
      HotelName: string;
      FOShift: string;
      Address: string;
    }>;
  };
}
```

## 🔧 Implementation

### Usage Example

```typescript
import { getProfile } from "@/api";

// Call API
try {
  const profile = await getProfile();
  console.log("User:", profile.fullName);
  console.log("Hotel:", profile.Configs?.FOConfig?.[0]?.HotelName);
} catch (error) {
  console.error("Failed to load profile:", error);
}
```

### Error Handling

```typescript
try {
  const profile = await getProfile();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - refresh or re-authenticate
  } else if (error.response?.status === 404) {
    // Not found - user not registered
  } else {
    // Network or other errors
  }
}
```

## 🔌 Adding New Endpoints

### Step 1: Define Interface

```typescript
// src/api/index.ts
export interface NewDataResponse {
  field1: string;
  field2: number;
}
```

### Step 2: Create Function

```typescript
export const getNewData = async (): Promise<NewDataResponse> => {
  const response = await api.get<NewDataResponse>("/api/new/endpoint");
  return response.data;
};
```

### Step 3: Use in Component

```typescript
import { getNewData } from "@/api";

const loadData = async () => {
  const data = await getNewData();
  // Use data
};
```

## 🛡️ Security Best Practices

### 1. Never Log Sensitive Data

```typescript
// ❌ Bad
console.log("initData:", initData.raw());

// ✅ Good
console.log("initData exists:", !!initData.raw());
```

### 2. Handle Expired initData

```typescript
// Check auth_date
const authDate = initData.state()?.authDate;
if (authDate) {
  const age = Date.now() / 1000 - authDate;
  if (age > 300) {
    // 5 minutes
    // initData might be expired
    showWarning("Please refresh the app");
  }
}
```

### 3. Validate Response

```typescript
const profile = await getProfile();

// Validate required fields
if (!profile.userID || !profile.fullName) {
  throw new Error("Invalid response structure");
}
```

## 🐛 Troubleshooting

### 401 Unauthorized

**Causes:**

- initData expired
- Bot token mismatch
- Invalid signature

**Solutions:**

- Refresh Telegram app
- Check backend bot token
- Verify signature validation

### 404 Not Found

**Causes:**

- Wrong endpoint URL
- User not registered in system

**Solutions:**

- Check API base URL
- Verify endpoint path
- Register user in backend

### CORS Errors

**Cause:** Backend not allowing origin or headers

**Solution:** Backend must allow:

```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type, X-TgDataInit
```

## 📊 Rate Limiting

**Current:** No rate limiting

**Recommended for production:**

- Implement retry with exponential backoff
- Cache responses when appropriate
- Debounce user actions

### Example: Retry Logic

```typescript
const retryRequest = async (fn: Function, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
};

// Usage
const profile = await retryRequest(() => getProfile());
```

## 🔄 Future Endpoints

Planned endpoints for future development:

- `POST /api/bookings` - Create booking
- `GET /api/rooms` - Get available rooms
- `GET /api/reports` - Generate reports
- `PUT /api/profile` - Update profile

## 📞 Backend Contact

For API issues or new endpoint requests:

- Backend Team: [contact info]
- Documentation: [backend docs URL]
- Issue Tracker: [URL]
