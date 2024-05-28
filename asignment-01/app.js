const http = require("http");

const server = http.createServer((req, res, ctxt) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write(
      "<body><h1>Hey, Welcome from NodeJS</h1><form action='/create-user' method='POST'><input placeholder='username' type='text' name='username'/><button>Submit</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/users") {
    res.write("<html>");
    res.write(
      "<body><ul> <li>User 1</li> <li>User 2</li> <li>User 3</li></ul></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-user" && method === "POST") {
    const data = [];
    req.on("data", (chunk) => {
      data.push(chunk);
    });
    return req.on("end", () => {
      const parseBody = Buffer.concat(data).toString();
      console.log(parseBody);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
});

server.listen(3000);
