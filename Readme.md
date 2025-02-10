# NodeJS notes

```js
const http = require("http");
const fs = require("fs");

function rqListener(req, res) {
  res.setHeader("Content-Type", "text/html");
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'/><button>Submit</button></form></body>"
    );
    res.write("</html>");
    return res.end(); //not need to return as we want to end execution that's why we are returning
  }

  if (url === "/message" && method === "POST") {
    //   data sent from client are made into chunk wich we can collect using buffer
    const body = [];

    // event for incoming data
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    // event for end of incoming data & we will serialize data here
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(parsedBody);
      fs.writeFileSync("message.txt", message);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
  // res.write() allow to write in chunks
  res.write("<html>");
  res.write("<head><title>My First title</title></head>");
  res.write("<body><h1>Hello from Node.js Server</h1></body>");
  res.write("</html>");
  res.end();
}

// rqListener get executed on every request reaches out to server
const server = http.createServer(rqListener);

// nodejs will keep on running to listen to reqts
server.listen(3000);
```

## Order of execution

1. Async code gets executed after execution of sync code

### fs.writeFile() vs fs.writeFileSync()

- fs.writeFileSync: It is a blocking code. Synchronously writes the file contents
  fs.writeFileSync(path,content)

- fs.writeFile: It is non-blocking code. Asynchronously writes the file contents.
  fs.writeFile(path,content,event)
  event: callback fn

```js
fs.writeFile("message.txt","Hello kitty!",(error)=>{
   <!-- execute code -->
})
```

### Single Thread, Event Loop & Blocking Code

- NodeJs uses single JS thread.
- All fast executable callback are handled by event loop handler. Where as heavy lifting task like file operation will not be handled by event loop handler this is sent to Worker pool, which is also spun up and managed by NodeJS itself.
- But the event callabck fn get executed by event loop itself because it is fast executable callback.
- Worker pool is responsible for heavy lifting and it is completely dettached from JS code, it run on different threads, it can spin-up multiple threads, it is closely intervened with OS your running the app on.

### Order of Event loop execution

- Timers: Execute setTimeout, setInterval callback
- Pending Callbacks: Execute I/O-related callbacks that are deferred
- Pool: Retrieve new I/O events excute their callbacks
- Check: Execute setImmediate() callbacks
- Close callbacks: Execute all "close" event callbacks.
- process.exit (refs == 0)

### Different ways of exporting module

Way 1:

```js
function someFnName() {}

module.export = someFnName;
```

Way 2:

```js
function someFnName() {}

module.export = {
  name: "shweta",
  handler: someFnName,
};
```

Way 3:

```js
function someFnName() {}

module.export.name = "shweta";
module.export.handler = someFnName;
```

Way 4:

```js
function someFnName() {}

vexport.name = "shweta";
vexport.handler = someFnName;
```

## Express

```js
app.use((req, res, next) => {
  console.log("use 1");
  next(); //allows the req to continue to next middleware in line
});
```

## Section 5: Working with Express.js

```js
<!-- Before shifting things to router -->
const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false })); //yields middleware with body parsing
app.use("/add-products", (req, res, next) => {
  res.send(
    "<html><body><form action='/product' method='POST'><input placeholder='Enter the name' name='title' type='text'/><button type='submit'>Submit</button></form></body></html>"
  );
});
app.use("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});
app.use((req, res, next) => {
  res.send("<html><body><h1>Hello Shweta!</h1></body></html>");
});

app.listen(port);

```

### Advantage of using app.get()

app.get() or router.get() uses matchers whereas app.use() or router.use() doesn't.
Send req to any other route app.use() will always return value from "/", if it is declared ahead of other routes

```js
app.use("/", () => {});
app.use("/add-products", () => {});
```

### Filtering routes

```js
//./app.js
app.use("/admin", shopRouter);
```

```js
//./router/shop.js
router.get("/add-products", () => {});
router.post("/add-products", () => {}); //same route name can exist for different methods
```

now route for shopRouter will look like this
GET: "/add-products" ==> "/admin/add-products"
POST: "/add-products" ==> "/admin/add-products"

## Alternative way of importing html files for response

Amateur way:

```js
//shop.js

const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});

module.exports = router;
```

Better way:

```js
//util/path.js
const path = require("path");

module.exports = path.dirname(require.main.filename);

//shop.js
const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
```

## Getting access to css file

- Use express static fn for exposing static files like css.

```js
//app.js
...
app.use(bodyPaser.url....);
<!-- using of express static -->
app.use(express.static(path.join(__dirname,"public")));

app.use("/admin",adminRoutes);
app.use(shopRoutes);
.
.
.
.
```

## Section 6: Working with Dynamic Content & Adding Templating Engines

### Set variable globally in your express server

```js
app.set("title", "My Site");

app.get("title"); //My Site

app.set("view engine", "pug");
//it doesn't work for engine like this
```

