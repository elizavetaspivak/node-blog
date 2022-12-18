import {Router} from "express";
import {authMiddleware, blogs} from "./blog-route";
import {PostsRepository} from "../repositories/posts-repository";
import {body, validationResult} from "express-validator";
import {blogsCollections} from "../db/mongo";
import {BlogsRepository} from "../repositories/blogs-repository";


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

const blogIdValidation = body('blogId').custom(async (value) => {
    const blog = await BlogsRepository.getBlogById(value)
    if (!blog) {
        throw Error('Incorrect blogId')
    }
    return true
}).withMessage('Incorrect blogId')

export const postRoute = Router({})

postRoute.get('/', async (req, res) => {
    const posts = await PostsRepository.getAllPosts()
    res.send(posts)
})

postRoute.get('/:id', async (req, res) => {
    const id = req.params.id

    if (!id) {
        res.sendStatus(404)
        return
    }

    const foundedPost = await PostsRepository.getPostById(id)

    if (!foundedPost) {
        res.sendStatus(404)
    }

    const postForClient = {
        id: foundedPost._id,
        title: foundedPost.title,
        shortDescription: foundedPost.shortDescription,
        content: foundedPost.content,
        blogId: foundedPost.blogId,
        blogName: foundedPost.blogName,
        createdAt: foundedPost.createdAt
    }

    res.send(postForClient)
})

postRoute.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, async (req, res) => {
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

    const createdPostId = await PostsRepository.createPost({title, shortDescription, content, blogId})
    const post = await PostsRepository.getPostById(createdPostId)


    const createdPostMapper = {
        id: createdPostId,
        title, shortDescription, content, blogId, blogName: post.blogName, createdAt: post.createdAt
    }


    res.status(201).json(createdPostMapper)
})

postRoute.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, async (req, res) => {
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

    const isUpdatePost = await PostsRepository.updatePost(id, {title, shortDescription, content, blogId})

    if (!isUpdatePost) {
        res.sendStatus(404)
    }

    res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params!.id

    if (!id) {
        res.sendStatus(404)

    }

    const post = await PostsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return;
    }

    await PostsRepository.deletePostById(id)

    res.sendStatus(204)
})