const serverless = require('serverless-http');

let handler;
let dbReady = false;

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!handler) {
      const { app, ensureDb } = require('../../server/index');
      if (!dbReady) {
        await ensureDb();
        dbReady = true;
      }
      handler = serverless(app);
    }
    return await handler(event, context);
  } catch (err) {
    console.error('Netlify function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};
