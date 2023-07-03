#!/usr/bin/node

const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt'); // hashes password
const { mysqldb } = require('../models/db_engine/db');
const { User } = require('../models/users');
const validateSignUp = require('../validators/signup')

class UserController {
  // Signup Handler
  static async signup(req, res) {
    const { username, email, password } = req.body;
    
    if (!username) {
      res.status(400).json({ error: 'username missing' });
      return;
    }
    if (!email) {
      res.status(400).json({ error: 'email missing' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'password missing' });
      return;
    }

    try {
      const result = await validateSignUp(username, email, password)
      if (result === 'email') {
        res.status(400).json({ error: 'invalid email, supports gmail and yahoo mails only' });
        return;
      }
      else if (result === 'username') {
        res.status(400).json({ error: 'username should have minimum of 3 character and maximum of 12 characters' });
        return;
      }
      else if (result === 'password') {
        res.status(400).json({ error: 'password should have minimum of 8 characters' });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
      return;
    }

    const filter = { email };
    const user = await mysqldb.get(User, filter);
    if (user !== null) {
      res.status(400).json({ error: 'user exists' });
      return;
    }

    let hashedPwd;
    try {
        hashedPwd = await bcrypt.hash(password, 10);
        console.log(hashedPwd);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
        return;
    }

    const obj = {
      username, email, password: hashedPwd,
    }
    const newUser = await mysqldb.createModel(User, obj);
    delete newUser.password;
    delete newUser.createdAt;
    delete newUser.updatedAt;
    res.status(201).json(newUser);
  }
}

module.exports = UserController;
