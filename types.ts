export interface Lead {
  id: string;
  name: string;
  phone: string;
  requirement: string; // e.g., "3BHK Rent", "Buy Plot"
  status: 'New' | 'Contacted' | 'Closed';
  timestamp: number;
  source: 'Instagram DM' | 'Comment' | 'Simulator';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppConfig {
  apiKey: string;
  googleSheetId: string;
  instagramToken: string;
}

export enum BotState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  EXTRACTING = 'EXTRACTING',
}