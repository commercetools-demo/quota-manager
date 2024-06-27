import Text from '@commercetools-uikit/text';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { useCustomerGroupsFetcher } from '../../hooks/useCustomerGroups';
import SelectField from '@commercetools-uikit/select-field';

interface CustomerGroupsSelectionProps {
  setCustomerSelection: (group: string) => void;
  customerSelection: string | undefined;
}

const CustomerGroupsSelection: React.FC<CustomerGroupsSelectionProps> = ({
  setCustomerSelection,
  customerSelection,
}) => {
  const { customerGroups, error, loading } = useCustomerGroupsFetcher({
    limit: 100,
    offset: 0,
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
  if (!customerGroups || customerGroups.count < 1) {
    return <PageNotFound />;
  }

  const options = [
    {
      value: 'general',
      label: 'All Customers',
    },
  ];

  return (
    <SelectField
      title="Select a Customer Group:"
      isClearable={true}
      value={customerSelection}
      options={options.concat(
        customerGroups.results.map((group) => {
          return {
            value: group.key || group.id,
            label: group.name,
          };
        })
      )}
      onChange={(event) => {
        setCustomerSelection(event?.target.value as string);
      }}
    />
  );
};

export default CustomerGroupsSelection;
