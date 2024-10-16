const express = require('express');
const path = require('path');
const app = express();

// Set security headers for clickjacking protection
app.use((req, res, next) => {
//   res.setHeader('X-Frame-Options', 'SAMEORIGIN');
//   res.setHeader('Content-Security-Policy', "frame-ancestors 'self';");
//   next();
// Enforce HTTPS with HSTS
res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://manakirana.com https://manakirana.online https://etrug.app;"
  );

// Prevent clickjacking
res.setHeader('X-Frame-Options', 'SAMEORIGIN');

// Prevent MIME type sniffing
res.setHeader('X-Content-Type-Options', 'nosniff');

// Set Referrer Policy
res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');

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
