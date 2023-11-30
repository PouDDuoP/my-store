'use strict';

const { ORDER_TABLE } = require('../models/order.model');
const { TIER_TABLE } = require('./../models/tier.model');
const { STATUS_TABLE } = require('../models/status.model');
const { DataTypes, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(ORDER_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      tierId: {
        type: DataTypes.INTEGER,
        field: 'tier_id',
        allowNull: false,
        references: {
          model: TIER_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      statusId: {
        type: DataTypes.INTEGER,
        field: 'status_id',
        defaultValue: 2,
        allowNull: false,
        references: {
          model: STATUS_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      total: {
        type: DataTypes.VIRTUAL,
        get() {
          if (this.products.length > 0) {
            return this.products.reduce((total, product) => {
              return total + product.price * product.OrderProduct.amount;
            }, 0);
          }
          return 0;
        }
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ORDER_TABLE);
  }
};
