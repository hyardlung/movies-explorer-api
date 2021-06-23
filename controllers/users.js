const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;

// регистрация пользователя
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.send({ name, email }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoError' && err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

// получение залогиненного пользователя
const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с таким ID не найден'))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

// обновление данных пользователя
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) throw new BadRequestError('Переданы некорректные данные при обновлении пользователя');
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь с таким ID не найден'))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при редактировании профиля'));
      } else if (err.name === 'MongoError' && err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, login, getProfile, updateProfile,
};
