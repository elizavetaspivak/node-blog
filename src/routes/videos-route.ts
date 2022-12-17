import {Router} from "express";
import {AvailableResolutions, videos} from "./delete-all-data-route";

type errorMessageType = {
    message: string
    field: string
}

type ErrorType = {
    errorsMessages: errorMessageType[]
}

export const videosRoute = Router({})

export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: AvailableResolutions[]
}


videosRoute.get('/', (req, res) => {
    res.send(videos)
})

videosRoute.get('/:id', (req, res) => {
    const id = req.params.id
    const video = videos.find(v => v.id === +id)

    if (!video) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(200).send(videos)
})

videosRoute.post('/', (req, res) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions

    if (!title || title.length.trim() > 40) {
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
    }

    if (!author || author.length.trim() > 20) {
        errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
    }

    if (availableResolutions) {
        availableResolutions.map((a: AvailableResolutions) => {
            !AvailableResolutions[a] && errors.errorsMessages.push({
                message: 'Incorrect availableResolutions',
                field: 'availableResolutions'
            })
            return
        })
    }

    if (errors.errorsMessages.length) {
        res.sendStatus(400).send(errors)
        return;
    }

    let createdAt = new Date()

    const newVideo = {
        id: videos.length + 1,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: new Date(createdAt.getDate() + 1).toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)

    res.sendStatus(201).send(newVideo)
})