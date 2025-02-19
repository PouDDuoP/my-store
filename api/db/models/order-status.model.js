const { Model, DataTypes, Sequelize } = require('sequelize');

const ORDER_STATUS_TABLE = 'order_status';

const OrderStatusSchema = {
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
}

class OrderStatus extends Model {
  static associate() {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_STATUS_TABLE,
      modelName: 'OrderStatus',
      timestamps: false
    }
  }
}

module.exports = { ORDER_STATUS_TABLE, OrderStatusSchema, OrderStatus }
