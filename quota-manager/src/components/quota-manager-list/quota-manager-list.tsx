import { FC } from 'react';
import {
  useCustomObjectDeleter,
  useCustomObjectFetcher,
  useCustomObjectUpdater,
} from '../../hooks/use-custom-object-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import QuotaManagerMaxCart from '../quota-manager-max-cart/quota-manager-max-cart';
import { FormikProvider, useFormik } from 'formik';
import { validate } from './validation';
import {
  DOMAINS,
  NOTIFICATION_KINDS_PAGE,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import QuotaManagerConfiguredRules from '../quota-manager-configured-rules/quota-manager-configured-rules';
import { TMoneyValue } from '@commercetools-uikit/money-input/dist/declarations/src/money-input';
import QuotaManagerProductList, {
  FormProps,
} from '../quota-manager-product-list/quota-manager-product-list';

export type Config = {
  key: string;
  cartLimits?: Array<TMoneyValue>;
  cartLimitsCurrenciesConfigured?: Array<string>;
  productRules?: Array<FormProps>;
};

type Props = { storeId: string; customerGroupId: string };

export const QuotaManagerList: FC<Props> = ({ customerGroupId, storeId }) => {
  const objectKey = `${customerGroupId}-cart-rules`;
  const showNotification = useShowNotification();
  const { customObject, error, loading, refetch } = useCustomObjectFetcher({
    container: objectKey,
    key: storeId,
  });
  const customObjectUpdater = useCustomObjectUpdater();
  const customObjectDeleter = useCustomObjectDeleter();

  const handleSubmit = (values: Config) => {
    customObjectUpdater.execute({
      draft: {
        container: objectKey,
        key: storeId,
        value: JSON.stringify(values),
      },
      onCompleted: () => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: `Configuration created for ${storeId}`,
        });
      },
      onError: (message) => {
        showNotification({
          kind: NOTIFICATION_KINDS_PAGE.error,
          domain: DOMAINS.PAGE,
          text: message,
        });
      },
    });
  };

  const handleDeleteConfiguration = async () => {
    customObjectDeleter.execute({
      id: customObject?.id,
      version: customObject?.version,
      onCompleted: () => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: `Configuration deleted`,
        });
      },
      onError: (message) =>
        showNotification({
          kind: NOTIFICATION_KINDS_PAGE.error,
          domain: DOMAINS.PAGE,
          text: message,
        }),
    });
  };

  const formik = useFormik<Config>({
    initialValues: (customObject?.value as Config) || {},
    onSubmit: handleSubmit,
    validate: validate,
    enableReinitialize: true,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }

  const hasRules =
    (formik.values.productRules && formik.values.productRules.length <= 0) ||
    (formik.values.cartLimits && formik.values.cartLimits.length <= 0) ||
    (formik.values.cartLimitsCurrenciesConfigured &&
      formik.values.cartLimitsCurrenciesConfigured.length <= 0);

  return (
    <FormikProvider value={formik}>
      <Spacings.Stack scale={'xl'}>
        {hasRules ? (
          <>
            <Text.Headline as="h2">
              Quota configuration for {storeId} - {customerGroupId}
            </Text.Headline>
            <QuotaManagerConfiguredRules
              afterSubmit={refetch}
              handleDeleteConfiguration={handleDeleteConfiguration}
            />
          </>
        ) : (
          <Text.Body>
            No Quota configuration available for {storeId} - {customerGroupId}
          </Text.Body>
        )}
      </Spacings.Stack>
    </FormikProvider>
  );
};

export default QuotaManagerList;
