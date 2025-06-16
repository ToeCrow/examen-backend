import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchAllNotes,
  deleteExistingNote,
  updateExistingNote,
  type Note,
} from '../features/notes/noteSlice';
import NoteItem from '../components/NoteItem';
import NoteFormModal from '../components/NoteFormModal';
import EditNoteModal from '../components/EditNoteModal';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';

const defaultColumns = ['Att göra', 'Pågår', 'Färdig'];

const BoardView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notes } = useAppSelector((state) => state.notes);

  const [columns] = useState<string[]>(defaultColumns);
  const [columnNotes, setColumnNotes] = useState<Record<string, Note[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllNotes());
  }, [dispatch]);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    const sorted = notes.reduce((acc, note) => {
      const match =
        note.title.toLowerCase().includes(query) ||
        note.text.toLowerCase().includes(query);
      if (!match) return acc;

      const column = columns[0]; // Allt går till första kolumnen för nu
      if (!acc[column]) acc[column] = [];
      acc[column].push(note);
      return acc;
    }, {} as Record<string, Note[]>);

    columns.forEach((col) => {
      if (!sorted[col]) sorted[col] = [];
    });

    setColumnNotes(sorted);
  }, [notes, searchQuery, columns]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromColumn = active.data.current?.from;
    const toColumn = over.data.current?.to;

    if (!fromColumn || !toColumn) return;

    const activeNote = columnNotes[fromColumn].find(n => n.id === active.id);
    if (!activeNote) return;

    const newFrom = columnNotes[fromColumn].filter(n => n.id !== active.id);
    const newTo = [...columnNotes[toColumn], activeNote];

    setColumnNotes({
      ...columnNotes,
      [fromColumn]: newFrom,
      [toColumn]: newTo,
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Planeringsbräda</h2>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>+ Ny anteckning</Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Sök bland anteckningar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Row>
          {columns.map((column) => (
            <Col key={column}>
              <Card className="mb-3">
                <Card.Header>{column}</Card.Header>
                <Card.Body className="bg-light">
                  <SortableContext
                    items={columnNotes[column]?.map(n => n.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnNotes[column]?.map((note) => (
                      <SortableNote
                        key={note.id}
                        note={note}
                        column={column}
                        onEdit={() => {
                          setEditingNote(note);
                          setShowEditModal(true);
                        }}
                        onDelete={() => dispatch(deleteExistingNote(note.id))}
                      />
                    ))}
                  </SortableContext>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </DndContext>

      <NoteFormModal show={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <EditNoteModal note={editingNote} show={showEditModal} onClose={() => setShowEditModal(false)} />
    </div>
  );
};

export default BoardView;

interface SortableNoteProps {
  note: Note;
  column: string;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableNote: React.FC<SortableNoteProps> = ({ note, column, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: note.id,
    data: {
      from: column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '12px',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteItem note={note} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};
