'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Header } from '@/components/Layout/Header';
import { ContentGrid } from '@/components/ContentGrid/ContentGrid';
import { SettingsPanel } from '@/components/Settings/SettingsPanel';
import { FavoritesPanel } from '@/components/Favorites/FavoritesPanel';
import { TrendingPanel } from '@/components/Trending/TrendingPanel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetNewsQuery, useGetBooksQuery, useGetSocialPostsQuery, ContentItem } from '@/store/api/contentApi';
import { incrementPage, resetPage } from '@/store/slices/contentSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const { searchQuery, currentPage } = useAppSelector((state) => state.content);
  const { isDark } = useAppSelector((state) => state.theme);
  
  const [showSettings, setShowSettings] = React.useState(false);
  const [showFavorites, setShowFavorites] = React.useState(false);
  const [showTrending, setShowTrending] = React.useState(false);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  // Apply theme to document
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // API queries
  const newsQuery = useGetNewsQuery(
    { page: currentPage.news, query: searchQuery },
    { skip: !preferences.enabledSources.news }
  );
  
  const booksQuery = useGetBooksQuery(
    { page: currentPage.books, query: searchQuery },
    { skip: !preferences.enabledSources.books }
  );
  
  const socialQuery = useGetSocialPostsQuery(
    { page: currentPage.social, query: searchQuery },
    { skip: !preferences.enabledSources.social }
  );

  // Reset pages when search query changes
  React.useEffect(() => {
    dispatch(resetPage('news'));
    dispatch(resetPage('books'));
    dispatch(resetPage('social'));
  }, [searchQuery, dispatch]);

  // Load more when in view
  React.useEffect(() => {
    if (inView && !newsQuery.isFetching && !booksQuery.isFetching && !socialQuery.isFetching) {
      if (preferences.enabledSources.news) dispatch(incrementPage('news'));
      if (preferences.enabledSources.books) dispatch(incrementPage('books'));
      if (preferences.enabledSources.social) dispatch(incrementPage('social'));
    }
  }, [inView, dispatch, preferences.enabledSources, newsQuery.isFetching, booksQuery.isFetching, socialQuery.isFetching]);

  // Combine all content
  const allContent = React.useMemo(() => {
    const content: ContentItem[] = [];
    
    if (newsQuery.data?.response?.results) {
      content.push(...newsQuery.data.response.results);
    }
    
    if (booksQuery.data?.docs) {
      content.push(...booksQuery.data.docs);
    }
    
    if (socialQuery.data) {
      content.push(...socialQuery.data);
    }
    
    return content;
  }, [newsQuery.data, booksQuery.data, socialQuery.data]);

  const isLoading = newsQuery.isFetching || booksQuery.isFetching || socialQuery.isFetching;
  const hasMore = currentPage.news < 5 || currentPage.books < 5 || currentPage.social < 5; // Limit for demo

  const handleLoadMore = () => {
    if (preferences.enabledSources.news) dispatch(incrementPage('news'));
    if (preferences.enabledSources.books) dispatch(incrementPage('books'));
    if (preferences.enabledSources.social) dispatch(incrementPage('social'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        onFavoritesClick={() => setShowFavorites(true)}
        onTrendingClick={() => setShowTrending(true)}
      />
      
      <main className="py-8">
        {allContent.length === 0 && !isLoading ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No content found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or enabling more content sources in settings.
            </p>
            <motion.button
              onClick={() => setShowSettings(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open Settings
            </motion.button>
          </motion.div>
        ) : (
          <ContentGrid
            items={allContent}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={isLoading}
          />
        )}
        
        {/* Intersection observer target */}
        <div ref={loadMoreRef} className="h-10" />
      </main>

      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <FavoritesPanel isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
      <TrendingPanel isOpen={showTrending} onClose={() => setShowTrending(false)} />
    </div>
  );
}