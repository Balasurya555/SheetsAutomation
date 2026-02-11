
export type UserRole = 'user' | 'admin';
export type ApiProvider = 'openai' | 'gemini' | 'groq';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provider: ApiProvider;
  isBlocked: boolean;
  tokenUsage: number;
  lastLogin: string;
  isOnline: boolean;
}

export interface SheetConfig {
  sheetId: string;
  serviceAccount: string;
  headers: string[];
}

/**
 * Interface for structuring data generation requests.
 */
export interface DataRequest {
  startRange: number;
  endRange: number;
  fields: string;
  context?: string;
}

/**
 * Interface representing a single row of generated data.
 */
export interface GeneratedRow {
  [key: string]: any;
}
