import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import classes from './Layout.module.css';
import MainNavigation from './MainNavigation';

const Layout = props => {
  // using fragment to wrap the layout, and using bootstrap for the header.
  const regular = useSelector(state => state.ui.regular);
  const fake = useSelector(state => state.ui.fake);
  const real = useSelector(state => state.ui.real);

  return (
    <Fragment>
      <Navbar bg="secondary" expend="lg" variant="light">
        <Container>
          <MainNavigation></MainNavigation>
        </Container>
      </Navbar>
      <Row
        className={`${classes.fullScreen} ${regular && classes.regular} ${
          fake && classes.fake
        } ${real && classes.real}`}
      >
        <main>{props.children}</main>
      </Row>
    </Fragment>
  );
};

export default Layout;
