const jwt = require('jsonwebtoken');


function auth(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'no_token', message: 'Acesso negado. Nenhum token fornecido.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'token_malformed', message: 'Token mal formatado.' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        
        next();
    } catch (ex) {
        res.status(401).json({ error: 'token_invalid', message: 'Token inválido.' });
    }
}

module.exports = auth;