import { Context, createContext, useEffect, useState } from 'react';

import { STORAGE_KEY, THEME } from '@/shared/config/constants';
import { Switch } from '@/shared/ui/shadcn/switch';

type Theme = (typeof THEME)[keyof typeof THEME];
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
type ThemeProviderState = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

export const ThemeProviderContext: Context<ThemeProviderState | undefined> =
  createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = THEME.DARK,
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const initialTheme = () => {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme && Object.values(THEME).includes(storedTheme as Theme)) {
      return storedTheme as Theme;
    }
    return defaultTheme;
  };
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(THEME.LIGHT, THEME.DARK);
    root.classList.add(theme);

    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      <Switch
        className="fixed right-4 top-4"
        checked={theme === THEME.DARK}
        onCheckedChange={() =>
          setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT))
        }
        data-cy="theme-switch"
      />
      {children}
    </ThemeProviderContext.Provider>
  );
}
