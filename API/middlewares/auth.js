#!/usr/bin/node

const jwt = require('jsonwebtoken');
const { User } = require('../models/users');
const { mysqldb } = require('../models/db_engine/db');
const { error } = require('./logger');
const { info } = require('console');


async function authorization(req, res, next) {
  const auth = req.get('Authorization');
  if (auth && auth.split(' ')[0] === 'Bearer') {
    const token = auth.split(' ')[1];
    let email;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      email = decoded.email;
      if (!email) {
        res.status(401).json({ error: 'unauthorized' });
        return;
      }
    } catch(err) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const filter = { email };
    res.locals.email = email;
    
    try {
      const user = await mysqldb.get(User, filter);
      if (user) {
        next();
      } else {
        res.status(401).json({ error: 'unauthorized' });
      }
    } catch(err) {
      error(err);
      res.status(500).json({ error: 'internal server error' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
}


module.exports = authorization;
