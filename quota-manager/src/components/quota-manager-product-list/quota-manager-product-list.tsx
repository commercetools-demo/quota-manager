import { FC } from 'react';
import Text from '@commercetools-uikit/text';
import SelectInput from '@commercetools-uikit/select-input';
import TextInput from '@commercetools-uikit/text-input';
import MoneyInput, {
  type TCurrencyCode,
} from '@commercetools-uikit/money-input';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Spacings from '@commercetools-uikit/spacings';
import Grid from '@commercetools-uikit/grid';
import { CategorySearchInput } from '../category-search-input';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { ProductSearchInput } from '../product-search-input';
import { CategoryValue } from '../category-search-input/category-search-input';
import { ProductValue } from '../product-search-input/product-search-input';
import NumberInput from '@commercetools-uikit/number-input';
import { TValue } from '@commercetools-uikit/money-input/dist/declarations/src/money-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { Config } from '../quota-manager-list/quota-manager-list';

type Props = {};

export type FormProps = {
  type: 'flag' | 'sku' | 'category';
  criteria?: 'quantity' | 'value' | 'money';
  category?: CategoryValue;
  product?: ProductValue;
  quantity?: number | string;
  totalValue?: string;
  selectedTotalValue: TValue;
  flag?: string;
};

export const QuotaManagerProductList: FC<Props> = ({}) => {
  const { currencies } = useApplicationContext((context) => ({
    currencies: context.project?.currencies ?? [],
  }));

  const { setFieldValue, values, submitForm } = useFormikContext<Config>();

  const formik = useFormik<FormProps>({
    initialValues: {
      type: 'sku',
      criteria: 'quantity',
      selectedTotalValue: {
        currencyCode: currencies[0] as TCurrencyCode,
        amount: '',
      },
    },
    onSubmit: async (formValues: FormProps) => {
      setFieldValue('productRules', [
        ...(values.productRules || []),
        { ...formValues },
      ]);
      await submitForm();
    },
  });

  let typeComponent;
  if (formik.values.type === 'sku') {
    typeComponent = (
      <ProductSearchInput
        name={'product'}
        value={formik.values.product}
        placeholder={'Search by name, description, slug, or sku.'}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    );
  } else if (formik.values.type === 'flag') {
    typeComponent = (
      <TextInput
        name={'flag'}
        value={formik.values.flag || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    );
  } else {
    typeComponent = (
      <CategorySearchInput
        name={'category'}
        value={formik.values.category}
        placeholder={'Search'}
      />
    );
  }

  let criteriaComponent;
  if (formik.values.criteria === 'quantity') {
    criteriaComponent = (
      <NumberInput
        name="quantity"
        value={formik.values.quantity || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    );
  } else if (formik.values.criteria === 'money') {
    criteriaComponent = (
      <MoneyInput
        value={formik.values.selectedTotalValue}
        onChange={formik.handleChange}
        name={'selectedTotalValue'}
        onBlur={formik.handleBlur}
        currencies={currencies}
      />
    );
  } else {
    criteriaComponent = (
      <TextInput
        name={'totalValue'}
        value={formik.values.totalValue || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    );
  }

  return (
    <FormikProvider value={formik}>
      <Spacings.Stack scale={'m'}>
        <Text.Headline as="h2">Product Limits: </Text.Headline>
        <Grid
          gridGap="16px"
          gridAutoColumns="1fr"
          gridTemplateColumns="repeat(5, 1fr)"
          alignItems={'center'}
        >
          <Grid.Item>
            <Text.Body>Type:</Text.Body>
          </Grid.Item>
          <Grid.Item>
            <Text.Body>Equals:</Text.Body>
          </Grid.Item>
          <Grid.Item>
            <Text.Body>Criteria:</Text.Body>
          </Grid.Item>
          <Grid.Item>
            <Text.Body>{'Quantity:'}</Text.Body>
          </Grid.Item>
          <Grid.Item></Grid.Item>
          <Grid.Item>
            <SelectInput
              value={formik.values.type}
              options={[
                { label: 'SKU', value: 'sku' },
                { label: 'Category', value: 'category' },
                { label: 'Flag', value: 'flag' },
              ]}
              name="type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></SelectInput>
          </Grid.Item>
          <Grid.Item>{typeComponent}</Grid.Item>
          <Grid.Item>
            <SelectInput
              options={[
                { label: 'Max number of Items', value: 'quantity' },
                { label: 'Max total Value', value: 'value' },
                { label: 'Amount', value: 'money' },
              ]}
              name={'criteria'}
              value={formik.values.criteria}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></SelectInput>
          </Grid.Item>
          <Grid.Item>{criteriaComponent}</Grid.Item>
          <Grid.Item>
            <PrimaryButton
              label={`Add `}
              type="button"
              size="big"
              isDisabled={!formik.dirty}
              onClick={formik.submitForm}
            ></PrimaryButton>
          </Grid.Item>
        </Grid>
      </Spacings.Stack>
    </FormikProvider>
  );
};

export default QuotaManagerProductList;
