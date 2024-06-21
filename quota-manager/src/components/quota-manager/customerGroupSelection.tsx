import Text from '@commercetools-uikit/text';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { useCustomerGroupsFetcher } from '../../hooks/useCustomerGroup';
import SelectField from '@commercetools-uikit/select-field';

interface CustomerGroupsSelectionProps {
  setCustomerSelection: (group: string) => void;
  customerSelection: string;
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

  return (
    <SelectField
      title="Select a Customer Group:"
      isClearable={true}
      placeholder={'All Customers'}
      value={customerSelection}
      options={customerGroups.results.map((group) => {
        return {
          value: group.id,
          label: group.name,
        };
      })}
      onChange={(event) => {
        setCustomerSelection(event?.target.value as string);
      }}
    />
  );
};

export default CustomerGroupsSelection;
