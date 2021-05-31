const mongoose = require('mongoose');
const { isEmail } = require('validator/es');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        required_protocol: true,
      }),
      message: 'Некорректный формат ссылки',
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  }
})

module.exports = mongoose.model('user', userSchema);
