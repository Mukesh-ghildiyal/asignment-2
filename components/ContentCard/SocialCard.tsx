'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, User, Hash } from 'lucide-react';
import { SocialPost } from '@/store/api/contentApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/contentSlice';

interface SocialCardProps {
  post: SocialPost;
  isDragging?: boolean;
}

export const SocialCard: React.FC<SocialCardProps> = ({ post, isDragging = false }) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.content);
  const isFavorite = favorites.includes(post.id.toString());

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(post.id.toString()));
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
        isDragging ? 'rotate-3 scale-105' : ''
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">User {post.userId}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <MessageSquare className="w-3 h-3 mr-1" />
                Social
              </span>
            </div>
          </div>
          <motion.button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full transition-colors duration-200 ${
              isFavorite
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {post.body}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Hash className="w-4 h-4 mr-1" />
              #{post.id}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Expand
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};