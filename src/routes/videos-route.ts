import {Router} from "express";
import {AvailableResolutions} from "../repositories/testing-repository";
import {VideosRepository} from "../repositories/videos-repository";

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
    const videos = VideosRepository.getAllVideos()
    res.send(videos)
})

videosRoute.get('/:id', (req, res) => {
    const id = +req.params.id
    const video = VideosRepository.getVideoById(id)

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

    const video = VideosRepository.createVideo({
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    })

    res.status(201).json(video)
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

    if (canBeDownloaded === undefined) {
        canBeDownloaded = false
    } else if (typeof canBeDownloaded !== "boolean") {
        errors.errorsMessages.push({message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded'})
    }

    if (minAgeRestriction) {
        minAgeRestriction < 1 || minAgeRestriction > 18 && errors.errorsMessages.push({
            message: 'Incorrect minAgeRestriction',
            field: 'minAgeRestriction'
        })
    }

    if (publicationDate && !/^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(publicationDate)) {
        errors.errorsMessages.push({message: 'Incorrect publicationDate', field: 'publicationDate'})
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    let video = VideosRepository.getVideoById(+id)

    if (!video) {
        res.sendStatus(404)
        return;
    }

    let newItem = {
        canBeDownloaded,
        minAgeRestriction,
        publicationDate: publicationDate,
        title,
        author,
        availableResolutions
    }

    VideosRepository.updateVideo(+id, newItem)

    res.sendStatus(204)
})

videosRoute.delete('/:id', (req, res) => {
    const id = req.params.id

    const video = VideosRepository.getVideoById(+id)

    if (!video) {
        res.sendStatus(404)
        return;
    }

    VideosRepository.deleteVideo(+id)

    res.sendStatus(204)
})