const userRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { isEmail } = require('validator');
const auth = require('../middlewares/auth');
const {
  createUser,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/users');

// роут регистрации пользователя
userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().lowercase().trim()
      .custom((value, helpers) => {
        if (isEmail(value, {
          require_tld: true,
        })) return value;
        return helpers.message('Некорректный формат почты');
      }),
    password: Joi.string().required(),
  }),
}), createUser);

// роут авторизации
userRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().lowercase().trim()
      .custom((value, helpers) => {
        if (isEmail(value, {
          require_tld: true,
        })) return value;
        return helpers.message('Некорректный формат почты');
      }),
    password: Joi.string().required().min(8),
  }),
}), login);

userRouter.use(auth);

userRouter.get('/users/me', getProfile);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().lowercase().trim()
      .custom((value, helpers) => {
        if (isEmail(value, {
          require_tld: true,
        })) return value;
        return helpers.message('Некорректный формат почты');
      }),
  }),
}), updateProfile);

module.exports = userRouter;
