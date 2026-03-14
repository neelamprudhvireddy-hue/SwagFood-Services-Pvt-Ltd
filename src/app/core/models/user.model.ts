export type UserRole = 'ADMIN' | 'MANAGER' | 'WORKER' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  favorites: string[];
  walletBalance: number;
  loyaltyPoints: number;
  role: UserRole;
}
