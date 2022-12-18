"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRepository = void 0;
const mongo_1 = require("../db/mongo");
const mongodb_1 = require("mongodb");
class PostsRepository {
    static async getAllPosts() {
        const posts = await mongo_1.postsCollections.find({}).toArray();
        return posts.map((p) => ({
            id: p._id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
        }));
    }
    static async getPostById(id) {
        const post = await mongo_1.postsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
        return post;
    }
    static async createPost(postData) {
        const res = await mongo_1.postsCollections.insertOne(postData);
        return res.insertedId;
    }
    static async updatePost(id, postData) {
        const res = await mongo_1.postsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                title: postData.title,
                shortDescription: postData.shortDescription,
                content: postData.content,
                blogId: postData.blogId
            }
        }, { upsert: true });
        return !!res.matchedCount;
    }
    static async deletePostById(id) {
        const res = await mongo_1.postsCollections.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return !!res.deletedCount;
    }
}
exports.PostsRepository = PostsRepository;
