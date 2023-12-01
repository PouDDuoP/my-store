'use strict';

const { USER_TABLE } = require('./../models/user.model');
const { CATEGORY_TABLE } = require('./../models/category.model');
const { PRODUCT_TABLE } = require('./../models/product.model');
const { TIER_TABLE } = require('./../models/tier.model');
const { STATUS_TABLE } = require('../models/status.model');
const { ORDER_TABLE } = require('../models/order.model');
const { ORDER_PRODUCT_TABLE } = require('../models/order-product.model');
const { DataTypes } = require('sequelize');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name',
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profile: {
        type: DataTypes.STRING,
        defaultValue: 'basic',
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      isSuperuser: {
        type: DataTypes.BOOLEAN,
        field: 'is_superuser',
        defaultValue: false,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
        defaultValue: false,
        allowNull: false
      }
    });
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
    await queryInterface.createTable(PRODUCT_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      price: {
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
      categoryId: {
        type: DataTypes.INTEGER,
        field: 'category_id',
        allowNull: false,
        references: {
          model: CATEGORY_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
    await queryInterface.createTable(TIER_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
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
      }
    });
    await queryInterface.createTable(STATUS_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
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
      }
    });
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
      }
    });
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
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
      orderId: {
        type: DataTypes.INTEGER,
        field: 'order_id',
        allowNull: false,
        references: {
          model: ORDER_TABLE,
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
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(CATEGORY_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(TIER_TABLE);
    await queryInterface.dropTable(STATUS_TABLE);
    await queryInterface.dropTable(ORDER_TABLE);
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
  }
};
