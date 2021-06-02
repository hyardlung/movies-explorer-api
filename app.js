const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/movexpdb' } = process.env;
const app = express();

app.use(express.json());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(router);
app.use(errorHandler);

app.listen(PORT);
