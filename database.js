const mysql = require('mysql');
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});
const DB_TABLE = 'products';


connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId + "\n");
});

function getAllProducts(callback) {
  var query = "SELECT * FROM `" + DB_TABLE + "`";

  doQuery(query, function(result) {
    callback(result);
  });
}

function totalItems() {
  var query = "SELECT COUNT (*) as `total_items` FROM " + DB_TABLE
  doQuery(query, function(result) {
    console.log(result);
  })
}

function doQuery(query, callback) {
  connection.query(query, function(err, res) {
    if (err) throw err;

    callback(res);

    //connection.end();
  });
}

function updateProduct(id, quantity, callback) {
  var query = "UPDATE " + DB_TABLE + 
             " SET `stock_quantity` = " + quantity + 
             " WHERE `item_id` = " + id;

  doQuery(query, function(result) {
    callback(result);
  });
}

function endConnection() {
  connection.end();
}

function getLowInventory(callback) {
  var query = "SELECT * FROM `" + DB_TABLE + "` " +
              "WHERE `stock_quantity` < 5";

  doQuery(query, function(result) {
    callback(result);
  });
}

function addItem(itemObj, callback) {
  var query = "INSERT INTO `" + DB_TABLE + "` " +
              "(`product_name`, `department_name`, `price`, `stock_quantity`) VALUES" +
              "('" + itemObj.name + "', '" + itemObj.dept + "', '" + itemObj.price + "', '" + itemObj.total + "')";

  doQuery(query, function(result) {
    callback(result);
  });      
}

module.exports = {
  getAll          : getAllProducts,
  totalRows       : totalItems,
  updateProduct   : updateProduct,
  endConnection   : endConnection,
  getLowInventory : getLowInventory,
  addItem         : addItem,
}