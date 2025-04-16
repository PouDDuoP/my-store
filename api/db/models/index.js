const { User, UserSchema } = require('./user.model');
const { Category, CategorySchema } = require('./category.model');
const { Product, ProductSchema } = require('./product.model');
const { Tier, TierSchema } = require('./tier.model');
const { Order, OrderSchema } = require('./order.model');
const { Status, StatusSchema } = require('./status.model');
const { OrderProduct, OrderProductSchema } = require('./order-product.model');
const { Multimedia, MultimediaSchema } = require('./multimedia.model');
const { Commission, CommissionSchema } = require('./commission.model');
const { OrderProductCommission, OrderProductCommissionSchema } = require('./order-product-commission.model');

function setupModels(sequelize) {
  // Models
  User.init(UserSchema, User.config(sequelize));
  Tier.init(TierSchema, Tier.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  Status.init(StatusSchema, Status.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));
  Multimedia.init(MultimediaSchema, Multimedia.config(sequelize));
  Commission.init(CommissionSchema, Commission.config(sequelize));
  OrderProductCommission.init(OrderProductCommissionSchema, OrderProductCommission.config(sequelize));

  // Relationship
  User.associate(sequelize.models);
  Tier.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Order.associate(sequelize.models);
  Status.associate(sequelize.models);
  OrderProduct.associate(sequelize.models);
  Multimedia.associate(sequelize.models);
  Commission.associate(sequelize.models);
  OrderProductCommission.associate(sequelize.models);
}

module.exports = setupModels;
