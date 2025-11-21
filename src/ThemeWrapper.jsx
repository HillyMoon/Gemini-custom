import { createTheme, useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react';
import ThemeContext from './ThemeContext';

// provides ThemeConfig context to child components to read and set theme.
export default function ThemeWrapper({ children }) {

  const [darkMode, setMode] = useState(useMediaQuery('(prefers-color-scheme: dark)'));

  const themeConfig = {
    darkMode,
    toggleMode: ()=>{
      document.documentElement.style.setProperty('color-scheme', darkMode ? 'light' : 'dark');
      setMode(prev=> !prev);
    }
  };

  const theme = createTheme({
    palette: {
      mode: (darkMode ? 'dark' : 'light')
    },
  });

  return(
    <ThemeContext.Provider value={themeConfig}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}