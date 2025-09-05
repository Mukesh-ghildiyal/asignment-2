'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Grid, List, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateEnabledSources, updateLayout, updateItemsPerPage } from '@/store/slices/preferencesSlice';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);

  const handleSourceToggle = (source: keyof typeof preferences.enabledSources) => {
    dispatch(updateEnabledSources({ [source]: !preferences.enabledSources[source] }));
  };

  const handleLayoutChange = (layout: 'grid' | 'list') => {
    dispatch(updateLayout(layout));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    dispatch(updateItemsPerPage(itemsPerPage));
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
                  <Settings className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
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

              <div className="space-y-8">
                {/* Content Sources */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Sources</h3>
                  <div className="space-y-3">
                    {Object.entries(preferences.enabledSources).map(([source, enabled]) => (
                      <motion.div
                        key={source}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {source}
                        </span>
                        <motion.button
                          onClick={() => handleSourceToggle(source as keyof typeof preferences.enabledSources)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                            enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                            layout
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Layout Options */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layout</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={() => handleLayoutChange('grid')}
                      className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                        preferences.layout === 'grid'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Grid className="h-5 w-5 mr-2" />
                      Grid
                    </motion.button>
                    <motion.button
                      onClick={() => handleLayoutChange('list')}
                      className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                        preferences.layout === 'list'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <List className="h-5 w-5 mr-2" />
                      List
                    </motion.button>
                  </div>
                </div>

                {/* Items Per Page */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Items Per Page</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 20, 30].map((count) => (
                      <motion.button
                        key={count}
                        onClick={() => handleItemsPerPageChange(count)}
                        className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                          preferences.itemsPerPage === count
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {count}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};