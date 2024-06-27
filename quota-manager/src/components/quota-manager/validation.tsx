import { FormikErrors } from 'formik';
import omitEmpty from 'omit-empty-es';
import { TMoneyValue } from '@commercetools-uikit/money-input/dist/declarations/src/money-input';
import { FormProps } from '../quota-manager-product-list/quota-manager-product-list';

export type TErrors = {};

export const validate = (): FormikErrors<Config> => {
  const errors: TErrors = {};

  return omitEmpty<FormikErrors<Config>, TErrors>(errors);
};

export type Config = {
  key: string;
  cartLimits?: Array<TMoneyValue>;
  cartLimitsCurrenciesConfigured?: Array<string>;
  productRules?: Array<FormProps>;
};
