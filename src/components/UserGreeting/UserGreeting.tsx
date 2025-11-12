import { memo, useMemo } from "react";
import { Typography } from "@mui/material";
import { useViewer } from "../../context";

export interface IUserGreetingProps {
  /**
   * @default 'UserGreeting'
   */
  dataTest?: string;
}

const getGreetingWithEmoji = (): { greeting: string; emoji: string } => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { greeting: "Good Morning", emoji: "☀️" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "Good Afternoon", emoji: "🌤️" };
  } else if (hour >= 17 && hour < 20) {
    return { greeting: "Good Evening", emoji: "🌆" };
  } else {
    return { greeting: "Good Night", emoji: "🌙" };
  }
};

export const UserGreeting = memo<IUserGreetingProps>(({ dataTest = "UserGreeting" }) => {
  const { viewer, loading } = useViewer();
  const { greeting, emoji } = useMemo(() => getGreetingWithEmoji(), []);

  if (loading || !viewer) {
    return null;
  }

  return (
    <Typography variant="body1" color="text.secondary" align="center" data-test={dataTest}>
      {emoji} {greeting}, @{viewer.login}
    </Typography>
  );
});
