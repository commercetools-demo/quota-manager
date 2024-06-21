import { TQuery, TQuery_StoresArgs } from '../../types/generated/ctp';
import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

import FetchAllQuery from './fetch-stores.ctp.graphql';

type TUseStoresFetcher = (
  variables: TQuery_StoresArgs & { locale: string }
) => {
  stores?: TQuery['stores'];
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<TQuery>>;
};
export const useStoresFetcher: TUseStoresFetcher = (variables) => {
  const { data, error, loading, refetch } = useQuery<TQuery, TQuery_StoresArgs>(
    FetchAllQuery,
    {
      variables: variables,
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );
  return {
    stores: data?.stores,
    error,
    loading,
    refetch,
  };
};
