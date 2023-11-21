const express = require('express');
require('dotenv').config({ path: '.env.dev' });
const cors = require('cors');
const bodyParser = require('body-parser');
const { PORT } = require('./config.js');
const connectToDatabase = require('./src/db/db.connect.js');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler.js');
const routeNotFoundHandler = require('./src/middlewares/routeNotFoundHandler.js');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Server running' });
});
app.use('/v1', routes);

//Error handler
app.use(errorHandler);
app.use(routeNotFoundHandler);

app.listen(PORT, async () => {
  try {
    console.log(`Server started on port ${PORT}`);
    const db = await connectToDatabase();
    if (db) {
      console.log('Database connected success');
    } else {
      throw new Error('Could not connect to db');
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});
