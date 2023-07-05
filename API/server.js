#!/usr/bin/node

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/index');
const treblle = require('@treblle/express');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(
  treblle({
    apiKey: process.env.TREBLLE_API_KEY,
    projectId: process.env.TREBLLE_PROJECT_ID,
    additionalFieldsToMask: [],
  })
)
app.use('/api/v1', router);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
})
