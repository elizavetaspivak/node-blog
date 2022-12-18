"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const mongo_1 = require("../db/mongo");
const mongodb_1 = require("mongodb");
class BlogsRepository {
    static async getAllBlogs() {
        const blogs = await mongo_1.blogsCollections.find({}).toArray();
        return blogs.map((b) => ({
            id: b._id,
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt
        }));
    }
    static async getBlogById(id) {
        const blog = await mongo_1.blogsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
        return blog;
    }
    static async createBlog(createdData) {
        const res = await mongo_1.blogsCollections.insertOne(createdData);
        return res.insertedId;
    }
    static async updateBlog(id, updatedData) {
        const res = await mongo_1.blogsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                "name": updatedData.name,
                "description": updatedData.description,
                "websiteUrl": updatedData.websiteUrl
            }
        }, { upsert: true });
        return !!res.matchedCount;
    }
    static async deleteBlogById(id) {
        const res = await mongo_1.blogsCollections.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return !!res.deletedCount;
    }
}
exports.BlogsRepository = BlogsRepository;
