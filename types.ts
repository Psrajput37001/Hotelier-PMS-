
export type UserRole = 'SUPERADMIN' | 'HOTEL_ADMIN' | 'STAFF';

export interface ModuleConfig {
  inventory: boolean;
  reservations: boolean;
  personnel: boolean;
  accounting: boolean;
  concierge: boolean;
}

export interface HotelTenant {
  id: string;
  clientId: string; // 3 Alphabets + 3 Numbers
  name: string;
  ownerName: string;
  location: string;
  username: string;
  onboardedAt: string;
  status: 'Active' | 'Suspended';
  modules: ModuleConfig;
}

export interface UserSession {
  role: UserRole;
  username: string;
  hotelId?: string;
  clientId: string;
  tenantName?: string;
}

// Fixed: Added 'chat', 'image-gen', and 'live' to AppTab type to allow navigation to AI features
export type AppTab = 'dashboard' | 'rooms' | 'bookings' | 'staff' | 'tenants' | 'settings' | 'chat' | 'image-gen' | 'live';

export interface Room {
  id: string;
  type: 'Superior' | 'Delux' | 'Guest' | 'Single';
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

// Fixed: Added ProjectFile interface to support file uploads in WelcomeScreen
export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  type: string;
  size: number;
}
