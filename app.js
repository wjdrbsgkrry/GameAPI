import express from 'express';
import connect from './schemas/index.js';
import character from './routes/characters.router.js';
import item from './routes/items.router.js';

const APP = express();
const PORT = 3000;

connect();

APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

APP.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

APP.use('/api', [character, item ]);

APP.listen(PORT, () => {
  console.log(PORT, 'Game Item Server 0.0.1 Open');
});
