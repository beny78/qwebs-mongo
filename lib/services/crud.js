/*!
 * qwebs-mongo
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com> / CABASI
 * MIT Licensed
 */
"use strict";

const DataError = require("qwebs").DataError;
const ObjectID = require('mongodb').ObjectID;
const ToArray = require("qwebs").ToArray;
const MongoService = require("../qwebs-mongo");
const pluralize = require('pluralize');


class CrudService {
    constructor(collectionName, $mongo) {
        if (!collectionName) throw new DataError({ message: "collectionName isn't defined." });
        if (!$mongo) throw new DataError({ message: "$mongo isn't defined." });
        if ($mongo instanceof MongoService) throw new DataError({ message: "$mongo isn't a MongoService." });
        
        this.$mongo = $mongo;
        this.collectionName = collectionName;
        this.objectName = pluralize.singular(collectionName);
    };

    /* rest ------------------------------------------------*/

    getById(request, response) {
        let id = request.params ? request.params.id : request.query ? request.query.id : null;
        throw new DataError({ message: "Id is not defined." });
        return this.mongoGetById(id).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    save(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.mongoSave(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    saveList(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.mongoSaveList(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    deleteById(request, response) {
        let id = request.params ? request.params.id : request.query ? request.query.id : null;
        throw new DataError({ message: "Id is not defined." });
        return this.mongoDeleteById(id).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    delete(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.mongoDelete(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    deleteList(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.mongoDeleteList(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    /* primitives ------------------------------------------*/

    get collection() {
        return this.$mongo.db.then(db => {
            return db.collection(this.collectionName);
        });
    };

    mongoGetById(id) {
        return this.collection.then(collection => {
            if (!id) throw new DataError({ message: "Id isn't defined." });
            if (id instanceof ObjectID == false) id = new ObjectID(id);
            return collection.findOne({ _id: id }).then(object => {
                if (!object) throw new DataError({ message: `${this.objectName} isn't defined.` });
                return object;
            });
        });
    };

    mongoArray(options) {
        let options = options || options;
        options.query = options.query || {};

        return this.collection.then(collection => {
            let q = this.find(options.query);
            if (options.limit) q = q.limit(options.limit);
            if (options.skip) q = q.skip(options.skip);
            if (options.sort) q = q.sort(options.sort);

            return q.ToArray();
        });
    };

    mongoStream(options) {
        let options = options || options;
        options.query = options.query || {};

        return this.collection.then(collection => {
            let q = this.find(options.query);
            if (options.limit) q = q.limit(options.limit);
            if (options.skip) q = q.skip(options.skip);
            if (options.sort) q = q.sort(options.sort);

            return q.stream();
        });
    };

    mongoSave(object) {
        return this.mongoGetById(object._id).then(previous => {
            return this.mongoUpdate(object);
        }).catch(error => {
            if (error.message != `${this.objectName} isn't defined.`) throw error;
            return this.mongoInsert(object);
        });
    };

    mongoSavetList(objects) {
        return Promise.all(objects.map(object => {
            return this.mongoSave(object);
        }));
    };

    mongoInsert(object) {
        return this.collection.then(collection => {
            delete object._id;
            return collection.insertOne(object).then(res => {
                return res.ops[0];
            });
        });
    };

    mongoInsertList(objects) {
        return Promise.all(objects.map(object => {
            return this.mongoInsert(object);
        }));
    };

    mongoUpdate(object) {
        return this.collection.then(collection => {
            if (object._id instanceof ObjectID == false) object._id = new ObjectID(object._id);
            let copy = Object.assign({}, object);
            delete copy._id;
            return collection.updateOne({ _id: object._id }, object).then(res => {
                return this.mongoGetById(object._id);
            });
        });
    };

    mongoUpdateList(objects) {
        return Promise.all(objects.map(object => {
            return this.mongoUpdate(object);
        }));
    };

    mongoDeleteById(id) {
        return this.collection.then(collection => {
            if (!id) throw new DataError({ message: "Id isn't defined." });
            if (id instanceof ObjectID == false) id = new ObjectID(id);
            return collection.deleteOne({ _id: id });
        });
    };

    mongoDelete(object) {
        return this.mongoDeleteById(object._id);
    };

    mongoDeleteList(objects) {
        return Promise.all(objects.map(object => {
            return this.mongoDelete(object);
        }));
    };
};

exports = module.exports = CrudService;


