import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '../api/contentApi';

interface ContentState {
  favorites: string[];
  contentOrder: string[];
  searchQuery: string;
  currentPage: { news: number; books: number; social: number };
}

const initialState: ContentState = {
  favorites: [],
  contentOrder: [],
  searchQuery: '',
  currentPage: { news: 1, books: 1, social: 1 },
};

// Load favorites from localStorage
const loadFavorites = (): string[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return [];
};

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    ...initialState,
    favorites: loadFavorites(),
  },
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.favorites.indexOf(itemId);
      
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(itemId);
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    updateContentOrder: (state, action: PayloadAction<string[]>) => {
      state.contentOrder = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    incrementPage: (state, action: PayloadAction<'news' | 'books' | 'social'>) => {
      state.currentPage[action.payload] += 1;
    },
    resetPage: (state, action: PayloadAction<'news' | 'books' | 'social'>) => {
      state.currentPage[action.payload] = 1;
    },
  },
});

export const { toggleFavorite, updateContentOrder, setSearchQuery, incrementPage, resetPage } = contentSlice.actions;
export default contentSlice.reducer;