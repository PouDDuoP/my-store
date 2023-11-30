'use strict';

const { USER_TABLE } = require('./../models/user.model');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addColumn(USER_TABLE, 'profile', {
      profile: {
        type: DataTypes.STRING,
        defaultValue: 'basic',
        allowNull: false
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn(USER_TABLE, 'profile');
  }
};
