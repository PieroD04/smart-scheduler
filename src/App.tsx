import { createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import Home from './pages/Home'

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'Inter, sans-serif'
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Home/>
    </ThemeProvider>
  )
}

export default App
