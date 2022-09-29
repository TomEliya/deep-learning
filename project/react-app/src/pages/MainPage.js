import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { realResult, fakeResult } from '../store/ui-actions';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Modal from '../components/ui/Modal';

const NotFound = () => {
  const dispatch = useDispatch();
  const [sentence, setSentence] = useState('');
  const [oldSentence, setOldSentence] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [validText, setValidText] = useState(false);
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, seModalBody] = useState('');

  const handleShowModal = (title, body) => {
    setModalTitle(title);
    seModalBody(body);
    setShow(true);
  };

  const handleCloseShowModal = () => {
    setShow(false);
  };

  const sentenceSubmitHandler = event => {
    event.preventDefault();

    if (pending) {
      return;
    }
    const token = localStorage.getItem('token');
    setPending(true);
    axios
      .post(
        'http://127.0.0.1:8080/',
        { sentence },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      )
      .then(response => {
        if (response.data.result === 'Real') {
          dispatch(realResult());
          setReviewResult('Review is Authentic');
        } else {
          dispatch(fakeResult());
          setReviewResult('Review is Fake');
        }
        setTimeout(() => {
          setPending(false);
        }, 1 * 1000);
        setOldSentence(sentence);
        setSentence('');
        setValidText(false);
      })
      .catch(err => {
        console.log(err.response.data.message);
        handleShowModal(err.response.data.message, 'Please try again.');
        setTimeout(() => {
          setPending(false);
        }, 1 * 1000);
      });
  };

  const sentenceChangedHandler = event => {
    if (event.target.value !== '') {
      setValidText(true);
    } else {
      setValidText(false);
    }
    setSentence(event.target.value);
  };

  return (
    <Row className="mt-5 m-auto">
      <Col></Col>
      <Col xs={6}>
        <Card border="dark">
          <Card.Header>Enter A Review To Verify:</Card.Header>
          <Card.Body>
            <Form
              noValidate
              validated={validText}
              onSubmit={sentenceSubmitHandler}
            >
              <Form.Group size="lg" as={Col} controlId="validationCustom01">
                <Form.Control
                  as="textarea"
                  style={{ height: '200px' }}
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                  value={sentence}
                  onChange={sentenceChangedHandler}
                  className="mb-3"
                />
              </Form.Group>
              <Row>
                <Col className="text-center">
                  {!pending && validText && (
                    <Button className="btn-dark" type="submit">
                      Verify Review
                    </Button>
                  )}
                  {!pending && !validText && (
                    <Button className="btn-dark" type="submit" disabled>
                      Verify Review
                    </Button>
                  )}
                  {pending && <Spinner animation="border" />}
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
        <Row>
          <Col className="text-center pt-5">
            <h1>{reviewResult}</h1>
            <h2>{oldSentence && `"${oldSentence}"`}</h2>
          </Col>
        </Row>
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

export default NotFound;
