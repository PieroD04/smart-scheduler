import { createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import Home from './pages/Home'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'


function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'Inter, sans-serif'
    },
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            '@media (max-width: 640px)': {
              margin: 0,
            },
            maxHeight: 'calc(100% - 128px)'
          }
        }
      }
    }
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
