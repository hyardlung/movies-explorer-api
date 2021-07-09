require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/movexpdb' } = process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../movies-explorer-frontend/build/'));
}

app.use(helmet()); // защита HTTP-заголовков
app.use(express.json());
app.use(requestLogger); // логгер запросов
app.use(cors()); // обход политики безопасности кросс-доменных запросов
app.use(limiter); // лимитер запросов
app.use(router); // роуты
app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`Run on port: ${PORT}`);
});
