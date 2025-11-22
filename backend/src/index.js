const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const session = require('express-session'); // Desabilitado temporariamente
const dotenv = require('dotenv');
dotenv.config();

// const passport = require('./googleStrategy'); // Desabilitado temporariamente
const auth = require('./routes/auth');
// const google = require('./routes/google'); // Desabilitado temporariamente
const lessons = require('./routes/lessons');
const progress = require('./routes/progress');
const leaderboard = require('./routes/leaderboard');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));

// --- Rotas da Aplicação ---
app.use('/auth', auth);
// app.use('/auth/google', google); // Desabilitado temporariamente
app.use('/lessons', lessons);
app.use('/progress', progress);
app.use('/leaderboard', leaderboard);

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('API on', port));