import CustomError from '../errors/custom.error';
import { Resource } from '../interfaces/resource.interface';
import { logger } from '../utils/logger.utils';
import { Cart, LineItem } from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';
import { CentPrecisionMoney } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export interface ProductValue extends Record<string, unknown> {
  id: number;
  name: string;
  productId: string;
  sku: string;
  image?: string;
}

export interface CategoryValue extends Record<string, unknown> {
  id?: string;
  name: string;
  key?: string | null;
}

type Criteria = 'quantity' | 'value' | 'money';

export type ProductRule = {
  type: 'flag' | 'sku' | 'category';
  criteria: Criteria;
  category?: CategoryValue;
  product?: ProductValue;
  quantity?: number | string;
  totalValue?: CentPrecisionMoney;
  // selectedTotalValue: TValue;
  flag?: string;
};

export type Config = {
  key: string;
  cartLimits?: Array<CentPrecisionMoney>;
  cartLimitsCurrenciesConfigured?: Array<string>;
  productRules?: Array<ProductRule>;
};

// const applySampleRules = (
//   lineItems: Array<LineItem>,
//   maxQty,
//   sampleProductType
// ) => {
//   let count = 0;
//   lineItems.forEach((lineItem) => {
//     if (lineItem?.productType.id === sampleProductType) {
//       count += lineItem.quantity;
//     }
//   });
//
//   logger.info('Samples Quantity Validation:');
//   logger.info('Max Qty: ', maxQty);
//   logger.info('Quantity on Cart:', count);
//   logger.info('Quota exceeded? ', count > maxQty);
//   return count > maxQty;
// };
//
// const applyCategoryRules = async (
//   lineItems: Array<LineItem>,
//   categoryId,
//   criteria,
//   totalValue
// ) => {
//   const wantedCategoryId = categoryId;
//
//   const fetchPromises = lineItems.map(async (lineItem) => {
//     const response = await fetchCt(`products/${lineItem.productId}`, {
//       method: 'GET',
//     });
//     const responseData = await response.json();
//     return {
//       lineItem: lineItem,
//       categories: responseData.masterData?.current?.categories,
//     };
//   });
//   let errorFound = false;
//   const result = await Promise.all(fetchPromises)
//     .then((promises) => {
//       logger.info('Category Quantity Validation');
//       let lineQty = 0;
//       let lineTtlValue = 0;
//       let currency = '';
//       promises.forEach((promise) => {
//         promise.categories.forEach((category) => {
//           if (category.id === wantedCategoryId) {
//             lineQty += promise.lineItem.quantity;
//             lineTtlValue += promise.lineItem.totalPrice.centAmount;
//             currency = promise.lineItem.totalPrice.currencyCode;
//           }
//         });
//       });
//       if (criteria === 'quantity') {
//         logger.info('Category Quantity Validation - Line Item qty:');
//         logger.info('Max value: ', totalValue);
//         logger.info('LineItem Qty:', lineQty);
//         logger.info('Quota exceeded? ', lineQty > totalValue);
//         if (lineQty > totalValue) {
//           return true;
//         }
//       } else if (criteria === 'value') {
//         logger.info(
//           'Checking if LineItem has value on currency ',
//           totalValue.currencyCode
//         );
//         if (currency === totalValue.currencyCode) {
//           logger.info('Category Value Validation - Line Item Value:');
//           logger.info('Max value: ', totalValue);
//           logger.info('LineItems Value:', lineTtlValue);
//           logger.info('Quota exceeded? ', lineTtlValue > totalValue.centAmount);
//           if (lineTtlValue > totalValue.centAmount) {
//             return true;
//           }
//         } else {
//           logger.info(
//             'No entries for currency ',
//             totalValue.currencyCode,
//             ' found. Skipping...'
//           );
//           return false;
//         }
//       }
//     })
//     .catch((error) => {
//       logger.error('Error fetching categories:', error);
//     });
//
//   return result;
// };

