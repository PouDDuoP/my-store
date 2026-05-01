'use strict';
const { STATUS_TABLE } = require('./../models/status.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(STATUS_TABLE, [
      {
        name: 'pending',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'paid',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'shipped',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'delivered',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'cancelled',
        createdAt: new Date(),
        isActive: true,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(STATUS_TABLE, null, {});
  }
};
