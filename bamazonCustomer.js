
const inquirer = require('inquirer');
const db = require('./database');

function buildLocalDB(sqlResult) {
  var localDB = [];

  sqlResult.forEach(function(item, index) {
    localDB[parseInt(item.item_id)] = {
      item_id         : item.item_id,
      product_name    : item.product_name,
      department_name : item.department_name,
      price           : item.price,
      stock_quantity  : parseInt(item.stock_quantity),
    };
  });

  return localDB;
}

function printDB(localDB) {
  localDB.forEach(function(item, index) {
    if (item) {
      console.log('----- ID: ' + item.item_id + '-----');
      console.log('NAME: ' + item.product_name);
      console.log('PRICE: $' + item.price);
    }
  })
}

db.getAll(function(result) {
  var dbImage = buildLocalDB(result);

  console.log("Here is our DB");

  printDB(dbImage);

  var questions = [
    {
      type: 'input',
      name: 'itemID',
      message: "What is the ID of the item you wanna buy?",
      validate: function(value) {
        if (value in dbImage) {
          return true;
        }
        return 'Please enter a valid ID';
      }
    },
    {
      type: 'input',
      name: 'buyTotal',
      message: "How many you wanna buy?",
      validate: function(value) {
        if (parseInt(value) > -1){
          return true;
        }
        return 'Please enter a valid number';
      }
    }
  ];

  inquirer.prompt(questions).then(answers => {
    var itemID   = parseInt(answers["itemID"]),
        currentQuantity = dbImage[itemID].stock_quantity,
        buyTotal = parseInt(answers["buyTotal"]),
        price    = parseFloat(dbImage[itemID].price);

    if (currentQuantity < buyTotal) {
      console.log('Sorry we don\'t have enough item for you');
    }
    else {
      // handle DB update
      db.updateProduct(itemID, currentQuantity - buyTotal, function(result) {
        console.log('Now you owe us $' + price * buyTotal);
        return;
      });
    }
    
  });

});
/*
7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
   * This means updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.
*/



