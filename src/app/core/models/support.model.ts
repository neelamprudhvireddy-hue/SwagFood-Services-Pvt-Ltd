export interface SupportMessage {
  id: string;
  from: 'agent' | 'user';
  text: string;
  timestamp: string;
}
