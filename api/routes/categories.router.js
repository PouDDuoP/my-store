/**
  * @swagger
  * components:
  *   schemas:
  *     Categories:
  *       type: object
  *       required:
  *         - name
  *         - image
  *       properties:
  *         id:
  *           type: integer
  *           description: The auto-generated id of the category
  *         name:
  *           type: string
  *           description: The name of your category
  *         image:
  *           type: string
  *           description: Image URL
  *         isActive:
  *           type: boolean
  *           description: The indicator of whether the category is active
  *         createdAt:
  *           type: string
  *           format: date
  *           description: The date the category was added
  *       example:
  *         id: 1
  *         name: Title of Category
  *         image: http://image.com/image.png
  *         isActive: true
  *         createdAt: 2024-03-10T04:05:06.157Z
*/

/**
  * @swagger
  * tags:
  *   name: Categories
  *   description: The categories managing API
  * /categories:
  *   get:
  *     summary: Lists all the categories
  *     tags: [Categories]
  *     responses:
  *       200:
  *         description: The list of the categories
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Categories'
  *   post:
  *     summary: Create a new category
  *     tags: [Categories]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Categories'
  *     responses:
  *       200:
  *         description: The created category.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Categories'
  *       500:
  *         description: Some server error
  * /categories/{id}:
  *   get:
  *     summary: Get the category by id
  *     tags: [Categories]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The category id
  *     responses:
  *       200:
  *         description: The category response by id
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Categories'
  *       404:
  *         description: The category was not found
  *   put:
  *     summary: Update the category by the id
  *     tags: [Categories]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The category id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Categories'
  *     responses:
  *       200:
  *         description: The category was updated
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Categories'
  *       404:
  *         description: The category was not found
  *       500:
  *         description: Some error happened
  *   delete:
  *     summary: Remove the category by id
  *     tags: [Categories]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The category id
  *
  *     responses:
  *       200:
  *         description: The category was deleted
  *       404:
  *         description: The category was not found
*/

const express = require("express");
const passport = require("passport");

const CategoriesService = require("../services/category.service");
const validatorHandler = require("../middleware/validator.handler");
const { checkAdminProfile, checkProfile } = require("../middleware/auth.handler");
const { createCategorySchema, updateCategorySchema, getCategorySchema } = require("../schemas/category.schema");

const router = express.Router();
const service = new CategoriesService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile(['admin', 'tier', 'customer']),
  async (req, res, next) => {
    try {
      const categories = await service.find();
      res.json(categories)
    } catch (error) {
      next(error);
    }

  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile(['admin', 'tier', 'customer']),
  validatorHandler(getCategorySchema, 'params'),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const category = await service.findOne(id);
        res.json(category)
      } catch(error) {
        next(error);
      }
    }
  );

// router.get('/:id_category/products/:id_product', (req, res) => {
//   const { id_category, id_product } = req.params;
//   res.json({
//     id_category,
//     id_product,
//   });
// });

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile(['admin']),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile(['admin']),
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const category = await service.update(id, body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkAdminProfile,
  validatorHandler(getCategorySchema, 'params'),
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
