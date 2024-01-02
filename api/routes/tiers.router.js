/**
  * @swagger
  * components:
  *   schemas:
  *     Tiers:
  *       type: object
  *       required:
  *         - name
  *         - image
  *         - user
  *       properties:
  *         id:
  *           type: integer
  *           description: The auto-generated id of the tier
  *         name:
  *           type: string
  *           description: The name of your tier
  *         user:
  *           type: object
  *           required:
  *             - username
  *             - email
  *             - password
  *             - firstName
  *             - lastName
  *             - profile
  *           properties:
  *             id:
  *               type: integer
  *               description: The auto-generated id of the user
  *             username:
  *               type: string
  *               description: The username of your user
  *             email:
  *               type: string
  *               description: The email of your user
  *             password:
  *               type: string
  *               description: The password of your user
  *             firstName:
  *               type: string
  *               description: The first name of your user
  *             lastName:
  *               type: string
  *               description: The last name of your user
  *             profile:
  *               type: string
  *               description: The profile of your user
  *             isActive:
  *               type: boolean
  *               description: The indicator of whether the user is active
  *             createdAt:
  *               type: string
  *               description: The date the user was added
  *         isActive:
  *           type: boolean
  *           description: The indicator of whether the tier is active
  *         createdAt:
  *           type: string
  *           format: date
  *           description: The date the tier was added
  *       example:
  *         id: 1
  *         name: Name of tier
  *         isActive: true
  *         createdAt: 2024-03-10T04:05:06.157Z
  *         user:
  *            username: root
  *            email: kevinalvarado.ag@gmail.com
  *            password: aaabbb1234
  *            firstName: kevin tier 1
  *            lastName: alvarado tier 1
  *            profile: tier
  *            isActive: true
  *            createdAt: 2024-03-10T04:05:06.157Z
  *
*/

/**
  * @swagger
  * tags:
  *   name: Tiers
  *   description: The tiers managing API
  * /tiers:
  *   get:
  *     summary: Lists all the tiers
  *     tags: [Tiers]
  *     responses:
  *       200:
  *         description: The list of the tiers
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Tiers'
  *   post:
  *     summary: Create a new Tier
  *     tags: [Tiers]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Tiers'
  *     responses:
  *       200:
  *         description: The created Tier.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Tiers'
  *       500:
  *         description: Some server error
  * /tiers/{id}:
  *   get:
  *     summary: Get the Tier by id
  *     tags: [Tiers]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The Tier id
  *     responses:
  *       200:
  *         description: The Tier response by id
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Tiers'
  *       404:
  *         description: The Tier was not found
  *   put:
  *     summary: Update the Tier by the id
  *     tags: [Tiers]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The Tier id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Tiers'
  *     responses:
  *       200:
  *         description: The Tier was updated
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Tiers'
  *       404:
  *         description: The Tier was not found
  *       500:
  *         description: Some error happened
  *   delete:
  *     summary: Remove the Tier by id
  *     tags: [Tiers]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The Tier id
  *
  *     responses:
  *       200:
  *         description: The Tier was deleted
  *       404:
  *         description: The Tier was not found
*/

const express = require("express");
const passport = require("passport");

const TierService = require("../services/tier.service");
const validatorHandler = require("../middleware/validator.handler");
const { checkProfile } = require("../middleware/auth.handler");
const { createTierSchema, updateTierSchema, getTierSchema } = require('../schemas/tier.schema');

const router = express.Router();
const service = new TierService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  async (req, res, next) => {
    try {
      const tiers = await service.find();
      res.json(tiers);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  validatorHandler(getTierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const tier = await service.findOne(id);
      res.json(tier);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  validatorHandler(createTierSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTier = await service.create(body);
      res.status(201).json(newTier);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  validatorHandler(getTierSchema, 'params'),
  validatorHandler(updateTierSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const tier = await service.update(id, body);
      res.json(tier);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(getTierSchema, 'params'),
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
