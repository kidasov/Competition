'use strict';
export default (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
    startsAt: DataTypes.DATE,
    endsAt: DataTypes.DATE,
    ownerUserId: DataTypes.INTEGER,
    location: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};