#!/usr/bin/node
const { createClient } = require('redis');
const { promisify } = require('util')

class RedisClient {
  constructor() {
    this.client = createClient();
    // this.client.on('connect', () => console.log('Redis Client connect to server'));
    this.client.on('error', (err) => console.log(`Redis not connected to server: ${err}`));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getKey = promisify(this.client.get).bind(this.client);

    try {
      return (await getKey(key));
    } catch (err) {
      throw new Error();
    }
  }

  async set(key, value, duration) {
    await this.client.setex(key, duration, value);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
// console.log(redisClient);