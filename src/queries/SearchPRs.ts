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
export type ISearchPRsQueryVariables = Types.Exact<{
  query: Types.Scalars['String']['input'];
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ISearchPRsQuery = (
  { __typename?: 'Query' }
  & { search: (
    { __typename?: 'SearchResultItemConnection' }
    & Pick<Types.ISearchResultItemConnection, 'issueCount'>
    & {
      pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<Types.IPageInfo, 'hasNextPage' | 'endCursor'>
      ),
      nodes?: Types.Maybe<Array<Types.Maybe<
        | { __typename?: 'App' }
        | { __typename?: 'Discussion' }
        | { __typename?: 'Issue' }
        | { __typename?: 'MarketplaceListing' }
        | { __typename?: 'Organization' }
        | (
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
        )
        | { __typename?: 'Repository' }
        | { __typename?: 'User' }
      >>>,
    }
  ) }
);


export const SearchPRsDocument = gql`
    query SearchPRs($query: String!, $first: Int, $after: String) {
  search(query: $query, type: ISSUE, first: $first, after: $after) {
    issueCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ... on PullRequest {
        ...PR
      }
    }
  }
}
    ${PrFragmentDoc}`;

/**
 * __useSearchPRsQuery__
 *
 * To run a query within a React component, call `useSearchPRsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPRsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPRsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSearchPRsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ISearchPRsQuery, ISearchPRsQueryVariables> & ({ variables: ISearchPRsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ISearchPRsQuery, ISearchPRsQueryVariables>(SearchPRsDocument, options);
      }
export function useSearchPRsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ISearchPRsQuery, ISearchPRsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ISearchPRsQuery, ISearchPRsQueryVariables>(SearchPRsDocument, options);
        }
export function useSearchPRsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ISearchPRsQuery, ISearchPRsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ISearchPRsQuery, ISearchPRsQueryVariables>(SearchPRsDocument, options);
        }
export type SearchPRsQueryHookResult = ReturnType<typeof useSearchPRsQuery>;
export type SearchPRsLazyQueryHookResult = ReturnType<typeof useSearchPRsLazyQuery>;
export type SearchPRsSuspenseQueryHookResult = ReturnType<typeof useSearchPRsSuspenseQuery>;
export type SearchPRsQueryResult = ApolloReactCommon.QueryResult<ISearchPRsQuery, ISearchPRsQueryVariables>;