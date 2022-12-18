"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = exports.authMiddleware = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
const authMiddleware = (req, res, next) => {
    if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401);
        return;
    }
    next();
};
exports.authMiddleware = authMiddleware;
const nameValidation = (0, express_validator_1.body)('name').trim().isLength({ min: 1, max: 15 }).withMessage('Incorrect name');
const descriptionValidation = (0, express_validator_1.body)('description').isLength({ min: 1, max: 500 }).withMessage('Incorrect description');
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').isLength({
    min: 1,
    max: 100
}).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$');
exports.blogRoute = (0, express_1.Router)({});
exports.blogRoute.get('/', (req, res) => {
    const blogs = blogs_repository_1.BlogsRepository.getAllBlogs();
    res.send(blogs);
});
exports.blogRoute.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const blog = blogs_repository_1.BlogsRepository.getBlogById(id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    res.send(blog);
});
exports.blogRoute.post('/', exports.authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const err = errors.array();
        let newErrors = [];
        err.forEach(error => {
            let found = newErrors.filter(errItem => error.param === errItem.field).length;
            if (!found) {
                newErrors.push({
                    message: error.msg, field: error.param
                });
            }
        });
        return res.status(400).json({
            errorsMessages: newErrors
        });
    }
    const createdBlog = blogs_repository_1.BlogsRepository.createBlog({ name, description, websiteUrl });
    res.status(201).json(createdBlog);
});
exports.blogRoute.put('/:id', exports.authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const err = errors.array();
        let newErrors = [];
        err.forEach(error => {
            let found = newErrors.filter(errItem => error.param === errItem.field).length;
            if (!found) {
                newErrors.push({
                    message: error.msg, field: error.param
                });
            }
        });
        return res.status(400).json({
            errorsMessages: newErrors
        });
    }
    const isBlogUpdated = blogs_repository_1.BlogsRepository.updateBlog(id, { name, description, websiteUrl });
    if (!isBlogUpdated) {
        res.sendStatus(404);
    }
    res.sendStatus(204);
});
exports.blogRoute.delete('/:id', exports.authMiddleware, (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
    }
    const blog = blogs_repository_1.BlogsRepository.getBlogById(id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    blogs_repository_1.BlogsRepository.deleteBlogById(id);
    res.sendStatus(204);
});
