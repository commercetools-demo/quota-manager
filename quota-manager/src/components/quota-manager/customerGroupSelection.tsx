import SelectInput from '@commercetools-uikit/select-input';
import Text from '@commercetools-uikit/text';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { useCustomerGroupsFetcher } from '../../hooks/useCustomerGroup';

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
    <>
      {customerGroups ? (
        <>
          <div className=" py-5">
            <Text.Headline as="h2">Select a Customer Group: </Text.Headline>
          </div>
          <SelectInput
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
          ></SelectInput>
        </>
      ) : null}
    </>
  );
};

export default CustomerGroupsSelection;
