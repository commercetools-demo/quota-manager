import { FC } from 'react';
import Text from '@commercetools-uikit/text';
import MoneyInput from '@commercetools-uikit/money-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useFormik, useFormikContext } from 'formik';
import { Config } from '../quota-manager-list/quota-manager-list';
import Grid from '@commercetools-uikit/grid';
import MoneyField from '@commercetools-uikit/money-field';
import { TMoneyFieldProps } from '@commercetools-uikit/money-field/dist/declarations/src/money-field';

type Props = {};

export const QuotaManagerMaxCart: FC<Props> = () => {
  const { values, submitForm, setFieldValue } = useFormikContext<Config>();

  const { currencies, dataLocale } = useApplicationContext((context) => ({
    currencies: context.project?.currencies ?? [],
    dataLocale: context.dataLocale ?? '',
  }));

  const filteredCurrencies = currencies.filter(
    (currency) =>
      (values.cartLimitsCurrenciesConfigured || []).indexOf(currency) === -1
  );

  const formik = useFormik<{ moneyInput: TMoneyFieldProps['value'] }>({
    initialValues: {
      moneyInput: {
        amount: '',
        // @ts-ignore
        currencyCode: filteredCurrencies[0] || '',
      },
    },
    onSubmit: () => {},
  });
  return (
    <Grid
      gridGap="16px"
      gridAutoColumns="1fr"
      gridTemplateColumns="repeat(3, 1fr)"
      alignItems={'center'}
    >
      <Text.Body> Maximum cart total value: </Text.Body>
      <MoneyField
        title={''}
        name={'moneyInput'}
        value={formik.values.moneyInput}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        currencies={filteredCurrencies}
      />
      <PrimaryButton
        label={`Add total for ${formik.values.moneyInput.currencyCode} currency`}
        type="button"
        size="big"
        isDisabled={
          !formik.dirty ||
          !formik.values.moneyInput.currencyCode ||
          !formik.values.moneyInput.amount
        }
        onClick={async () => {
          let convertToMoneyValue = MoneyInput.convertToMoneyValue(
            // @ts-ignore
            { ...formik.values.moneyInput },
            dataLocale
          );
          if (convertToMoneyValue) {
            convertToMoneyValue = {
              ...convertToMoneyValue,
              centAmount: convertToMoneyValue.centAmount / 100,
            };
            setFieldValue('cartLimits', [
              ...(values.cartLimits || []),
              convertToMoneyValue,
            ]);
            setFieldValue('cartLimitsCurrenciesConfigured', [
              ...(values.cartLimitsCurrenciesConfigured || []),
              convertToMoneyValue.currencyCode,
            ]);

            await submitForm();
          }
        }}
      />
    </Grid>
  );
};

export default QuotaManagerMaxCart;
