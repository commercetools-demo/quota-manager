import { lazy } from 'react';

const QuotaManager = lazy(
  () => import('./quotaManager' /* webpackChunkName: "quotaManager" */)
);

export default QuotaManager;
