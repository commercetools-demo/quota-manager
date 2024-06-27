import {
  transformLocalizedStringToLocalizedField,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { isApolloError, ApolloError, type ServerError } from '@apollo/client';
import type {
  TBaseMoney,
  TChannel,
  THighPrecisionMoney,
} from './types/generated/ctp';
import type {
  TGraphqlUpdateAction,
  TSyncAction,
  TChangeNameActionPayload,
} from './types';
import { IntlShape } from 'react-intl';

export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const isServerError = (
  error: ApolloError['networkError']
): error is ServerError => {
  return Boolean((error as ServerError)?.result);
};

export const extractErrorFromGraphQlResponse = (graphQlResponse: unknown) => {
  if (graphQlResponse instanceof Error && isApolloError(graphQlResponse)) {
    if (
      isServerError(graphQlResponse.networkError) &&
      typeof graphQlResponse.networkError?.result !== 'string' &&
      graphQlResponse.networkError?.result?.errors.length > 0
    ) {
      return graphQlResponse?.networkError?.result.errors;
    }

    if (graphQlResponse.graphQLErrors?.length > 0) {
      return graphQlResponse.graphQLErrors;
    }
  }

  return graphQlResponse;
};

const getNameFromPayload = (payload: TChangeNameActionPayload) => ({
  name: transformLocalizedStringToLocalizedField(payload.name),
});

const isChangeNameActionPayload = (
  actionPayload: Record<string, unknown>
): actionPayload is TChangeNameActionPayload => {
  return (actionPayload as TChangeNameActionPayload)?.name !== undefined;
};

const convertAction = (action: TSyncAction): TGraphqlUpdateAction => {
  const { action: actionName, ...actionPayload } = action;
  return {
    [actionName]:
      actionName === 'changeName' && isChangeNameActionPayload(actionPayload)
        ? getNameFromPayload(actionPayload)
        : actionPayload,
  };
};

export const createGraphQlUpdateActions = (actions: TSyncAction[]) =>
  actions.reduce<TGraphqlUpdateAction[]>(
    (previousActions, syncAction) => [
      ...previousActions,
      convertAction(syncAction),
    ],
    []
  );

export const convertToActionData = (draft: Partial<TChannel>) => ({
  ...draft,
  name: transformLocalizedFieldToLocalizedString(draft.nameAllLocales || []),
});

export function getFractionedAmount(moneyValue: TBaseMoney) {
  const { fractionDigits = 2 } = moneyValue;

  // the amount should be available on preciseAmount for highPrecision
  const amount =
    moneyValue.type === 'highPrecision'
      ? (moneyValue as THighPrecisionMoney).preciseAmount
      : moneyValue.centAmount;

  return amount / 10 ** fractionDigits;
}

export function formatMoney(
  moneyValue: TBaseMoney | undefined | null,
  intl: IntlShape,
  options?: Record<string, unknown>
) {
  if (!moneyValue || !moneyValue.currencyCode) {
    return '';
  }
  return intl.formatNumber(getFractionedAmount(moneyValue), {
    style: 'currency',
    currency: moneyValue.currencyCode,
    minimumFractionDigits: moneyValue.fractionDigits,
    ...options,
  });
}
