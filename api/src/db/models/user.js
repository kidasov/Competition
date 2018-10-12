import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const User = sequelize.define('user', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  rating: DataTypes.REAL,
  password: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('now'),
  },
});

export default User;
