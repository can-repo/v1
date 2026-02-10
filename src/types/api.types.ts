/**
 * API Types - All API response and request interfaces
 */

// ============================================
// Profile API Types
// ============================================

export interface ProfileResponse {
  userID: string;
  fullName: string;
  account_name: string;
  timeStamp: string;
  Configs?: {
    FOConfig?: FOConfig[];
  };
  Apps?:appinfo[];
}

export interface FOConfig {
  FOSysDate: string;
  HotelName: string;
  FOShift: string;
  Address: string;
}

export interface appinfo {
  idx : number;
  code: string;
  name: string;
  grantedApi?: string[];
  config?: string[];
}

// ============================================
// Menu/App Types (untuk MainMenu.vue)
// ============================================

export interface AppMenuItem {
  code: string;
  name: string;
  description: string;
}

// ============================================
// Current Status (untuk RAStatus.vue)
// ============================================

export interface RA_Status {
  Status: string;
  Text: string;
  Sec: number;
  Total: number;
}

// ============================================
// Search Room (untuk RASearchRoom.vue)
// ============================================

export interface RA_SearchRoom {
  Room: string;
  ReservationID: number;
  StatusHK: string;
  StatusFO: string;
  GuestName: string;
  ArrivalDate: string; // ISO date format
  DepartureDate: string; // ISO date format
  FlagDoubleLock: number;
  FlagDND: number;
  FlagRejectCleaning: number;
  FlagNL: number;
  FlagGuestSick: number;
  FlagGuestHandicap: number;
  BorrowedItem: number;
  History: number;
  FlagMsg: number;
  FlagGuestNoInfo: number;
  FlagHoneymooner: number;
  FlagComplain: number;
  FlagSleepOut: number;
  FlagLockedMinibar: number;
  FlagMR: number;
  FlagTransactionClose: number;
  POSInCash: number;
  Viplevel: number;
  NoteRoomMessage: string;
  NotePrefer: string;
  OOOTitle: string;
  OOONote: string;
  DateStart: string; // ISO date format
  DateEnd: string; // ISO date format
  OOONumber: number;
  RoomType: string;
  StatusAll: string;
}

// ============================================
// Future API Types (tambahkan di sini)
// ============================================

// export interface OrderResponse { ... }
// export interface RoomAttendantResponse { ... }
