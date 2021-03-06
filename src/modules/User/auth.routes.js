const router = require('express').Router();
const passport = require('../../config/passport');
const { successRedirect } = require('../../config');
const userService = require('../../services')('User');
const { authUtils } = require('../../lib');
const { isAuth } = require('../../middleware/auth-middleware');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google'),
  async (req, res, next) => {
    return res.redirect(successRedirect);
  }
);

router.get('/account', isAuth, async (req, res, next) => {
  return res.json({
    data: { user: req.user },
    message: 'Logged in',
  });
});

router.post(
  '/login',
  passport.authenticate('local'),
  async (req, res, next) => {
    const user = await userService.getItem({ _id: req.session.passport.user });

    return res.json({
      data: { user },
      message: 'Logged in',
    });
  }
);

router.post('/register', async (req, res, next) => {
  const { email, username, password } = req.body;

  // Check for duplicate user
  const user = await userService.getItem({ email });

  if (user) {
    return res.status(401).send('Incorrect email or password');
  }

  // Hash password
  const hashedPassword = await authUtils.hashPassword(password);
  await userService.create({ email, username, password: hashedPassword });

  return res.json({
    data: {},
    message: 'User created; login to continue',
  });
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    return res.send('OK');
  });
});

module.exports = router;
