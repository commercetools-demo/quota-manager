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

const useCustomObjects = (): any => {
  const getCustomObjectsByStore = async (
    key: any,
    config = { headers: {} }
  ) => {
    const data = await executeHttpClientRequest(
      async (options) => {
        const res = await axios(
          buildApiUrl(
            `/chanel-rfp-042024/custom-objects?where=key%3D%22${key}%22`
          ),
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
            buildApiUrl('/chanel-rfp-042024/custom-objects'),
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
      //console.log(error?.response?.data);
      //@ts-ignore
      return error?.response?.data;
    }
  };

  return { getCustomObjectsByStore, createCustomObject };
};

export default useCustomObjects;
