const moviesRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { isURL } = require('validator');
const auth = require('../middlewares/auth');
const {
  getFavoritesMovies, addMovieToFavorites, deleteMovieById,
} = require('../controllers/movies');

moviesRouter.use(auth);

moviesRouter.get('/movies', getFavoritesMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: true,
      })) return value;
      return helpers.message('Некорректный формат ссылки');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: true,
      })) return value;
      return helpers.message('Некорректный формат ссылки');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: true,
      })) return value;
      return helpers.message('Некорректный формат ссылки');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovieToFavorites);

moviesRouter.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), deleteMovieById);

module.exports = moviesRouter;
