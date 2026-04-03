const fs = require('fs');
const filepath = 'd:/NEW STUDENT PORTFOLIO  SYSTEM/backend/controllers/adminController.js';
let code = fs.readFileSync(filepath, 'utf8');
const marker = '// @desc    Get analytics';
const idx = code.indexOf(marker);
if (idx > -1) {
    let clean = code.substring(0, idx);
    clean += marker + '\n// @route   GET /api/admin/analytics\nexports.getAnalytics = async (req, res) => {\n    try {\n        const totalStudents = await User.countDocuments({ role: \'student\' });\n        const activeStudents = await User.countDocuments({ role: \'student\', isActive: true });\n        const blockedStudents = await User.countDocuments({ role: \'student\', isActive: false });\n        const totalProjects = await Project.countDocuments();\n        const totalCertifications = await Certification.countDocuments();\n\n        const recentStudents = await User.find({ role: \'student\' }).select(\'name email createdAt isActive\').sort({ createdAt: -1 }).limit(5);\n\n        const profiles = await Profile.find().populate(\'userId\', \'role\');\n        const deptMap = {};\n        profiles.forEach(p => {\n            if (p.userId && p.userId.role === \'student\' && p.department) {\n                deptMap[p.department] = (deptMap[p.department] || 0) + 1;\n            }\n        });\n\n        res.json({ totalStudents, activeStudents, blockedStudents, totalProjects, totalCertifications, recentStudents, departmentDistribution: deptMap });\n    } catch (error) {\n        console.error(\'Analytics error:\', error);\n        res.status(500).json({ message: \'Server error\' });\n    }\n};\n\n// @desc    Get departments\n// @route   GET /api/admin/departments\nexports.getDepartments = async (req, res) => {\n    try {\n        res.json([{ id: 1, name: \'Computer Science\' }, { id: 2, name: \'Electrical Engineering\' }]);\n    } catch (error) {\n        res.status(500).json({ message: \'Server error\' });\n    }\n};\n\n// @desc    Create department\n// @route   POST /api/admin/departments\nexports.createDepartment = async (req, res) => {\n    try {\n        res.status(201).json({ message: \'Department created\', data: req.body });\n    } catch (error) {\n        res.status(500).json({ message: \'Server error\' });\n    }\n};\n';
    fs.writeFileSync(filepath, clean);
    console.log('Fixed adminController.js');
} else {
    console.log('marker not found');
}
