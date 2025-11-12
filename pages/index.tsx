import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useOrganizationPRsQuery } from "../src/queries/OrganizationPRs";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { IIssueOrderField, IOrderDirection, IPullRequestReviewDecision, IPullRequestState } from "../src/types/graphqlTypes";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

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
      <List>
        {prs?.map((pr) =>
          pr ? (
            <ListItem key={pr.id}>
              <ListItemButton href={pr.url} target="_blank" rel="noopener noreferrer">
                <ListItemAvatar>
                  <Avatar src={pr.author?.__typename === "User" ? pr.author.avatarUrl : undefined} />
                </ListItemAvatar>
                <ListItemText primary={pr.title} secondary={pr.author?.__typename === "User" ? pr.author.login : undefined} />
                <Chip label={pr.reviewDecision} color={pr.reviewDecision === IPullRequestReviewDecision.APPROVED ? "success" : "warning"} />
              </ListItemButton>
            </ListItem>
          ) : null
        )}
      </List>
    </Container>
  );
}
