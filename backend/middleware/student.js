const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : '');

const student = (req, res, next) => {
    // Be tolerant to role casing stored in DB (e.g., `Student` vs `student`)
    const role = normalizeRole(req.user?.role);
    if (role === 'student') return next();

    return res.status(403).json({ message: 'Access denied. Students only.' });
};

module.exports = student;
