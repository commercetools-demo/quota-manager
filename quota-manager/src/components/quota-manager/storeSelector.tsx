import Text from '@commercetools-uikit/text';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useStoresFetcher } from '../../hooks/useStores';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import { PageNotFound } from '@commercetools-frontend/application-components';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import SelectField from '@commercetools-uikit/select-field';

interface StoreSelectorProps {
  setSelection: (value: string) => void;
  selection: string | undefined;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  setSelection,
  selection,
}) => {
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));

  const { stores, error, loading } = useStoresFetcher({
    limit: 100,
    offset: 0,
    locale: dataLocale,
  });

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
  if (!stores || stores.count < 1) {
    return <PageNotFound />;
  }

  return (
    <SelectField
      title="Select a Store:"
      value={selection}
      options={stores.results.map((store) => {
        return {
          value: store.key,
          label: formatLocalizedString(
            {
              name: transformLocalizedFieldToLocalizedString(
                store.nameAllLocales ?? []
              ),
            },
            {
              key: 'name',
              locale: dataLocale,
              fallback: store.key,
              fallbackOrder: projectLanguages,
            }
          ),
        };
      })}
      onChange={(event) => {
        setSelection(event?.target.value as string);
      }}
    />
  );
};

export default StoreSelector;
