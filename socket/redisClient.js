const redis = require('redis');

const publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.subscribe('chatMessages');

subscriber.on('message', (channel, message) => {
    if (channel === 'chatMessages') {
        const parsedMessage = JSON.parse(message);
    }
});

const publishMessage = (message) => {
    publisher.publish('chatMessages', JSON.stringify(message));
};

module.exports = { publishMessage };
