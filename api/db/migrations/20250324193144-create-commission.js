'use strict';

const { COMMISSION_TABLE } = require('./../models/commission.model');
const { USER_TABLE } = require('./../models/user.model');
const { PRODUCT_TABLE } = require('./../models/product.model');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(COMMISSION_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      percentage: {
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
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: false,
        references: {
          model: USER_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      productId: {
        type: DataTypes.INTEGER,
        field: 'product_id',
        allowNull: false,
        references: {
          model: PRODUCT_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable(COMMISSION_TABLE);
  }
};