Pug ships with built-in support for express and it auto register itself with express

If you named folder "templates" instead of "views" which stores html files then

```js
app.set("views", "templates");
```

## Pug template set-up

```js
const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("shop");
});

module.exports = router;
```

- it will use default templating engine that's why we declared app.set("view engine","pug") in app.js
- no need of mentioning path as we have defined default path for views in app.js i.e app.set("views", "views")
- no need of adding file extension as express will automatically pick up pug as template engine because of app.set("views egine", "pug")

### sending dynamic data

```js
router.get("/", (req, res, next) => {
  res.render("shop", {
    products: adminData.data,
    pageTitle: "Products",
    path: "/",
  }); //it will use default templating engine that's why we declared app.set("view engine","pug")
});
```

### using extend to share UI components

```js
//layout/main-layout.pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title #{pageTitle}
    link(rel="stylesheet", href="/css/main.css")
      block styles
  body
    header.nav-header
      nav.navbar
        ul.nav-list
            li.nav-item
              a.nav-link(href="/" ,class=(path==="/"?"active-link":"")) Home
            li.nav-item
              a.nav-link(href="/admin/add-products",class=(path==="/admin/add-products"?"active-link":"")) Add Products
    block content


//404.pug
//using extend to share layout template

extends layouts/main-layout.pug

block content
  main.center-content
    h1 Page not found!
      p
        a.link(href="/") Take me home

```

- "extends" used as "import"
- "block content" used as keyword variable for replacement to render

## Express-handlebars template set-up

- handlebars doesn't auto setup express

```js
const expressHbs = require("express-handlebars");

//setting up HANDLEBARS template engine

//initializing handlebars engine
app.engine(
  "hbs",
  expressHbs({
    layoutDir: "views/layouts/", //for adding pointer to "layout" directory
    defaultLayout: "main-layout",
    extname: "hbs", //without this express will not pickup this as handlebars
  })
);
app.set("view engine", "hbs");
```

## EJS template set-up

- doesn't need to setup like express-handlebars

```js
app.set("view engine", "ejs");
app.set("views", "views");
```

```js
<%= {someVariable}> //will render as string
<%- include("includes/head.ejs) %> //will render as html
```

## Section 7: Model View Controller (MVC)

### Model

- Represent your data in your code
- Work with your data (e.g save, fetch)

### View

- What the users see
- Decoupled from your application code

### Controller

- Connecting your models and your views
- Contains "in-between" logic.

## Database

## MySQL

### how to integrate mysql

- install mysql2 package
- add this in utils folder database.js

```js
const mySql = require("mysql2");

//this will connect to db for each fired query & then exist connection
//each query will have their own connection with db
//this makes connection alive & can connect when ever query is fired
const pool = mySql.createPool({
  host: "localhost",
  user: "root",
  password: "shweta@123",
  database: "node-schema",
});

module.exports = pool.promise();
```

- import into models folder where data is handled for manipulation & storage purpose

```js
//----------------------------------------------------------------
//                    Storing data in SQL DBs
//----------------------------------------------------------------
const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    //to protect from input sql injection, we are giving ?, ?, .. for values
    return db.execute(
      "INSERT INTO products (title, imgUrl, description, price) VALUES (?, ?, ?, ?)",
      [this.title, this.imageUrl, this.description, this.price]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM `node-schema`.products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
```

- usage in controller

```js
const ProductDB = require("../models/product.db");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  ProductDB.fetchAll()
    .then(([products]) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {});
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  ProductDB.findById(prodId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getIndex = (req, res, next) => {
  ProductDB.fetchAll()
    .then(([products]) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {});
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    ProductDB.fetchAll()
      .then(([products]) => {
        const cartProducts = [];
        for (const product of products) {
          const cartProductData = cart.products.find(
            (prod) => prod.id === product.id
          );
          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty,
            });
          }
        }
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts,
        });
      })
      .catch((err) => {});
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  ProductDB.findById(prodId)
    .then(([product]) => {
      Cart.addProduct(prodId, product[0].price);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  ProductDB.findById(prodId)
    .then(([product]) => {
      Cart.deleteProduct(prodId, product[0].price);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
```

```js
app.js;
const db = require("./util/database");
db.execute("SELECT * FROM products")
  .then((data) => console.log("dta->", data))
  .catch((err) => console.error(err));
```

### mySQL using Sequelize

- it is a ORM (Object Relational Mapping ) library
- instead of writing SQL long query we can just use regular JS object to add data to database

```js
const user = User.create({name:"...", age:23, password:"sdjh@jhjd})
```

- it requires you to install

`npm i mysql2 sequelize`

- config for product table

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Product;
```

```javascript
//utilizing ProductSequelize
const Product=new Product();
Product.create(...) //creates and auto save
Product.build(...)//create but you have to manually save it to DB

```
