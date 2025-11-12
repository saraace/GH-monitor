import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@mui/material/styles";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { SxProps, Theme } from "@mui/material";

export interface IIconProps {
  /**
   * The Font Awesome icon definition
   */
  icon: IconDefinition;
  /**
   * Material UI color from the theme palette
   * @default 'inherit'
   */
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"
    | "text.primary"
    | "text.secondary"
    | "text.disabled"
    | "action.active"
    | "action.disabled"
    | "inherit";
  /**
   * Size of the icon
   * Can use MUI sizing or Font Awesome size strings
   * @default 'medium'
   */
  size?: "small" | "medium" | "large" | "inherit" | number;
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  /**
   * Additional class name
   */
  className?: string;
  /**
   * @default 'Icon'
   */
  dataTest?: string;
}

export const Icon = ({ icon, color = "inherit", size = "medium", sx, className, dataTest = "Icon" }: IIconProps) => {
  const theme = useTheme();

  // Map MUI colors to actual color values from theme
  const getColor = (): string => {
    if (color === "inherit") return "inherit";

    // Handle nested color paths (e.g., "text.primary")
    if (color.includes(".")) {
      const [category, shade] = color.split(".") as [keyof Theme["palette"], string];
      const paletteCategory = theme.palette[category];
      if (paletteCategory && typeof paletteCategory === "object" && shade in paletteCategory) {
        return (paletteCategory as any)[shade];
      }
    }

    // Handle standard palette colors
    const paletteColor = theme.palette[color as keyof typeof theme.palette];
    if (paletteColor && typeof paletteColor === "object" && "main" in paletteColor) {
      return paletteColor.main;
    }

    return color;
  };

  // Map MUI size to font size
  const getFontSize = (): string | number => {
    if (typeof size === "number") return size;

    switch (size) {
      case "small":
        return "1rem"; // 16px
      case "medium":
        return "1.25rem"; // 20px
      case "large":
        return "1.75rem"; // 28px
      case "inherit":
        return "inherit";
      default:
        return "1.25rem";
    }
  };

  return (
    <FontAwesomeIcon
      icon={icon}
      data-test={dataTest}
      className={className}
      style={{
        color: getColor(),
        fontSize: getFontSize(),
        ...(sx && typeof sx === "object" && !Array.isArray(sx) ? (sx as any) : {})
      }}
    />
  );
};
