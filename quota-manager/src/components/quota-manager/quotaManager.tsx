import { FC, lazy, useState } from 'react';
import StoreSelector from './storeSelector';
import {
  InfoMainPage,
  PageContentWide,
} from '@commercetools-frontend/application-components';
import CustomerGroupsSelection from './customerGroupSelection';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import {
  Link,
  Switch,
  useHistory,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import { EditIcon } from '@commercetools-uikit/icons';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import {
  useCustomObjectDeleter,
  useCustomObjectFetcher,
  useCustomObjectUpdater,
} from '../../hooks/use-custom-object-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import {
  DOMAINS,
  NOTIFICATION_KINDS_PAGE,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { FormikProvider, useFormik } from 'formik';
import { Config, validate } from './validation';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import QuotaManagerConfiguredRules from '../quota-manager-configured-rules/quota-manager-configured-rules';

const QuotaManagerEditRules = lazy(
  () => import('../quota-manager-edit-rules/quota-manager-edit-rules')
);

export interface Query {
  store?: string;
  customergroup?: string;
}

type Props = {
  baseUrl: string;
};

const QuotaManager: FC<Props> = ({ baseUrl }) => {
  const { customerGroup, store } = useParams<{
    customerGroup?: string;
    store?: string;
  }>();
  const match = useRouteMatch();
  const { push } = useHistory();
  const [filters, setFilters] = useState<Query>({
    customergroup: customerGroup,
    store: store,
  });

  const showNotification = useShowNotification();

  const updateFilters = (query: Partial<Query>) => {
    const newQuery = {
      ...filters,
      ...query,
    };
    setFilters(newQuery);
    const baseURL = `${baseUrl}/${newQuery.customergroup || ''}/${
      newQuery.store || ''
    }`;
    console.log(baseURL);
    push(baseURL);
  };

  const objectKey =
    filters.customergroup && `${filters.customergroup}-cart-rules`;
  const { customObject, error, loading, refetch } = useCustomObjectFetcher({
    container: objectKey,
    key: filters.store,
  });

  const customObjectUpdater = useCustomObjectUpdater();

  const customObjectDeleter = useCustomObjectDeleter();

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

  const handleSubmit = (values: Config) => {
    if (objectKey && filters.store) {
      customObjectUpdater.execute({
        draft: {
          container: objectKey,
          key: filters.store,
          value: JSON.stringify(values),
        },
        onCompleted: () => {
          showNotification({
            kind: NOTIFICATION_KINDS_SIDE.success,
            domain: DOMAINS.SIDE,
            text: `Configuration created for ${filters.store}`,
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
    }
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
    (formik.values.productRules && formik.values.productRules.length > 0) ||
    (formik.values.cartLimits && formik.values.cartLimits.length > 0) ||
    (formik.values.cartLimitsCurrenciesConfigured &&
      formik.values.cartLimitsCurrenciesConfigured.length > 0);

  return (
    <FormikProvider value={formik}>
      <InfoMainPage
        customTitleRow={
          <Spacings.Inline justifyContent="space-between">
            <Text.Headline as="h2">Quota Management Page</Text.Headline>
            <SecondaryButton
              as={Link}
              to={`${match.url}/new`}
              iconLeft={<EditIcon />}
              label={'Create/Edit Rules'}
              isDisabled={!filters.customergroup || !filters.store}
            />
          </Spacings.Inline>
        }
      >
        <PageContentWide>
          <Spacings.Stack scale={'l'}>
            <Spacings.Inline scale={'s'}>
              <StoreSelector filters={filters} updateFilters={updateFilters} />
              <CustomerGroupsSelection
                filters={filters}
                updateFilters={updateFilters}
              />
            </Spacings.Inline>
            {filters.store && filters.customergroup ? (
              <Spacings.Stack scale={'xl'}>
                {hasRules ? (
                  <>
                    <Text.Headline as="h2">
                      Quota configuration for {filters.store} -{' '}
                      {filters.customergroup}
                    </Text.Headline>
                    <QuotaManagerConfiguredRules
                      afterSubmit={refetch}
                      handleDeleteConfiguration={handleDeleteConfiguration}
                    />
                  </>
                ) : (
                  <Text.Body>
                    No Quota configuration available for {filters.store} -{' '}
                    {filters.customergroup}
                  </Text.Body>
                )}
              </Spacings.Stack>
            ) : null}
          </Spacings.Stack>
        </PageContentWide>
        <Switch>
          <SuspendedRoute path={`${match.url}/new`}>
            <QuotaManagerEditRules
              onClose={async () => {
                await refetch();
                push(`${match.url}`);
              }}
              storeId={filters.store}
              customerGroupId={filters.customergroup}
            />
          </SuspendedRoute>
        </Switch>
      </InfoMainPage>
    </FormikProvider>
  );
};

export default QuotaManager;
