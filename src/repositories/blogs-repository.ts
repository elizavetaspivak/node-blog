import {blogs} from "./testing-repository";

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
        return blogs.filter(el => el.id !== id);
    }
}