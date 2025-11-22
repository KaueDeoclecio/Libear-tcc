const { Router } = require('express');
const mockDb = require('../mockDb'); 
const auth = require('../middleware/auth');
const r = Router();

r.get('/', auth, (req, res) => {
  const allLessons = mockDb.getAllLessons();
  res.json(allLessons);
});

r.get('/:slug', auth, (req, res) => {
  const lesson = mockDb.getLessonBySlug(req.params.slug);
  if (!lesson) return res.status(404).json({ error: 'not_found' });

  const questions = mockDb.getQuestionsByLessonId(lesson.id);
  res.json({ lesson, questions });
});

module.exports = r;