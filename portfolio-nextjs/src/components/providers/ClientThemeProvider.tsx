'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}