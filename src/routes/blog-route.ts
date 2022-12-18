import {NextFunction, Request, Response, Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {body, validationResult} from "express-validator";

export let blogs: BlogType[] = [
    {
        id: "fdsfdsfsd",
        name: "fsdf",
        description: "fdsfsd",
        websiteUrl: "fsdfds"
    }
]

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
        return
    }

    next()
}

const nameValidation = body('name').trim().isLength({min: 1, max: 15}).withMessage('Incorrect name')
const descriptionValidation = body('description').isLength({min: 1, max: 500}).withMessage('Incorrect description')
const websiteUrlValidation = body('websiteUrl').isLength({
    min: 1,
    max: 100
}).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

export const blogRoute = Router({})

blogRoute.get('/', async (req, res) => {
    const bloggers = await BlogsRepository.getAllBlogs()
    res.status(200).json(bloggers)
})

blogRoute.get('/:id', async (req, res) => {
    const id = req.params.id

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        return res.sendStatus(404)
    }

    const blogForClient = {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }

    res.send(blogForClient)
})

blogRoute.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, async (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl
    const createdAt = new Date().toISOString()

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = errors.array()
        let newErrors: { message: string, field: string }[] = [];

        err.forEach(error => {
            let found = newErrors.filter(errItem => error.param === errItem.field).length;
            if (!found) {
                newErrors.push({
                    message: error.msg, field:
                    error.param
                });
            }
        });
        return res.status(400).json({
            errorsMessages: newErrors
        });
    }


    const createdBlogId = await BlogsRepository.createBlog({name, description, websiteUrl, createdAt})

    const createdBlogMapper = {
        id: createdBlogId,
        name, description, websiteUrl, createdAt
    }

    res.status(201).json(createdBlogMapper)
})

blogRoute.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, async (req, res) => {
    const id = req.params.id
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = errors.array()
        let newErrors: { message: string, field: string }[] = [];

        err.forEach(error => {
            let found = newErrors.filter(errItem => error.param === errItem.field).length;
            if (!found) {
                newErrors.push({
                    message: error.msg, field:
                    error.param
                });
            }
        });
        return res.status(400).json({
            errorsMessages: newErrors
        });
    }

    const isBlogUpdated = await BlogsRepository.updateBlog(id, {name, description, websiteUrl})

    if (!isBlogUpdated) {
        res.sendStatus(404)
    }

    res.sendStatus(204)
})

blogRoute.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params!.id

    const blog = BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return;
    }

    await BlogsRepository.deleteBlogById(id)

    res.sendStatus(204)
})