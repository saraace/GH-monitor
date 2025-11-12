import { useFragment } from "@apollo/client/react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { memo, useMemo } from "react";
import { IPrFragment, PrFragmentDoc } from "../../queries/PRFragment";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { PullRequestStatusChip } from "./PullRequestStatusChip";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "../Icon";
import { faCheck, faTimes } from "@awesome.me/kit-2cb31446e2/icons/classic/solid";
import { faRobot } from "@awesome.me/kit-2cb31446e2/icons/duotone/regular";
import { IStatusState } from "../../types/graphqlTypes";

export interface IPullRequestListItemProps {
  /**
   * @default 'PullRequestListItem'
   */
  dataTest?: string;
  /**
   * The ID of the Pull Request
   */
  prId: string;
}

export const PullRequestListItem = memo<IPullRequestListItemProps>(({ dataTest = "PullRequestListItem", prId }) => {
  const { data: pr } = useFragment<IPrFragment>({
    fragment: PrFragmentDoc,
    from: {
      id: prId,
      __typename: "PullRequest"
    }
  });
  const { title, author, reviewDecision, url, isDraft, createdAt, statusCheckRollup, number } = pr || {};
  const { state: checksState } = statusCheckRollup || {};

  const parsedTitle = useMemo(() => {
    if (!title) return { ticketId: null, rest: "" };

    // Match ticket ID pattern at the start: alphanumeric-numbers (e.g., SQD1-2997, JIRA-123)
    const match = title.match(/^([A-Z][A-Z0-9]*-\d+)(\s*-?\s*)(.*)$/);

    if (match) {
      return {
        ticketId: match[1],
        separator: match[2],
        rest: match[3]
      };
    }

    return { ticketId: null, rest: title };
  }, [title]);

  const secondaryText = useMemo(() => {
    if (!author) return null;
    if (author.__typename === "User") {
      return `${number ? `#${number} ` : ""} opened ${formatDistanceToNow(createdAt)} ago by ${author.login}`;
    }
    return null;
  }, [author, createdAt]);

  return (
    <ListItem>
      <ListItemButton href={url} target="_blank" rel="noopener noreferrer">
        <ListItemAvatar>
          {author && author.__typename === "User" && <Avatar src={author.avatarUrl} />}
          {author && author.__typename === "Bot" && (
            <Avatar>
              <Icon icon={faRobot} size={20} />
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">
                {parsedTitle.ticketId ? (
                  <>
                    <Typography fontWeight={"bold"} component="span">
                      {parsedTitle.ticketId}
                    </Typography>
                    {parsedTitle.separator}
                    {parsedTitle.rest}
                  </>
                ) : (
                  title
                )}
              </Typography>
              <Icon
                icon={checksState === IStatusState.SUCCESS ? faCheck : faTimes}
                color={checksState === IStatusState.SUCCESS ? "success" : "error"}
                size="small"
              />
            </Box>
          }
          secondary={secondaryText}
        />
        <PullRequestStatusChip reviewDecision={reviewDecision} isDraft={isDraft} />
      </ListItemButton>
    </ListItem>
  );
});
