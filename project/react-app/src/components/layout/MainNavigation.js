import { Link } from 'react-router-dom';
import { Fragment } from 'react';
// import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import classes from './MainNavigation.module.css';
import { authActions } from '../../store/auth-slice';

const MainNavigation = () => {
  const dispatch = useDispatch();
  // for redirect
  // const history = useHistory();
  // login button
  const isAuth = useSelector(state => state.auth.isLoggedIn);
  const userName = useSelector(state => state.auth.email);

  const logoutHandler = () => {
    dispatch(authActions.logout());

    // history.replace('/');
  };

  return (
    <Fragment>
      <Navbar.Brand to="/">
        <img
          alt=""
          src="https://i.imgur.com/pfGKwXv.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        <Link className={classes.main_link} to="/">
          Fake Reviews Detector
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {!isAuth && (
            <Nav>
              <Link className={classes.link} to="/login">
                Login
              </Link>
            </Nav>
          )}
          {isAuth && (
            <Nav>
              <Link className={classes.link} to="/" onClick={logoutHandler}>
                Logout
              </Link>
            </Nav>
          )}
        </Nav>
        <Nav>
          {!isAuth && (
            <Nav>
              <Link className={classes.link} to="/signup">
                Signup
              </Link>
            </Nav>
          )}
        </Nav>
      </Navbar.Collapse>
      {isAuth && (
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text style={{ color: '#000000' }}>
            Signed in as:{' '}
            <Link
              className={classes.link}
              style={{ color: 'white' }}
              to="/user-area"
            >
              {userName}
            </Link>
          </Navbar.Text>
        </Navbar.Collapse>
      )}
    </Fragment>
  );
};

export default MainNavigation;
