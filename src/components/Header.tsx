import { Moon, Sun } from 'lucide-react';

import { useThemeStore } from '../states/theme.store';

export const Header = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <header className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo/Title */}
          <div className='flex items-center'>
            <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
              UniFi Config Decoder
            </h1>
          </div>

          {/* Navigation/Actions */}
          <div className='flex items-center space-x-4'>
            {/* Dark Mode Toggle Switch */}
            <div className='flex items-center space-x-2'>
              <Sun className='h-4 w-4 text-yellow-500' />
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role='switch'
                aria-checked={isDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <Moon className='h-4 w-4 text-blue-500' />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
