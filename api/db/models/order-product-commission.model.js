const { Model, DataTypes, Sequelize } = require('sequelize');
const { ORDER_PRODUCT_TABLE } = require('./order-product.model');
const { COMMISSION_TABLE } = require('./commission.model');

const ORDER_PRODUCT_COMMISSION_TABLE = 'orders_products_commissions';

const OrderProductCommissionSchema = {
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
}

class OrderProductCommission extends Model {
  static associate(models) {
    this.belongsTo(models.OrderProduct, {as: 'orderProduct'});
    this.belongsTo(models.Commission, {as: 'commission'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PRODUCT_COMMISSION_TABLE,
      modelName: 'OrderProductCommission',
      timestamps: false
    }
  }
}

module.exports = { ORDER_PRODUCT_COMMISSION_TABLE, OrderProductCommissionSchema, OrderProductCommission };
