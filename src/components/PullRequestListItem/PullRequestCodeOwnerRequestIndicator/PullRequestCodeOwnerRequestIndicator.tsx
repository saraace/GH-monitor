import { memo, useMemo } from "react";
import { Box, Tooltip } from "@mui/material";
import { Icon } from "../../Icon";
import { faStar } from "@awesome.me/kit-2cb31446e2/icons/classic/solid";
import { Maybe } from "../../../types/graphqlTypes";

export interface IPullRequestCodeOwnerRequestIndicatorProps {
  /**
   * @default 'PullRequestCodeOwnerRequestIndicator'
   */
  dataTest?: string;
  reviewRequests?: Maybe<{
    __typename?: string;
    nodes?: Maybe<
      Array<
        Maybe<{
          __typename?: string;
          id?: string;
          asCodeOwner?: boolean;
          requestedReviewer?: Maybe<{
            __typename?: string;
            id?: string;
            name?: string;
          }>;
        }>
      >
    >;
  }>;
}

export const PullRequestCodeOwnerRequestIndicator = memo<IPullRequestCodeOwnerRequestIndicatorProps>(
  ({ dataTest = "PullRequestCodeOwnerRequestIndicator", reviewRequests }) => {
    const codeOwnerTeams = useMemo(() => {
      if (!reviewRequests?.nodes) return null;

      const codeOwners = reviewRequests.nodes.filter((request) => request?.asCodeOwner && request.requestedReviewer?.__typename === "Team");

      if (codeOwners.length === 0) return null;

      return codeOwners
        .map((request) => {
          if (request?.requestedReviewer?.__typename === "Team") {
            return request.requestedReviewer.name;
          }
          return null;
        })
        .filter(Boolean) as string[];
    }, [reviewRequests]);

    if (!codeOwnerTeams || codeOwnerTeams.length === 0) return null;

    return (
      <Tooltip title={`Code owner approval required: ${codeOwnerTeams.join(", ")}`}>
        <Box display="flex" alignItems="center" data-test={dataTest}>
          <Icon icon={faStar} size={16} color="warning" />
        </Box>
      </Tooltip>
    );
  }
);
