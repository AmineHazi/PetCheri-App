const db = require('./db'); // Ensure this path is correct

(async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
  } catch (error) {
    console.error('Database connection error:', error);
  }
})();
