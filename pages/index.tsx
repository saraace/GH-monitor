import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useOrganizationPRsQuery } from "../src/queries/OrganizationPRs";
import { IIssueOrderField, IOrderDirection, IPullRequestState } from "../src/types/graphqlTypes";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import { PullRequestListItem } from "../src/components/PullRequestListItem/PullRequestListItem";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

const repos = ["wilson", "broker-platform-svc", "transfix-libraries"] as const;

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<string>("wilson");
  const { data, loading } = useOrganizationPRsQuery({
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
        {!loading && prs && prs.length > 0 && (
          <Paper elevation={1}>
            <List>{prs?.map((pr) => (pr ? <PullRequestListItem key={pr.id} prId={pr.id} /> : null))}</List>
          </Paper>
        )}
        {!loading && prs && prs.length === 0 && (
          <Typography variant="body1" align="center">
            No pull requests found
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
