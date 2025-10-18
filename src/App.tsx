import { useEffect } from 'react';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useThemeStore } from './states/theme.store';
import { UnifiDecoder } from './unifi/UnifiDecoder';

function App() {
  const { isDarkMode } = useThemeStore();

  // Apply dark mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col'>
      <Header />

      <main className='flex-1'>
        <UnifiDecoder />
      </main>

      <Footer />
    </div>
  );
}

export default App;
