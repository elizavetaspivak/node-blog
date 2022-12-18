import {posts} from "./testing-repository";
import {blogs} from "../routes/blog-route";
import {v4} from 'uuid'
import {blogsCollections, postsCollections} from "../db/mongo";
import {ObjectId} from "mongodb";

type PostData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export class PostsRepository {
    static async getAllPosts() {
        const posts = await postsCollections.find({}).toArray();

        return posts.map((p: any) => ({
            id: p._id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
        }))
    }

    static async getPostById(id: string) {
        const post = await postsCollections.findOne({_id: new ObjectId(id)});

        return post
    }

    static async createPost(postData: PostData) {
        const res = await postsCollections.insertOne(postData)

        return res.insertedId
    }

    static async updatePost(id: string, postData: PostData) {
        const res = await postsCollections.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    title: postData.title,
                    shortDescription: postData.shortDescription,
                    content: postData.content,
                    blogId: postData.blogId
                }
            }, {upsert: true}
        )

        return !!res.matchedCount;
    }

    static async deletePostById(id: string) {
        const res = await postsCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}