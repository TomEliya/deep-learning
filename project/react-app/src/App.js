import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Layout from './components/layout/Layout';
import Spinner from 'react-bootstrap/Spinner';
import MainPage from './pages/MainPage';
import { authActions } from './store/auth-slice';
import classes from './App.module.css';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const dispatch = useDispatch();

  const isAuth = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(authActions.checkExist());
  });

  return (
    <Layout>
      <Suspense
        fallback={
          <div className={classes.spinnerParent}>
            <Spinner animation="border" className={classes.spinner} />
          </div>
        }
      >
        <Routes>
          <Route path="/" exact element={<MainPage />} />
          {!isAuth && <Route path="/login" exact element={<AuthPage />} />}
          {!isAuth && <Route path="/signup" exact element={<AuthPage />} />}
          {isAuth && <Route path="/user-area" exact element={<UserPage />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
