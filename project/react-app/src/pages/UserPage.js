import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from '../components/ui/Modal';

const NotFound = () => {
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, seModalBody] = useState('');
  const token = useSelector(state => state.auth.token);

  const handleShowModal = (title, body) => {
    setModalTitle(title);
    seModalBody(body);
    setShow(true);
  };

  const handleCloseShowModal = () => {
    setShow(false);
  };

  useEffect(() => {
    if (token) {
      axios
        .post(
          'http://127.0.0.1:8080/personal-data',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(result => {
          setUserData(result.data.reviewsList);
        })
        .catch(err => {
          console.log(err.response.data.message);
          handleShowModal(
            err.response.data.message,
            'something went wrong. ):'
          );
        });
    } else {
      handleShowModal('This page is for members only.', 'Please login first.');
    }
  }, [token]);

  return (
    <Fragment>
      {userData
        .slice(0)
        .reverse()
        .map(cell => {
          return (
            <Row className="mt-3 mb-3" key={cell._id}>
              <Col></Col>
              <Col xs={6}>
                <Card
                  bg={cell.result === 'Real' ? 'success' : 'danger'}
                  text="white"
                  border="dark"
                >
                  <Card.Header>
                    Review created at: {new Date(cell.createdAt).toDateString()}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>
                      {cell.result === 'Real' ? 'Authentic' : 'Fake'} Review
                    </Card.Title>
                    <Card.Text>{cell.sentence}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col></Col>
            </Row>
          );
        })}
      <Modal
        handleShowModal={handleCloseShowModal}
        show={show}
        title={modalTitle}
        body={modalBody}
      ></Modal>
    </Fragment>
  );
};

export default NotFound;
