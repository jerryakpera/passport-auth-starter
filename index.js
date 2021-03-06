const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
require('./src/config/passport');

module.exports = (sessionOptions) => {
  const app = express();

  app.use(session(sessionOptions));

  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/', require('./src/routes'));

  app.use((err, req, res, next) => {
    const errorMsg = typeof err === 'string' ? err : 'Something went wrong';

    return res.status(500).send(errorMsg);
  });

  return app;
};
