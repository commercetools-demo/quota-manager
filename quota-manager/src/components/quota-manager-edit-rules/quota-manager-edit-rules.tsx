import { FC } from 'react';
import { FormModalPage } from '@commercetools-frontend/application-components';
import QuotaManagerMaxCart from '../quota-manager-max-cart/quota-manager-max-cart';
import QuotaManagerProductList from '../quota-manager-product-list/quota-manager-product-list';

type Props = {
  onClose: () => Promise<void>;
  storeId?: string;
  customerGroupId?: string;
};

export const QuotaManagerEditRules: FC<Props> = ({
  onClose,
  storeId,
  customerGroupId,
}) => {
  return (
    <FormModalPage
      title={`Edit rules for ${storeId} - ${customerGroupId}`}
      isOpen
      onPrimaryButtonClick={() => console.log('Primary')}
      onSecondaryButtonClick={onClose}
      labelSecondaryButton={'Close'}
      onClose={onClose}
    >
      <QuotaManagerMaxCart />
      <QuotaManagerProductList />
    </FormModalPage>
  );
};

export default QuotaManagerEditRules;
