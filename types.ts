
export type UserRole = 'SUPERADMIN' | 'HOTEL_ADMIN' | 'STAFF';

export interface ModuleConfig {
  inventory: boolean;
  reservations: boolean;
  personnel: boolean;
  accounting: boolean;
  concierge: boolean;
}

export interface Room {
  id: string;
  number: string;
  category: string;
  status: 'Available' | 'Booked' | 'Maintenance' | 'Cleaning';
  floor: number;
  basePrice?: number;
}

export interface PropertySetupData {
  logo?: string;
  address: string;
  taxId: string;
  floors: number;
  totalRooms: number;
  currency: string;
  roomCategories: string[];
  roomInventory: Room[];
}

export interface HotelTenant {
  id: string;
  clientId: string; 
  name: string;
  ownerName: string;
  location: string;
  username: string;
  onboardedAt: string;
  status: 'Active' | 'Suspended';
  modules: ModuleConfig;
  isSetupComplete: boolean;
  setupData?: PropertySetupData;
}

export interface UserSession {
  role: UserRole;
  username: string;
  hotelId?: string;
  clientId: string;
  tenantName?: string;
  isSetupComplete?: boolean;
  setupData?: PropertySetupData;
  permissions?: string[]; // e.g., ['res_view', 'res_create', 'res_edit', 'res_delete']
}

export type AppTab = 'dashboard' | 'rooms' | 'bookings' | 'staff' | 'tenants' | 'accounting';

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled' | 'No-Show';
export type BookingSource = 'Walk-In' | 'Phone' | 'Online' | 'OTA';

export interface Reservation {
  id: string;
  clientId: string;
  guestName: string;
  email: string;
  phone: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: ReservationStatus;
  source: BookingSource;
  totalAmount: number;
  specialRequests?: string;
  internalNotes?: string;
  createdAt: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  type: string;
  size: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: { uri: string; title: string }[];
}

export interface ImageResult {
  url: string;
  prompt: string;
  timestamp: number;
}
