'use strict';
const { ORDER_PRODUCT_TABLE } = require('./../models/order-product.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orderProducts = [];

    // Orders 1-10, Products 1-25
    for (let orderId = 1; orderId <= 10; orderId++) {
      // Add 2-5 products per order
      const numProducts = Math.floor(Math.random() * 4) + 2; // 2-5
      const usedProductIds = new Set();

      for (let j = 0; j < numProducts; j++) {
        let productId;
        do {
          productId = Math.floor(Math.random() * 25) + 1; // 1-25
        } while (usedProductIds.has(productId));
        usedProductIds.add(productId);

        orderProducts.push({
          amount: Math.floor(Math.random() * 5) + 1, // 1-5
          createdAt: new Date(),
          isActive: true,
          orderId: orderId,
          productId: productId,
        });
      }
    }

    await queryInterface.bulkInsert(ORDER_PRODUCT_TABLE, orderProducts);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(ORDER_PRODUCT_TABLE, null, {});
  }
};
