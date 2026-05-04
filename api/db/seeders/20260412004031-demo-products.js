'use strict';
const { PRODUCT_TABLE } = require('./../models/product.model');
const { faker } = require('@faker-js/faker/locale/es'); // Usar locale español

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const products = [];

    // Category IDs: 1 = Clothing, 2 = Electronics, 3 = Home & Garden
    const categoryIds = [1, 2, 3];

    // Generar 25 productos con datos realistas
    for (let i = 1; i <= 25; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: `https://loremflickr.com/640/480/${faker.commerce.product().toLowerCase()}?random=${i}`,
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        create_at: new Date(),
        is_active: true,
        category_id: categoryIds[Math.floor(Math.random() * categoryIds.length)],
      });
    }

    await queryInterface.bulkInsert(PRODUCT_TABLE, products);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
  }
};
