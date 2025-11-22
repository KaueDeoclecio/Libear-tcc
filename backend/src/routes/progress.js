const { Router } = require('express');
const mockDb = require('../mockDb');
const auth = require('../middleware/auth');
const r = Router();

r.get('/', auth, (req, res) => {
    const progressData = mockDb.getUserProgress(req.user.id);
    res.json(progressData);
});

r.post('/submit/:slug', auth, (req, res) => {
    const { score = 0 } = req.body || {};
    const lesson = mockDb.getLessonBySlug(req.params.slug);
    if (!lesson) return res.status(404).json({ error: 'not_found' });
    
    mockDb.submitUserProgress(req.user.id, lesson.id, score);
    res.json({ ok: true });
});

module.exports = r;