const axios = require('axios');

const APP_ID = '902232504731325';
const APP_SECRET = '54be98b7313834e94e6bca4ac1c9c888';

const trackEvent = async (req, res) => {
    const { eventName, userId } = req.body;

    const apiUrl = `https://graph.facebook.com/v12.0/${APP_ID}/events`;

    try {
        const response = await axios.post(apiUrl, {
            data: [{
                event_name: eventName,
                user_data: {
                    em: userId,
                },
            }],
            access_token: `${APP_ID}|${APP_SECRET}`,
        });

        console.log('Event tracked:', response.data);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error tracking event:', error.message);
        res.sendStatus(500);
    }
};

module.exports = {
    trackEvent,
};
