import { FormikErrors } from 'formik';
import omitEmpty from 'omit-empty-es';
import { Config } from './quota-manager-list';

export type TErrors = {};

export const validate = (): FormikErrors<Config> => {
  const errors: TErrors = {};

  return omitEmpty<FormikErrors<Config>, TErrors>(errors);
};
