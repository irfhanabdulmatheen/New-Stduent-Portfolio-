const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : '');

const admin = (req, res, next) => {
    const role = normalizeRole(req.user?.role);
    if (role === 'admin') return next();

    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = admin;
