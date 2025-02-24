import { createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import Home from './pages/Home'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'Inter, sans-serif'
    }
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Home/>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
