const GuestUser = require('../Models/GuestUser.model');
const jwt = require('jsonwebtoken');

exports.createTemporaryUser = async (req, res) => {
    console.log(req.body);
    const { fullName, phone, email } = req.body; // Ensure you're using the correct field name

    try {
        let user = await GuestUser.findOne({ phone });

        if (!user) {
            // Ensure fullName is passed correctly
            user = await GuestUser.create({ fullName, phone, email });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        console.log(accessToken);

        res.json({ accessToken });
    } catch (error) {
        console.error('Error creating temporary user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
