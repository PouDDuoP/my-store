'use strict';
const { COMMISSION_TABLE } = require('./../models/commission.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const commissions = [];

    // Tier users are IDs 2 and 3
    // Products 1-25
    const tierUserIds = [2, 3];

    for (let productId = 1; productId <= 25; productId++) {
      // Create 1-2 commissions per product (from different tier users)
      const numCommissions = Math.floor(Math.random() * 2) + 1; // 1-2
      const usedUserIds = new Set();

      for (let i = 0; i < numCommissions; i++) {
        let userId;
        do {
          userId = tierUserIds[Math.floor(Math.random() * tierUserIds.length)];
        } while (usedUserIds.has(userId));
        usedUserIds.add(userId);

        commissions.push({
          percentage: parseFloat((Math.random() * 10).toFixed(2)), // 0-10%
          create_at: new Date(),
          is_active: true,
          user_id: userId,
          product_id: productId,
        });
      }
    }

    await queryInterface.bulkInsert(COMMISSION_TABLE, commissions);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(COMMISSION_TABLE, null, {});
  }
};
