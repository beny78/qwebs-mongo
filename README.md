# qwebs-mongo
Mongo client for Qwebs server

## Add the mongo connection string in the qwebs config file (config.json)
```json
{
	"mongo": {
        "connectionString": "mongodb://localhost:27017/database"
    },
}
```

## Declare and inject the service $mongo in Qwebs

```json
var Qwebs = require("qwebs");
var qwebs = new Qwebs();

qwebs.inject("$mongo" ,"qwebs-mongo");
```

## Use $mongo in your own service

```json
function MyService($mongo) {
  this.$mongo = $mongo;
};

MyService.prototype.insert = function (request, response, promise) {
  return promise.then(function (self) { //read html body
    return self.$mongo.insert("collectionName", request.body).then(function (data) {
      return response.send({ request: request, content: data });
    });
  });
};

exports = module.exports = MyService; //Return a class. Qwebs will instanciate it;
```

## Features

  * Qwebs
  * Mongo
  * Promise
  
## Installation

```bash
$ npm install qwebs-mongo
```
