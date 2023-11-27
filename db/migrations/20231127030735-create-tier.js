'use strict';

const { TierSchema, TIER_TABLE } = require('./../models/tier.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(TIER_TABLE, TierSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(TIER_TABLE);
  }
};
