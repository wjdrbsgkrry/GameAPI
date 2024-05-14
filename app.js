import express from 'express';
import connect from './schemas/index.js';
import characterCreate from './routes/characters.router.js';

const APP = express();
const PORT = 3000;

connect();

APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

APP.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

APP.use('/api', [characterCreate]);

APP.listen(PORT, () => {
  console.log(PORT, 'Game Item Server 0.0.1 Open');
});
