import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const Session = sequelize.define('session', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('now'),
  },
  userId: DataTypes.INTEGER,
});

export default Session;
