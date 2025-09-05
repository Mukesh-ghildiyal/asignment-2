'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/contentSlice';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.content);

  const handleRemoveFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const clearAllFavorites = () => {
    favorites.forEach(id => dispatch(toggleFavorite(id)));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Favorites ({favorites.length})
                  </h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {favorites.length > 0 ? (
                <>
                  <motion.button
                    onClick={clearAllFavorites}
                    className="w-full mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="h-4 w-4 inline mr-2" />
                    Clear All Favorites
                  </motion.button>

                  <div className="space-y-3">
                    {favorites.map((favoriteId, index) => (
                      <motion.div
                        key={favoriteId}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {favoriteId}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Favorited item
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleRemoveFavorite(favoriteId)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Favorites Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start favoriting content by clicking the heart icon on any item.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};