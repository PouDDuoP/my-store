const { Pool } = require("pg");

// con pool comparte la conexion .con todos los que lo nescesiten realizando solo una instancia

const pool = new Pool({
  host: '172.23.0.3', // Aqui va law ip generada con docker o el localhost dependiendo de donde este corriendo la base de datos postgres
  post: 5432,
  user: "root",
  password: "123456",
  database: "my_store"
});

module.exports = pool;
