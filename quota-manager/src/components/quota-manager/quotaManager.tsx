/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import TextInput from '@commercetools-uikit/text-input';
import SelectInput from '@commercetools-uikit/select-input';
import StoreSelector from './storeSelector';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { PageContentNarrow } from '@commercetools-frontend/application-components';
import useCategories from '../../hooks/useCategories';
import useCustomObjects from '../../hooks/useCustomObjects';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import MoneyInput from '@commercetools-uikit/money-input';

import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
  NOTIFICATION_KINDS_PAGE,
} from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import CustomerGroupsSelection from './customerGroupSelection';

const QuotaManager: React.FC = () => {
  const applicationContext = useApplicationContext();

  const { getCategories } = useCategories(applicationContext!.project!.key);
  const {
    createCustomObject,
    getCustomObjectsByStore,
    deleteCustomObjectsByStore,
  } = useCustomObjects(applicationContext!.project!.key);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function retrieveConfiguration() {
      try {
        const result = await getCategories();

        result.results.forEach((category: any) => {
          setCategories((categories: any) => [
            ...categories,
            { value: category, label: category.name['en-US'] },
          ]);
        });
      } catch (error) {}
    }
    retrieveConfiguration();
  }, []);

  const moneyInitialValue = { amount: '', currencyCode: '' };
  const [stSelection, setStSelection] = useState<any>();
  const [cgSelection, setCgSeletion] = useState<any>();
  const [cartLimits, setcartLimits] = useState<any[]>([]);
  const [samplesLimit, setSamplesLimit] = useState<any>('');
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [criteria, setCriteria] = useState<any>();
  const [totalValue, setTotalValue] = useState<any>('');
  const [flag, setFlag] = useState<any>();
  const [sku, setSku] = useState<any>();
  const [type, setType] = useState<any>('');
  const [customerGroup, setCustomerGroup] = useState<any>();
  const [removeList, setRemoveList] = useState<any[]>([]);
  const [thereIsQuotaConfigured, setThereIsQuotaConfigured] =
    useState<boolean>(false);
  const [productLimits, setProductLimits] = useState<any[]>([]);
  const [stagingCartLimits, setStagingCartLimits] =
    useState<any>(moneyInitialValue);
  const [cartLimitsCurrenciesConfigured, setCartLimitsCurrenciesConfigured] =
    useState<any[]>([]);
  const [selectedTotalValue, setSelectedTotalValue] =
    useState<any>(moneyInitialValue);
  const showNotification = useShowNotification();
  const clearRules = () => {
    setcartLimits([]);
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
    setCgSeletion('');
    setStSelection('');
  };

  useMemo(() => {
    async function retrieveConfiguration() {
      try {
        const objectKey = `${cgSelection.key}-cart-rules`;

        const result = await getCustomObjectsByStore(
          objectKey,
          stSelection?.key
        );
        if (result.value) {
          setThereIsQuotaConfigured(true);
        }
        if (result.value.maximumCartValue) {
          setCartLimitsCurrenciesConfigured([]);
          result.value.maximumCartValue.forEach((configuredLimit: any) => {
            setCartLimitsCurrenciesConfigured(
              (cartLimitsCurrenciesConfigured) => [
                ...cartLimitsCurrenciesConfigured,
                configuredLimit.currencyCode,
              ]
            );
          });
        }

        setcartLimits(result.value.maximumCartValue || []);
        setSamplesLimit(result.value.maxSamples || '');
        setProductLimits(result.value.productRules || '');
      } catch (error) {
        setCartLimitsCurrenciesConfigured([]);
        setcartLimits([]);
        setSamplesLimit('');
        setProductLimits([]);
        setThereIsQuotaConfigured(false);
      }
    }

    retrieveConfiguration();
  }, [stSelection, cgSelection]);

  const handleAddValueRules = (valueObj: any) => {
    return MoneyInput.convertToMoneyValue(
      valueObj,
      applicationContext?.dataLocale || 'fr_FR'
    );
  };

  const handleDeleteConfiguration = async () => {
    try {
      const objectKey = `${cgSelection.key}-cart-rules`;

      deleteCustomObjectsByStore(objectKey, stSelection?.key).then(
        (response: any) => {
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
              text: `Configuration deleted for ${stSelection?.name['en-US']}`,
            });
          }
        }
      );
    } catch (error) {}
    setThereIsQuotaConfigured(false);
    clearAll();
  };

  const handleDeletionList = (rule: any) => {
    const itemIndex = removeList.indexOf(rule);
    if (itemIndex === -1) {
      setRemoveList([...removeList, rule]);
    } else {
      setRemoveList(removeList.filter((item) => item !== rule));
    }
  };

  const clearSelectedRules = () => {
    const productLimitsToDelete = productLimits.filter(
      (element) => !removeList.includes(element)
    );

    const cartLimitsToDelete = cartLimits.filter(
      (element) => !removeList.includes(element)
    );

    const currenciesToDelete = cartLimitsToDelete.filter(
      (element) => !removeList.includes(element.currencyCode)
    );

    const newConfiguredCurrencies = currenciesToDelete.map((currency) => {
      return currency.currencyCode;
    });

    setProductLimits(productLimitsToDelete);
    setcartLimits(cartLimitsToDelete);
    setCartLimitsCurrenciesConfigured(newConfiguredCurrencies);

    setRemoveList([]);
    console.log(cartLimitsCurrenciesConfigured);
  };

  return (
    <>
      <PageContentNarrow>
        <div className="pb-5">
          <Text.Headline as="h1">Quota Management Page</Text.Headline>
        </div>
        <StoreSelector setSelection={setStSelection} selection={stSelection} />
        <CustomerGroupsSelection
          setCustomerSelection={setCgSeletion}
          customerSelection={cgSelection}
        />
        {stSelection && cgSelection ? (
          <div className="pt-5">
            <Text.Headline as="h2">
              Quota configuration for{' '}
              {stSelection?.name[applicationContext.dataLocale || 'en-US']} -{' '}
              {cgSelection.name}
            </Text.Headline>
            <div>
              <div className="flex items-center mt-5">
                <Text.Body> Maximum cart total value: </Text.Body>
                <div className="mx-5 w-52">
                  <MoneyInput
                    value={stagingCartLimits}
                    onChange={(event) => {
                      if (event?.target?.id?.endsWith('.amount')) {
                        setStagingCartLimits((stagingCartLimits: any) => {
                          return {
                            amount: event.target.value,
                            currencyCode: stagingCartLimits.currencyCode,
                          };
                        });
                      }

                      if (event?.target?.id?.endsWith('.currencyCode'))
                        setStagingCartLimits((stagingCartLimits: any) => {
                          return {
                            amount: stagingCartLimits.amount,
                            currencyCode: event.target.value,
                          };
                        });
                    }}
                    currencies={applicationContext.project?.currencies.filter(
                      (currency) =>
                        cartLimitsCurrenciesConfigured.indexOf(currency) === -1
                    )}
                  />
                </div>
                <div>
                  <PrimaryButton
                    style={{ width: 210, textAlign: 'justify', marginTop: 0 }}
                    label={`Add total for ${stagingCartLimits.currencyCode} currency`}
                    type="button"
                    size="big"
                    isDisabled={
                      !stagingCartLimits.currencyCode ||
                      !stagingCartLimits.amount
                    }
                    onClick={() => {
                      setcartLimits([
                        ...cartLimits,
                        handleAddValueRules(stagingCartLimits),
                      ]);

                      setCartLimitsCurrenciesConfigured([
                        ...cartLimitsCurrenciesConfigured,
                        stagingCartLimits.currencyCode,
                      ]);
                      setStagingCartLimits(moneyInitialValue);
                    }}
                  />
                </div>
              </div>
              {/**   <div className="flex items-center mt-5">
                <Text.Body> Maximum quantity of samples allowed: </Text.Body>
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
              </div>*/}
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
                  <Text.Body>
                    {criteria?.charAt(0).toUpperCase() + criteria?.slice(1) ||
                      'Quantity'}
                  </Text.Body>
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
                  {criteria !== 'value' ? (
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
                  ) : (
                    <MoneyInput
                      value={selectedTotalValue}
                      onChange={(event) => {
                        if (event?.target?.id?.endsWith('.amount')) {
                          setSelectedTotalValue((selectedTotalValue: any) => {
                            return {
                              amount: event.target.value,
                              currencyCode: selectedTotalValue.currencyCode,
                            };
                          });
                        }

                        if (event?.target?.id?.endsWith('.currencyCode'))
                          setSelectedTotalValue((selectedTotalValue: any) => {
                            return {
                              amount: selectedTotalValue.amount,
                              currencyCode: event.target.value,
                            };
                          });
                      }}
                      currencies={applicationContext.project?.currencies}
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <PrimaryButton
                style={{ width: 100, textAlign: 'justify', marginTop: 10 }}
                label="Add Rule"
                type="button"
                size="big"
                isDisabled={!totalValue && !selectedTotalValue.amount}
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
                      value:
                        totalValue || handleAddValueRules(selectedTotalValue),
                    },
                  ]);
                  setType('');
                  setSku('');
                  setSelectedCategory('');
                  setCriteria('');
                  setTotalValue('');
                  setFlag('');
                  setSelectedTotalValue(moneyInitialValue);
                }}
              />
            </div>

            <Text.Headline as="h2">Configured Rules: </Text.Headline>
            <div className="mt-5">
              {cartLimits.length > 0 ? (
                <>
                  {cartLimits.map((cartLimit) => (
                    <>
                      <CheckboxInput
                        key={cartLimit.index}
                        onChange={() => handleDeletionList(cartLimit)}
                        isChecked={removeList.indexOf(cartLimit) !== -1}
                      >
                        <p key={cartLimit.index}>
                          The maximum total value for the whole cart is{' '}
                          <b>
                            {(cartLimit.centAmount / 100).toLocaleString(
                              undefined,
                              {
                                style: 'currency',
                                currency: cartLimit.currencyCode,
                              }
                            )}
                          </b>
                        </p>
                      </CheckboxInput>
                    </>
                  ))}
                </>
              ) : null}
              {/**
              {samplesLimit !== '' ? (
                <p>
                  The maximum quantity of sample Items on cart is{' '}
                  <b>{samplesLimit}</b>
                </p>
              ) : null} */}
              {productLimits.map((rule: any) => (
                <>
                  <CheckboxInput
                    key={rule.index}
                    onChange={() => handleDeletionList(rule)}
                    isChecked={removeList.indexOf(rule) !== -1}
                  >
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
                      is{' '}
                      <b>
                        {rule.criteria === 'quantity' ? (
                          rule.value
                        ) : (
                          <b>
                            {(rule.value.centAmount / 100).toLocaleString(
                              undefined,
                              {
                                style: 'currency',
                                currency: rule.value.currencyCode,
                              }
                            )}
                          </b>
                        )}
                      </b>
                    </p>
                  </CheckboxInput>
                </>
              ))}

              <div className="flex gap-4">
                <SecondaryButton
                  style={{ width: 130, textAlign: 'justify', marginTop: 10 }}
                  label="Clear All Rules"
                  type="button"
                  size="big"
                  isDisabled={
                    cartLimits.length <= 0 && productLimits.length <= 0
                  }
                  onClick={() => {
                    clearRules();
                  }}
                />
                <SecondaryButton
                  style={{ width: 170, textAlign: 'justify', marginTop: 10 }}
                  label="Clear Selected Rules"
                  type="button"
                  size="big"
                  isDisabled={removeList.length <= 0}
                  onClick={() => {
                    clearSelectedRules();
                  }}
                />
              </div>
              <div className="flex gap-4">
                <PrimaryButton
                  style={{ width: 220, textAlign: 'justify', marginTop: 10 }}
                  label={`${
                    thereIsQuotaConfigured ? 'Update' : 'Create'
                  } Quota Configuration`}
                  type="button"
                  size="big"
                  isDisabled={
                    cartLimits.length <= 0 && productLimits.length <= 0
                  }
                  onClick={() => {
                    createCustomObject({
                      container: `${cgSelection?.key}-cart-rules`,
                      key: stSelection?.key,
                      value: {
                        customerGroup: customerGroup,
                        maximumCartValue: cartLimits,
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
                  style={{ width: 215, textAlign: 'justify', marginTop: 10 }}
                  label="Delete Quota Configuration "
                  type="button"
                  size="big"
                  isDisabled={!thereIsQuotaConfigured}
                  onClick={() => {
                    handleDeleteConfiguration();
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
