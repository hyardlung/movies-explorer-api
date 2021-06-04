const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимальное количество запросов с каждого IP
});
