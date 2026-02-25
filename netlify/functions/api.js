const serverless = require('serverless-http');
const { app, ensureDb } = require('../../server/index');

let handler;

module.exports.handler = async (event, context) => {
  await ensureDb();
  if (!handler) {
    handler = serverless(app);
  }
  return handler(event, context);
};
