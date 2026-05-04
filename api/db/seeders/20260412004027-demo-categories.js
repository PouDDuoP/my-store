'use strict';
const { CATEGORY_TABLE } = require('./../models/category.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert(CATEGORY_TABLE, [
      {
        name: 'Clothing',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: 'https://loremflickr.com/640/480',
        create_at: new Date(),
        is_active: true,
      },
      {
        name: 'Electronics',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: 'https://loremflickr.com/640/480',
        create_at: new Date(),
        is_active: true,
      },
      {
        name: 'Home & Garden',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: 'https://loremflickr.com/640/480',
        create_at: new Date(),
        is_active: true,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(CATEGORY_TABLE, null, {});
  }
};
