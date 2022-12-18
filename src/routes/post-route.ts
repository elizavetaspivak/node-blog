import {Router} from "express";
import {authMiddleware, blogs} from "./blog-route";
import {PostsRepository} from "../repositories/posts-repository";
import {body, validationResult} from "express-validator";


export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

const titleValidation = body('title').trim().isLength({min: 1, max: 30}).withMessage('Incorrect title')

const shortDescriptionValidation = body('shortDescription').isLength({
    min: 1,
    max: 100
}).withMessage('Incorrect shortDescription')

const contentValidation = body('content').trim().isLength({
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

    if (!id) {
        res.sendStatus(404)
        return
    }

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

    if (!id) {
        res.sendStatus(404)

    }

    const post = PostsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return;
    }

    PostsRepository.deletePostById(id)

    res.sendStatus(204)
})