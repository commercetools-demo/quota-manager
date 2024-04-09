/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import TextInput from '@commercetools-uikit/text-input';
import SelectInput from '@commercetools-uikit/select-input';
import StoreSelector from './storeSelector';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { PageContentNarrow } from '@commercetools-frontend/application-components';
import useCategories from '../../hooks/useCategories';
import useCustomObjects from '../../hooks/useCustomObjects';
import CheckboxInput from '@commercetools-uikit/checkbox-input';

import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
  NOTIFICATION_KINDS_PAGE,
} from '@commercetools-frontend/constants';

const QuotaManager: React.FC = () => {
  const { getCategories } = useCategories();
  const { createCustomObject, getCustomObjectsByStore } = useCustomObjects();

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function retrieveCategories() {
      try {
        const result = await getCategories();

        result.results.map((category: any) => {
          setCategories((categories: any) => [
            ...categories,
            { value: category, label: category.name['en-US'] },
          ]);
        });
      } catch (error) {
        //console.log(error);
      }
    }
    retrieveCategories();
  }, []);

  const [stSelection, setStSelection] = useState<any>();
  const [cartLimit, setCartLimit] = useState<any>('');
  const [samplesLimit, setSamplesLimit] = useState<any>('');
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [criteria, setCriteria] = useState<any>();
  const [totalValue, setTotalValue] = useState<any>('');
  const [flag, setFlag] = useState<any>();
  const [sku, setSku] = useState<any>();
  const [type, setType] = useState<any>('');
  const [customerGroup, setCustomerGroup] = useState<any>();
  const [isEmployee, setIsEmployee] = useState<boolean>(true);

  const [productLimits, setProductLimits] = useState<any[]>([]);
  const showNotification = useShowNotification();

  const clearRules = () => {
    setCartLimit('');
    setSamplesLimit('');
    setSelectedCategory('');
    setCriteria('');
    setTotalValue('');
    setFlag('');
    setSku('');
    setType('');
    setCustomerGroup('');
    setProductLimits([]);
  };

  const clearAll = () => {
    clearRules();
    setStSelection('');
  };

  useMemo(() => {
    async function retrieveCategories() {
      let objectKey = 'general-cart-rules';
      try {
        if (isEmployee) {
          objectKey = 'employee-cart-rules';
        }
        const result = await getCustomObjectsByStore(
          objectKey,
          stSelection?.key
        );

        setCartLimit(result.value.maximumCartValue || '');
        setSamplesLimit(result.value.maxSamples || '');
        setProductLimits(result.value.productRules || '');

        console.log(result);
      } catch (error) {
        //console.log(error);
      }
    }

    retrieveCategories();
  }, [stSelection, isEmployee]);

  return (
    <>
      <PageContentNarrow>
        <div className="pb-5">
          <Text.Headline as="h1">Quota Management Page</Text.Headline>
        </div>
        <StoreSelector setSelection={setStSelection} selection={stSelection} />
        {stSelection ? (
          <div className="pt-5">
            <Text.Headline as="h2">
              Quota configuration for {stSelection?.name['en-US']}
            </Text.Headline>
            <div className="pt-5">
              <CheckboxInput
                onChange={() => setIsEmployee(!isEmployee)}
                isChecked={isEmployee}
              >
                Quota configuration for Employees
              </CheckboxInput>
            </div>
            <div>
              <div className="flex items-center mt-5">
                <Text.Body> Max cart total Value: </Text.Body>
                <div className="mx-5 w-20">
                  <TextInput
                    value={cartLimit}
                    onChange={(event) => {
                      if (event.target.value.length === 0) {
                        setCartLimit('');
                      } else {
                        setCartLimit(event.target.value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center mt-5">
                <Text.Body> Max qty of Samples allowed: </Text.Body>
                <div className="mx-5 w-20">
                  <TextInput
                    value={samplesLimit}
                    onChange={(event) => {
                      if (event.target.value.length === 0) {
                        setSamplesLimit('');
                      } else {
                        setSamplesLimit(event.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Text.Headline as="h2">Product Limits: </Text.Headline>
            </div>
            <div className="grid-flow-col grid-cols-4 gap-4 items-center mt-5">
              <div className="grid grid-cols-subgrid gap-4">
                <div className="col-start-1 w-100 mr-8">
                  <Text.Body>Type:</Text.Body>
                </div>
                <div className="col-start-2 w-100">
                  <Text.Body>Equals:</Text.Body>
                </div>
                <div className="col-start-3 w-100">
                  <Text.Body>Criteria:</Text.Body>
                </div>
                <div className="col-start-4 w-100">
                  <Text.Body>Value:</Text.Body>
                </div>
              </div>
            </div>
            <div className="grid-flow-col grid-cols-4 gap-4 items-center mt-5">
              <div className="grid grid-cols-subgrid gap-4">
                <div className="col-start-1 w-100">
                  <SelectInput
                    value={type}
                    options={[
                      { label: 'SKU', value: 'sku' },
                      { label: 'Category', value: 'category' },
                      { label: 'Flag', value: 'flag' },
                    ]}
                    onChange={(event) => {
                      setType(event?.target.value);
                    }}
                  ></SelectInput>
                </div>
                <div className="col-start-2  w-100">
                  {type === 'sku' || type?.length < 1 ? (
                    <TextInput
                      value={sku}
                      onChange={(event) => {
                        if (event.target.value.length === 0) {
                          setSku('');
                        } else {
                          setSku(event.target.value);
                        }
                      }}
                    />
                  ) : (
                    <>
                      {type === 'flag' ? (
                        <TextInput
                          value={flag}
                          onChange={(event) => {
                            if (event.target.value.length === 0) {
                              setFlag(null);
                            } else {
                              setFlag(event.target.value);
                            }
                          }}
                        />
                      ) : (
                        <SelectInput
                          value={selectedCategory}
                          options={categories}
                          onChange={(event) => {
                            setSelectedCategory(event?.target.value);
                          }}
                        ></SelectInput>
                      )}
                    </>
                  )}
                </div>
                <div className="col-start-3  w-100">
                  <SelectInput
                    value={criteria}
                    options={[
                      { label: 'Max number of Items', value: 'quantity' },
                      { label: 'Max total Value', value: 'value' },
                    ]}
                    onChange={(event) => {
                      setCriteria(event.target.value);
                    }}
                  ></SelectInput>
                </div>
                <div className="col-start-4 w-100">
                  <TextInput
                    value={totalValue}
                    onChange={(event) => {
                      if (event.target.value.length === 0) {
                        setTotalValue('');
                      } else {
                        setTotalValue(event.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <PrimaryButton
                style={{ width: 100, textAlign: 'justify', marginTop: 10 }}
                label="Add Rule"
                type="button"
                size="big"
                isDisabled={totalValue === ''}
                onClick={() => {
                  setProductLimits((productLimits: any) => [
                    ...productLimits,
                    {
                      type: type,
                      equals: sku ||
                        flag || {
                          categoryId: selectedCategory.id,
                          categoryName: selectedCategory.name,
                        },
                      criteria: criteria,
                      value: totalValue,
                    },
                  ]);
                  setType('');
                  setSku('');
                  setSelectedCategory('');
                  setCriteria('');
                  setTotalValue('');
                  setFlag('');
                }}
              />
            </div>

            <Text.Headline as="h2">Configured Rules: </Text.Headline>
            <div className="mt-5">
              {cartLimit > 0 ? (
                <p>
                  The max total value for the whole cart is <b>{cartLimit}</b>
                </p>
              ) : null}

              {samplesLimit !== '' ? (
                <p>
                  The max quantity of sample Items on cart is{' '}
                  <b>{samplesLimit}</b>
                </p>
              ) : null}
              {productLimits.map((rule: any) => (
                <p key={rule.index}>
                  The max <b>{rule.criteria} </b>for products with{' '}
                  <b>
                    {rule.type} ={' '}
                    {rule.equals.categoryName ? (
                      <>{rule.equals.categoryName['en-US']}</>
                    ) : (
                      <>{rule.equals}</>
                    )}
                  </b>{' '}
                  is <b>{rule.value}</b>
                </p>
              ))}

              <div className="flex gap-4">
                <PrimaryButton
                  style={{ width: 220, textAlign: 'justify', marginTop: 10 }}
                  label="Create Quota Configuration"
                  type="button"
                  size="big"
                  isDisabled={cartLimit === '' && productLimits.length <= 0}
                  onClick={() => {
                    createCustomObject({
                      container: `${
                        isEmployee
                          ? 'employee-cart-rules'
                          : 'general-cart-rules'
                      }`,
                      key: stSelection?.key,
                      value: {
                        customerGroup: customerGroup,
                        maximumCartValue: cartLimit,
                        maxSamples: samplesLimit,
                        productRules: productLimits,
                      },
                    }).then((response: any) => {
                      if (response.statusCode) {
                        showNotification({
                          kind: NOTIFICATION_KINDS_PAGE.error,
                          domain: DOMAINS.PAGE,
                          text: response.message,
                        });
                      } else {
                        showNotification({
                          kind: NOTIFICATION_KINDS_SIDE.success,
                          domain: DOMAINS.SIDE,
                          text: `Configuration created for ${stSelection?.name['en-US']}`,
                        });
                      }
                    });
                    clearAll();
                  }}
                />

                <PrimaryButton
                  style={{ width: 110, textAlign: 'justify', marginTop: 10 }}
                  label="Clear Rules"
                  type="button"
                  size="big"
                  isDisabled={cartLimit === '' && productLimits.length <= 0}
                  onClick={() => {
                    clearRules();
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </PageContentNarrow>
    </>
  );
};

export default QuotaManager;
