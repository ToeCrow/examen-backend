import pool from '../models/db.js';

export const getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta anteckningar' });
  }
};

export const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM notes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hittade ingen anteckning med detta id' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämte anteckning' });
  }
};


export const createNote = async (req, res) => {
  const { title, text } = req.body;
  
  // Validating title
  if (!title) {
    return res.status(400).json({ error: 'Titel krävs för att kunna söka bland anteckningar.' });
  }
  if (title.length > 50) {
    return res.status(400).json({ error: 'Titel får vara max 50 tecken lång.' });
  }

  // Validating text
  if (text && text.length > 300) {
    return res.status(400).json({ error: 'Text får vara max 300 tecken lång.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, title, text) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, title, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte spara anteckning' });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;

  // Validating title
  if (!title) {
    return res.status(400).json({ error: 'Titel krävs för att kunna söka bland anteckningar.' });
  }
  if (title.length > 50) {
    return res.status(400).json({ error: 'Titel får vara max 50 tecken lång.' });
  }

  // Validating text
  if (text && text.length > 300) {
    return res.status(400).json({ error: 'Text får vara max 300 tecken lång.' });
  }

  try {
    const result = await pool.query(
      `UPDATE notes
       SET title = $1, text = $2, modified_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, text, id, req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Anteckning hittades inte' });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte uppdatera anteckning' });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Anteckning hittades inte' });

    res.json({ message: 'Anteckning raderad' });
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte radera anteckning' });
  }
};

export const searchNotes = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM notes
       WHERE user_id = $1 AND title ILIKE $2`,
      [req.user.id, `%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte söka anteckningar' });
  }
};

export const getGroupNotes = async (req, res) => {
  const { groupId } = req.params;
  try {
    const result = await pool.query(
      `SELECT n.* FROM notes n
       JOIN users u ON n.user_id = u.id
       JOIN group_members gm ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY n.created_at DESC`,
      [groupId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta anteckningar från din grupp' });
  }
};
