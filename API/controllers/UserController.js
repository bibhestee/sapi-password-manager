#!/usr/bin/node

const jwt = require('jsonwebtoken');
const { v4, validate } = require('uuid');
const bcrypt = require('bcrypt'); // hashes password
const { mysqldb } = require('../models/db_engine/db');
const { User } = require('../models/users');
const validateSignUp = require('../validators/signup')
const { info, error } = require('../middlewares/logger');
const { validatePassword } = require('../validators/password');

class UserController {
  // Signup Handler
  static async signup(req, res) {
    const { username, email, password, securityQuestion } = req.body;
    
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
    if (!securityQuestion) {
      res.status(400).json({ error: 'answer missing. What is your favourite city?'});
      return;
    }

    try {
      const result = await validateSignUp(username, email, password, securityQuestion);
      const isValid = validatePassword(password);

      if (result === 'email') {
        res.status(400).json({ error: 'invalid email, supports gmail and yahoo mails only' });
        return;
      }
      else if (result === 'username') {
        res.status(400).json({ error: 'username should have minimum of 3 characters and maximum of 15 characters' });
        return;
      }
      else if (result === 'password') {
        res.status(400).json({ error: 'password should have minimum of 8 characters' });
        return;
      }
      else if (result === 'securityQuestion') {
        res.status(400).json({ error: 'favourite city should have minimum of 3 characters and maximum of 12 characters' });
        return;
      }
      else if (!isValid) {
        res.status(400).json({ error: 'password should contain at least 1 Uppercase, 1 lowercase, 1 digit, and 1 special character.'});
        return;
      }
    } catch (err) {
      error(err);
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
    } catch (err) {
        error(err);
        res.status(500).json({ error: 'internal server error' });
        return;
    }

    const obj = {
      username, email, security: securityQuestion, password: hashedPwd,
    }
    const newUser = await mysqldb.createModel(User, obj);
    delete newUser.password;
    delete newUser.createdAt;
    delete newUser.updatedAt;
    delete newUser.security;
    res.status(201).json(newUser);
  }


  // Signin Handler
  static async signin(req, res) {
    const { password, email } = req.body;
    if (!password) {
      res.status(400).json({ error: 'password missing' });
      return;
    }
    if (!email) {
      res.status(400).json({ error: 'email missing' });
      return;
    }

    const filter = { email };
    const user = await mysqldb.get(User, filter);
    
    if (!user) {
      res.status(404).json({ error: 'account not found' });
      return;
    }
    try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(400).json({ error: 'incorrect password' });
            return;
        }
    } catch (err){
        error(err);
        res.status(500).json({ error: 'internal server error' });
    }

    if (!user) {
      res.status(400).json({ error: 'account not found' });
      return;
    }

    // generates jwt
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '15h' });
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.security;
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    res.status(200).header('Authorization', `Bearer ${token}`).json(user);
  }


  // Change Password Handler
  static async changePassword(req, res) {
    const { email, password, newPassword, securityQuestion } = req.body;

     if (!password) {
      res.status(400).json({ error: 'password missing' });
      return;
    }

    if (!newPassword) {
      res.status(400).json({ error: 'new password missing' });
      return;
    }

    if (!email) {
      res.status(400).json({ error: 'email missing' });
      return;
    }
     if (!securityQuestion) {
      res.status(400).json({ error: 'answer missing. What is your favourite city?' });
      return;
    }

    const filter = { email };
    const user = await mysqldb.get(User, filter);

    try {
      if (password) {
          try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(400).json({ error: 'incorrect password' });
            return;
        }
    } catch (err){
        res.status(500).json({ error: 'internal server error' });
    }
    }
    } catch (err) {
      // Continue
    }

    if (securityQuestion !== user.security) {
      res.status(400).json({ error: 'incorrect answer to security question, pls retry!' });
      return;
  }

    if (!user) {
      res.status(400).json({ error: 'account not found' });
      return;
    }
    const isValid = validatePassword(newPassword);
    if (!isValid) {
        res.status(400).json({ error: 'password should be min of 8 characters and must contain at least 1 Uppercase, 1 lowercase, 1 digit, and 1 special character.'});
        return;
      }

    // Hash the password and save to database
    let hashedPwd;
    try {
        hashedPwd = await bcrypt.hash(newPassword, 10);
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
        return;
    }

    const updatedUser = await mysqldb.update(User, { email: user.email }, { password: hashedPwd });
    res.status(200).json({info: `User ${user.username} password successfully updated!`});
  }

  // Forget Password Handler
  static async forgetPassword(req, res) {
    const { email, confirmPassword, newPassword, securityQuestion } = req.body;


    if (!newPassword) {
      res.status(400).json({ error: 'new password missing' });
      return;
    }

    if (!confirmPassword) {
      res.status(400).json({ error: 'confirm password missing' });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: "password doesn't match"});
      return;
    }

    if (!email) {
      res.status(400).json({ error: 'email missing' });
      return;
    }
     if (!securityQuestion) {
      res.status(400).json({ error: 'answer missing. What is your favourite city?' });
      return;
    }

    const filter = { email };
    const user = await mysqldb.get(User, filter);


    if (securityQuestion !== user.security) {
      res.status(400).json({ error: 'incorrect answer to security question, pls retry!' });
      return;
  }

    if (!user) {
      res.status(400).json({ error: 'account not found' });
      return;
    }

    const isValid = validatePassword(newPassword);
    if (!isValid) {
        res.status(400).json({ error: 'password should be min of 8 characters and must contain at least 1 Uppercase, 1 lowercase, 1 digit, and 1 special character.'});
        return;
      }
      
    // Hash the password and save to database
    let hashedPwd;
    try {
        hashedPwd = await bcrypt.hash(newPassword, 10);
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
        return;
    }

    const updatedUser = await mysqldb.update(User, { email: user.email }, { password: hashedPwd });
    res.status(200).json({info: `User ${user.username} password successfully updated!`});
  }

  // Generate API key
  static async generateApiKey(req, res) {
    const email = res.locals.email;

    let apiKey;
    try {
      apiKey = `sapi_${ await bcrypt.hash(email, 5)}`;
    } catch(err) {
      error(err);
      res.status(500).json({ error: "internal server error"});
    }


    let updatedModel;
    let user;
    try {
      updatedModel = await mysqldb.update(User, { email }, { apiKey });

      if (updatedModel[0] === 1) {
        user = await mysqldb.get(User, { apiKey }, ['username', 'email', 'apiKey']);
      }
      res.status(200).json(user);
    } catch(err) {
      error(`${err.message}`);
      res.status(500).json({ error: "internal server error"}); 
    }
  }
}

module.exports = UserController;
