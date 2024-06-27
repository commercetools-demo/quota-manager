import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import CategorySearch from './category-search.graphql';
import CategoryById from './category-by-id.graphql';
import {
  TCategory,
  TQuery,
  TQuery_CategoryArgs,
} from '../../types/generated/ctp';
import { OptionProps, SingleValueProps } from 'react-select';
import { SearchIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { useFormikContext } from 'formik';

export interface CategoryValue extends Record<string, unknown> {
  id?: string;
  name: string;
  key?: string | null;
}

const localizePath = (category: TCategory, showProductCount = false) => {
  let path = category.ancestors
    .map((ancestor) => ancestor.name)
    .concat([category.name])
    .join(' > ');
  if (showProductCount) {
    path = `${path} (${category.stagedProductCount})`;
  }
  return path;
};

export const CategorySearchSingleValue: FC<SingleValueProps<CategoryValue>> = (
  props
) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const { data, loading, error } = useQuery<
    TQuery,
    { locale: string } & TQuery_CategoryArgs
  >(CategoryById, {
    variables: {
      id: props.data.id,
      locale: dataLocale,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  if (!props.data || !props.data.id) {
    return <AsyncSelectInput.SingleValue {...props} />;
  }
  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }
  if (!data?.category) {
    return <PageNotFound />;
  }

  return (
    <AsyncSelectInput.SingleValue {...props}>
      {localizePath(data.category, true)}
    </AsyncSelectInput.SingleValue>
  );
};

const CategorySearchOption: FC<OptionProps<CategoryValue>> = (props) => {
  return (
    <AsyncSelectInput.Option {...props}>
      <Spacings.Stack scale="xs">
        <Text.Detail isBold>{props.data.name}</Text.Detail>
      </Spacings.Stack>
    </AsyncSelectInput.Option>
  );
};

type Props = {
  name: string;
  value?: CategoryValue | null;
  placeholder?: string;
  showProductCount?: boolean;
  hasError?: boolean;
};

const CategorySearchInput: FC<Props> = ({
  name,
  value,
  placeholder,
  showProductCount = false,
  hasError,
}) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const formik = useFormikContext();
  const { refetch } = useQuery<
    { categories: { results: Array<TCategory> } },
    {
      limit: number;
      offset: number;
      fullText?: { locale: string; text: string };
      locale: string;
    }
  >(CategorySearch, {
    skip: true,
    variables: {
      limit: 20,
      offset: 0,
      locale: dataLocale,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  const loadOptions = (text: string) =>
    refetch({
      fullText: { locale: dataLocale, text },
    }).then((response) => {
      return response.data.categories.results.map((category): CategoryValue => {
        return {
          id: category.id,
          name: localizePath(category, showProductCount),
          key: category.key,
        };
      });
    });
  return (
    <AsyncSelectInput
      name={name}
      value={{ ...value }}
      placeholder={placeholder}
      isClearable
      isSearchable
      cacheOptions={20}
      loadOptions={loadOptions}
      components={{
        // @ts-ignore
        SingleValue: CategorySearchSingleValue,
        // @ts-ignore
        Option: CategorySearchOption,
        DropdownIndicator: () => <SearchIcon color="primary" />,
      }}
      hasError={hasError}
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
    />
  );
};
CategorySearchInput.displayName = 'CategorySearchInput';

export default CategorySearchInput;
