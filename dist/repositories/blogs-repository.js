"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const blog_route_1 = require("../routes/blog-route");
const uuid_1 = require("uuid");
class BlogsRepository {
    static getAllBlogs() {
        return blog_route_1.blogs;
    }
    static getBlogById(id) {
        return blog_route_1.blogs.find(b => b.id === id);
    }
    static createBlog(createdData) {
        const newBlog = Object.assign({ id: (0, uuid_1.v4)() }, createdData);
        blog_route_1.blogs.push(newBlog);
        return newBlog;
    }
    static updateBlog(id, updatedData) {
        let blogsIndex = blog_route_1.blogs.findIndex(v => v.id === id);
        const blog = blog_route_1.blogs.find(v => v.id === id);
        let newItem = Object.assign(Object.assign({}, blog), updatedData);
        blog_route_1.blogs.splice(blogsIndex, 1, newItem);
        return !!blog;
    }
    static deleteBlogById(id) {
        return blog_route_1.blogs.filter(el => el.id !== id);
    }
}
exports.BlogsRepository = BlogsRepository;
