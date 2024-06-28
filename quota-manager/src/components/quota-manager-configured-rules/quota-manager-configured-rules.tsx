import { FC, useState } from 'react';
import Text from '@commercetools-uikit/text';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import PrimaryButton from '@commercetools-uikit/primary-button';

import { useFormikContext } from 'formik';
import { Config } from '../quota-manager/validation';
import { useIntl } from 'react-intl';
import { formatMoney } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import MoneyInput from '@commercetools-uikit/money-input';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

type Props = {
  afterSubmit: () => Promise<unknown>;
  handleDeleteConfiguration: () => Promise<void>;
};

export const QuotaManagerConfiguredRules: FC<Props> = ({
  afterSubmit,
  handleDeleteConfiguration,
}) => {
  const { values, setFieldValue, submitForm } = useFormikContext<Config>();
  const intl = useIntl();
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const [removeList, setRemoveList] = useState<any[]>([]);

  const clearSelectedRules = async () => {
    const productLimitsToDelete = values.productRules?.filter(
      (element) => !removeList.includes(element)
    );

    const cartLimitsToDelete = values.cartLimits?.filter(
      (element) => !removeList.includes(element)
    );

    const currenciesToDelete = cartLimitsToDelete?.filter(
      (element) => !removeList.includes(element.currencyCode)
    );

    const newConfiguredCurrencies = currenciesToDelete?.map((currency) => {
      return currency.currencyCode;
    });
    setFieldValue('productRules', productLimitsToDelete);
    setFieldValue('cartLimits', cartLimitsToDelete);
    setFieldValue('cartLimitsCurrenciesConfigured', newConfiguredCurrencies);

    setRemoveList([]);
    await submitForm();
    await afterSubmit();
  };

  const handleDeletionList = (rule: any) => {
    const itemIndex = removeList.indexOf(rule);
    if (itemIndex === -1) {
      setRemoveList([...removeList, rule]);
    } else {
      setRemoveList(removeList.filter((item) => item !== rule));
    }
  };

  return (
    <>
      <Spacings.Stack scale={'l'}>
        <Text.Headline as="h2">Configured Rules: </Text.Headline>
        <Spacings.Stack scale={'s'}>
          {values.cartLimits && values.cartLimits.length > 0 ? (
            <>
              {values.cartLimits.map((cartLimit, index) => {
                return (
                  <CheckboxInput
                    key={index}
                    onChange={() => handleDeletionList(cartLimit)}
                    isChecked={removeList.indexOf(cartLimit) !== -1}
                  >
                    <p key={index}>
                      The maximum total value for the whole cart is{' '}
                      <b>{formatMoney(cartLimit, intl)}</b>
                    </p>
                  </CheckboxInput>
                );
              })}
            </>
          ) : null}
          {/**
           {samplesLimit !== '' ? (
           <p>
           The maximum quantity of sample Items on cart is{' '}
           <b>{samplesLimit}</b>
           </p>
           ) : null} */}
          {values.productRules?.map((rule, index) => {
            let type;
            let typeMessage;
            let criteriaMessage;
            if (rule.type === 'sku' && rule.product) {
              type = 'SKU';
              typeMessage = `${rule.product.name} (${rule.product.sku})`;
            } else if (rule.type === 'category' && rule.category) {
              type = 'category';
              typeMessage = rule.category.name;
            }
            if (rule.criteria === 'quantity') {
              criteriaMessage = rule.quantity;
            } else if (rule.criteria === 'money') {
              criteriaMessage = formatMoney(
                MoneyInput.convertToMoneyValue(
                  rule.selectedTotalValue,
                  dataLocale
                ),
                intl
              );
            }
            return (
              <CheckboxInput
                key={index}
                onChange={() => handleDeletionList(rule)}
                isChecked={removeList.indexOf(rule) !== -1}
              >
                <p>
                  The max <b>{rule.criteria} </b>for {type} with name{' '}
                  {typeMessage} is {criteriaMessage}
                </p>
              </CheckboxInput>
            );
          })}
        </Spacings.Stack>

        <Spacings.Inline>
          <SecondaryButton
            label="Clear Selected Rules"
            type="button"
            size="big"
            isDisabled={removeList.length <= 0}
            onClick={async () => {
              await clearSelectedRules();
            }}
          />
          <PrimaryButton
            label="Clear All Rules"
            type="button"
            size="big"
            onClick={async () => {
              await handleDeleteConfiguration();
            }}
          />
        </Spacings.Inline>
      </Spacings.Stack>
    </>
  );
};

export default QuotaManagerConfiguredRules;
