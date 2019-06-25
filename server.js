const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});