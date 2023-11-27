const { User, UserSchema } = require('./user.model');
const { Category, CategorySchema } = require('./category.model');
const { Product, ProductSchema } = require('./product.model');
const { Tier, TierSchema } = require('./tier.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Tier.init(TierSchema, Tier.config(sequelize));

  // relationship
  Product.associate(sequelize.models);
  Category.associate(sequelize.models);
  Tier.associate(sequelize.models);
}

module.exports = setupModels;
