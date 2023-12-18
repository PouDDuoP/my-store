const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");
const { swaggerDocs: V1SwaggerDocs } = require('./routes/swagger');

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
  V1SwaggerDocs(app, port);
});

// console.log('My App');

