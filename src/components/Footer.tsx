import { Github } from 'lucide-react';

import { APP_VERSION } from '../version';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className='bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          {/* Copyright Info */}
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            <p>
              © {CURRENT_YEAR} UniFi Config Decoder. Licensed under{' '}
              <a
                href='https://www.gnu.org/licenses/gpl-3.0.html'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                GPL v3
              </a>
            </p>
          </div>

          {/* Version Info */}
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
              v{APP_VERSION}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-xs text-gray-500 dark:text-gray-500 text-center'>
            This tool helps decode and analyze UniFi configuration files.{' '}
            <a
              href='https://github.com/markush97/Unifi-Config-Decoder'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline'
            >
              <Github className='h-3 w-3' />
              <span>View on GitHub</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