const applySKURules = (
  lineItems: Array<LineItem>,
  sku: string | undefined,
  criteria: Criteria,
  totalValue?: CentPrecisionMoney,
  quantity?: number | string
) => {
  let count = 0;
  let value: CentPrecisionMoney | undefined;

  lineItems.forEach((lineItem) => {
    if (lineItem?.variant.sku === sku) {
      if (criteria === 'quantity') {
        count += lineItem.quantity;
      }
      if (criteria === 'value') {
        value = lineItem.totalPrice;
      }
    }
  });

  if (criteria === 'value' && value !== undefined) {
    logger.info(
      'Checking if SKU ',
      sku,
      ' has value on currency ',
      totalValue?.currencyCode
    );
    if (totalValue?.currencyCode === value.currencyCode) {
      logger.info('SKU Maximum Value Validation:');
      logger.info('Max Value: ', totalValue);
      logger.info('Value on cart:', value);
      logger.info(
        'Value Quota exceeded? ',
        value.centAmount > totalValue.centAmount
      );
      return value.centAmount > totalValue.centAmount;
    } else {
      logger.info(
        'No entries for currency ',
        totalValue?.currencyCode,
        ' found. Skipping...'
      );
      return false;
    }
  } else if (criteria === 'quantity' && quantity) {
    const converted =
      typeof quantity === 'number' ? quantity : parseInt(quantity);
    logger.info('SKU Maximum Quantity Validation:');
    logger.info('Max Quantity: ', quantity);
    logger.info('Qty on cart:', count);
    logger.info('Quota exceeded? ', converted);
    return count > converted;
  }
  return true;
};

// const applyFlagRules = (
//   lineItems: Array<LineItem>,
//   equals,
//   criteria,
//   totalValue
// ) => {
//   let count = 0;
//   let value = null;
//   let hasError = false;
//
//   lineItems.forEach((lineItem) => {
//     const flags = lineItem.variant.attributes.find(
//       (attribute) => attribute.name === 'flags'
//     );
//
//     if (flags?.value.find((flag) => flag === equals)) {
//       if (criteria === 'quantity') {
//         count += lineItem.quantity;
//       }
//       if (criteria === 'value') {
//         value += lineItem.totalPrice.centAmount;
//       }
//     }
//   });
//
//   if (value !== null) {
//     logger.info(
//       'Checking if LineItem has value on currency ',
//       totalValue.currencyCode
//     );
//     if (totalValue.currencyCode === value.currencyCode) {
//       logger.info('Flag Maximum Value Validation:');
//       logger.info('Max Value: ', totalValue);
//       logger.info('Value on cart:', value);
//       logger.info('Quota exceeded? ', value > totalValue.centAmount);
//       hasError = value > totalValue.centAmount;
//     }
//   } else {
//     logger.info(
//       'No entries for currency ',
//       totalValue.currencyCode,
//       ' found. Skipping...'
//     );
//     return false;
//   }
//
//   if (count > 0) {
//     logger.info('Flag Maximum Quantity Validation:');
//     logger.info('Max Quantity: ', totalValue);
//     logger.info('Qty on cart:', count);
//     logger.info('Quota exceeded? ', count > totalValue * 100);
//     hasError = count > totalValue;
//   }
//   return hasError;
// };

const getCustomerBasedObjectKey = async (
  customerId: string | undefined,
  apiRoot: ByProjectKeyRequestBuilder
) => {
  let objectKey = 'general';
  if (customerId) {
    const loadedCustomerGroupKey = await apiRoot
      .customers()
      .withId({ ID: customerId })
      .get({ queryArgs: { expand: ['customerGroup'] } })
      .execute()
      .then((response) => {
        return response.body.customerGroup?.obj?.key;
      });
    if (loadedCustomerGroupKey) {
      objectKey = loadedCustomerGroupKey;
    }
  }
  return objectKey;
};

const loadConfig = async (
  objectKey: string,
  storeKey: string,
  apiRoot: ByProjectKeyRequestBuilder
) => {
  let response = undefined;
  try {
    logger.info(
      `Fetching rules for customer-group: ${objectKey} and store: ${storeKey}`
    );
    response = await apiRoot
      .customObjects()
      .withContainerAndKey({
        container: `${objectKey}-cart-rules`,
        key: storeKey,
      })
      .get()
      .execute()
      .then((response) => {
        //logger.info(response);
        return response.body;
      });
  } catch (error) {
    logger.error(error);
  }

  if (!response) {
    logger.info(`Couldn't find rules for ${objectKey}.`);
    logger.info('Fetching rules for All Customers');
    try {
      response = await apiRoot
        .customObjects()
        .withContainerAndKey({
          container: `general-cart-rules`,
          key: storeKey,
        })
        .get()
        .execute()
        .then((response) => {
          return response.body;
        });
    } catch (error) {
      logger.info('No rules found... skipping');
    }
  }
  return response;
};

