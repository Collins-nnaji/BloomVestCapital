require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const aiRoutes = require('./routes/ai');
const portfolioRoutes = require('./routes/portfolio');
const progressRoutes = require('./routes/progress');
const coursesRoutes = require('./routes/courses');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/courses', coursesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  ensureDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = { app, ensureDb };
