import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useThemeToggle } from "../../context";
import { Icon } from "../Icon";
import { faSun, faMoon } from "@awesome.me/kit-2cb31446e2/icons/classic/regular";

export const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useThemeToggle();

  return (
    <Tooltip title={themeMode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
      <IconButton onClick={toggleTheme} color="primary" sx={{ ml: 1 }}>
        <Icon icon={themeMode === "light" ? faMoon : faSun} size={20} />
      </IconButton>
    </Tooltip>
  );
};
