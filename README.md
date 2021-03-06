# qwebs-mongo
[Mongo](https://www.npmjs.com/package/mongodb) service for [Qwebs server](https://www.npmjs.com/package/qwebs).

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]

## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)
  * [Mongo API](http://mongodb.github.io/node-mongodb-native/2.2/api/)
  * Singleton

```js
return $mongo.db.then(db => {
  //db is a singleton Mongo Db instance
});
```

### Add the mongo connection string in config.json

```json
{
	"mongo": {
        "connectionString": "mongodb://localhost:27017/database"
    },
}
```

### Declare and inject $mongo service

#### Via route.json
```routes.json
{
  "services": [
    { "name": "$mongo", "location": "qwebs-mongo" }
  ]
}
```

#### Or in javascript
```js
const Qwebs = require("qwebs");
const qwebs = new Qwebs();
qwebs.inject("$mongo" ,"qwebs-mongo");
```

### Use $mongo service

#### Hight level api

```js
const { CRUD } = require("qwebs-mongo");

class Api extends CRUD {
    constructor($mongo) {
        super("collectionName", $mongo);
    };

    /* manage skip and limit as querystring */
    httpStream(request, response) {
        request.mongo = {   //define mongo query, options,...
            options: {
              limit: parseInt(request.query.limit),
              skip: parseInt(request.query.skip)
            }
        }
        return super.httpStream(request, response);
    }
```

#### Low level api

```js
/* no extend -> custom implementation */
class Api {
  constructor($mongo) {
    this.$mongo = $mongo;
  };

  httpStream(request, response) {
    return this.$mongo.db.then(db => {
      const limit = parseInt(request.query.limit);
      const skip = parseInt(request.query.skip);
      const stream = db.collection("collectionName").find({}).limit(limit).skip(skip).stream();
      return response.send({ request: request, stream: stream });
    });
  );
};
```

## Installation

```bash
$ npm install qwebs-mongo
```

## Test

To run our tests, clone the qwebs-mongo repo and install the dependencies.

```bash
$ git clone https://github.com/BenoitClaveau/qwebs-mongo --depth 1
$ cd qwebs-mongo
$ npm install
$ mongod --dbpath ./data/db
$ node.exe "../node_modules/mocha/bin/mocha" tests
```

[npm-image]: https://img.shields.io/npm/v/qwebs-mongo.svg
[npm-url]: https://npmjs.org/package/qwebs-mongo
[travis-image]: https://travis-ci.org/BenoitClaveau/qwebs-mongo.svg?branch=master
[travis-url]: https://travis-ci.org/BenoitClaveau/qwebs-mongo
[coveralls-image]: https://coveralls.io/repos/BenoitClaveau/qwebs-mongo/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/BenoitClaveau/qwebs-mongo?branch=master
