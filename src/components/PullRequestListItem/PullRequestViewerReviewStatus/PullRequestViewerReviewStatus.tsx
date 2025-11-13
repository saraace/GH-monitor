import { memo, useMemo } from "react";
import { Maybe } from "../../../types/graphqlTypes";
import { Avatar, Box, Typography } from "@mui/material";
import { IPrReviewFragment } from "../../../queries/PRReviewFragment";
import { IPullRequestReviewState } from "../../../types/graphqlTypes";
import { formatDistanceToNow } from "date-fns";

export interface IPullRequestViewerReviewStatusProps {
  /**
   * @default 'PullRequestViewerReviewStatus'
   */
  dataTest?: string;
  viewerReview: Maybe<IPrReviewFragment>;
}

export const PullRequestViewerReviewStatus = memo<IPullRequestViewerReviewStatusProps>(
  ({ dataTest = "PullRequestViewerReviewStatus", viewerReview }) => {
    const reviewStatusLabel = useMemo(() => {
      if (!viewerReview) return "You have not reviewed";

      const createdAt = formatDistanceToNow(viewerReview.createdAt, { addSuffix: true });

      if (viewerReview.author?.__typename === "User") {
        if (viewerReview.state === IPullRequestReviewState.APPROVED) {
          return `You approved ${createdAt}`;
        }
        if (viewerReview.state === IPullRequestReviewState.CHANGES_REQUESTED) {
          return `You requested changes ${createdAt}`;
        }
        if (viewerReview.state === IPullRequestReviewState.COMMENTED) {
          return `You commented ${createdAt}`;
        }
        if (viewerReview.state === IPullRequestReviewState.PENDING) {
          return `Your review is pending!`;
        }
      }
    }, [viewerReview]);

    return (
      <div data-test={dataTest}>
        {!viewerReview && (
          <Typography variant="caption" color="text.secondary" component="span">
            You have not reviewed
          </Typography>
        )}
        {viewerReview && viewerReview.author?.__typename === "User" && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Avatar src={viewerReview.author.avatarUrl} sx={{ width: 16, height: 16 }} />
            <Typography variant="caption" component="span">
              {reviewStatusLabel}
            </Typography>
          </Box>
        )}
      </div>
    );
  }
);
