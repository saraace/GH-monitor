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
    | 'reviewDecision'
    | 'number'
  >
  & {
    repository: (
      { __typename?: 'Repository' }
      & Pick<Types.IRepository, 'name'>
    ),
    commits: (
      { __typename?: 'PullRequestCommitConnection' }
      & { nodes?: Types.Maybe<Array<Types.Maybe<(
        { __typename?: 'PullRequestCommit' }
        & Pick<Types.IPullRequestCommit, 'id'>
        & { commit: (
          { __typename?: 'Commit' }
          & Pick<Types.ICommit, 'id' | 'committedDate'>
        ) }
      )>>> }
    ),
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
    reviewRequests?: Types.Maybe<(
      { __typename?: 'ReviewRequestConnection' }
      & { nodes?: Types.Maybe<Array<Types.Maybe<(
        { __typename?: 'ReviewRequest' }
        & Pick<Types.IReviewRequest, 'id' | 'asCodeOwner'>
        & { requestedReviewer?: Types.Maybe<
          | { __typename?: 'Bot' }
          | { __typename?: 'Mannequin' }
          | (
            { __typename?: 'Team' }
            & Pick<Types.ITeam, 'id' | 'name'>
          )
          | { __typename?: 'User' }
        > }
      )>>> }
    )>,
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
    labels?: Types.Maybe<(
      { __typename?: 'LabelConnection' }
      & { nodes?: Types.Maybe<Array<Types.Maybe<(
        { __typename?: 'Label' }
        & Pick<Types.ILabel, 'id' | 'name' | 'color'>
      )>>> }
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
  reviewDecision
  number
  repository {
    name
  }
  commits(last: 1) {
    nodes {
      id
      commit {
        id
        committedDate
      }
    }
  }
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
  reviewRequests(first: 15) {
    nodes {
      id
      asCodeOwner
      requestedReviewer {
        ... on Team {
          id
          name
        }
      }
    }
  }
  viewerLatestReview {
    ...PRReview
  }
  labels(first: 10) {
    nodes {
      id
      name
      color
    }
  }
}
    ${PrReviewFragmentDoc}`;