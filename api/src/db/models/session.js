export default (sequelize, DataTypes) => {
  return sequelize.define('Session', {
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
};
