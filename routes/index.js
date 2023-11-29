const express = require("express");
const usersRouter = require('./users.router');
const tiersRouter = require('./tiers.router');
const categoriesRouter = require('./categories.router');
const productsRouter = require('./products.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router) // Pad global para todos
  router.use('/users', usersRouter);
  router.use('/tiers', tiersRouter);
  router.use('/categories', categoriesRouter);
  router.use('/products', productsRouter);

}

module.exports = routerApi;
