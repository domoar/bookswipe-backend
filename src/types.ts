// Book Interface - exakt wie im Frontend spezifiziert
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  subGenres: string[];
  coverImage?: string;
  quotes: Array<{
    text: string;
    page?: number;
  }>;
  description: string;
  pageCount: number;
  rating: number;
}

// Swipe Interface
export interface Swipe {
  id?: number;
  bookId: string;
  direction: 'left' | 'right';
  userId?: string;
  timestamp?: string;
}

// Recommendations Response
export interface RecommendationsResponse {
  recommendations: Book[];
  matchPercentages: {
    [bookId: string]: number;
  };
}

// Stats Response
export interface StatsResponse {
  totalSwipes: number;
  totalLikes: number;
  totalRead: number;
  topGenres: string[];
}
