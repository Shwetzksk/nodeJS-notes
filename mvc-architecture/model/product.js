const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

function getProductsFromFile(fn) {
  const p = path.join(rootDir, "data", "products.json");
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      fn([], p);
    }
    fn(JSON.parse(fileContent), p);
  });
}
module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductsFromFile((products, path) => {
      products.push(this);
      fs.writeFile(path, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
  static getAllProducts(fn) {
    getProductsFromFile(fn);
  }
};
