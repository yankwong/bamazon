const mysql = require('mysql');
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "products"
});


connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId + "\n");
});

function printAllProducts() {
  var query = "SELECT * FROM `" + connection.database + "`";

  doQuery(query, function(result) {
    console.log('yo', result);
  });

}

function doQuery(query, callback) {
  connection.query(query, function(err, res) {
    if (err) throw err;

    callback(res);

    connection.end();
  });
}

module.exports = {
  printAll: printAllProducts
}