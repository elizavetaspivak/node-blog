import {blogs} from "../routes/blog-route";
import {v4} from "uuid";

type CreatePostData = {
    name: string
    description: string
    websiteUrl: string
}

export class BlogsRepository {
    static getAllBlogs() {
        return blogs
    }

    static getBlogById(id: string) {
        return blogs.find(b => b.id === id)
    }

    static createBlog(createdData: CreatePostData) {
        const newBlog = {
            id: v4(),
            ...createdData
        }

        blogs.push(newBlog)

        return newBlog
    }

    static updateBlog(id: string, updatedData: CreatePostData) {
        let blogsIndex = blogs.findIndex(v => v.id === id)
        const blog = blogs.find(v => v.id === id)

        let newItem = {
            ...blog!,
            ...updatedData
        }

        blogs.splice(blogsIndex, 1, newItem)

        return !!blog;
    }

    static deleteBlogById(id: string) {
        return blogs.filter(el => el.id !== id);
    }
}