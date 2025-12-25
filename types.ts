
export type UserRole = 'SUPERADMIN' | 'HOTEL_ADMIN' | 'STAFF';

export interface ModuleConfig {
  inventory: boolean;
  reservations: boolean;
  personnel: boolean;
  accounting: boolean;
  concierge: boolean;
}

export interface PropertySetupData {
  logo?: string;
  address: string;
  taxId: string; // GST or Udyam
  floors: number;
  totalRooms: number;
  currency: string;
  roomCategories: string[];
  roomInventory: { number: string; category: string }[];
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
  isSetupComplete?: boolean; // Track if the owner has finished property setup
}

export type AppTab = 'dashboard' | 'rooms' | 'bookings' | 'staff' | 'tenants' | 'settings' | 'chat' | 'image-gen' | 'live';

export interface Room {
  id: string;
  type: string;
  number: string;
  status: 'Available' | 'Booked';
}

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
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

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  type: string;
  size: number;
}
