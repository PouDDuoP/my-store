const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middleware/error.handler');

const app = express();

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

const swaggerDefinition = {
  explorer: true,
  openapi: "3.1.0",
  info: {
    title: "My Store Express API with Swagger",
    version: "1.0.0",
    description:
      "This is a simple CRUD API application made with Express and documented with Swagger",
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
    },
  ],
  schemes: ['http'],
  host: 'localhost:3000',
  basePath: '/api/v1',
  // paths: {
  //   path: {
  //     '/categories/': [Object]
  //   }
  // },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./api/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

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
  console.log(`My port ${port}`);
});

// console.log('My App');

