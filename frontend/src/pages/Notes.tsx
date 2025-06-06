// src/pages/Notes.tsx

import React, { useEffect, useState } from 'react';
import { Button, Form, ListGroup, Modal, Alert } from 'react-bootstrap';
import { fetchNotes, createNote, updateNote, deleteNote } from '../utils/api';

interface Note {
  id: string;
  title: string;
  text: string;
  created_at: string;
  modified_at: string | null;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch {
      setError('Kunde inte ladda anteckningar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch {
      setError('Kunde inte ta bort anteckningen');
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingNote(null);
    setShowModal(false);
  };

  const handleEditSave = async () => {
    if (!editingNote) return;
    try {
      const updated = await updateNote(editingNote.id, editingNote.title, editingNote.text);
      setNotes(notes.map(n => (n.id === updated.id ? updated : n)));
      closeModal();
    } catch {
      setError('Kunde inte uppdatera anteckningen');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newText) return;
    try {
      const created = await createNote(newTitle, newText);
      setNotes([created, ...notes]);
      setNewTitle('');
      setNewText('');
    } catch {
      setError('Kunde inte skapa anteckning');
    }
  };

  return (
    <>
      <h2>Dina Anteckningar</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleCreate} className="mb-4">
        <h4>Skapa ny anteckning</h4>
        <Form.Group className="mb-2" controlId="newTitle">
          <Form.Label>Titel</Form.Label>
          <Form.Control
            type="text"
            maxLength={50}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="newText">
          <Form.Label>Text</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={300}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Skapa</Button>
      </Form>

      {loading ? (
        <div>Laddar...</div>
      ) : notes.length === 0 ? (
        <div>Inga anteckningar ännu.</div>
      ) : (
        <ListGroup>
          {notes.map(note => (
            <ListGroup.Item key={note.id} className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{note.title}</strong>
                <div>{note.text}</div>
                <small className="text-muted">
                  {note.modified_at
                    ? `Redigerad: ${new Date(note.modified_at).toLocaleString()}`
                    : `Skapad: ${new Date(note.created_at).toLocaleString()}`}
                </small>
              </div>
              <div>
                <Button variant="outline-primary" size="sm" onClick={() => openEditModal(note)}>
                  Editera
                </Button>{' '}
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(note.id)}>
                  Ta bort
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editera Anteckning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editTitle">
              <Form.Label>Titel</Form.Label>
              <Form.Control
                type="text"
                maxLength={50}
                value={editingNote?.title || ''}
                onChange={e =>
                  setEditingNote(editingNote ? { ...editingNote, title: e.target.value } : null)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editText">
              <Form.Label>Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={300}
                value={editingNote?.text || ''}
                onChange={e =>
                  setEditingNote(editingNote ? { ...editingNote, text: e.target.value } : null)
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Avbryt
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Spara
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Notes;
