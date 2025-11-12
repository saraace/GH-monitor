/* eslint-disable */

              /**
               * This was auto-generated, girl. Don't touch it.
               */
            
import * as Types from '../types/graphqlTypes';

import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client/react';
import * as ApolloReactHooks from '@apollo/client/react';
const defaultOptions = {} as const;
export type IViewerInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type IViewerInfoQuery = (
  { __typename?: 'Query' }
  & { viewer: (
    { __typename?: 'User' }
    & Pick<
      Types.IUser,
      | 'id'
      | 'login'
      | 'name'
      | 'avatarUrl'
    >
  ) }
);


export const ViewerInfoDocument = gql`
    query ViewerInfo {
  viewer {
    id
    login
    name
    avatarUrl(size: 64)
  }
}
    `;

/**
 * __useViewerInfoQuery__
 *
 * To run a query within a React component, call `useViewerInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewerInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewerInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useViewerInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IViewerInfoQuery, IViewerInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<IViewerInfoQuery, IViewerInfoQueryVariables>(ViewerInfoDocument, options);
      }
export function useViewerInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IViewerInfoQuery, IViewerInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<IViewerInfoQuery, IViewerInfoQueryVariables>(ViewerInfoDocument, options);
        }
export function useViewerInfoSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<IViewerInfoQuery, IViewerInfoQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<IViewerInfoQuery, IViewerInfoQueryVariables>(ViewerInfoDocument, options);
        }
export type ViewerInfoQueryHookResult = ReturnType<typeof useViewerInfoQuery>;
export type ViewerInfoLazyQueryHookResult = ReturnType<typeof useViewerInfoLazyQuery>;
export type ViewerInfoSuspenseQueryHookResult = ReturnType<typeof useViewerInfoSuspenseQuery>;
export type ViewerInfoQueryResult = ApolloReactCommon.QueryResult<IViewerInfoQuery, IViewerInfoQueryVariables>;