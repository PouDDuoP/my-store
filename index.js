const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hola este el servicio express')
});

app.get('/new-route', (req, res) => {
  res.send('Hola esta es una nueva ruta')
});

// Categories

app.get('/category', (req, res) => {
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

app.get('/category/:id', (req, res) => {
  const { id } = req.params;
  res.json([
    {
      id,
      name: 'Category One',
      description: 'Description One'
    }
  ])
});

app.get('/categories/:id_category/products/:id_product', (req, res) => {
  const { id_category, id_product } = req.params;
  res.json({
    id_category,
    id_product,
  });
});

// Products

app.get('/products', (req, res) => {
  res.json([
    {
      name: 'Product One',
      price: 1000
    },
    {
      name: 'Product Two',
      price: 2000
    },
    {
      name: 'Product Three',
      price: 3000
    },
    {
      name: 'Product Four',
      price: 4000
    }
  ])
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    name: 'Product Two',
    description: 'Description Two',
    price: 2000
  })
})

app.listen(port, () => {
  console.log('My port '+ port);
})

// console.log('My App');
