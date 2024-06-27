import { TQuery, TQuery_CustomerGroupsArgs } from '../../types/generated/ctp';
import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

import FetchAllQuery from './fetch-customer-groups.ctp.graphql';

type TUseStoresFetcher = (variables: TQuery_CustomerGroupsArgs) => {
  customerGroups?: TQuery['customerGroups'];
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<TQuery>>;
};
export const useCustomerGroupsFetcher: TUseStoresFetcher = (variables) => {
  const { data, error, loading, refetch } = useQuery<
    TQuery,
    TQuery_CustomerGroupsArgs
  >(FetchAllQuery, {
    variables: variables,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  return {
    customerGroups: data?.customerGroups,
    error,
    loading,
    refetch,
  };
};
