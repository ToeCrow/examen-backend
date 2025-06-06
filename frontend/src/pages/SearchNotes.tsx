// src/pages/SearchNotes.tsx

import React, { useState } from 'react';
import { Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { searchNotes } from '../utils/api';

interface Note {
  id: string;
  title: string;
  text: string;
  created_at: string;
  modified_at: string | null;
}

const SearchNotes: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await searchNotes(query);
      setResults(data);
    } catch {
      setError('Kunde inte söka anteckningar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Sök Anteckningar</h2>
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group className="mb-2" controlId="searchQuery">
          <Form.Label>Sökord</Form.Label>
          <Form.Control
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" disabled={loading}>
          {loading ? 'Söker...' : 'Sök'}
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {results.length === 0 && !loading ? (
        <div>Inga resultat.</div>
      ) : (
        <ListGroup>
          {results.map(note => (
            <ListGroup.Item key={note.id}>
              <strong>{note.title}</strong>
              <div>{note.text}</div>
              <small className="text-muted">
                {note.modified_at
                  ? `Redigerad: ${new Date(note.modified_at).toLocaleString()}`
                  : `Skapad: ${new Date(note.created_at).toLocaleString()}`}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default SearchNotes;
