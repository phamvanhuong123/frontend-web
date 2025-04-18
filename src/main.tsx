import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme.ts';
createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App />
      </ThemeProvider>
      
    </BrowserRouter>
 
)
