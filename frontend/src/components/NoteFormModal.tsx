import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAppDispatch } from '../store/hooks';
import { createNewNote } from '../features/notes/noteSlice';

interface Props {
  show: boolean;
  onClose: () => void;
}

const NoteFormModal: React.FC<Props> = ({ show, onClose }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return setError('Titel krävs');
    if (title.length > 50) return setError('Titel får vara max 50 tecken');
    if (text.length > 300) return setError('Text får vara max 300 tecken');

    try {
      await dispatch(createNewNote({ title, text })).unwrap();
      setTitle('');
      setText('');
      onClose();
    } catch {
      setError('Kunde inte skapa anteckning');
    }
  };

  const handleCancel = () => {
  setTitle('');
  setText('');
  setError('');
  onClose();
};


  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ny Anteckning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Titel</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} maxLength={50} />
              {title.length >= 40 && (
                <Form.Text className={title.length === 50 ? "text-danger" : "text-warning"}>
                  {title.length}/50 tecken
                  {title.length === 50 && " – Du har nått maxgränsen."}
                </Form.Text>
              )}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={300}
            />
              {text.length >= 280 && (
                <Form.Text className={text.length === 300 ? "text-danger" : "text-warning"}>
                  {text.length}/300 tecken
                  {text.length === 300 && " – Du har nått maxgränsen."}
                </Form.Text>
              )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>Avbryt</Button>
        <Button variant="primary" onClick={handleSubmit}>Skapa</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoteFormModal;
