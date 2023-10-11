const express = require("express");
const routerApi = require("./routes");

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hola este el servicio express')
});

app.get('/new-route', (req, res) => {
  res.send('Hola esta es una nueva ruta')
});

app.listen(port, () => {
  console.log('My port '+ port);
});

routerApi(app);

// console.log('My App');

