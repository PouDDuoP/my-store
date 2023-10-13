const express = require("express");
const routerApi = require("./routes");

const { logErrors, errorHandler } = require('./middleware/error.handler')

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola este el servicio express')
});

app.get('/new-route', (req, res) => {
  res.send('Hola esta es una nueva ruta')
});

routerApi(app);

app.use(logErrors);
app.use(errorHandler);

app.listen(port, () => {
  console.log('My port '+ port);
});

// console.log('My App');

