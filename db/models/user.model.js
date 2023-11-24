const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  // profile: {
    //   type: DataTypes.STRING,
    //   defaultValue: 'customer',
    //   allowNull: false
  // },
  createdAt: {
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  isSuperuser: {
    type: DataTypes.BOOLEAN,
    field: 'is_superuser',
    allowNull: false
  },
  isActive: {
    type: DataTypes.DATE,
    field: 'is_active',
    defaultValue: Sequelize.NOW,
    allowNull: false
  }
}

class User extends Model {
  static associate() {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

module.exports = { USER_TABLE, UserSchema, User }
