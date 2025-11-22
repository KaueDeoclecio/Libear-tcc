const { Router } = require('express');
const mockDb = require('../mockDb');
const auth = require('../middleware/auth');
const r = Router();

/**
 * @route   GET /leaderboard
 * @desc    Retorna o ranking dos 10 usuários com mais XP
 * @access  Private (requer autenticação)
 */
r.get('/', auth, (req, res) => {
    try {
        const allUsers = mockDb.getAllUsers();

        const sortedUsers = allUsers.sort((a, b) => b.total_xp - a.total_xp);

        const top10 = sortedUsers.slice(0, 10);

        const leaderboard = top10.map(user => ({
            id: user.id,
            name: user.name,
            total_xp: user.total_xp
        }));

        res.json(leaderboard);
        
    } catch (error) {
        console.error('Erro ao gerar leaderboard:', error);
        res.status(500).json({ error: 'server_error' });
    }
});

module.exports = r;