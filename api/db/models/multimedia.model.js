const { Model, DataTypes, Sequelize } = require('sequelize');
const { PRODUCT_TABLE } = require('./product.model')

const MULTIMEDIA_TABLE = 'multimedia';

const MultimediaSchema = {
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
}

class Multimedia extends Model {
  static associate(models) {
    this.belongsTo(models.Product, {as: 'product'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MULTIMEDIA_TABLE,
      modelName: 'Multimedia',
      timestamps: false
    }
  }
}

module.exports = { MULTIMEDIA_TABLE, MultimediaSchema, Multimedia }
