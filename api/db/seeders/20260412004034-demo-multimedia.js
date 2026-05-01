'use strict';
const { MULTIMEDIA_TABLE } = require('./../models/multimedia.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const multimedia = [];
    const mediaTypes = ['image', 'video', 'audio'];

    // Products 1-25
    for (let productId = 1; productId <= 25; productId++) {
      // Add 1-3 multimedia items per product
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3

      for (let i = 0; i < numItems; i++) {
        const mediaType = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
        multimedia.push({
          mediaType: mediaType,
          fileUrl: `https://loremflickr.com/640/480/${mediaType}?random=${productId * 10 + i}`,
          order: i + 1,
          description: `${mediaType} for product ${productId}`,
          createdAt: new Date(),
          isActive: true,
          productId: productId,
        });
      }
    }

    await queryInterface.bulkInsert(MULTIMEDIA_TABLE, multimedia);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(MULTIMEDIA_TABLE, null, {});
  }
};
