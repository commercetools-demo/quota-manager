/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import SelectInput from '@commercetools-uikit/select-input';
import useCustomerGroups from '../../hooks/useCustomerGroups';
import Text from '@commercetools-uikit/text';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

interface CustomerGroupsSelectionProps {
  setCustomerSelection: any;
  customerSelection: any;
}

const CustomerGroupsSelection: React.FC<CustomerGroupsSelectionProps> = ({
  setCustomerSelection,
  customerSelection,
}) => {
  const [customerGroups, setCustomerGroups] = useState<any>([
    {
      value: { key: 'general', name: 'All Customers' },
      label: 'All Customers',
    },
  ]);

  const applicationContext = useApplicationContext();

  const { getCustomerGroups } = useCustomerGroups(
    applicationContext!.project!.key
  );

  useEffect(() => {
    async function retrieveCustomerGroups() {
      try {
        const result = await getCustomerGroups();

        result.results.forEach((cgResult: any) => {
          setCustomerGroups((customerGroups: any) => [
            ...customerGroups,
            {
              value: { key: cgResult.key, name: cgResult.name },
              label: cgResult.name,
            },
          ]);
        });
      } catch (error) {}
    }
    retrieveCustomerGroups();
  }, []);

  return (
    <>
      {customerGroups ? (
        <>
          <div className=" py-5">
            <Text.Headline as="h2">Select a Customer Group: </Text.Headline>
          </div>
          <SelectInput
            value={customerSelection}
            options={customerGroups}
            onChange={(event) => {
              setCustomerSelection(event?.target.value);
            }}
          ></SelectInput>
        </>
      ) : null}
    </>
  );
};

export default CustomerGroupsSelection;
