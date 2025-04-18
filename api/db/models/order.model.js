const { Model, DataTypes, Sequelize } = require('sequelize');
const { TIER_TABLE } = require('./tier.model');
const { STATUS_TABLE } = require('./status.model');

const ORDER_TABLE = 'orders';

const OrderSchema = {
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
      if (this.products && this.products.length > 0) {
        return this.products.reduce((total, product) => {
          return total + product.price * product.OrderProduct.amount;
        }, 0);
      }
      return 0;
    }
  }
}

class Order extends Model {
  static associate(models) {
    this.belongsTo(models.Tier, {as: 'tier'});
    this.belongsTo(models.Status, {as: 'status'});
    this.belongsToMany(models.Product, {
      as: 'products',
      through: models.OrderProduct,
      foreignKey: 'orderId',
      otherKey: 'productId'
    });
    this.hasMany(models.OrderProduct, {
      as: 'orderProducts',
      foreignKey: 'orderId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false
    }
  }
}

module.exports = { ORDER_TABLE, OrderSchema, Order }
