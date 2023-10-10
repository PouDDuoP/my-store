const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hola este el servicio express')
});

app.get('/new-route', (req, res) => {
  res.send('Hola esta es una nueva ruta')
});

app.get('/products', (req, res) => {
  res.json({
    name: 'Product One',
    price: 1000
  })
});

app.get('/category', (req, res) => {
  res.json({
    id: 1,
    name: 'Category One'
  })
});

app.listen(port, () => {
  console.log('My port '+ port);
})

// console.log('My App');
