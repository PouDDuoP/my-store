/**
  * @swagger
  * components:
  *   schemas:
  *     OrderStatus:
  *       type: object
  *       required:
  *         - name
  *       properties:
  *         id:
  *           type: integer
  *           description: The auto-generated id of the status
  *         name:
  *           type: string
  *           description: The name of your status
  *        description:
  *          type: string
  *          description: The description of the status
  *         isActive:
  *           type: boolean
  *           description: The indicator of whether the status is active
  *         createdAt:
  *           type: string
  *           format: date
  *           description: The date the status was added
  *       example:
  *         id: 1
  *         name: Name of status
  *         description: Description of status
  *         isActive: true
  *         createdAt: 2024-03-10T04:05:06.157Z
*/

/**
  * @swagger
  * tags:
  *   name: OrderStatus
  *   description: The status managing API
  * /order-status:
  *   get:
  *     summary: Lists all the status
  *     tags: [OrderStatus]
  *     responses:
  *       200:
  *         description: The list of the status
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/OrderStatus'
  *   post:
  *     summary: Create a new status
  *     tags: [OrderStatus]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/OrderStatus'
  *     responses:
  *       200:
  *         description: The created status.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/OrderStatus'
  *       500:
  *         description: Some server error
  * /order-status/{id}:
  *   get:
  *     summary: Get the status by id
  *     tags: [OrderStatus]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The status id
  *     responses:
  *       200:
  *         description: The status response by id
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/OrderStatus'
  *       404:
  *         description: The status was not found
  *   put:
  *     summary: Update the status by the id
  *     tags: [OrderStatus]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The status id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/OrderStatus'
  *     responses:
  *       200:
  *         description: The status was updated
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/OrderStatus'
  *       404:
  *         description: The status was not found
  *       500:
  *         description: Some error happened
  *   delete:
  *     summary: Remove the status by id
  *     tags: [OrderStatus]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The status id
  *
  *     responses:
  *       200:
  *         description: The status was deleted
  *       404:
  *         description: The status was not found
*/

const express = require("express");
const passport = require("passport");

const OrderStatusService = require("../services/order-status.service");
const validatorHandler = require("../middleware/validator.handler");
const { checkProfile } = require("../middleware/auth.handler");
const { createStatusSchema, updateStatusSchema, getStatusSchema } = require('../schemas/order-status.schema');

const router = express.Router();
const service = new OrderStatusService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  async (req, res, next) => {
    try {
      const status = await service.find();
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(getStatusSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const status = await service.findOne(id);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(createStatusSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newStatus = await service.create(body);
      res.status(201).json(newStatus);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(getStatusSchema, 'params'),
  validatorHandler(updateStatusSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const status = await service.update(id, body);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(getStatusSchema, 'params'),
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

module.exports = router;
