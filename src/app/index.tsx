import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProvider, ThemeProvider } from '@/app/providers';
import DashboardPage from '@/pages/DashboardPage';
import { STORAGE_KEY, THEME } from '@/shared/config/constants';
import { FullscreenImage as DashboardBackground } from '@/shared/ui/FullscreenImage';

import './styles/global.css';

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { startMSW } = await import('@/mocks/browser');
  return startMSW();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider defaultTheme={THEME.DARK} storageKey={STORAGE_KEY}>
        <AppProvider>
          <DashboardPage />
          <DashboardBackground
            src="/images/wood-cladding-painted-blue.jpg"
            srcSet="/images/wood-cladding-painted-blue.webp"
            alt="Blue painted wood cladding texture"
            fitMode="cover"
          />
        </AppProvider>
      </ThemeProvider>
    </StrictMode>,
  );
});
