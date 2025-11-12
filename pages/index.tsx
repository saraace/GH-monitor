import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useOrganizationPRsQuery } from "../src/queries/OrganizationPRs";
import { IIssueOrderField, IOrderDirection, IPullRequestState } from "../src/types/graphqlTypes";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import { PullRequestListItem } from "../src/components/PullRequestListItem/PullRequestListItem";
import { ToggleButton, ToggleButtonGroup, Switch, FormControlLabel, Divider, Card } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useHiddenPRs } from "../src/hooks/useHiddenPRs";
import { Icon } from "../src/components/Icon";
import { faCodePullRequest } from "@awesome.me/kit-2cb31446e2/icons/classic/regular";
import { UserGreeting } from "../src/components/UserGreeting";
import { ThemeToggle } from "../src/components/ThemeToggle";
import { useThemeToggle } from "../src/context";

const repos = ["rogers", "wilson", "broker-platform-svc", "transfix-libraries"] as const;

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<string>("wilson");
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const { hiddenPRs, hidePR, unhidePR } = useHiddenPRs();
  const { themeMode } = useThemeToggle();

  const { data, loading } = useOrganizationPRsQuery({
    pollInterval: 60000,
    variables: {
      orgName: "transfixio",
      repoName: selectedRepo,
      first: 100,
      orderBy: {
        field: IIssueOrderField.CREATED_AT,
        direction: IOrderDirection.DESC
      },
      pullRequestStates: [IPullRequestState.OPEN]
    }
  });
  const { repository } = data || {};
  const { pullRequests } = repository || {};
  const { nodes: prs } = pullRequests || {};

  // Track when we've loaded data at least once
  useEffect(() => {
    if (data && !loading) {
      setHasLoadedOnce(true);
    }
  }, [data, loading]);

  // Reset hasLoadedOnce when changing repos
  useEffect(() => {
    setHasLoadedOnce(false);
  }, [selectedRepo]);

  // Filter PRs based on hidden state
  const filteredPRs = useMemo(() => {
    if (!prs) return [];
    if (showHidden) return prs;
    return prs.filter((pr) => pr && !hiddenPRs.has(pr.id));
  }, [prs, hiddenPRs, showHidden]);

  const isInitialLoading = loading && !hasLoadedOnce;
  const isPolling = loading && hasLoadedOnce;
  return (
    <Container>
      <Stack gap={4}>
        <Box position="relative">
          <UserGreeting />
          <Box position="absolute" top={0} right={0}>
            <ThemeToggle />
          </Box>
        </Box>
        <Typography variant="h1" align="center" fontWeight={"regular"} fontStyle={"italic"}>
          Pull Requests
        </Typography>
        <Box display="flex" justifyContent="center">
          <ToggleButtonGroup value={selectedRepo} onChange={(event, value) => setSelectedRepo(value)} exclusive>
            {repos.map((repo) => (
              <ToggleButton key={repo} value={repo}>
                {repo}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        {isInitialLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        )}
        {!isInitialLoading && (filteredPRs.length > 0 || (prs && prs.length > 0)) && (
          <Card sx={{ position: "relative", overflow: "visible" }}>
            {isPolling && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  zIndex: 2,
                  background: "linear-gradient(90deg, #87b689 0%, #5b8a8f 20%, #9b7a95 40%, #996b4d 60%, #d9935a 80%, #d97b89 100%)",
                  backgroundSize: "200% 100%",
                  animation: "rainbow-slide 2s ease-in-out infinite",
                  "@keyframes rainbow-slide": {
                    "0%": {
                      backgroundPosition: "0% 0%"
                    },
                    "50%": {
                      backgroundPosition: "100% 0%"
                    },
                    "100%": {
                      backgroundPosition: "0% 0%"
                    }
                  }
                }}
              />
            )}
            {isPolling && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(1px)",
                  zIndex: 1,
                  pointerEvents: "none"
                }}
              />
            )}
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Icon icon={faCodePullRequest} size={16} color="success" />
                <Typography variant="body2" color="text.secondary">
                  {filteredPRs.length} Open Pull Requests
                </Typography>
              </Box>
              {hiddenPRs.size > 0 && (
                <FormControlLabel
                  control={<Switch checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} size="small" />}
                  label="Show hidden PRs"
                />
              )}
            </Box>
            <Divider />
            {filteredPRs.length > 0 ? (
              <List>
                {filteredPRs.map((pr) =>
                  pr ? <PullRequestListItem key={pr.id} prId={pr.id} isHidden={hiddenPRs.has(pr.id)} onHide={hidePR} onUnhide={unhidePR} /> : null
                )}
              </List>
            ) : (
              <Box py={4}>
                <Typography variant="body1" align="center">
                  All PRs are hidden. Toggle "Show hidden PRs" to see them.
                </Typography>
              </Box>
            )}
          </Card>
        )}
        {!isInitialLoading && prs && prs.length === 0 && (
          <Card>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} gap={2}>
              <Typography variant="h1" fontSize={64}>
                {themeMode === "dark" ? "👽" : "☕"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No pull requests found
              </Typography>
            </Box>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
