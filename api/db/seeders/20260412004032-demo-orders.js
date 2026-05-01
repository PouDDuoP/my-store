'use strict';
const { ORDER_TABLE } = require('./../models/order.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orders = [];

    // Tier IDs: 1 and 2 (created in demo-tiers seeder)
    // Status ID: 2 = paid (as per requirement)
    const tierIds = [1, 2];
    const statusId = 2;

    // Create 10 orders
    for (let i = 1; i <= 10; i++) {
      orders.push({
        createdAt: new Date(),
        isActive: true,
        tierId: tierIds[Math.floor(Math.random() * tierIds.length)],
        statusId: statusId,
      });
    }

    await queryInterface.bulkInsert(ORDER_TABLE, orders);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(ORDER_TABLE, null, {});
  }
};
