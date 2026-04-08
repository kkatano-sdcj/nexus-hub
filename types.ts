export enum ContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  PODCAST = 'PODCAST',
  EVENT = 'EVENT'
}

export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  content?: string; // Full content for articles
  thumbnail: string;
  author: Author;
  date: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  mediaUrl?: string; // For video/audio
  duration?: string; // For video/audio
  location?: string; // For events
}

export interface AIResponseState {
  isLoading: boolean;
  content: string | null;
  error: string | null;
}
