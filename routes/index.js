const express = require("express");
const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const tiersRouter = require('./tiers.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router) // Pad global para todos
  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/tiers', tiersRouter);

}

module.exports = routerApi;
