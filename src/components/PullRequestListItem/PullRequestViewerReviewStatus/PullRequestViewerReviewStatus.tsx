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

const VIEWER = "saraace";

export const PullRequestViewerReviewStatus = memo<IPullRequestViewerReviewStatusProps>(
  ({ dataTest = "PullRequestViewerReviewStatus", viewerReview }) => {
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
              {`You ${viewerReview.state === IPullRequestReviewState.APPROVED ? "approved" : "requested changes"} ${formatDistanceToNow(
                viewerReview.createdAt,
                { addSuffix: true }
              )}`}
            </Typography>
          </Box>
        )}
      </div>
    );
  }
);
