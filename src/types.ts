export interface Job {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  salary: string;
  tags: string[];
  location: string;
  coordinates: { x: number; y: number }; // Percentage coordinate on custom map (0-100)
  time: string;
  urgent: boolean;
  applied: boolean;
  bookmarked: boolean;
  status: 'applied' | 'confirmed' | 'todo' | 'completed' | 'none';
  description: string;
  hourlyRate?: string;
  transportRate?: string;
  periodText?: string;
  durationLabel?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'recruiter';
  text: string;
  time: string;
  hasMap?: boolean;
  mapLocation?: string;
}

export interface Chat {
  id: string;
  companyName: string;
  logoUrl?: string;
  recruiterName: string;
  recruiterAvatar?: string;
  online: boolean;
  messages: Message[];
  unreadCount: number;
  lastMessageTime: string;
}

export interface CalendarDay {
  dayNum: number;
  monthOffset: number; // -1 for previous, 0 for current, 1 for next month
  fullDate: string; // YYYY-MM-DD
}
