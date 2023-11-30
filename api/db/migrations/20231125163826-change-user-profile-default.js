'use strict';
const { DataTypes } = require('sequelize');

const { USER_TABLE } = require('./../models/user.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.changeColumn(USER_TABLE, 'profile', {
      type: DataTypes.STRING,
      defaultValue: 'basic',
      allowNull: false
    }
    );
  },

  async down (queryInterface) {
    // await queryInterface.removeColumn(USER_TABLE, 'profile');
  }
};