export const cartController = async (action: string, resource: Resource) => {
  logger.info('Cart Action: ' + action);
  switch (action) {
    case 'Update': {
      logger.info('Cart update executed', resource);
      const cart: Cart = resource.obj;
      const storeKey = cart.store?.key;
      const customerId = cart.customerId;
      const lineItems = cart.lineItems;
      if (storeKey) {
        const apiRoot = createApiRoot();
        const objectKey = await getCustomerBasedObjectKey(customerId, apiRoot);

        const response = await loadConfig(objectKey, storeKey, apiRoot);

        if (!response) {
          logger.info('Found no rules for quotas for store ', storeKey);
          return { statusCode: 200 };
        }
        const config: Config = response.value;

        // const maxSamples = '';

        let errorFound = false;
        let ruleFlag = null;

        if (config.cartLimits) {
          logger.info('Cart Maximum value Validation:');
          logger.info('Max Cart values: ', config.cartLimits);
          logger.info('Cart Total Value:', cart.totalPrice);
          config.cartLimits.map((maxCartRule) => {
            if (cart.totalPrice.currencyCode === maxCartRule.currencyCode) {
              if (cart.totalPrice.centAmount > maxCartRule.centAmount) {
                errorFound = true;
                ruleFlag = { criteria: 'value' };
              }
            }
          });
        }

        // if (!errorFound && maxSamples) {
        //   logger.info('Samples validation:');
        //   ruleFlag = {
        //     type: 'samples',
        //     criteria: 'quantity',
        //     equals: 'Samples',
        //   };
        //   errorFound = applySampleRules(
        //     lineItems,
        //     maxSamples,
        //     '600388e2-0976-493e-929d-91800b0b3207'
        //   );
        // }

        let productErrorFound = false;

        if (!errorFound && config.productRules) {
          for (const rule of config.productRules) {
            if (!productErrorFound) {
              ruleFlag = rule;
              if (rule.type === 'sku') {
                logger.info(rule);
                productErrorFound = applySKURules(
                  lineItems,
                  rule.product?.sku,
                  rule.criteria,
                  rule.totalValue,
                  rule.quantity
                );
              }
              // if (rule.type === 'category') {
              //   ruleFlag = {
              //     type: rule.type,
              //     value: rule.category?.id,
              //     criteria: rule.criteria,
              //     equals: rule.equals.categoryName['en-US'],
              //   };
              //   await new Promise<void>((resolve, reject) => {
              //     applyCategoryRules(
              //       lineItems,
              //       rule.equals.categoryId,
              //       rule.criteria,
              //       rule.value
              //     )
              //       .then((result) => {
              //         logger.info(result);
              //         // productErrorFound = result;
              //         resolve();
              //       })
              //       .catch((error) => reject(error));
              //   });
              // }
              logger.info('Error found:');
              logger.info(productErrorFound);
              // if (rule.type === 'flag') {
              //   ruleFlag = rule;
              //   productErrorFound = applyFlagRules(
              //     lineItems,
              //     rule.equals,
              //     rule.criteria,
              //     rule.value
              //   );
              // }
            }
          }
          errorFound = productErrorFound;
        }

        if (errorFound) {
          throw new CustomError(400, 'InvalidInput', [
            {
              statusCode: 400,
              message: `The maximum total ${ruleFlag?.criteria} allowed ${
                ruleFlag?.type
                  ? `for ${ruleFlag?.type} = ${ruleFlag}` //?.equals
                  : `for cart`
              } has been exceeded.`,
            },
          ]);
        }
      }
      return { statusCode: 200 };
    }

    default:
      throw new CustomError(
        500,
        `Internal Server Error - Resource not recognized. Allowed values are 'Create' or 'Update'.`
      );
  }
};
