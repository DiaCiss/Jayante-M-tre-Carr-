
import { Member, Contribution, UserRole, UserStatus, PaymentMethod } from './types';

// Helper to generate dates
const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const MOCK_MEMBERS: Member[] = [
  // ADMIN
  { id: 'ADM-001', fullName: 'Serigne Saliou (Admin)', phone: '770000000', sqmCommitted: 0, joinDate: getDate(365), role: UserRole.ADMIN, status: UserStatus.ACTIVE, address: 'Siège FMS' },
  
  // TOP BUILDERS (Gold/Silver)
  { id: 'KST-001', fullName: 'El Hadji Malick Sy', phone: '776543210', sqmCommitted: 20, joinDate: getDate(120), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Dakar Plateau' },
  { id: 'KST-002', fullName: 'Sokhna Diarra Bousso', phone: '775551234', sqmCommitted: 15, joinDate: getDate(110), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Touba' },
  { id: 'KST-003', fullName: 'Moustapha Cissé', phone: '778889900', sqmCommitted: 10, joinDate: getDate(90), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Thiaroye Azur' },
  { id: 'KST-004', fullName: 'Fatima Ndiaye', phone: '762223344', sqmCommitted: 10, joinDate: getDate(85), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Mbao' },
  
  // REGULAR BUILDERS
  { id: 'KST-005', fullName: 'Amadou Ba', phone: '771234567', sqmCommitted: 5, joinDate: getDate(60), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Pikine' },
  { id: 'KST-006', fullName: 'Moussa Diop', phone: '772345678', sqmCommitted: 5, joinDate: getDate(55), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Guédiawaye' },
  { id: 'KST-007', fullName: 'Omar Fall', phone: '773456789', sqmCommitted: 2, joinDate: getDate(40), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Keur Massar' },
  { id: 'KST-008', fullName: 'Aissatou Diallo', phone: '774567890', sqmCommitted: 2, joinDate: getDate(35), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Rufisque' },
  { id: 'KST-009', fullName: 'Babacar Seck', phone: '775678901', sqmCommitted: 1, joinDate: getDate(30), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Thiaroye' },
  { id: 'KST-010', fullName: 'Mariama Sow', phone: '776789012', sqmCommitted: 1, joinDate: getDate(25), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Parcelles' },
  
  // NEW / PENDING
  { id: 'KST-011', fullName: 'Ibrahima Gueye', phone: '777890123', sqmCommitted: 1, joinDate: getDate(5), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Yoff' },
  { id: 'KST-012', fullName: 'Khadija Tall', phone: '778901234', sqmCommitted: 5, joinDate: getDate(2), role: UserRole.MEMBER, status: UserStatus.PENDING, address: 'Ouakam' },
  { id: 'KST-013', fullName: 'Abdoulaye Wade', phone: '779012345', sqmCommitted: 2, joinDate: getDate(1), role: UserRole.MEMBER, status: UserStatus.PENDING, address: 'Fann' },
  { id: 'KST-014', fullName: 'Jean Gomis', phone: '701112233', sqmCommitted: 1, joinDate: getDate(10), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Mermoz' },
  { id: 'KST-015', fullName: 'Seynabou Ka', phone: '763334455', sqmCommitted: 3, joinDate: getDate(15), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Thiaroye Azur' },
  { id: 'KST-016', fullName: 'Ousmane Sonko', phone: '754445566', sqmCommitted: 1, joinDate: getDate(20), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Ziguinchor' },
  { id: 'KST-017', fullName: 'Mame Diarra', phone: '775556677', sqmCommitted: 4, joinDate: getDate(18), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Touba' },
  { id: 'KST-018', fullName: 'Cheikh Anta', phone: '786667788', sqmCommitted: 2, joinDate: getDate(12), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Bambey' },
  { id: 'KST-019', fullName: 'Rokhaya Niang', phone: '707778899', sqmCommitted: 1, joinDate: getDate(8), role: UserRole.MEMBER, status: UserStatus.ACTIVE, address: 'Saint Louis' },
  { id: 'KST-020', fullName: 'Modou Lo', phone: '768889900', sqmCommitted: 10, joinDate: getDate(1), role: UserRole.MEMBER, status: UserStatus.PENDING, address: 'Parcelles' },
];

export const MOCK_CONTRIBUTIONS: Contribution[] = [
  // Large Donations (Gold Builders)
  { id: 'PAY-001', memberId: 'KST-001', amount: 500000, date: getDate(100), method: PaymentMethod.BANK, status: 'completed', monthFor: 'Avance', type: 'MEMBER_CONTRIBUTION' },
  { id: 'PAY-002', memberId: 'KST-001', amount: 500000, date: getDate(30), method: PaymentMethod.BANK, status: 'completed', monthFor: 'Solde', type: 'MEMBER_CONTRIBUTION' },
  { id: 'PAY-003', memberId: 'KST-002', amount: 250000, date: getDate(90), method: PaymentMethod.CASH, status: 'completed', monthFor: 'Tranche 1', type: 'MEMBER_CONTRIBUTION' },
  { id: 'PAY-004', memberId: 'KST-003', amount: 100000, date: getDate(60), method: PaymentMethod.WAVE, status: 'completed', monthFor: 'Octobre', type: 'MEMBER_CONTRIBUTION' },
  
  // Regular Donations
  { id: 'PAY-005', memberId: 'KST-005', amount: 50000, date: getDate(50), method: PaymentMethod.WAVE, status: 'completed', monthFor: 'Novembre', type: 'MEMBER_CONTRIBUTION' },
  { id: 'PAY-006', memberId: 'KST-006', amount: 25000, date: getDate(40), method: PaymentMethod.OM, status: 'completed', monthFor: 'Novembre', type: 'MEMBER_CONTRIBUTION' },
  { id: 'PAY-007', memberId: 'KST-006', amount: 25000, date: getDate(10), method: PaymentMethod.OM, status: 'completed', monthFor: 'Décembre', type: 'MEMBER_CONTRIBUTION' },
  
  // Recent / Pending
  { id: 'PAY-008', memberId: 'KST-010', amount: 10000, date: getDate(1), method: PaymentMethod.WAVE, status: 'pending', monthFor: 'Janvier', type: 'MEMBER_CONTRIBUTION' },
  { id: 'PAY-009', memberId: 'KST-012', amount: 250000, date: getDate(0), method: PaymentMethod.BANK, status: 'pending', monthFor: 'Totalité', type: 'MEMBER_CONTRIBUTION' },
];
