/* eslint-disable */

              /**
               * This was auto-generated, girl. Don't touch it.
               */
            
import * as Types from '../types/graphqlTypes';

import { gql } from '@apollo/client';
export type IPrReviewFragment = (
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
);

export const PrReviewFragmentDoc = gql`
    fragment PRReview on PullRequestReview {
  id
  state
  createdAt
  author {
    ... on User {
      id
      login
      avatarUrl(size: 64)
    }
  }
}
    `;