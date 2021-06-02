const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// получение всех сохранённых пользователем фильмов
const getFavoritesMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

// добавление фильма в избранное
const addMovieToFavorites = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailer, thumbnail,
    movieId,
    nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

// удаление сохранённого фильма по ID
const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie.findById(movieId)
    .orFail(new NotFoundError('Фильм с заданным ID не найден'))
    .then((movie) => {
      if (movie.owner !== userId) {
        return next(new ForbiddenError('Нельзя удалить чужой фильм'));
      }
      return Movie.findByIdAndRemove(movieId)
        .then(() => res.send({ message: 'Фильм успешно удалён' }));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный ID фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getFavoritesMovies, addMovieToFavorites, deleteMovieById,
};
