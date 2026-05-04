'use strict';
const { STATUS_TABLE } = require('./../models/status.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(STATUS_TABLE, [
      {
        name: 'pending',
        create_at: new Date(),
        is_active: true,
      },
      {
        name: 'paid',
        create_at: new Date(),
        is_active: true,
      },
      {
        name: 'shipped',
        create_at: new Date(),
        is_active: true,
      },
      {
        name: 'delivered',
        create_at: new Date(),
        is_active: true,
      },
      {
        name: 'cancelled',
        create_at: new Date(),
        is_active: true,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(STATUS_TABLE, null, {});
  }
};
