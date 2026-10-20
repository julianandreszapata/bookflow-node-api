import express from 'express';
import cors from 'cors';
import { createRouter } from './api/routes';

const app = express();
app.use(cors({ origin: ['http://localhost:4200'] }));
app.use(express.json({ limit: '100kb' }));
app.use('/api', createRouter());

const port = Number(process.env.PORT ?? 3000);
app.listen(port, '127.0.0.1', () => {
  console.log(`BookFlow Node API listening on http://127.0.0.1:${port}`);
});
