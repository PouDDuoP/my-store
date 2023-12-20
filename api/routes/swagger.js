const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use('/api-docs', swaggerUi.serve);
// app.get('/api-docs', swaggerUi.setup(swaggerDocument));

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
      url: "http://localhost:3000/api/v1/",
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
  // apis: ["./api/routes/index.js"]
  apis: ["./api/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerDocs = (app, port) => {
  app.use("/api/v1/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
    // swaggerUi.setup(swaggerSpec, { explorer: true })
  );
  app.get("/api/v1/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Version 1 Docs are available at http://localhost:${port}/api/v1/docs`);

}

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options_));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// https://www.youtube.com/watch?v=RayDPBYou4I

module.export = { swaggerDocs };
