import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
}

const loadTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

const initialState: ThemeState = {
  isDark: loadTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', JSON.stringify(state.isDark));
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;