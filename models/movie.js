const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: (value) => isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        required_protocol: true,
      }),
      message: 'Некорректный формат ссылки',
    },
  },
  trailer: {
    type: String,
    require: true,
    validate: {
      validator: (value) => isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        required_protocol: true,
      }),
      message: 'Некорректный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (value) => isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        required_protocol: true,
      }),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: ObjectId,
    require: true,
    select: true,
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
