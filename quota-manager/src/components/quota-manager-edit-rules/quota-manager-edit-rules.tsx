import { FC } from 'react';
import { FormModalPage } from '@commercetools-frontend/application-components';
import Text from '@commercetools-uikit/text';
import QuotaManagerMaxCart from '../quota-manager-max-cart/quota-manager-max-cart';
import QuotaManagerProductList from '../quota-manager-product-list/quota-manager-product-list';

type Props = { onClose: () => void; storeId: string; customerGroupId: string };

export const QuotaManagerEditRules: FC<Props> = ({
  onClose,
  storeId,
  customerGroupId,
}) => {
  return (
    <FormModalPage
      title={'Edit rules for'}
      isOpen
      onPrimaryButtonClick={() => console.log('Primary')}
      onSecondaryButtonClick={onClose}
      labelSecondaryButton={'Close'}
    >
      <Text.Headline as="h2">
        Add new rules for {storeId} - {customerGroupId}
      </Text.Headline>
      <QuotaManagerMaxCart />
      <QuotaManagerProductList />
    </FormModalPage>
  );
};

export default QuotaManagerEditRules;
