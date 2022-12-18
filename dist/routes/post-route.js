"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
const blog_route_1 = require("./blog-route");
const posts_repository_1 = require("../repositories/posts-repository");
const express_validator_1 = require("express-validator");
const testing_repository_1 = require("../repositories/testing-repository");
const titleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 30 }).withMessage('Incorrect title');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').isLength({
    min: 1,
    max: 100
}).withMessage('Incorrect shortDescription');
const contentValidation = (0, express_validator_1.body)('content').trim().isLength({
    min: 1,
    max: 1000
}).withMessage('Incorrect content');
const blogIdValidation = (0, express_validator_1.body)('blogId').custom((value) => {
    const blog = testing_repository_1.blogs.find(b => b.id === value);
    if (!blog) {
        throw Error('Incorrect blogId');
    }
    return true;
}).withMessage('Incorrect blogId');
exports.postRoute = (0, express_1.Router)({});
exports.postRoute.get('/', (req, res) => {
    const posts = posts_repository_1.PostsRepository.getAllPosts();
    res.send(posts);
});
exports.postRoute.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const foundedPost = posts_repository_1.PostsRepository.getPostById(id);
    if (!foundedPost) {
        res.sendStatus(404);
    }
    res.send(foundedPost);
});
exports.postRoute.post('/', blog_route_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, (req, res) => {
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
    const createdPost = posts_repository_1.PostsRepository.createPost({ title, shortDescription, content, blogId });
    res.status(201).json(createdPost);
});
exports.postRoute.put('/:id', blog_route_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, (req, res) => {
    const id = req.params.id;
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
    const isUpdatePost = posts_repository_1.PostsRepository.updatePost(id, { title, shortDescription, content, blogId });
    if (!isUpdatePost) {
        res.sendStatus(404);
    }
    res.sendStatus(204);
});
exports.postRoute.delete('/:id', blog_route_1.authMiddleware, (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
    }
    const post = posts_repository_1.PostsRepository.deletePostById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
