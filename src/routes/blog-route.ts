import {NextFunction, Request, Response, Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {body, validationResult} from "express-validator";

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

blogRoute.get('/', (req, res) => {
    const blogs = BlogsRepository.getAllBlogs()
    res.send(blogs)
})

blogRoute.get('/:id', (req, res) => {
    const id = req.params.id

    const blogs = BlogsRepository.getBlogById(id)

    if (!blogs) {
        res.sendStatus(404)
        return
    }

    res.send(blogs)
})

blogRoute.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => {
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

    const createdBlog = BlogsRepository.createBlog({name, description, websiteUrl})

    res.status(201).json(createdBlog)
})

blogRoute.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => {
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

    const isBlogUpdated = BlogsRepository.updateBlog(id, {name, description, websiteUrl})

    if (!isBlogUpdated) {
        res.sendStatus(404)
    }

    res.sendStatus(204)
})

blogRoute.delete('/:id', authMiddleware, (req, res) => {
    const id = req.params!.id

    const blogs = BlogsRepository.deleteBlogById(id)

    if (!blogs) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})