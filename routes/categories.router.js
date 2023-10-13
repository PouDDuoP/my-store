const express = require("express");
const CategoriesService = require("../services/categories.service");

const router = express.Router();
const service = new CategoriesService();

router.get('/', (req, res) => {
  const categories = service.find();
  res.json(categories)
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const category = service.findOne(id);
  res.json(category)
});

router.get('/:id_category/products/:id_product', (req, res) => {
  const { id_category, id_product } = req.params;
  res.json({
    id_category,
    id_product,
  });
});

module.exports = router;
