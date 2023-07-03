#!/usr/bin/node

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/index');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/api/v1', router);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
})
