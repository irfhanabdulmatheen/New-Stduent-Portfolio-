const net = require('net');
const port = 5001;

const server = net.createServer();

server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is occupied.`);
    } else {
        console.log(`Error: ${err.message}`);
    }
    process.exit(0);
});

server.listen(port, () => {
    console.log(`Port ${port} is free.`);
    server.close();
    process.exit(0);
});
