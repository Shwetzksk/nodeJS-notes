const http = require("http");
const routes = require("./routes.js");

// rqListener get executed on every request reaches out to server
const server = http.createServer(routes);

// nodejs will keep on running to listen to reqts
server.listen(3000);
