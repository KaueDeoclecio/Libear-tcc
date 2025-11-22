const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const r = Router();

r.get('/', passport.authenticate('google', { scope: ['profile','email'] }));

r.get('/callback',
  passport.authenticate('google', { failureRedirect: (process.env.CORS_ORIGIN||'') + '/login.html' }),
  (req,res)=>{
    const token = jwt.sign({id: req.user.id, email: req.user.email}, process.env.JWT_SECRET, {expiresIn:'7d'});
    const redirect = (process.env.CORS_ORIGIN||'http://localhost:3000') + '/dashboard.html#token=' + token;
    res.redirect(redirect);
  }
);

module.exports = r;
