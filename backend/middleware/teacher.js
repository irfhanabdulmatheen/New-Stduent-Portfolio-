const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : '');

const teacher = (req, res, next) => {
    const role = normalizeRole(req.user?.role);
    if (role === 'teacher') return next();

    return res.status(403).json({ message: 'Access denied. Teachers only.' });
};

module.exports = teacher;
