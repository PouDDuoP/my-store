'use strict';

const { StatusSchema, STATUS_TABLE } = require('../models/status.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(STATUS_TABLE, StatusSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(STATUS_TABLE);
  }
};
