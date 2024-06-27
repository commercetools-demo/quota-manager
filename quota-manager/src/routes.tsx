import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import QuotaManager from './components/quota-manager';
type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();
  console.log(match.url);
  return (
    <Switch>
      <Route path={`${match.path}/:customerGroup?/:store?`}>
        <QuotaManager baseUrl={match.url} />
      </Route>
    </Switch>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
