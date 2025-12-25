
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
}

export interface PropertySetupData {
  logo?: string;
  address: string;
  taxId: string; // GST or Udyam
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
}

export type AppTab = 'dashboard' | 'rooms' | 'bookings' | 'staff' | 'tenants' | 'accounting' | 'settings';

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';
  totalAmount: number;
}

// Added missing ProjectFile type for WelcomeScreen
export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  type: string;
  size: number;
}

// Added missing ChatMessage type for ChatInterface
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: { uri: string; title: string }[];
}

// Added missing ImageResult type for ImageGen
export interface ImageResult {
  url: string;
  prompt: string;
  timestamp: number;
}
