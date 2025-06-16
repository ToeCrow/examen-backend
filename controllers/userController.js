import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // för test, ändra senare
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // för test, ändra senare
  );
};

export const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'Konto skapat', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      // 23505 = unique_violation in Postgres
      return res.status(400).json({ error: 'Användarnamnet finns redan' });
    }
    res.status(500).json({ error: 'Serverfel vid skapande av användare' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverfel vid inloggning' });
  }
};

export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token saknas' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ogiltig refresh token' });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '10s' }
    );

    res.json({ accessToken: newAccessToken });
  });
};

export const getMe = (req, res) => {
  const { id, username } = req.user;
  res.json({ id, username });
};
