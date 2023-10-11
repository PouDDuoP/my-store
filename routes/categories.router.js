const express = require("express");

const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Category One'
    },
    {
      id: 2,
      name: 'Category Two'
    }
  ])
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json([
    {
      id,
      name: 'Category One',
      description: 'Description One'
    }
  ])
});

router.get('/:id_category/products/:id_product', (req, res) => {
  const { id_category, id_product } = req.params;
  res.json({
    id_category,
    id_product,
  });
});

module.exports = router;
