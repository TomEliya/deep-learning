import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { sendUserData } from '../../store/auth-actions';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from '../ui/Modal';

const AuthForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, seModalBody] = useState('');

  const navigate = useNavigate();
  const [pathName, signup] =
    useLocation().pathname === '/login' ? ['Login', false] : ['Signup', true];

  const emailChangeHandler = event => {
    return setEmail(event.target.value);
  };

  const nameChangeHandler = event => {
    return setName(event.target.value);
  };

  const passwordChangeHandler = event => {
    return setPassword(event.target.value);
  };

  const handleShowModal = (title, body) => {
    setModalTitle(title);
    seModalBody(body);
    setShow(true);
  };

  const handleCloseShowModal = () => {
    setShow(false);
  };

  const handleLogin = event => {
    event.preventDefault();

    if (!signup) {
      dispatch(sendUserData({ email, password })).then(res => {
        if (res.status === 200) {
          navigate('/');
        } else {
          handleShowModal(res.data.message, 'Please try again');
        }
      });
    } else {
      axios
        .put('http://127.0.0.1:8080/auth/signup', {
          email,
          password,
          name,
        })
        .then(response => {
          navigate('/login');
          handleShowModal('Successfully Signed Up', 'Please Login');
        })
        .catch(err => {
          console.log(err.response.data.message);
          handleShowModal(err.response.data.message, 'Please try again');
        });
    }
  };

  return (
    <Row className="mt-5">
      <Col></Col>
      <Col xs={6}>
        <Card border="dark">
          <Card.Header>{pathName}</Card.Header>
          <Card.Body>
            <Form onSubmit={handleLogin}>
              <FloatingLabel
                controlId="floatingEmail"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={emailChangeHandler}
                  required
                />
              </FloatingLabel>
              {signup && (
                <FloatingLabel
                  controlId="floatingInput"
                  label="Name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Tom"
                    value={name}
                    onChange={nameChangeHandler}
                    required
                  />
                </FloatingLabel>
              )}
              <FloatingLabel
                controlId="floatingPassword"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={passwordChangeHandler}
                  required
                  minLength="5"
                />
              </FloatingLabel>
              <Button
                variant="outline-dark"
                className="col-md-12"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col></Col>
      <Modal
        handleShowModal={handleCloseShowModal}
        show={show}
        title={modalTitle}
        body={modalBody}
      ></Modal>
    </Row>
  );
};

export default AuthForm;
