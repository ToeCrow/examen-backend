import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger/swagger.json', 'utf8'));


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);  // skulle varit ett s på slutet, men skapar mer fel än jag vill ha just nu, så vi låter det vara så länge
app.use('/api/notes', notesRoutes);
app.use('/api/groups', groupRoutes);

// To be able to show in frontend
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
