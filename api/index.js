const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middleware/error.handler');

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument  = require('swagger-jsdoc');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;

app.use(express.json());

const whitelist = [ 'http://localhost:8080', 'http://localhost:8081' ]
const options = {
  origin: (origin, callback) => {
    if ( whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));

// app.use('/api-docs', swaggerUi.serve);
// app.get('/api-docs', swaggerUi.setup(swaggerDocument));

var options_ = {
  explorer: true,
  swaggerOptions: {
    url: 'http://localhost:3000/api/v1/'
  }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options_));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/', (req, res) => {
  res.send('Hola este el servicio express');
});

app.get('/api/new-route', (req, res) => {
  res.send('Hola esta es una nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('My port '+ port);
});

// console.log('My App');

