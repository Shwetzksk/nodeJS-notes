const Product = require("../model/product");

module.exports.getAddProducts = (req, res, next) => {
  res.render("add-products", {
    path: "/admin/add-products",
    pageTitle: "Add Products",
    activeHome: false,
    activeProducts: true,
  });
  // res.sendFile(path.join(rootDir, "views", "add-products.html"));
};

module.exports.postAddProducts = (req, res, next) => {
  if (req.body.title) {
    const product = new Product(req.body.title);
    product.save();
  }
  res.redirect("/");
};

module.exports.getProducts = (req, res, next) => {
  Product.getAllProducts((products) => {
    res.render("shop", {
      products: products,
      pageTitle: "Products",
      path: "/",
      activeHome: true,
      activeProducts: false,
      // layout: false, //special key that renders layout (main-layout.hbs, set up in app.js)
    }); //it will use default templating engine that's why we declared app.set("view engine","pug")
  });
};
