const express = require("express");
const usersRouter = require('./users.router');
const tiersRouter = require('./tiers.router');
const categoriesRouter = require('./categories.router');
const productsRouter = require('./products.router');
const ordersRouter = require('./orders.router');
const statusRouter = require('./status.router');
const authRouter = require('./auth.router');
const profileRouter = require('./profile.router');
const multimediaRouter = require('./multimedia.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router) // Pad global para todos
  router.use('/users', usersRouter);
  router.use('/tiers', tiersRouter);
  router.use('/categories', categoriesRouter);
  router.use('/products', productsRouter);
  router.use('/orders', ordersRouter);
  router.use('/status', statusRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
  router.use('/multimedia', multimediaRouter);

}

module.exports = routerApi;
