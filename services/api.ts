
import { Member, Contribution, AuthResponse, UserRole, UserStatus } from '../types';
import { MOCK_MEMBERS, MOCK_CONTRIBUTIONS } from '../constants';

// Configuration API
const API_URL = '/api';
const USE_MOCK_DATA = false;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- AUTHENTIFICATION ---
  
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      // Backdoor Admin
      if (identifier === 'admin' && password === 'admin123') {
        return {
          user: {
            id: 'ADMIN001',
            fullName: 'Administrateur',
            phone: '000000000',
            sqmCommitted: 0,
            joinDate: new Date().toISOString(),
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE
          },
          token: 'mock-jwt-token-admin'
        };
      }
      
      // Recherche uniquement par téléphone
      const member = MOCK_MEMBERS.find(m => m.phone === identifier);
      if (member) {
        return { user: member, token: 'mock-jwt-token-member' };
      }
      throw new Error('Identifiants incorrects');
    } else {
      // VRAI BACKEND
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      if (!response.ok) throw new Error('Erreur de connexion');
      return await response.json();
    }
  },

  register: async (memberData: Member): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      await delay(1000);
      return { user: memberData, token: 'mock-jwt-token-new' };
    } else {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) throw new Error("Erreur lors de l'inscription");
      return await response.json();
    }
  },

  // --- DONNÉES ---

  getMembers: async (): Promise<Member[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return MOCK_MEMBERS;
    } else {
      const response = await fetch(`${API_URL}/members`);
      return await response.json();
    }
  },

  getContributions: async (): Promise<Contribution[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return MOCK_CONTRIBUTIONS;
    } else {
      const response = await fetch(`${API_URL}/contributions`);
      return await response.json();
    }
  },

  addContribution: async (contribution: Contribution): Promise<Contribution> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return contribution;
    } else {
      const response = await fetch(`${API_URL}/contributions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contribution),
      });
      return await response.json();
    }
  },

  getSettings: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/settings`);
    return response.json();
  },

  updateSettings: async (settings: any): Promise<any> => {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return response.json();
  },

  getLegalPage: async (slug: string): Promise<any> => {
    const response = await fetch(`${API_URL}/legal-pages/${slug}`);
    if (!response.ok) throw new Error('Page not found');
    return response.json();
  },

  makeDonation: async (donation: any): Promise<any> => {
    const response = await fetch(`${API_URL}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation),
    });
    return response.json();
  },

  resetPasswordRequest: async (phone: string): Promise<{ success: boolean, message: string }> => {
    // Mock API call
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Code envoyé' }), 1000));
  },

  resetPasswordConfirm: async (phone: string, code: string, newPassword: string): Promise<{ success: boolean }> => {
    // Mock API call
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  }
};
