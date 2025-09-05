'use client';

import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '@/store/api/contentApi';
import { NewsCard } from '../ContentCard/NewsCard';
import { BookCard } from '../ContentCard/BookCard';
import { SocialCard } from '../ContentCard/SocialCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateContentOrder } from '@/store/slices/contentSlice';

interface ContentGridProps {
  items: ContentItem[];
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ items, onLoadMore, hasMore, loading }) => {
  const dispatch = useAppDispatch();
  const { layout } = useAppSelector((state) => state.preferences);
  const { contentOrder } = useAppSelector((state) => state.content);

  // Sort items based on contentOrder if it exists
  const sortedItems = React.useMemo(() => {
    if (contentOrder.length === 0) return items;
    
    const orderedItems: ContentItem[] = [];
    const unorderedItems: ContentItem[] = [];

    items.forEach(item => {
      const id = getItemId(item);
      const orderIndex = contentOrder.indexOf(id);
      if (orderIndex !== -1) {
        orderedItems[orderIndex] = item;
      } else {
        unorderedItems.push(item);
      }
    });

    return [...orderedItems.filter(Boolean), ...unorderedItems];
  }, [items, contentOrder]);

  const getItemId = (item: ContentItem): string => {
    switch (item.type) {
      case 'news':
        return item.id;
      case 'book':
        return item.key;
      case 'social':
        return item.id.toString();
      default:
        return '';
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = [...sortedItems];
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    const newContentOrder = newOrder.map(getItemId);
    dispatch(updateContentOrder(newContentOrder));
  };

  const renderContentCard = (item: ContentItem, isDragging = false) => {
    switch (item.type) {
      case 'news':
        return <NewsCard article={item} isDragging={isDragging} />;
      case 'book':
        return <BookCard book={item} isDragging={isDragging} />;
      case 'social':
        return <SocialCard post={item} isDragging={isDragging} />;
      default:
        return null;
    }
  };

  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'flex flex-col space-y-6';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-grid" direction={layout === 'grid' ? 'horizontal' : 'vertical'}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={gridClasses}
            >
              <AnimatePresence>
                {sortedItems.map((item, index) => {
                  const itemId = getItemId(item);
                  return (
                    <Draggable key={itemId} draggableId={itemId} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative"
                        >
                          {renderContentCard(item, snapshot.isDragging)}
                          {snapshot.isDragging && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Moving...
                            </div>
                          )}
                        </motion.div>
                      )}
                    </Draggable>
                  );
                })}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {hasMore && (
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={onLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Loading...' : 'Load More Content'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};