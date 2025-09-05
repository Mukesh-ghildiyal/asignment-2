'use client';

import React from 'react';
import { Search, Settings, Moon, Sun, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { setSearchQuery } from '@/store/slices/contentSlice';
import { useDebounce } from 'use-debounce';

interface HeaderProps {
  onSettingsClick: () => void;
  onFavoritesClick: () => void;
  onTrendingClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onFavoritesClick, onTrendingClick }) => {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.theme);
  const { searchQuery } = useAppSelector((state) => state.content);
  const { favorites } = useAppSelector((state) => state.content);
  
  const [searchValue, setSearchValue] = React.useState(searchQuery);
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  React.useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchValue));
  }, [debouncedSearchValue, dispatch]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    document.documentElement.classList.toggle('dark');
  };

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ContentHub
            </h1>
          </motion.div>

          <motion.div
            className="flex-1 max-w-2xl mx-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search across news, books, and posts..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={onTrendingClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp className="h-5 w-5" />
            </motion.button>

            <motion.button
              onClick={onFavoritesClick}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {favorites.length}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              onClick={handleThemeToggle}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>

            <motion.button
              onClick={onSettingsClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};