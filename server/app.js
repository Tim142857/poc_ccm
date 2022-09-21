const http = require("http");
const qs = require('querystring');

const serveFile = require("./serveFile");
const sendServerEvents = require("./sendServerEvents");
const suscribers = require("./suscribers");
const log = require("./log");

const server = http.createServer(function (req, res) {
  if (req.url === "/") {
    serveFile("/index.html", res, "text/html");
  } else if (req.url.match(/\.(css|js|html)$/)) {
    serveFile(req.url, res);
  } else if (req.url === "/events") {
    suscribers.add(res);
    sendServerEvents(res);
  }
  else if (req.url === "/update-count" && req.method == 'POST') {
    let post = qs.parse(body)

    var body = '';

    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function () {
      var post = qs.parse(body);
      log(`DISPLAY`)
    });
    res.end();
  }
  else if (req.url === "/hovered-canvas" && req.method == 'POST') {
    log('VIEWED');
    res.end();
  }
  else {
    res.end();
  }
});

server.listen(8080, "0.0.0.0", () => {
  console.log("Server is running at 8080");
});
