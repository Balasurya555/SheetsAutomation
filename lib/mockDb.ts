
import { UserProfile, ApiProvider } from '../types';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'admin-001',
    name: 'Surya Admin',
    email: 'nbalasurya12345@gmail.com',
    role: 'admin',
    provider: 'gemini',
    isBlocked: false,
    tokenUsage: 0,
    lastLogin: new Date().toISOString(),
    isOnline: true
  },
  {
    id: 'user-001',
    name: 'Demo User',
    email: 'user@example.com',
    role: 'user',
    provider: 'gemini',
    isBlocked: false,
    tokenUsage: 4500,
    lastLogin: new Date().toISOString(),
    isOnline: false
  }
];

export const getDbUsers = (): UserProfile[] => {
  const stored = localStorage.getItem('sa_users');
  if (!stored) {
    localStorage.setItem('sa_users', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const saveDbUsers = (users: UserProfile[]) => {
  localStorage.setItem('sa_users', JSON.stringify(users));
};

export const updateUserInDb = (userId: string, updates: Partial<UserProfile>) => {
  const users = getDbUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveDbUsers(users);
  }
};
