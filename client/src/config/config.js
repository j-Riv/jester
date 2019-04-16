let server = 'https://the-jester.herokuapp.com:3001';

const env = process.env.NODE_ENV;

if (env === 'development') {
    server = 'http://localhost:3001';
}

module.exports = server;