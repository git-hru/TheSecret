const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/env-config.js', (req, res) => {
  const config = {
    publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
    serviceId: process.env.EMAILJS_SERVICE_ID || '',
    templateId: process.env.EMAILJS_TEMPLATE_ID || '',
  };
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.EMAILJS_CONFIG = ${JSON.stringify(config)};`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
