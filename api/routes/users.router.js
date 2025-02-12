/**
  * @swagger
  * components:
  *   schemas:
  *     Users:
  *       type: object
  *       required:
  *         - username
  *         - email
  *         - password
  *         - firstName
  *         - lastName
  *         - profile
  *       properties:
  *         id:
  *           type: integer
  *           description: The auto-generated id of the user
  *         username:
  *           type: string
  *           description: The username of your user
  *         email:
  *           type: string
  *           description: The email of your user
  *         password:
  *           type: string
  *           description: The password of your user
  *         firstName:
  *           type: string
  *           description: The first name of your user
  *         lastName:
  *           type: string
  *           description: The last name of your user
  *         profile:
  *           type: string
  *           description: The profile of your user
  *         isActive:
  *           type: boolean
  *           description: The indicator of whether the user is active
  *         createdAt:
  *           type: string
  *           description: The date the user was added
  *       example:
  *         id: 1
  *         username: Username
  *         email: example@gmail.com
  *         password: aaabbb1234
  *         firstName: First name of user
  *         lastName: Last name of user
  *         profile: basic
  *         isActive: true
  *         createdAt: 2024-03-10T04:05:06.157Z
  *
*/

/**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  * /users:
  *   get:
  *     summary: Lists all the users
  *     tags: [Users]
  *     responses:
  *       200:
  *         description: The list of the users
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Users'
  *   post:
  *     summary: Create a new User
  *     tags: [Users]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Users'
  *     responses:
  *       200:
  *         description: The created User.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Users'
  *       500:
  *         description: Some server error
  * /Users/{id}:
  *   get:
  *     summary: Get the User by id
  *     tags: [Users]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The User id
  *     responses:
  *       200:
  *         description: The User response by id
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Users'
  *       404:
  *         description: The User was not found
  *   put:
  *     summary: Update the User by the id
  *     tags: [Users]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The User id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Users'
  *     responses:
  *       200:
  *         description: The User was updated
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Users'
  *       404:
  *         description: The User was not found
  *       500:
  *         description: Some error happened
  *   delete:
  *     summary: Remove the User by id
  *     tags: [Users]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The User id
  *
  *     responses:
  *       200:
  *         description: The User was deleted
  *       404:
  *         description: The User was not found
*/

const express = require("express");
const passport = require("passport");

const UsersService = require("../services/user.service");
const validatorHandler = require("../middleware/validator.handler");
const { checkProfile } = require("../middleware/auth.handler");
const { createUserSchema, updateUserSchema, getUserSchema } = require('../schemas/user.schema');

const router = express.Router();
const service = new UsersService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  // passport.authenticate('jwt', {session: false}),
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await service.update(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(getUserSchema, 'params'),
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
