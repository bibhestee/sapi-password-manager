#!/usr/bin/node

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/index');
const treblle = require('@treblle/express');
const app = express();
const { info, error } = require('./middlewares/logger');
const { requestLogger, unknownEndpoint, errorHandler } = require('./middlewares/handlers');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(requestLogger()); // Log request to terminal
app.use(
  treblle({
    apiKey: process.env.TREBLLE_API_KEY,
    projectId: process.env.TREBLLE_PROJECT_ID,
    additionalFieldsToMask: [],
  })
)
app.use('/api/v1', router);
// Middleware - Always add these middlewares at the end
app.use(unknownEndpoint);
app.use(errorHandler);


app.listen(process.env.PORT, () => {
  info(`server is running on port ${process.env.PORT}`);
})
