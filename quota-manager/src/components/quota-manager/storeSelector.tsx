/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import SelectInput from '@commercetools-uikit/select-input';
import useStores from '../../hooks/useStores';
import Text from '@commercetools-uikit/text';

interface StoreSelectorProps {
  setSelection: any;
  selection: any;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  setSelection,
  selection,
}) => {
  const [stores, setStores] = useState<any>([]);

  const { getStores } = useStores();

  useEffect(() => {
    async function retrieveStores() {
      try {
        const result = await getStores();

        result.results.map((stResult: any) => {
          setStores((stores: any) => [
            ...stores,
            { value: stResult, label: stResult.name['en-US'] },
          ]);
        });
      } catch (error) {}
    }
    retrieveStores();
  }, []);

  return (
    <>
      {stores ? (
        <>
          <div className=" pb-5">
            <Text.Headline as="h2">Select a Store: </Text.Headline>
          </div>
          <SelectInput
            value={selection}
            options={stores}
            onChange={(event) => {
              setSelection(event?.target.value);
            }}
          ></SelectInput>
        </>
      ) : null}
    </>
  );
};

export default StoreSelector;
