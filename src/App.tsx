import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import { ROUTES, IRoute } from './configs/routes';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => setLoading(false), 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        {ROUTES.map((item: IRoute, index: number) => (
          <Route
            key={index}
            index={index === 0}
            path={item.path}
            element={
              <>
                <PageTitle title={item.title} />
                {item.component}
              </>
            }
          />
        ))}
      </Routes>
    </DefaultLayout>
  );
}

export default App;
