import {blogs, videos} from "./testing-repository";

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
        const foundedBlogs = blogs.find(b => b.id === id)

        if (foundedBlogs) {
            return foundedBlogs
        } else {
            return false
        }
    }

    static createBlog(createdData: CreatePostData) {
        const newBlog = {
            id: new Date().getDate().toString(),
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
        let blogIndex = blogs.findIndex(v => v.id === id)
        const blog = blogs.find(v => v.id === id)

        blogs.splice(blogIndex, 1)

        return !!blog;
    }
}