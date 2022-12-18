"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsCollections = exports.blogsCollections = exports.database = exports.client = void 0;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://liza:liza@blogs.3awsprb.mongodb.net/?retryWrites=true&w=majority";
exports.client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
exports.database = exports.client.db('blogs');
exports.blogsCollections = exports.database.collection('blogs');
exports.postsCollections = exports.database.collection('posts');
