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

const useCustomObjects = (projectKey: string): any => {
  const getCustomObjectsByStore = async (
    container: any,
    key: any,
    config = { headers: {} }
  ) => {
    const data = await executeHttpClientRequest(
      async (options) => {
        const res = await axios(
          buildApiUrl(`/${projectKey}/custom-objects/${container}/${key}`),
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

  const createCustomObject = async (
    cartRules: any,
    config = { headers: {} }
  ) => {
    try {
      const data = await executeHttpClientRequest(
        async (options) => {
          const res = await axios(
            buildApiUrl(`/${projectKey}/custom-objects`),
            {
              ...config,
              method: 'post',
              data: cartRules,
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
      return error?.response?.data;
    }
  };

  const deleteCustomObjectsByStore = async (
    container: any,
    key: any,
    config = { headers: {} }
  ) => {
    const data = await executeHttpClientRequest(
      async (options) => {
        const res = await axios(
          buildApiUrl(`/${projectKey}/custom-objects/${container}/${key}`),
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
  };

  return {
    getCustomObjectsByStore,
    createCustomObject,
    deleteCustomObjectsByStore,
  };
};

export default useCustomObjects;
