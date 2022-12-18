"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = exports.authMiddleware = exports.blogs = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
exports.blogs = [
    {
        id: "fdsfdsfsd",
        name: "fsdf",
        description: "fdsfsd",
        websiteUrl: "fsdfds"
    }
];
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
exports.blogRoute.get('/', async (req, res) => {
    const bloggers = await blogs_repository_1.BlogsRepository.getAllBlogs();
    res.status(200).json(bloggers);
});
exports.blogRoute.get('/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await blogs_repository_1.BlogsRepository.getBlogById(id);
    if (!blog) {
        return res.sendStatus(404);
    }
    const blogForClient = {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl
    };
    res.send(blogForClient);
});
exports.blogRoute.post('/', exports.authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, async (req, res) => {
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
    const createdBlogId = await blogs_repository_1.BlogsRepository.createBlog({ name, description, websiteUrl });
    const createdBlogMapper = {
        id: createdBlogId,
        name, description, websiteUrl
    };
    res.status(201).json(createdBlogMapper);
});
exports.blogRoute.put('/:id', exports.authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, async (req, res) => {
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
    const isBlogUpdated = await blogs_repository_1.BlogsRepository.updateBlog(id, { name, description, websiteUrl });
    if (!isBlogUpdated) {
        res.sendStatus(404);
    }
    res.sendStatus(204);
});
exports.blogRoute.delete('/:id', exports.authMiddleware, async (req, res) => {
    const id = req.params.id;
    const blog = blogs_repository_1.BlogsRepository.getBlogById(id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    await blogs_repository_1.BlogsRepository.deleteBlogById(id);
    res.sendStatus(204);
});
