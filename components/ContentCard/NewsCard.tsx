'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Clock, Tag } from 'lucide-react';
import { NewsArticle } from '@/store/api/contentApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/contentSlice';

interface NewsCardProps {
  article: NewsArticle;
  isDragging?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, isDragging = false }) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.content);
  const isFavorite = favorites.includes(article.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(article.id));
  };

  const handleCardClick = () => {
    window.open(article.webUrl, '_blank');
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
        isDragging ? 'rotate-3 scale-105' : ''
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleCardClick}
    >
      {article.fields?.thumbnail && (
        <div className="relative overflow-hidden h-48">
          <img
            src={article.fields.thumbnail}
            alt={article.webTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Tag className="w-3 h-3 mr-1" />
            {article.sectionName}
          </span>
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

        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {article.fields?.headline || article.webTitle}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(article.webPublicationDate).toLocaleDateString()}
          </div>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ExternalLink className="w-4 h-4 mr-1" />
            Read more
          </div>
        </div>

        {article.fields?.bodyText && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {article.fields.bodyText.slice(0, 150)}...
          </p>
        )}
      </div>
    </motion.div>
  );
};