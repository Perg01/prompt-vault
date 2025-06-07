// src/components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Use React's ComponentProps utility type to get the props from the provider
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default ThemeProvider;
