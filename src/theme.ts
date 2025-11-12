import { Lato } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
});

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#556cd6"
    },
    secondary: {
      main: "#19857b"
    },
    error: {
      main: red.A400
    }
  },
  typography: {
    fontFamily: lato.style.fontFamily
  }
});

export default theme;
