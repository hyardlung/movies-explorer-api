# [Movies Explorer](https://hyardlung-movies-explorer.nomoredomains.icu)
Репозиторий для серверного API проекта **Movies Explorer**.
  
## IP-адрес сервера на Яндекс.Облаке:
~~~
178.154.228.230
~~~
## Домен:
https://hyardlung-movies-explorer.nomoredomains.icu

## Методы API:
| Метод  | Путь              | Описание                                                                                                                                | Требует авторизации |
|--------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------|---------------------|
|  POST  | `/signup`         | Cоздаёт пользователя с переданными в теле email, password и name                                                                        |        false        |
|  POST  | `/signin`         | Проверяет переданные в теле почту и пароль и возвращает JWT                                                                             |        false        |
|   GET  | `/movies`         | Возвращает все сохранённые пользователем фильмы                                                                                         |         true        |
|  POST  | `/movies`         | Создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId  |         true        |
| DELETE | `/movies/movieId` | Удаляет сохранённый фильм из избранного по id                                                                                           |         true        |
