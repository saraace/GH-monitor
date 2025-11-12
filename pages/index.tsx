import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useOrganizationPRsQuery } from "../src/queries/OrganizationPRs";
import { IIssueOrderField, IOrderDirection, IPullRequestState } from "../src/types/graphqlTypes";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import { PullRequestListItem } from "../src/components/PullRequestListItem/PullRequestListItem";
import { ToggleButton, ToggleButtonGroup, Switch, FormControlLabel, Divider, Card } from "@mui/material";
import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useHiddenPRs } from "../src/hooks/useHiddenPRs";
import { Icon } from "../src/components/Icon";
import { faCodePullRequest } from "@awesome.me/kit-2cb31446e2/icons/classic/regular";

const repos = ["wilson", "broker-platform-svc", "transfix-libraries"] as const;

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<string>("wilson");
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const { hiddenPRs, hidePR, unhidePR } = useHiddenPRs();

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

  // Filter PRs based on hidden state
  const filteredPRs = useMemo(() => {
    if (!prs) return [];
    if (showHidden) return prs;
    return prs.filter((pr) => pr && !hiddenPRs.has(pr.id));
  }, [prs, hiddenPRs, showHidden]);
  return (
    <Container>
      <Stack gap={4}>
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
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        )}
        {!loading && (filteredPRs.length > 0 || (prs && prs.length > 0)) && (
          <Card>
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
        {!loading && prs && prs.length === 0 && (
          <Card>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} gap={2}>
              <Typography variant="h1" fontSize={64}>
                ☕
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
