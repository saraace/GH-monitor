import { AppBar, Avatar, Box, Button, Container, Link, Stack, Toolbar, Typography } from "@mui/material";
import { memo, PropsWithChildren, useMemo } from "react";
import { useViewer } from "../../context";
import { getGreeting } from "../../utils";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ThemeToggle } from "../../components/ThemeToggle";
import { APP_BAR_LINKS } from "../../constants";

export interface IAppLayoutProps extends PropsWithChildren {
  /**
   * @default 'AppLayout'
   */
  dataTest?: string;
  /**
   * If true, children won't be wrapped in a Container
   * @default false
   */
  fullWidth?: boolean;
}

export const AppLayout = memo<IAppLayoutProps>(({ dataTest = "AppLayout", children, fullWidth = false }) => {
  const router = useRouter();
  const { viewer } = useViewer();
  const { avatarUrl, login } = viewer || {};
  const { greeting, emoji } = useMemo(() => getGreeting(), []);

  return (
    <div data-test={dataTest}>
      <AppBar color="transparent" elevation={0}>
        <Toolbar>
          <Box flexGrow={1}>
            <Stack direction="row" gap={2}>
              {APP_BAR_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} component={NextLink} underline="none" sx={{ fontWeight: router.pathname === href ? 700 : 400 }}>
                  {label}
                </Link>
              ))}
            </Stack>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="body2" color="primary" fontWeight={700}>
                {emoji} {greeting}, @{login}
              </Typography>
              <Avatar src={avatarUrl} alt={login} />
              <ThemeToggle />
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 8, px: fullWidth ? 3 : 0 }}>
        {fullWidth ? children : <Container>{children}</Container>}
      </Box>
    </div>
  );
});
