/**
  * @swagger
  * components:
  *   schemas:
  *     Products:
  *       type: object
  *       required:
  *         - name
  *         - price
  *         - image
  *         - categoryId
  *       properties:
  *         id:
  *           type: integer
  *           description: The auto-generated id of the product
  *         name:
  *           type: string
  *           description: The name of your product
  *         description:
  *           type: string
  *           description: The description of your product
  *         price:
  *           type: number
  *           description: The price of your product
  *         image:
  *           type: string
  *           description: Image URL
  *         categoryId:
  *           type: integer
  *           description: The category id  of your product
  *         isActive:
  *           type: boolean
  *           description: The indicator of whether the product is active
  *         createdAt:
  *           type: string
  *           format: date
  *           description: The date the product was added
  *       example:
  *         id: 1
  *         name: Title of product
  *         price: 3.99
  *         image: http://image.com/image.png
  *         isActive: true
  *         createdAt: 2024-03-10T04:05:06.157Z
*/

/**
  * @swagger
  * tags:
  *   name: Products
  *   description: The products managing API
  * /products:
  *   get:
  *     summary: Lists all the products
  *     tags: [Products]
  *     responses:
  *       200:
  *         description: The list of the products
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Products'
  *   post:
  *     summary: Create a new product
  *     tags: [Products]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Products'
  *     responses:
  *       200:
  *         description: The created product.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Products'
  *       500:
  *         description: Some server error
  * /products/{id}:
  *   get:
  *     summary: Get the product by id
  *     tags: [Products]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The product id
  *     responses:
  *       200:
  *         description: The product response by id
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Products'
  *       404:
  *         description: The product was not found
  *   put:
  *     summary: Update the product by the id
  *     tags: [Products]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The product id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Products'
  *     responses:
  *       200:
  *         description: The product was updated
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Products'
  *       404:
  *         description: The product was not found
  *       500:
  *         description: Some error happened
  *   delete:
  *     summary: Remove the product by id
  *     tags: [Products]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The product id
  *
  *     responses:
  *       200:
  *         description: The product was deleted
  *       404:
  *         description: The product was not found
*/

const express = require("express");
const ProductsService = require("../services/product.services");
const validatorHandler = require("../middleware/validator.handler");
const { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema } = require("../schemas/product.schema");

const router = express.Router();
const service = new ProductsService();

router.get('/',
  validatorHandler(queryProductSchema, 'query'),
  async (req, res, next) => {
    try {
      const products = await service.find(req.query);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/filter', (req, res) => {
  res.send('Soy un filter');
});

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProduct = await service.create(body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }

  }
);

router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const product = await service.update(id, body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// router.put('/:id', (req, res) => {
//   const { id } = req.params;
//   const body = req.body;
//   res.json({
//     message: 'put update',
//     data: body,
//     id
//   });
// });

router.delete('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch(error) {
      next(error);
    }
  }
);

module.exports = router;
