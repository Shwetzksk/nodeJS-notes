```
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

### Order of execution

1. Async code gets executed after execution of sync code

### fs.writeFile() vs fs.writeFileSync()

- fs.writeFileSync: It is a blocking code. Synchronously writes the file contents
  fs.writeFileSync(path,content)

- fs.writeFile: It is non-blocking code. Asynchronously writes the file contents.
  fs.writeFile(path,content,event)
  event: callback fn

```
fs.writeFile("message.txt","Hello kitty!",(error)=>{
   <!-- execute code -->
})
```

### Single Thread, Event Loop & Blocking Code

- NodeJs uses single JS thread.
- All fast executable callback are handled by event loop handler. Where as heavy lifting task like file operation will not be handled by event loop handler this is sent to Worker pool, which is also spun up and managed by NodeJS itself.
- But the event callabck fn get executed by event loop itself because it is fast executable callback.
- Worker pool is responsible for heavy lifting and it is completely dettached from JS code, it run on different threads, it can spin-up multiple threads, it is closely intervened with OS your running the app on.

### Order of Event loop execution:

- Timers: Execute setTimeout, setInterval callback
- Pending Callbacks: Execute I/O-related callbacks that are deferred
- Pool: Retrieve new I/O events excute their callbacks
- Check: Execute setImmediate() callbacks
- Close callbacks: Execute all "close" event callbacks.
- process.exit (refs == 0)

### Different ways of exporting module

Way 1:

```
function someFnName(){};

module.export = someFnName;
```

Way 2:

```
function someFnName(){};

module.export = {
   name:"shweta",
   handler:someFnName
};
```

Way 3:

```
function someFnName(){};

module.export.name = "shweta";
module.export.handler = someFnName;

```

Way 4:

```
function someFnName(){};

vexport.name = "shweta";
vexport.handler = someFnName;

```

## Express

```
app.use((req, res, next) => {
  console.log("use 1");
  next(); //allows the req to continue to next middleware in line
});
```

# Section 5: Working with Express.js

```
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

### Advantage of using app.get():

app.get() or router.get() uses matchers whereas app.use() or router.use() doesn't.
Send req to any other route app.use() will always return value from "/", if it is declared ahead of other routes

```
app.use("/",()=>{})
app.use("/add-products",()=>{})

```

### Filtering routes:

```
//./app.js
app.use("/admin",shopRouter)

```

```
//./router/shop.js
router.get("/add-products",()=>{})
router.post("/add-products",()=>{}) //same route name can exist for different methods

```

now route for shopRouter will look like this
GET: "/add-products" ==> "/admin/add-products"
POST: "/add-products" ==> "/admin/add-products"

## Alternative way of importing html files for response:

Amateur way:

```
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

```
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

## Getting access to css file:

- Use express static fn for exposing static files like css.

```
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

# Section 6: Working with Dynamic Content & Adding Templating Engines

### Set variable globally in your express server

```
app.set("title","My Site");

app.get("title"); //My Site
```
