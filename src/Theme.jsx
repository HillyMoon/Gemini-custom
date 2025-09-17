import  { createTheme, useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material'

export default function Theme({ children }) {

  const mode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}