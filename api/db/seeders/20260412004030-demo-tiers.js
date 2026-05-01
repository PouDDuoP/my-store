'use strict';
const { TIER_TABLE } = require('./../models/tier.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Tier users have IDs 2 and 3 (after admin with ID 1)
    await queryInterface.bulkInsert(TIER_TABLE, [
      {
        name: 'Gold Tier',
        image: 'https://loremflickr.com/640/480/tier',
        createdAt: new Date(),
        isActive: true,
        userId: 2,
      },
      {
        name: 'Silver Tier',
        image: 'https://loremflickr.com/640/480/tier',
        createdAt: new Date(),
        isActive: true,
        userId: 3,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TIER_TABLE, null, {});
  }
};
