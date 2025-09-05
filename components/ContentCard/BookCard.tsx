'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Book as BookIcon, Heart, Calendar, User } from 'lucide-react';
import { Book } from '@/store/api/contentApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/contentSlice';

interface BookCardProps {
  book: Book;
  isDragging?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, isDragging = false }) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.content);
  const isFavorite = favorites.includes(book.key);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(book.key));
  };

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
        isDragging ? 'rotate-3 scale-105' : ''
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookIcon className="w-16 h-16 text-purple-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            <BookIcon className="w-3 h-3 mr-1" />
            Book
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

        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
          {book.title}
        </h3>

        <div className="space-y-2 mb-4">
          {book.author_name && book.author_name.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <User className="w-4 h-4 mr-1" />
              {book.author_name.slice(0, 2).join(', ')}
              {book.author_name.length > 2 && ` +${book.author_name.length - 2} more`}
            </div>
          )}
          
          {book.first_publish_year && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {book.first_publish_year}
            </div>
          )}
        </div>

        {book.subject && book.subject.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.subject.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md"
              >
                {subject}
              </span>
            ))}
            {book.subject.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                +{book.subject.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};