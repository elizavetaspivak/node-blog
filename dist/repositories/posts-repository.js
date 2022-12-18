"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRepository = void 0;
const testing_repository_1 = require("./testing-repository");
const blog_route_1 = require("../routes/blog-route");
class PostsRepository {
    static getAllPosts() {
        return testing_repository_1.posts;
    }
    static getPostById(id) {
        const foundedPosts = testing_repository_1.posts.find(p => p.id === id);
        if (foundedPosts) {
            return foundedPosts;
        }
        else {
            return false;
        }
    }
    static createPost(postData) {
        const blog = blog_route_1.blogs.find(b => b.id === postData.blogId);
        const newPost = Object.assign({ id: new Date().getDate().toString(), blogName: blog.name }, postData);
        testing_repository_1.posts.push(newPost);
        return newPost;
    }
    static updatePost(id, postData) {
        let postIndex = testing_repository_1.posts.findIndex(v => v.id === id);
        const post = testing_repository_1.posts.find(v => v.id === id);
        let newItem = Object.assign(Object.assign({}, post), postData);
        testing_repository_1.posts.splice(postIndex, 1, newItem);
        return !!post;
    }
    static deletePostById(id) {
        let postIndex = testing_repository_1.posts.findIndex(v => v.id === id);
        testing_repository_1.posts.splice(postIndex, 1);
    }
}
exports.PostsRepository = PostsRepository;
