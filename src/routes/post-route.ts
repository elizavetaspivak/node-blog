import {Router} from "express";
import {authMiddleware} from "./blog-route";
import {PostsRepository} from "../repositories/posts-repository";
import {body, validationResult} from "express-validator";
import {blogs} from "../repositories/testing-repository";


export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

const titleValidation = body('title').isLength({min: 1, max: 30}).withMessage('Incorrect title')

const shortDescriptionValidation = body('shortDescription').isLength({
    min: 1,
    max: 100
}).withMessage('Incorrect shortDescription')

const contentValidation = body('content').isLength({
    min: 1,
    max: 1000
}).withMessage('Incorrect content')

const blogIdValidation = body('blogId').custom((value) => {
    const blog = blogs.find(b => b.id === value)
    if (!blog) {
        throw Error('Incorrect blogId')
    }
    return true
}).withMessage('Incorrect blogId')

export const postRoute = Router({})

postRoute.get('/', (req, res) => {
    const posts = PostsRepository.getAllPosts()
    res.send(posts)
})

postRoute.get('/:id', (req, res) => {
    const id = req.params.id

    const foundedPost = PostsRepository.getPostById(id)

    if (!foundedPost) {
        res.sendStatus(404)
    }

    res.send(foundedPost)
})

postRoute.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, (req, res) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = errors.array()
        return res.status(400).json({
            errorsMessages: err.map(er => ({
                message: er.msg, field:
                er.param
            }))
        });
    }

    const createdPost = PostsRepository.createPost({title, shortDescription, content, blogId})

    res.status(201).json(createdPost)
})

postRoute.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = errors.array()
        return res.status(400).json({
            errorsMessages: err.map(er => ({
                message: er.msg, field:
                er.param
            }))
        });
    }

    const isUpdatePost = PostsRepository.updatePost(id, {title, shortDescription, content, blogId})

    if (!isUpdatePost) {
        res.sendStatus(404)
    }

    res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, (req, res) => {
    const id = req.params!.id

    const post = PostsRepository.deletePostById(id)

    if (!post) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})