const fs = require("fs");

function requestHandler(req, res) {
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
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(parsedBody);
      fs.writeFile("message.txt", message, (error) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  // res.write() allow to write in chunks
  res.write("<html>");
  res.write("<head><title>My First title</title></head>");
  res.write("<body><h1>Hello from Node.js Server</h1></body>");
  res.write("</html>");
  res.end();
}

module.exports = requestHandler;
