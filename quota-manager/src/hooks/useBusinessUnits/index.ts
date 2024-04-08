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

const useBusinessUnits = (): any => {
  const getBusinessUnits = async (config = { headers: {} }) => {
    const data = await executeHttpClientRequest(
      async (options) => {
        const res = await axios(
          buildApiUrl('/chanel-rfp-042024/business-units'),
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

  return { getBusinessUnits };
};

export default useBusinessUnits;
