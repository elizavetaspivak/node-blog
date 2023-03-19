const {MongoClient, ServerApiVersion} = require('mongodb');

const uri = "mongodb+srv://liza:liza@blogs.3awsprb.mongodb.net/?retryWrites=true&w=majority";

export const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

//test

export const database = client.db('blogs')

export const blogsCollections = database.collection('blogs')
export const postsCollections = database.collection('posts')