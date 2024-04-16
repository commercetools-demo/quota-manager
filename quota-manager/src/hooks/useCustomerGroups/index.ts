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

const useCustomerGroups = (projectKey: string): any => {
  const getCustomerGroups = async (config = { headers: {} }) => {
    const data = await executeHttpClientRequest(
      async (options) => {
        const res = await axios(buildApiUrl(`/${projectKey}/customer-groups`), {
          ...config,
          headers: options.headers,
          withCredentials: options.credentials === 'include',
        });
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

  return { getCustomerGroups };
};

export default useCustomerGroups;
