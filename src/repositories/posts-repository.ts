import {blogs, posts} from "./testing-repository";

type PostData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export class PostsRepository {
    static getAllPosts() {
        return posts
    }

    static getPostById(id: string) {
        const foundedPosts = posts.find(p => p.id === id)

        if (foundedPosts) {
            return foundedPosts
        } else {
            return false
        }
    }

    static createPost(postData: PostData) {

        const blog = blogs.find(b => b.id === postData.blogId)

        const newPost = {
            id: new Date().getDate().toString(),
            blogName: blog!.name,
            ...postData
        }

        posts.push(newPost)

        return newPost
    }

    static updatePost(id: string, postData: PostData) {
        let postIndex = posts.findIndex(v => v.id === id)
        const post = posts.find(v => v.id === id)

        let newItem = {
            ...post!,
            ...postData
        }

        posts.splice(postIndex, 1, newItem)

        return !!post;
    }

    static deletePostById(id: string) {
        let postIndex = posts.findIndex(v => v.id === id)
        const post = posts.find(v => v.id === id)

        posts.splice(postIndex, 1)

        return !!post;
    }
}