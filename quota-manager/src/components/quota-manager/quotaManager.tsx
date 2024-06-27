import { lazy, useState } from 'react';
import StoreSelector from './storeSelector';
import {
  InfoMainPage,
  PageContentWide,
} from '@commercetools-frontend/application-components';
import CustomerGroupsSelection from './customerGroupSelection';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import QuotaManagerList from '../quota-manager-list/quota-manager-list';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { Link, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { EditIcon } from '@commercetools-uikit/icons';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';

const QuotaManagerEditRules = lazy(
  () => import('../quota-manager-edit-rules/quota-manager-edit-rules')
);

const QuotaManager: React.FC = () => {
  const match = useRouteMatch();
  const { push } = useHistory();
  const [stSelection, setStSelection] = useState<string>('thedoublef-webstore');
  const [cgSelection, setCgSeletion] = useState<string>('general');

  return (
    <InfoMainPage
      customTitleRow={
        <Spacings.Inline justifyContent="space-between">
          <Text.Headline as="h2">Quota Management Page</Text.Headline>
          <SecondaryButton
            as={Link}
            to={`${match.url}/new`}
            iconLeft={<EditIcon />}
            label={'Create/Edit Rules'}
            isDisabled={!cgSelection || !stSelection}
          />
        </Spacings.Inline>
      }
    >
      <PageContentWide>
        <Spacings.Stack scale={'l'}>
          <Spacings.Inline scale={'s'}>
            <StoreSelector
              setSelection={setStSelection}
              selection={stSelection}
            />
            <CustomerGroupsSelection
              setCustomerSelection={setCgSeletion}
              customerSelection={cgSelection}
            />
          </Spacings.Inline>
          {stSelection && cgSelection ? (
            <QuotaManagerList
              storeId={stSelection}
              customerGroupId={cgSelection}
            />
          ) : null}
        </Spacings.Stack>
      </PageContentWide>
      <Switch>
        <SuspendedRoute path={`${match.url}/new`}>
          <QuotaManagerEditRules
            onClose={() => {
              push(`${match.url}`);
            }}
            storeId={stSelection}
            customerGroupId={cgSelection}
          />
        </SuspendedRoute>
      </Switch>
    </InfoMainPage>
  );
};

export default QuotaManager;
