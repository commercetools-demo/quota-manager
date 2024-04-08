/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import createHttpUserAgent from '@commercetools/http-user-agent';
import axios from 'axios';

const userAgent = createHttpUserAgent({
  name: 'axios-client',
  version: '1.0.0',
  contactEmail: 'support@my-company.com',
});

const useShoppingLists = (): any => {
  const createShoppingList = async (
    shoppingList: any,
    config = { headers: {} }
  ) => {
    try {
      const data = await executeHttpClientRequest(
        async (options) => {
          const res = await axios(
            buildApiUrl('/chanel-rfp-042024/shopping-lists'),
            {
              ...config,
              method: 'post',
              data: shoppingList,
              headers: options.headers,
              withCredentials: options.credentials === 'include',
            }
          );

          return {
            data: res.data,
            statusCode: res.status,
            getHeader: (key) => res.headers[key],
          };
        },
        { userAgent, headers: config.headers }
      );
      return data;
    } catch (error) {
      //@ts-ignore
      //console.log(error?.response?.data);
      //@ts-ignore
      return error?.response?.data;
    }
  };

  const getShoppingLists = async (config = { headers: {} }) => {
    const data = await executeHttpClientRequest(
      async (options) => {
        const res = await axios(
          buildApiUrl('/chanel-rfp-042024/shopping-lists'),
          {
            ...config,
            headers: options.headers,
            withCredentials: options.credentials === 'include',
          }
        );
        return {
          data: res.data,
          statusCode: res.status,
          getHeader: (key) => res.headers[key],
        };
      },
      { userAgent, headers: config.headers }
    );
    return data;
  };

  const deleteShoppingListById = async (
    id: any,
    version: any,
    config = { headers: {} }
  ) => {
    try {
      const data = await executeHttpClientRequest(
        async (options) => {
          const res = await axios(
            buildApiUrl(
              `/chanel-rfp-042024/shopping-lists/${id}?version=${version}`
            ),
            {
              ...config,
              method: 'delete',
              headers: options.headers,
              withCredentials: options.credentials === 'include',
            }
          );

          return {
            data: res.data,
            statusCode: res.status,
            getHeader: (key) => res.headers[key],
          };
        },
        { userAgent, headers: config.headers }
      );
      return data;
    } catch (error) {
      //@ts-ignore
      //console.log(error?.response?.data);
      //@ts-ignore
      return error?.response?.data;
    }
  };

  return { createShoppingList, getShoppingLists, deleteShoppingListById };
};

export default useShoppingLists;
