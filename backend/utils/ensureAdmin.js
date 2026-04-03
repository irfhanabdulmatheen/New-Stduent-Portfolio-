const User = require('../models/User');

const ensureAdmin = async () => {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD?.trim();
    const name = process.env.ADMIN_NAME?.trim() || 'Admin';

    if (!email || !password) {
        console.log('Skipping admin bootstrap: ADMIN_EMAIL or ADMIN_PASSWORD is not set.');
        return;
    }

    let admin = await User.findOne({ email });

    if (admin) {
        let changed = false;

        if (admin.role !== 'admin') {
            admin.role = 'admin';
            changed = true;
        }

        if (!admin.isActive) {
            admin.isActive = true;
            changed = true;
        }

        if (admin.name !== name) {
            admin.name = name;
            changed = true;
        }

        admin.password = password;
        changed = true;

        if (changed) {
            await admin.save();
            console.log(`Admin account ensured for ${email}`);
        }
        return;
    }

    admin = new User({
        name,
        email,
        password,
        role: 'admin',
        isActive: true
    });

    await admin.save();
    console.log(`Admin account created for ${email}`);
};

module.exports = ensureAdmin;
