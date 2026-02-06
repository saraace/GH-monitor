/* eslint-disable */

              /**
               * This was auto-generated, girl. Don't touch it.
               */
            
import * as Types from '../types/graphqlTypes';

import { gql } from '@apollo/client';
import { PrFragmentDoc } from './PRFragment';
import * as ApolloReactCommon from '@apollo/client/react';
import * as ApolloReactHooks from '@apollo/client/react';
const defaultOptions = {} as const;
export type IOrganizationPRsQueryVariables = Types.Exact<{
  orgName: Types.Scalars['String']['input'];
  repoName: Types.Scalars['String']['input'];
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  pullRequestStates?: Types.InputMaybe<Array<Types.IPullRequestState> | Types.IPullRequestState>;
  orderBy?: Types.InputMaybe<Types.IIssueOrder>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type IOrganizationPRsQuery = (
  { __typename?: 'Query' }
  & { repository?: Types.Maybe<(
    { __typename?: 'Repository' }
    & Pick<Types.IRepository, 'id' | 'name'>
    & { pullRequests: (
      { __typename?: 'PullRequestConnection' }
      & { nodes?: Types.Maybe<Array<Types.Maybe<(
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
          reviewThreads: (
            { __typename?: 'PullRequestReviewThreadConnection' }
            & { nodes?: Types.Maybe<Array<Types.Maybe<(
              { __typename?: 'PullRequestReviewThread' }
              & Pick<Types.IPullRequestReviewThread, 'isResolved'>
            )>>> }
          ),
        }
      )>>> }
    ) }
  )> }
);


export const OrganizationPRsDocument = gql`
    query OrganizationPRs($orgName: String!, $repoName: String!, $first: Int, $pullRequestStates: [PullRequestState!], $orderBy: IssueOrder, $after: String) {
  repository(owner: $orgName, name: $repoName) {
    id
    name
    pullRequests(
      first: $first
      after: $after
      states: $pullRequestStates
      orderBy: $orderBy
    ) {
      nodes {
        ...PR
      }
    }
  }
}
    ${PrFragmentDoc}`;

/**
 * __useOrganizationPRsQuery__
 *
 * To run a query within a React component, call `useOrganizationPRsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationPRsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationPRsQuery({
 *   variables: {
 *      orgName: // value for 'orgName'
 *      repoName: // value for 'repoName'
 *      first: // value for 'first'
 *      pullRequestStates: // value for 'pullRequestStates'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useOrganizationPRsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<IOrganizationPRsQuery, IOrganizationPRsQueryVariables> & ({ variables: IOrganizationPRsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<IOrganizationPRsQuery, IOrganizationPRsQueryVariables>(OrganizationPRsDocument, options);
      }
export function useOrganizationPRsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IOrganizationPRsQuery, IOrganizationPRsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<IOrganizationPRsQuery, IOrganizationPRsQueryVariables>(OrganizationPRsDocument, options);
        }
export function useOrganizationPRsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<IOrganizationPRsQuery, IOrganizationPRsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<IOrganizationPRsQuery, IOrganizationPRsQueryVariables>(OrganizationPRsDocument, options);
        }
export type OrganizationPRsQueryHookResult = ReturnType<typeof useOrganizationPRsQuery>;
export type OrganizationPRsLazyQueryHookResult = ReturnType<typeof useOrganizationPRsLazyQuery>;
export type OrganizationPRsSuspenseQueryHookResult = ReturnType<typeof useOrganizationPRsSuspenseQuery>;
export type OrganizationPRsQueryResult = ApolloReactCommon.QueryResult<IOrganizationPRsQuery, IOrganizationPRsQueryVariables>;