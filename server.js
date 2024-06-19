// const http = require("http");
// const fs = require("fs");

// const server = http.createServer((req, res) => {
//   res.setHeader("Content-Type", "text/html");
//   // res.write('Hello World<br>');
//   // res.write('Hello World Mardav');
//   // console.log(req.url,req.method);

//   let path = "./views/";
//   switch (req.url) {
//     case "/":
//       path += "index.html";
//       res.statusCode = 200;
//       break;
//     case "/about":
//       path += "about.html";
//       res.statusCode = 200;
//       break;
//     case "/about-us":
//       res.statusCode = 301;
//       res.setHeader("Location", "/about");
//       res.end();
//       break;
//     default:
//       path += "404.html";
//       res.statusCode = 404;
//       break;
//   }

//   fs.readFile(path, (err, data) => {
//     if (err) {
//       console.log(err);
//       res.end();
//     } else {
//       res.write(data);
//       res.end();
//     }
//   });
// });

// server.listen(3333, "localhost", () => {
//   console.log("listening for requests on port 3333");
// });
