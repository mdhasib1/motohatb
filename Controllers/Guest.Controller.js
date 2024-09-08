const GuestUser = require('../Models/GuestUser.model');
const jwt = require('jsonwebtoken');

exports.createTemporaryUser = async (req, res) => {
    const { name, phone } = req.body;

    try {
        let user = await GuestUser.findOne({ phone });

        if (!user) {
            const fullName = name || '';
            user = await GuestUser.create({ fullName, phone });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.json({ accessToken });
    } catch (error) {
        console.error('Error creating temporary user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
