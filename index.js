/*
 * Entrypoint of the project
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

function serverFunction(req, res) {

  // Extract data for given task
  var parsedUrl = url.parse(req.url, true);
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
  var method = req.method.toLowerCase();

  // Find handler
  var handler = handlers.notFound;
  if (typeof(router[method]) !== 'undefined') {
    var handler = typeof(router[method][path]) !== 'undefined' ?
    router[method][path] : handlers.notFound;
  }

  // Pack data to send to the handler
  var data = {
    'parsedUrl': parsedUrl,
    'path': path,
    'method': method
  };

  handler(data, function(statusCode, payload) {
      // Use given status code, or the default one
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use given payload, or the default one
      payload = typeof(payload) == 'object' ? payload : {};
      // Convert a payload to a string
      var payloadString = JSON.stringify(payload);

      // Send the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log("Send response for method: '" + method + "' path: '" + path + "'");
  });

};

var server = http.createServer(serverFunction);
server.listen(8080, function() {
  console.log("Server is running on port 8080");
});

// Define handlers
handlers = {};

// Not found handler
handlers.notFound = function(data, callback) {
  var response = {'message': '404 Not Found'};
  callback(404, response);
};

// Hello handler for POST method
handlers.hello = function(data, callback) {
  var response = {'message': 'Hello, World!'};
  callback(200, response);
};

// Define a router
var router = {
  'post': {
    'hello': handlers.hello
  }
};
