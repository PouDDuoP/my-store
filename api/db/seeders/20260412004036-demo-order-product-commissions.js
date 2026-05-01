'use strict';
const { ORDER_PRODUCT_COMMISSION_TABLE } = require('./../models/order-product-commission.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // We need to query existing order_products and commissions to create proper relationships
    const orderProducts = await queryInterface.sequelize.query(
      'SELECT id, order_id, product_id FROM orders_products WHERE is_active = true;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const commissions = await queryInterface.sequelize.query(
      'SELECT id, product_id FROM commissions WHERE is_active = true;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const orderProductCommissions = [];

    for (const op of orderProducts) {
      // Find commissions for this product
      const productCommissions = commissions.filter(c => c.product_id === op.product_id);

      if (productCommissions.length > 0) {
        // Add 1 commission per order product (or all if multiple)
        for (const commission of productCommissions) {
          orderProductCommissions.push({
            commissionValue: parseFloat((Math.random() * 50).toFixed(2)), // 0-50 value
            createdAt: new Date(),
            isActive: true,
            commissionId: commission.id,
            orderProductId: op.id,
          });
        }
      }
    }

    if (orderProductCommissions.length > 0) {
      await queryInterface.bulkInsert(ORDER_PRODUCT_COMMISSION_TABLE, orderProductCommissions);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(ORDER_PRODUCT_COMMISSION_TABLE, null, {});
  }
};
