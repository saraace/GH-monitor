import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useOrganizationPRsQuery } from "../src/queries/OrganizationPRs";
import { IIssueOrderField, IOrderDirection, IPullRequestState } from "../src/types/graphqlTypes";
import List from "@mui/material/List";
import { PullRequestListItem } from "../src/components/PullRequestListItem/PullRequestListItem";

export default function Home() {
  const { data } = useOrganizationPRsQuery({
    variables: {
      orgName: "transfixio",
      repoName: "wilson",
      first: 100,
      orderBy: {
        field: IIssueOrderField.CREATED_AT,
        direction: IOrderDirection.DESC
      },
      pullRequestStates: [IPullRequestState.OPEN]
    }
  });
  const { repository } = data || {};
  const { name: repoName, pullRequests } = repository || {};
  const { nodes: prs } = pullRequests || {};
  return (
    <Container>
      {repoName && <Typography variant="h4">{repoName}</Typography>}
      <List>{prs?.map((pr) => (pr ? <PullRequestListItem key={pr.id} prId={pr.id} /> : null))}</List>
    </Container>
  );
}
