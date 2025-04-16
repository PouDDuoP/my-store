'use strict';

const { MULTIMEDIA_TABLE } = require('./../models/multimedia.model');
const { PRODUCT_TABLE } = require('./../models/product.model');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable(MULTIMEDIA_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      mediaType: {
        type: DataTypes.ENUM('image', 'video', 'audio'),
        allowNull: false
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
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

    await queryInterface.dropTable(MULTIMEDIA_TABLE);
  }
};
