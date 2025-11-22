const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { q } = require('./db');
const dotenv = require('dotenv'); dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
}, async (_accessToken, _refreshToken, profile, done)=>{
  try{
    const googleId = profile.id;
    const email = profile.emails && profile.emails[0]?.value || null;
    const name = profile.displayName || 'Usuário Google';
    const avatar = profile.photos && profile.photos[0]?.value || null;

    // procura por google_id
    let { rows } = await q('SELECT * FROM users WHERE google_id=$1', [googleId]);
    if(rows.length===0 && email){
      // tenta por email
      const r2 = await q('SELECT * FROM users WHERE email=$1',[email]);
      if(r2.rows.length){
        await q('UPDATE users SET google_id=$1, avatar_url=$2 WHERE id=$3', [googleId, avatar, r2.rows[0].id]);
        rows = [{...r2.rows[0], google_id: googleId, avatar_url: avatar}];
      }
    }
    if(rows.length===0){
      const ins = await q('INSERT INTO users(name,email,google_id,avatar_url) VALUES($1,$2,$3,$4) RETURNING *',
        [name,email,googleId,avatar]);
      rows = [ins.rows[0]];
    }
    return done(null, rows[0]);
  }catch(err){
    return done(err);
  }
}));

passport.serializeUser((user, done)=> done(null, user.id));
passport.deserializeUser(async (id, done)=>{
  try{
    const { rows:[u] } = await q('SELECT * FROM users WHERE id=$1',[id]);
    done(null, u);
  }catch(e){ done(e); }
});

module.exports = passport;
