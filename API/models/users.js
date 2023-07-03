#!/usr/bin/node

const { DataTypes, Model } = require('sequelize');
const { sequelize, mysqldb } = require('./db_engine/db');

class User extends Model {
}

User.init({
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
  }
}, {
  tableName: 'users',
  timestamps: true,
  sequelize,
})

User.sync();
// User.sync({ alter: true });

module.exports = { User };
