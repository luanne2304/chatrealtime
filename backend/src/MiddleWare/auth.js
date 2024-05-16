const jwt = require('jsonwebtoken');
const JWT_KEY = 'vinahey';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Nếu không có token, trả về lỗi 401
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) {
            // Nếu token không hợp lệ, trả về lỗi 403
            return res.sendStatus(403);
        }
        req.user = user;
        next(); // Tiếp tục tiến hành xử lý request
    });
}

module.exports = authenticateToken;