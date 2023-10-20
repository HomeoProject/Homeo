import tinycolor from 'tinycolor2'
import { createTheme } from '@mui/material/styles'

const primaryColor: string = '#1CBE8E'
const warningColor: string = '#a51f1f'
const secondaryColor: string = '#d8ac79'

function lighten(color: string, amount: number) {
  const hsl = tinycolor(color).toHsl()
  hsl.l += amount
  return tinycolor(hsl).toHexString()
}

function darken(color: string, amount: number) {
  const hsl = tinycolor(color).toHsl()
  hsl.l -= amount
  return tinycolor(hsl).toHexString()
}

const palette = {
  primary: {
    main: primaryColor,
    light: lighten(primaryColor, 0.5),
    dark: darken(primaryColor, 0.2),
    contrastText: '#fff',
  },
  secondary: {
    main: secondaryColor,
    light: lighten(secondaryColor, 0.3),
    dark: darken(secondaryColor, 0.1),
    contrastText: '#fff',
  },
  warning: {
    main: warningColor,
    dark: darken(warningColor, 0.05),
    contrastText: '#fff',
  },
}

const theme = createTheme({
  palette,
})

export default theme
