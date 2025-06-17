// src/components/EditNoteModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { Note } from '../features/notes/noteSlice';
import { useAppDispatch } from '../store/hooks';
import { updateExistingNote } from '../features/notes/noteSlice';

interface Props {
  note: Note | null;
  show: boolean;
  onClose: () => void;
}

const EditNoteModal: React.FC<Props> = ({ note, show, onClose }) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setText(note.text);
    }
  }, [note]);

  const handleSave = async () => {
    if (!note) return;
    await dispatch(updateExistingNote({ id: note.id, title, text }));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editera anteckning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
        <Button variant="secondary" onClick={onClose}>Avbryt</Button>
        <Button variant="primary" onClick={handleSave}>Spara</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditNoteModal;
