require('dotenv').config();
const createServer = require('./src/Infrastructures/http/createServer');
const container = require('./src/Infrastructures/container');

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
