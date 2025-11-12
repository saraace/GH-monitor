import { Lato, Playfair_Display } from "next/font/google";
import { createTheme, Theme } from "@mui/material/styles";

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

// Centralized color palette - Original earthy tones
const lightColors = {
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

// Centralized color palette - Dark theme optimized for eye comfort
const darkColors = {
  background: {
    default: "#1a1d23", // Soft dark blue-gray - easier than pure black
    paper: "#222831" // Slightly lighter dark - creates subtle depth
  },
  primary: {
    main: "#a8c4e0", // Soft sky blue - calming and easy to read
    light: "#c5d9ed",
    dark: "#7a9abb",
    lighter: "#2d3847", // Dark blue wash for chip backgrounds
    contrastText: "#0d0f12"
  },
  secondary: {
    main: "#c5a8d4", // Soft lavender - gentle on eyes
    light: "#dac5e5",
    dark: "#9a7ea8",
    lighter: "#32293d", // Dark purple wash for chip backgrounds
    contrastText: "#0d0f12"
  },
  error: {
    main: "#e89ba3", // Muted coral pink - softer than bright red
    light: "#f1b9bf",
    dark: "#c5747f",
    lighter: "#3d2a2d" // Dark rose wash for chip backgrounds
  },
  warning: {
    main: "#f0c98e", // Warm sandy amber - not too bright
    light: "#f5dcad",
    dark: "#c9a568",
    lighter: "#3d362a" // Dark amber wash for chip backgrounds
  },
  info: {
    main: "#9db6c9", // Muted slate blue - calm info color
    light: "#becfdc",
    dark: "#7592a3",
    lighter: "#2a3440" // Dark slate wash for chip backgrounds
  },
  success: {
    main: "#a8d4a8", // Soft mint green - restful and natural
    light: "#c4e3c4",
    dark: "#7fac7f",
    lighter: "#2a3d2e" // Dark green wash for chip backgrounds
  },
  text: {
    primary: "#e4e6eb", // Soft white - reduces glare
    secondary: "#a8adb8" // Muted gray - perfect for secondary text
  }
};

// Shared typography configuration
const typography = {
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
};

// Function to create theme-specific components
const createComponents = (colors: any) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none" as const,
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
        background: "transparent",
        margin: 0,
        border: `1px solid ${colors.primary.main}`,
        borderRadius: 24, // Full rounded bubble
        "&:not(:first-of-type)": {
          borderLeft: `1px solid ${colors.primary.main}`,
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
        textTransform: "none" as const,
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
});

// Create light theme with original earthy tones
export const lightTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    background: lightColors.background,
    primary: lightColors.primary,
    secondary: lightColors.secondary,
    error: lightColors.error,
    warning: lightColors.warning,
    info: lightColors.info,
    success: lightColors.success,
    text: lightColors.text
  },
  typography,
  components: createComponents(lightColors)
});

// Create dark theme optimized for eye comfort
export const darkTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    background: darkColors.background,
    primary: darkColors.primary,
    secondary: darkColors.secondary,
    error: darkColors.error,
    warning: darkColors.warning,
    info: darkColors.info,
    success: darkColors.success,
    text: darkColors.text
  },
  typography,
  components: createComponents(darkColors)
});

// Default export is light theme for backwards compatibility
export default lightTheme;
