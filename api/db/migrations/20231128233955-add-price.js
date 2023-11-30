'use strict';

const {  PRODUCT_TABLE } = require('./../models/product.model');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addColumn(PRODUCT_TABLE, 'price', {
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn(PRODUCT_TABLE, 'price');
  }
};

