const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const mockDb = require('../mockDb');
const auth = require('../middleware/auth');
const r = Router();

const registerValidationRules = [
  body('name', 'O nome é obrigatório').notEmpty().trim().escape(),
  body('email', 'Por favor, insira um e-mail válido').isEmail().normalizeEmail(),
  body('password', 'A senha deve ter no mínimo 8 caracteres').isLength({ min: 8 }),
];

const loginValidationRules = [
  body('email', 'Por favor, insira um e-mail válido').isEmail().normalizeEmail(),
  body('password', 'A senha não pode estar em branco').notEmpty(),
];

/**
 * @route
 * @desc
 * @access
 */
r.post('/register', registerValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  
  if (mockDb.findUserByEmail(email)) {
    return res.status(409).json({ error: 'email_in_use', message: 'Este e-mail já está cadastrado.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const u = mockDb.createUser(name, email, hash);

  const token = jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: { id: u.id, name: u.name, email: u.email }, token });
});

/**
 * @route
 * @desc
 * @access
 */
r.post('/login', loginValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const u = mockDb.findUserByEmail(email);

  if (!u) return res.status(401).json({ error: 'invalid_credentials', message: 'E-mail ou senha inválidos.' });
  
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials', message: 'E-mail ou senha inválidos.' });

  const token = jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: u.id, name: u.name, email: u.email }, token });
});

/**
 * @route  
 * @desc    
 * @access  
 */
r.get('/me', auth, (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'unauthorized', message: 'Token inválido ou expirado.' });
    }

    const user = mockDb.findUserById(req.user.id);
    
    if (!user) {
        return res.status(404).json({ error: 'user_not_found', message: 'Usuário não encontrado.' });
    }
    
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        total_xp: user.total_xp
    });
});

/**
 * @route   
 * @desc    
 * @access  
 */
r.put('/me', auth, (req, res) => {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'invalid_input', message: 'O nome é obrigatório.' });
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'unauthorized', message: 'Token inválido.' });
    }

    const user = mockDb.findUserById(req.user.id);
    
    if (!user) {
        return res.status(404).json({ error: 'user_not_found', message: 'Usuário não encontrado.' });
    }

    user.name = name.trim(); 

    res.json({ 
        message: 'Perfil atualizado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email } 
    });
});

module.exports = r;