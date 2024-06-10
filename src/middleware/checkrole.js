const jwt = require('jsonwebtoken');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.CookieComponent;
    console.log(token);
    if (token) {
        jwt.verify(token, 'm1$up3rKlaB$ekReT4', (err, decoded) => {
            if (err) {
                res.status(403).send('Acceso denegado. Token inválido.');
            } else {
                const userRole = decoded.user.admin;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
                }
            }
        });
    } else {
        res.status(403).send('Acceso denegado. Token no proporcionado.');
    }
};

module.exports = checkUserRole;