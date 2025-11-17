export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: 'happy' | 'sad' | 'excited' | 'calm' | 'anxious' | 'loved';
  photos: string[];
  stickers: StickerPlacement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StickerPlacement {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Sticker {
  id: string;
  emoji: string;
  category: 'hearts' | 'stars' | 'flowers' | 'animals' | 'food' | 'nature';
}
