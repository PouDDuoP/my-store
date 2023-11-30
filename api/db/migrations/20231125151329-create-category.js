'use strict';

const { CATEGORY_TABLE } = require('./../models/category.model')
const { DataTypes, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(CATEGORY_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
      },
      image: {
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
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable(CATEGORY_TABLE);
  }
};

