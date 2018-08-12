import { sequelize } from '../db';

('use strict');
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      rating: DataTypes.REAL,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('now'),
      },
    },
    {},
  );
  User.associate = function(models) {
    User.hasMany(models.event);
  };
  return User;
};
