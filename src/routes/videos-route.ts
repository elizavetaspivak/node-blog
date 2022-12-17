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

    res.status(200).json(video)
})

videosRoute.post('/', (req, res) => {
    let errors: ErrorType = {
        errorsMessages: []
    }

    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions

    if (!title || title.length > 40) {
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
    }

    if (!author || author.length > 20) {
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
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo = {
        id: videos.length + 1,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).json(newVideo)
})

videosRoute.put('/:id', (req, res) => {
    const id = req.params.id

    if (!id) {
        res.sendStatus(404)
        return;
    }

    let errors: ErrorType = {
        errorsMessages: []
    }

    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    let canBeDownloaded = req.body.canBeDownloaded
    const minAgeRestriction = req.body.minAgeRestriction
    let publicationDate = req.body.publicationDate

    if (!title || title.length > 40) {
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
    }

    if (!author || author.length > 20) {
        errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
    }

    if (availableResolutions) {
        availableResolutions.map((a: AvailableResolutions) => {
            !AvailableResolutions[a] && errors.errorsMessages.push({
                message: 'Incorrect availableResolutions',
                field: 'availableResolutions'
            })
        })
    }

    if (canBeDownloaded === undefined || typeof canBeDownloaded !== "boolean") {
        canBeDownloaded = false
    }

    if (minAgeRestriction) {
        minAgeRestriction < 1 || minAgeRestriction > 18 && errors.errorsMessages.push({
            message: 'Incorrect minAgeRestriction',
            field: 'minAgeRestriction'
        })
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    let videoIndex = videos.findIndex(v => v.id === +id)
    const video = videos.find(v => v.id === +id)


    if (!video) {
        res.sendStatus(404)
        return;
    }

    let newItem = {
        ...video,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate: publicationDate,
        title,
        author,
        availableResolutions
    }

    videos.splice(videoIndex, 1, newItem)

    res.sendStatus(204)
})

videosRoute.delete('/:id', (req, res) => {
    const id = req.params.id

    let videoIndex = videos.findIndex(v => v.id === +id)
    const video = videos.find(v => v.id === +id)


    if (!video) {
        res.sendStatus(404)
        return;
    }

    videos.splice(videoIndex, 1)

    res.sendStatus(204)
})