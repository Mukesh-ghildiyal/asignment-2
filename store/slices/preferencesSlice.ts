import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  enabledSources: {
    news: boolean;
    books: boolean;
    social: boolean;
  };
  newsCategories: string[];
  layout: 'grid' | 'list';
  itemsPerPage: number;
}

const initialState: UserPreferences = {
  enabledSources: {
    news: true,
    books: true,
    social: true,
  },
  newsCategories: ['world', 'technology', 'science'],
  layout: 'grid',
  itemsPerPage: 10,
};

// Load from localStorage
const loadPreferences = (): UserPreferences => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      return { ...initialState, ...JSON.parse(saved) };
    }
  }
  return initialState;
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: loadPreferences(),
  reducers: {
    updateEnabledSources: (state, action: PayloadAction<Partial<UserPreferences['enabledSources']>>) => {
      state.enabledSources = { ...state.enabledSources, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    updateNewsCategories: (state, action: PayloadAction<string[]>) => {
      state.newsCategories = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    updateLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layout = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    updateItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
  },
});

export const { updateEnabledSources, updateNewsCategories, updateLayout, updateItemsPerPage } = preferencesSlice.actions;
export default preferencesSlice.reducer;