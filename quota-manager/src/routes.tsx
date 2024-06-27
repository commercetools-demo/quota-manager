import type { ReactNode } from 'react';
import QuotaManager from './components/quota-manager';
type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  return <QuotaManager />;
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
