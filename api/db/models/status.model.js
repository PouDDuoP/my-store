const { Model, DataTypes, Sequelize } = require('sequelize');

const STATUS_TABLE = 'status';

const StatusSchema = {
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
}

class Status extends Model {
  static associate() {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: STATUS_TABLE,
      modelName: 'Status',
      timestamps: false
    }
  }
}

module.exports = { STATUS_TABLE, StatusSchema, Status }
