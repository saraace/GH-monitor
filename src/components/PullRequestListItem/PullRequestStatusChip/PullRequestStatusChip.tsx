import { memo, useMemo } from "react";
import { IPullRequestReviewDecision } from "../../../types/graphqlTypes";
import { Chip } from "@mui/material";
import { Maybe } from "../../../types/graphqlTypes";
export interface IPullRequestStatusChipProps {
  /**
   * @default 'PullRequestStatusChip'
   */
  dataTest?: string;
  reviewDecision: Maybe<IPullRequestReviewDecision>;
  isDraft: Maybe<boolean>;
}

export const PullRequestStatusChip = memo<IPullRequestStatusChipProps>(({ dataTest = "PullRequestStatusChip", reviewDecision, isDraft }) => {
  const label = useMemo(() => {
    if (isDraft) return "Draft";
    if (reviewDecision === IPullRequestReviewDecision.APPROVED) return "Approved";
    if (reviewDecision === IPullRequestReviewDecision.REVIEW_REQUIRED) return "Review required";
    if (reviewDecision === IPullRequestReviewDecision.CHANGES_REQUESTED) return "Changes requested";
    return null;
  }, [isDraft, reviewDecision]);

  const color = useMemo(() => {
    if (isDraft) return "secondary";
    if (reviewDecision === IPullRequestReviewDecision.APPROVED) return "success";
    if (reviewDecision === IPullRequestReviewDecision.REVIEW_REQUIRED) return "warning";
    if (reviewDecision === IPullRequestReviewDecision.CHANGES_REQUESTED) return "error";
    return "default";
  }, [isDraft, reviewDecision]);

  return label ? <Chip data-test={dataTest} label={label} color={color} /> : null;
});
