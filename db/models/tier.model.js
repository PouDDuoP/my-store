const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model')

const TIER_TABLE = 'tiers';

const TierSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    field: 'first_name',
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
}

class User extends Model {
  static associate(models) {
    this.belongsTo(models.User, {as: 'user'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIER_TABLE,
      modelName: 'Tier',
      timestamps: false
    }
  }
}

module.exports = { TIER_TABLE, TierSchema, User }
