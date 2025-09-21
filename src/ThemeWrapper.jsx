import { createTheme, useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react';
import ThemeContext from './ThemeContext';

// provides ThemeConfig context to child components to read and set theme.
export default function ThemeWrapper({ children }) {

  const [mode, setMode] = useState(useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light');

  const themeConfig = {
    mode,
    toggleMode: ()=>{
      setMode(prev=> prev === 'light' ? 'dark' : 'light');
    }
  };

  const theme = createTheme({
    palette: {
      mode,
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