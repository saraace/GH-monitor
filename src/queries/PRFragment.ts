/* eslint-disable */

              /**
               * This was auto-generated, girl. Don't touch it.
               */
            
import * as Types from '../types/graphqlTypes';

import { gql } from '@apollo/client';
import { PrReviewFragmentDoc } from './PRReviewFragment';
export type IPrFragment = (
  { __typename?: 'PullRequest' }
  & Pick<
    Types.IPullRequest,
    | 'id'
    | 'title'
    | 'state'
    | 'isDraft'
    | 'url'
    | 'createdAt'
    | 'lastEditedAt'
    | 'reviewDecision'
    | 'number'
  >
  & {
    statusCheckRollup?: Types.Maybe<(
      { __typename?: 'StatusCheckRollup' }
      & Pick<Types.IStatusCheckRollup, 'id' | 'state'>
    )>,
    author?: Types.Maybe<
      | { __typename?: 'Bot' }
      | { __typename?: 'EnterpriseUserAccount' }
      | { __typename?: 'Mannequin' }
      | { __typename?: 'Organization' }
      | (
        { __typename?: 'User' }
        & Pick<Types.IUser, 'id' | 'avatarUrl' | 'login'>
      )
    >,
    viewerLatestReview?: Types.Maybe<(
      { __typename?: 'PullRequestReview' }
      & Pick<Types.IPullRequestReview, 'id' | 'state' | 'createdAt'>
      & { author?: Types.Maybe<
        | { __typename?: 'Bot' }
        | { __typename?: 'EnterpriseUserAccount' }
        | { __typename?: 'Mannequin' }
        | { __typename?: 'Organization' }
        | (
          { __typename?: 'User' }
          & Pick<Types.IUser, 'id' | 'login' | 'avatarUrl'>
        )
      > }
    )>,
  }
);

export const PrFragmentDoc = gql`
    fragment PR on PullRequest {
  id
  title
  state
  isDraft
  url
  createdAt
  lastEditedAt
  reviewDecision
  number
  statusCheckRollup {
    id
    state
  }
  author {
    ... on User {
      id
      avatarUrl(size: 64)
      login
    }
  }
  viewerLatestReview {
    ...PRReview
  }
}
    ${PrReviewFragmentDoc}`;