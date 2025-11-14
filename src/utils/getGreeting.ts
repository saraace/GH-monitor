export const getGreeting = (): { greeting: string; emoji: string } => {
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
