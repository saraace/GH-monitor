import { useFragment } from "@apollo/client/react";
import { Avatar, Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import { memo, useMemo, useState } from "react";
import { IPrFragment, PrFragmentDoc } from "../../queries/PRFragment";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { PullRequestStatusChip } from "./PullRequestStatusChip";
import { PullRequestViewerReviewStatus } from "./PullRequestViewerReviewStatus";
import { PullRequestCodeOwnerRequestIndicator } from "./PullRequestCodeOwnerRequestIndicator";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "../Icon";
import { faCheck, faCircleNotch, faTimes } from "@awesome.me/kit-2cb31446e2/icons/classic/solid";
import { faRobot } from "@awesome.me/kit-2cb31446e2/icons/duotone/regular";
import { faEyeSlash, faEye } from "@awesome.me/kit-2cb31446e2/icons/classic/regular";
import { IStatusState } from "../../types/graphqlTypes";
import { IPrReviewFragment } from "../../queries/PRReviewFragment";

export interface IPullRequestListItemProps {
  /**
   * @default 'PullRequestListItem'
   */
  dataTest?: string;
  /**
   * The ID of the Pull Request
   */
  prId: string;
  /**
   * Whether this PR is hidden
   */
  isHidden?: boolean;
  /**
   * Callback to hide this PR
   */
  onHide?: (prId: string) => void;
  /**
   * Callback to unhide this PR
   */
  onUnhide?: (prId: string) => void;
}

export const PullRequestListItem = memo<IPullRequestListItemProps>(
  ({ dataTest = "PullRequestListItem", prId, isHidden = false, onHide, onUnhide }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { data: pr } = useFragment<IPrFragment>({
      fragment: PrFragmentDoc,
      fragmentName: "PR",
      from: {
        id: prId,
        __typename: "PullRequest"
      }
    });
    const { title, author, reviewDecision, url, isDraft, createdAt, statusCheckRollup, number, viewerLatestReview, lastEditedAt, reviewRequests } =
      pr || {};
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
      let text = null;
      if (author.__typename === "User") {
        text = `${number ? `#${number} ` : ""} opened ${formatDistanceToNow(createdAt, { addSuffix: true })} by ${author.login}`;
      }
      if (author.__typename === "Bot") {
        text = `${number ? `#${number} ` : ""} opened ${formatDistanceToNow(createdAt)} ago by a bot`;
      }
      if (lastEditedAt) {
        text += ` · updated ${formatDistanceToNow(lastEditedAt, { addSuffix: true })}`;
      }
      return text;
    }, [author, createdAt]);

    const handleHideClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isHidden && onUnhide) {
        onUnhide(prId);
      } else if (!isHidden && onHide) {
        onHide(prId);
      }
    };

    return (
      <ListItem
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          opacity: isHidden ? 0.6 : 1,
          transition: "opacity 0.2s"
        }}
      >
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
              <Box display="flex" alignItems="center" gap={1} flexWrap={"wrap"}>
                <Typography variant="body1" component="span">
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
                {checksState === IStatusState.SUCCESS && <Icon icon={faCheck} color="success" size="small" />}
                {checksState === IStatusState.FAILURE && <Icon icon={faTimes} color="error" size="small" />}
                {checksState === IStatusState.PENDING && <Icon icon={faCircleNotch} color="warning" size="small" spin />}
              </Box>
            }
            secondary={secondaryText}
          />
          <Stack alignItems="flex-end" gap={0.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <PullRequestStatusChip reviewDecision={reviewDecision} isDraft={isDraft} />
              <PullRequestCodeOwnerRequestIndicator reviewRequests={reviewRequests} />
            </Box>
            <PullRequestViewerReviewStatus viewerReview={viewerLatestReview as IPrReviewFragment} />
          </Stack>
        </ListItemButton>
        {(isHovered || isHidden) && (onHide || onUnhide) && (
          <Tooltip title={isHidden ? "Unhide PR" : "Hide PR"}>
            <IconButton onClick={handleHideClick} size="small" sx={{ ml: 1 }} color={isHidden ? "primary" : "default"}>
              <Icon icon={isHidden ? faEye : faEyeSlash} size={20} />
            </IconButton>
          </Tooltip>
        )}
      </ListItem>
    );
  }
);
