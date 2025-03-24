const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');
const { PRODUCT_TABLE } = require('./product.model');

const COMMISSION_TABLE = 'commissions';

const CommissionSchema = {
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
}

class Commission extends Model {
  static associate(models) {
    this.belongsTo(models.User, {as: 'user'});
    this.belongsTo(models.Product, {as: 'product'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COMMISSION_TABLE,
      modelName: 'Commission',
      timestamps: false
    }
  }
}

module.exports = { COMMISSION_TABLE, CommissionSchema, Commission }
