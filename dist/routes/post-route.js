"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
const blog_route_1 = require("./blog-route");
const posts_repository_1 = require("../repositories/posts-repository");
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../repositories/blogs-repository");
const titleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 30 }).withMessage('Incorrect title');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').isLength({
    min: 1,
    max: 100
}).withMessage('Incorrect shortDescription');
const contentValidation = (0, express_validator_1.body)('content').trim().isLength({
    min: 1,
    max: 1000
}).withMessage('Incorrect content');
const blogIdValidation = (0, express_validator_1.body)('blogId').custom(async (value) => {
    const blog = await blogs_repository_1.BlogsRepository.getBlogById(value);
    if (!blog) {
        throw Error('Incorrect blogId');
    }
    return true;
}).withMessage('Incorrect blogId');
exports.postRoute = (0, express_1.Router)({});
exports.postRoute.get('/', async (req, res) => {
    const posts = await posts_repository_1.PostsRepository.getAllPosts();
    res.send(posts);
});
exports.postRoute.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const foundedPost = await posts_repository_1.PostsRepository.getPostById(id);
    if (!foundedPost) {
        res.sendStatus(404);
        return;
    }
    const postForClient = {
        id: foundedPost._id,
        title: foundedPost.title,
        shortDescription: foundedPost.shortDescription,
        content: foundedPost.content,
        blogId: foundedPost.blogId,
        blogName: foundedPost.blogName,
        createdAt: foundedPost.createdAt
    };
    res.send(postForClient);
});
exports.postRoute.post('/', blog_route_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, async (req, res) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    const createdAt = new Date().toISOString();
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const err = errors.array();
        return res.status(400).json({
            errorsMessages: err.map(er => ({
                message: er.msg, field: er.param
            }))
        });
    }
    const blog = await blogs_repository_1.BlogsRepository.getBlogById(blogId);
    const createdPostId = await posts_repository_1.PostsRepository.createPost({
        title,
        shortDescription,
        content,
        blogId,
        createdAt,
        blogName: blog.name
    });
    const createdPostMapper = {
        id: createdPostId,
        title, shortDescription, content, blogId, blogName: blog.name, createdAt
    };
    res.status(201).json(createdPostMapper);
});
exports.postRoute.put('/:id', blog_route_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.sendStatus(404);
    }
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const err = errors.array();
        return res.status(400).json({
            errorsMessages: err.map(er => ({
                message: er.msg, field: er.param
            }))
        });
    }
    const post = await posts_repository_1.PostsRepository.getPostById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    const isUpdatePost = await posts_repository_1.PostsRepository.updatePost(id, { title, shortDescription, content, blogId });
    if (!isUpdatePost) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
exports.postRoute.delete('/:id', blog_route_1.authMiddleware, async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const post = await posts_repository_1.PostsRepository.getPostById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    await posts_repository_1.PostsRepository.deletePostById(id);
    res.sendStatus(204);
});
