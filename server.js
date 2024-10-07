const express = require('express');
const path = require('path');
const app = express();

// Set security headers for clickjacking protection
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self';");
  next();
});

// Serve the static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle any other routes and serve `index.html`
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
