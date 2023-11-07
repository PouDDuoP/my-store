const { Client } = require("pg");

async function getConnection() {
  const client = new Client({
    host: '172.23.0.3', // Aqui va law ip generada con docker o el localhost dependiendo de donde este corriendo la base de datos postgres
    post: 5432,
    user: "root",
    password: "123456",
    database: "my_store"
  });
  await client.connect();
  return client;
}

module.exports = getConnection;
