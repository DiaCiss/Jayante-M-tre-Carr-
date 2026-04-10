
export type ViewState = 
  | 'home' 
  | 'presentation' 
  | 'register' 
  | 'login' 
  | 'member-dashboard' 
  | 'admin' 
  | 'donation' 
  | 'contact' 
  | 'legal-mentions' 
  | 'legal-privacy' 
  | 'legal-cgu' 
  | 'legal-transparency';

export enum UserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BANNED = 'BANNED'
}

export enum PaymentMethod {
  WAVE = 'Wave',
  OM = 'Orange Money',
  BANK = 'Virement Bancaire',
  CASH = 'Espèces'
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  url: string;
  enabled: boolean;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  content: string;
}

// Admin Simulation Settings
export interface GlobalSettings {
  targetSqm: number;
  sqmPrice: number;
  targetAmount: number;
  manualRaisedOffset: number; // Amount added manually by admin to simulate offline donations
  isSimulationMode: boolean;
  presentationText: string;
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
  legalPages: LegalPage[];
}

export interface Member {
  id: string;
  fullName: string;
  phone: string; // Primary Key
  sqmCommitted: number; 
  joinDate: string; // ISO Date
  role: UserRole;
  status: UserStatus;
  address?: string;
  photoUrl?: string;
  password?: string;
}

export interface Contribution {
  id: string;
  memberId?: string; // Optional for anonymous donations
  donorName?: string; // For anonymous donations
  donorPhone?: string; // For anonymous donations
  donorEmail?: string; // For anonymous donations
  donorMessage?: string; // For anonymous donations
  amount: number;
  date: string; // ISO Date
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  monthFor?: string;
  proofUrl?: string;
  type: 'MEMBER_CONTRIBUTION' | 'DONATION_LIBRE';
}

export interface AuthResponse {
  user: Member;
  token: string;
}

export const SQM_PRICE = 50000;
