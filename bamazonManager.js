/*
* Add New Product
* If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
*/

const INQUIRER = require('inquirer');
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
      console.log('QUANTITY: ' + item.stock_quantity);
    }
  })
}

var questions = [
    {
      type: 'input',
      name: 'action',
      message: "What do you want to do\n" +
               "1. View Products for Sale\n" +
               "2. View Low Inventory\n" + 
               "3. Add to Inventory\n" +
               "4. Add New Product\n",
      validate: function(value) {
        if (parseInt(value) > 0 && parseInt(value) < 5) {
          return true;
        }
        return 'Please enter a valid action';
      }
    },
  ];

  db.getAll(function(result) {
    var dbImage = buildLocalDB(result);


    INQUIRER.prompt(questions).then(answers => {
      var actionID = parseInt(answers["action"]);

      if (actionID === 1) {
          console.log("Here is our DB");
          printDB(dbImage);
          db.endConnection();
      }
      else if (actionID === 2) {
        db.getLowInventory(function(result) {
          console.log('Here are items with low inventory');
          console.log(result);
          db.endConnection();
        });
      }
      else if (actionID === 3) {
        var addQuantity = [
            {
              type: 'input',
              name: 'itemID',
              message: "Input the ID of an existing item",
              validate: function(value) {
                if (value in dbImage) {
                  return true;
                }
                return 'Please enter a valid ID';
              }
            },
            {
              type: 'input',
              name: 'quantity',
              message: "How many you wanna add?",
              validate: function(value) {
                if (parseInt(value) > 0) {
                  return true;
                }
                return 'Please enter a valid quantity';
              }
            },
          ];

        INQUIRER.prompt(addQuantity).then(answers => {
          var total   = parseInt(answers["quantity"]),
              itemID  = parseInt(answers["itemID"]),
              currentTotal = parseInt(dbImage[itemID].stock_quantity);

          db.updateProduct(itemID, currentTotal + total, function(result) {
            console.log('Update completed');
            db.endConnection();
          });
        });
      }
      else if (actionID === 4) {
        var addItem = [
            {
              type: 'input',
              name: 'itemName',
              message: "Input name of product",
              validate: function(value) {
                if (value !== null && value.trim() !== '') {
                  return true;
                }
                return 'Please enter a valid product name';
              }
            },
            {
              type: 'input',
              name: 'itemDept',
              message: "Please enter item department",
              validate: function(value) {
                if (value !== null && value.trim() !== '') {
                  return true;
                }
                return 'Please enter a valid department';
              }
            },
            {
              type: 'input',
              name: 'itemPrice',
              message: "Please enter item's price",
              validate: function(value) {
                if (parseFloat(value) > 0) {
                  return true;
                }
                return 'Please enter a valid price';
              }
            },
            {
              type: 'input',
              name: 'itemTotal',
              message: "Please enter stock quantity",
              validate: function(value) {
                if (parseInt(value) > -1) {
                  return true;
                }
                return 'Please enter a valid amount';
              }
            },
          ];

        INQUIRER.prompt(addItem).then(answers => {
          var total   = parseInt(answers["itemTotal"]),
              price   = parseFloat(answers["itemPrice"]),
              name    = answers["itemName"].trim(),
              dept    = answers["itemDept"].trim();

          db.addItem({
            name  : name,
            dept  : dept,
            price : price,
            total : total
          }, function(result) {
            console.log('Item added');
            db.endConnection();
          });
        });
      }
    });
  });

  