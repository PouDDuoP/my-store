const express = require("express");
const { faker } = require("@faker-js/faker");

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
  const products = [];
  const { size } = req.query;
  const limit = size || 10;

  for (let index = 0; index < limit; index++) {
    products.push({
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price(), 10),
      Image: faker.image.imageUrl(),
    });

  }

  res.json(products);
});

app.get('/products/filter', (req, res) => {
  res.send('Soy un filter');
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

// Users

app.get('/users', (req, res) => {
  const { limit, offset } = req.query;
  if ( limit && offset ) {
    res.json({
      limit,
      offset
    });
  } else {
    res.send('No Hay Parametros');
  }
});
