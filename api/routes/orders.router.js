/**
  * @swagger
  * components:
  *   schemas:
  *     Orders:
  *       type: object
  *       required:
  *         - tierId
  *         - statusId
  *       properties:
  *         id:
  *           type: integer
  *           description: The auto-generated id of the user
  *         tierId:
  *           type: integer
  *           description: The tier id of your user
  *         statusId:
  *           type: integer
  *           description: The status id of your user
  *         isActive:
  *           type: boolean
  *           description: The indicator of whether the user is active
  *         createdAt:
  *           type: string
  *           description: The date the user was added
  *       example:
  *         id: 1
  *         tierId: 1
  *         statusId: 2
  *         isActive: true
  *         createdAt: 2024-03-10T04:05:06.157Z
  *
*/

/**
  * @swagger
  * tags:
  *   name: Orders
  *   description: The orders managing API
  * /orders:
  *   get:
  *     summary: Lists all the orders
  *     tags: [Orders]
  *     responses:
  *       200:
  *         description: The list of the orders
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Orders'
  *   post:
  *     summary: Create a new Order
  *     tags: [Orders]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Orders'
  *     responses:
  *       200:
  *         description: The created Order.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Orders'
  *       500:
  *         description: Some server error
  * /Orders/{id}:
  *   get:
  *     summary: Get the Order by id
  *     tags: [Orders]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The Order id
  *     responses:
  *       200:
  *         description: The Order response by id
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Orders'
  *       404:
  *         description: The Order was not found
  *   put:
  *     summary: Update the Order by the id
  *     tags: [Orders]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The Order id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Orders'
  *     responses:
  *       200:
  *         description: The Order was updated
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Orders'
  *       404:
  *         description: The Order was not found
  *       500:
  *         description: Some error happened
  *   delete:
  *     summary: Remove the Order by id
  *     tags: [Orders]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The Order id
  *
  *     responses:
  *       200:
  *         description: The Order was deleted
  *       404:
  *         description: The Order was not found
*/

const express = require("express");
const passport = require("passport");

const OrderService = require("../services/order.service");
const validatorHandler = require("../middleware/validator.handler");
const { checkProfile } = require("../middleware/auth.handler");
const { createOrderSchema, updateOrderSchema, getOrderSchema, addProductSchema, addCommissionSchema } = require('../schemas/order.schema');

const router = express.Router();
const service = new OrderService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  async (req, res, next) => {
    try {
      const orders = await service.find();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  validatorHandler(createOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newOrder = await service.create(body);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  validatorHandler(getOrderSchema, 'params'),
  validatorHandler(updateOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const order = await service.update(id, body);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

router.post('/add-products',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  validatorHandler(addProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newAddProduct= await service.addProduct(body);
      res.status(201).json(newAddProduct);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/add-commissions',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  validatorHandler(addCommissionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newAddCommission= await service.addCommission(body);
      res.status(201).json(newAddCommission);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
