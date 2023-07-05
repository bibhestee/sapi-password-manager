#!/usr/bin/node

const moment = require('moment');
const { User } = require('../models/users');
const redisClient = require('../models/db_engine/redis');
const { mysqldb } = require('../models/db_engine/db');


// console.log(redisClient);
async function rateLimiter(req, res, next) {
    const apiKey = req.query.api_key;
    
    if (!apiKey) {
        res.status(401).json({ error: "unauthorized"})
    }
    let user;
    let userId;
    try {
        user = await mysqldb.get(User, { apiKey }, [ 'id', 'apiKey']);
        if (user) {
            userId = `${user.id}`;
        }
        else {
            res.status(401).json({ error: "unauthorized"});
            return
        }
       
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "internal server error"});
        return;
    }

    let userData;
    try {
        userData = await redisClient.get(userId);
        if (!userData) {
            const currentTime = moment().unix();
            const userData = JSON.stringify({ count: 1, startTime: currentTime });
            redisClient.set(userId, userData, 60); // Set expiration time to 1 minute
            next();
        } else {
            const { count, startTime } = JSON.parse(userData);
            const currentTime = moment().unix();
            const timeDifference = currentTime - startTime;
            
            if (timeDifference >= 60) {
                // reset the count and start time
                const currentTime = moment().unix();
                const userData = JSON.stringify({ count: 1, startTime: currentTime });
                redisClient.set(userId, userData, 60);
                next();
            } else {
                if (count < 10) {
                    // time window still active
                    const userData = JSON.stringify({ count: count + 1, startTime });
                    redisClient.set(userId, userData, 60); // Set expiration time to 1 minute
                    next();
                } else {
                    // Rate limit exceeded
                    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
                }
            }
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: "internal server error"});
        return;
    }
}

module.exports = rateLimiter;
