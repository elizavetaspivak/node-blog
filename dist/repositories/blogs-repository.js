"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const testing_repository_1 = require("./testing-repository");
class BlogsRepository {
    static getAllBlogs() {
        return testing_repository_1.blogs;
    }
    static getBlogById(id) {
        const foundedBlogs = testing_repository_1.blogs.find(b => b.id === id);
        if (foundedBlogs) {
            return foundedBlogs;
        }
        else {
            return false;
        }
    }
    static createBlog(createdData) {
        const newBlog = Object.assign({ id: new Date().getDate().toString() }, createdData);
        testing_repository_1.blogs.push(newBlog);
        return newBlog;
    }
    static updateBlog(id, updatedData) {
        let blogsIndex = testing_repository_1.blogs.findIndex(v => v.id === id);
        const blog = testing_repository_1.blogs.find(v => v.id === id);
        let newItem = Object.assign(Object.assign({}, blog), updatedData);
        testing_repository_1.blogs.splice(blogsIndex, 1, newItem);
        return !!blog;
    }
    static deleteBlogById(id) {
        let blogIndex = testing_repository_1.blogs.findIndex(v => v.id === id);
        const blog = testing_repository_1.blogs.find(v => v.id === id);
        testing_repository_1.blogs.splice(blogIndex, 1);
        return !!blog;
    }
}
exports.BlogsRepository = BlogsRepository;
