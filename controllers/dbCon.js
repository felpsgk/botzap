function createCon() {
  const { mysql } = require('../index');

  // Criando a conexão MySQL
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senhadoroot',
    database: 'users'
  });
  // Retornando a conexão
  return connection;
}

module.exports = { createCon };
