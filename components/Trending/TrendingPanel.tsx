'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Eye, Heart, MessageSquare } from 'lucide-react';

interface TrendingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingData = [
  { id: 1, title: 'AI Revolution in Healthcare', views: '15.2k', likes: '2.1k', type: 'News', trend: '+12%' },
  { id: 2, title: 'Climate Change Solutions', views: '8.7k', likes: '1.3k', type: 'Article', trend: '+8%' },
  { id: 3, title: 'Space Exploration Updates', views: '12.1k', likes: '1.8k', type: 'Science', trend: '+15%' },
  { id: 4, title: 'Tech Startups 2025', views: '6.5k', likes: '892', type: 'Business', trend: '+5%' },
  { id: 5, title: 'Sustainable Living Guide', views: '9.3k', likes: '1.5k', type: 'Lifestyle', trend: '+10%' },
];

export const TrendingPanel: React.FC<TrendingPanelProps> = ({ isOpen, onClose }) => {
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
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
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

              <div className="space-y-4">
                {trendingData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-orange-500">#{index + 1}</span>
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.trend}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {item.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {item.likes}
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Trending Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Based on user engagement in the last 24 hours
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">85%</p>
                    <p className="text-xs text-gray-500">Engagement Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">42k</p>
                    <p className="text-xs text-gray-500">Total Views</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};