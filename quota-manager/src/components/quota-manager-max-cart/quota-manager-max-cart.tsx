import { FC } from 'react';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useFormik, useFormikContext } from 'formik';
import Spacings from '@commercetools-uikit/spacings';
import { Config } from '../quota-manager/validation';
import MoneyInput, {
  TValue,
  TCurrencyCode,
} from '@commercetools-uikit/money-input';
import Grid from '@commercetools-uikit/grid';

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

  const formik = useFormik<{ moneyInput: TValue }>({
    initialValues: {
      moneyInput: {
        amount: '',
        currencyCode: filteredCurrencies[0] as TCurrencyCode,
      },
    },
    onSubmit: () => {},
  });

  return (
    <Spacings.Stack scale={'s'}>
      <Text.Headline as="h2">Cart Limits: </Text.Headline>
      {filteredCurrencies.length > 0 ? (
        <Spacings.Inline alignItems={'center'}>
          <Grid.Item>
            <Text.Body> Maximum cart total value: </Text.Body>
          </Grid.Item>

          <Grid.Item>
            <MoneyInput
              name={'moneyInput'}
              value={formik.values.moneyInput}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              currencies={filteredCurrencies}
            />
          </Grid.Item>
          <Grid.Item>
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
                const convertToMoneyValue = MoneyInput.convertToMoneyValue(
                  { ...formik.values.moneyInput },
                  dataLocale
                );
                if (convertToMoneyValue) {
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
          </Grid.Item>
        </Spacings.Inline>
      ) : (
        <Text.Body>
          You have already configured limits for all currencies.
        </Text.Body>
      )}
    </Spacings.Stack>
  );
};

export default QuotaManagerMaxCart;
