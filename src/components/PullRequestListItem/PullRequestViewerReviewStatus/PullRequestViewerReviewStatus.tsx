import { memo, useMemo } from "react";
import { Maybe } from "../../../types/graphqlTypes";
import { Avatar, Box, Typography } from "@mui/material";
import { IPrReviewFragment } from "../../../queries/PRReviewFragment";
import { IPullRequestReviewState } from "../../../types/graphqlTypes";
import { formatDistanceToNow } from "date-fns";
import { IUser } from "../../../types/graphqlTypes";

export interface IPullRequestViewerReviewStatusProps {
  /**
   * @default 'PullRequestViewerReviewStatus'
   */
  dataTest?: string;
  viewerReview: Maybe<IPrReviewFragment>;
}

export const PullRequestViewerReviewStatus = memo<IPullRequestViewerReviewStatusProps>(
  ({ dataTest = "PullRequestViewerReviewStatus", viewerReview }) => {
    const { state, author, createdAt: reviewCreatedAt } = viewerReview || {};
    const { avatarUrl } = (author as IUser) || {};

    const reviewStatusLabel = useMemo(() => {
      if (!viewerReview) return null;

      const createdAt = formatDistanceToNow(reviewCreatedAt, { addSuffix: true });

      if (state === IPullRequestReviewState.APPROVED) {
        return `You approved ${createdAt}`;
      }
      if (state === IPullRequestReviewState.CHANGES_REQUESTED) {
        return `You requested changes ${createdAt}`;
      }
      if (state === IPullRequestReviewState.COMMENTED) {
        return `You commented ${createdAt}`;
      }
      if (state === IPullRequestReviewState.PENDING) {
        return `Your review is pending!`;
      }
      if (state === IPullRequestReviewState.DISMISSED) {
        return "Your review has been dismissed";
      }
    }, [viewerReview]);

    return (
      <div data-test={dataTest}>
        {!viewerReview ? (
          <Typography variant="caption" color="text.secondary" component="span">
            You have not reviewed
          </Typography>
        ) : (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Avatar src={avatarUrl} sx={{ width: 16, height: 16 }} />
            <Typography
              variant="caption"
              component="span"
              sx={{ textDecoration: state === IPullRequestReviewState.DISMISSED ? "line-through" : "none" }}
            >
              {reviewStatusLabel}
            </Typography>
          </Box>
        )}
      </div>
    );
  }
);
