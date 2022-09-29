import BTModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Modal = props => {
  return (
    <BTModal show={props.show} onHide={props.handleShowModal}>
      <BTModal.Header closeButton>
        <BTModal.Title>{props.title}</BTModal.Title>
      </BTModal.Header>
      <BTModal.Body>{props.body}</BTModal.Body>
      <BTModal.Footer>
        <Button variant="secondary" onClick={props.handleShowModal}>
          Close
        </Button>
      </BTModal.Footer>
    </BTModal>
  );
};

export default Modal;
