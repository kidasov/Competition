import * as Sequelize from 'sequelize';

module.exports = {
  up: (queryInterface: Sequelize.QueryInterface) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      startsAt: {
        type: Sequelize.DATE,
      },
      endsAt: {
        type: Sequelize.DATE,
      },
      ownerUserId: {
        type: Sequelize.INTEGER,
      },
      location: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface: Sequelize.QueryInterface) => {
    return queryInterface.dropTable('Events');
  },
};
