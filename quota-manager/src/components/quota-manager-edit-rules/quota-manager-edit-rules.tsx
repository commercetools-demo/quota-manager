import { FC } from 'react';
import { InfoModalPage } from '@commercetools-frontend/application-components';
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
    <InfoModalPage
      title={`Edit rules for ${storeId} - ${customerGroupId}`}
      isOpen
      onClose={onClose}
    >
      <QuotaManagerMaxCart />
      <QuotaManagerProductList />
    </InfoModalPage>
  );
};

export default QuotaManagerEditRules;
