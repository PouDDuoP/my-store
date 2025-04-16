'use strict';

const { ORDER_PRODUCT_COMMISSION_TABLE } = require('../models/order-product-commission.model');
const { COMMISSION_TABLE } = require('../models/commission.model');
const { ORDER_PRODUCT_TABLE } = require('../models/order-product.model');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(ORDER_PRODUCT_COMMISSION_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      commissionValue: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
        defaultValue: false,
        allowNull: false
      },
      commissionId: {
        type: DataTypes.INTEGER,
        field: 'commission_id',
        allowNull: false,
        references: {
          model: COMMISSION_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      orderProductId: {
        type: DataTypes.INTEGER,
        field: 'order_product_id',
        allowNull: false,
        references: {
          model: ORDER_PRODUCT_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ORDER_PRODUCT_COMMISSION_TABLE);
  }
};
