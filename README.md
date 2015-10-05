# qwebs-mongo
Mongo client build over Promises for Qwebs server.

## Features

  * Qwebs
  * Mongo
  * Promise
    
## Add the mongo connection string your Qwebs config file (config.json)
```json
{
	"mongo": {
        "connectionString": "mongodb://localhost:27017/database"
    },
}
```

## Declare and inject the service $mongo in Qwebs

```js
var Qwebs = require("qwebs");
var qwebs = new Qwebs();

qwebs.inject("$mongo" ,"qwebs-mongo");
```

## Use $mongo in your own service

```js
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

## API

  * connect()
  * createCollection(collectionName)
  * drop(collectionName)
  * ensureIndex(collectionName, index, options)
  * dropIndex(collectionName, index)
  * gridStore(objectId, mode, options)
  * insert(collectionName, item)
  * update(collectionName, criteria, update, option)
  * remove(collectionName, selector)
  * findOne(collectionName, query, fields)
  * find(collectionName, query, options)
  * find2(collectionName, query, meta, options) for meta like textScore
  * count(collectionName, query, options)
  * geoNear(collectionName, x, y, options)
  * aggregate(collectionName, array)
  * mapReduce(collectionName, map, reduce, options)
  * initializeUnorderedBulkOp(collectionName)

## Installation

```bash
$ npm install qwebs-mongo
```
  