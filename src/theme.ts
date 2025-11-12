import { Lato, Playfair_Display } from "next/font/google";
import { createTheme } from "@mui/material/styles";

export const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
});

export const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
});

// Centralized color palette - Punchy earthy tones
const colors = {
  background: {
    default: "#f5f0e8", // Warm cream with slight yellow
    paper: "#fdfbf7" // Bright cream
  },
  primary: {
    main: "#996b4d", // Rich terracotta brown
    light: "#c4936d",
    dark: "#704d35",
    lighter: "#f2e8de", // Light terracotta wash (for chip backgrounds)
    contrastText: "#ffffff"
  },
  secondary: {
    main: "#9b7a95", // Dusty mauve purple
    light: "#bda1b7",
    dark: "#765c71",
    lighter: "#f3edf2", // Light mauve wash (for chip backgrounds)
    contrastText: "#ffffff"
  },
  error: {
    main: "#d97b89", // Vibrant dusty rose
    light: "#e8a2ad",
    dark: "#b85c68",
    lighter: "#fceef0" // Light rose wash (for chip backgrounds)
  },
  warning: {
    main: "#d9935a", // Rich golden amber
    light: "#e6b482",
    dark: "#b5743a",
    lighter: "#fdf5ed" // Light amber wash (for chip backgrounds)
  },
  info: {
    main: "#5b8a8f", // Rich dusty teal
    light: "#85adb1",
    dark: "#426569",
    lighter: "#eef5f5" // Light teal wash (for chip backgrounds)
  },
  success: {
    main: "#87b689", // Vibrant moss green
    light: "#aacbab",
    dark: "#679268",
    lighter: "#f0f7f0" // Light moss wash (for chip backgrounds)
  },
  text: {
    primary: "#2d2520", // Deep espresso brown
    secondary: "#5a4d43" // Medium cocoa brown
  }
};

// Create a theme instance with soft earthy tones
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    background: colors.background,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    success: colors.success,
    text: colors.text
  },
  typography: {
    fontFamily: lato.style.fontFamily,
    h1: {
      fontFamily: playfairDisplay.style.fontFamily,
      fontWeight: 700
    },
    h2: {
      fontFamily: playfairDisplay.style.fontFamily,
      fontWeight: 700
    },
    h3: {
      fontFamily: playfairDisplay.style.fontFamily,
      fontWeight: 700
    },
    h4: {
      fontFamily: playfairDisplay.style.fontFamily,
      fontWeight: 700
    },
    h5: {
      fontFamily: playfairDisplay.style.fontFamily,
      fontWeight: 700
    },
    h6: {
      fontFamily: playfairDisplay.style.fontFamily,
      fontWeight: 700
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        },
        colorPrimary: {
          backgroundColor: colors.primary.lighter,
          color: colors.primary.dark,
          border: `2px solid ${colors.primary.main}`
        },
        colorSecondary: {
          backgroundColor: colors.secondary.lighter,
          color: colors.secondary.dark,
          border: `2px solid ${colors.secondary.main}`
        },
        colorError: {
          backgroundColor: colors.error.lighter,
          color: colors.error.dark,
          border: `2px solid ${colors.error.main}`
        },
        colorWarning: {
          backgroundColor: colors.warning.lighter,
          color: colors.warning.dark,
          border: `2px solid ${colors.warning.main}`
        },
        colorInfo: {
          backgroundColor: colors.info.lighter,
          color: colors.info.dark,
          border: `2px solid ${colors.info.main}`
        },
        colorSuccess: {
          backgroundColor: colors.success.lighter,
          color: colors.success.dark,
          border: `2px solid ${colors.success.main}`
        }
      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 12, // Space between buttons
          backgroundColor: "transparent"
        },
        grouped: {
          margin: 0,
          border: `2px solid ${colors.primary.main}`,
          borderRadius: 24, // Full rounded bubble
          "&:not(:first-of-type)": {
            borderLeft: `2px solid ${colors.primary.main}`,
            marginLeft: 0,
            borderRadius: 24
          },
          "&:not(:last-of-type)": {
            borderRadius: 24
          }
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 24,
          padding: "8px 20px",
          backgroundColor: colors.background.paper,
          color: colors.primary.dark,
          border: `2px solid ${colors.primary.main}`,
          "&:hover": {
            backgroundColor: colors.primary.lighter
          },
          "&.Mui-selected": {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
            "&:hover": {
              backgroundColor: colors.primary.dark
            }
          }
        }
      }
    }
  }
});

export default theme;
