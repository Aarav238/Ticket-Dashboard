// TypeScript types for the guide system

export interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: GuideContent[];
  estimatedTime: string; // e.g., "2 minutes"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GuideContent {
  type: 'text' | 'image' | 'step' | 'tip' | 'warning' | 'code';
  title?: string;
  content: string;
  code?: string;
  language?: string;
  imageUrl?: string;
  alt?: string;
}

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  action?: string; // What user should do
  result?: string; // What should happen
  screenshot?: string;
}

export interface GuideNavigation {
  currentSection: number;
  totalSections: number;
  completedSections: number[];
}

export interface GuideState {
  isOpen: boolean;
  currentSectionId: string;
  completedSections: string[];
  progress: number; // 0-100
}
