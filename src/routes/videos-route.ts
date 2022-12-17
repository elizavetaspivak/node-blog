import {Router} from "express";
import {AvailableResolutions} from "../repositories/testing-repository";
import {VideosRepository} from "../repositories/videos-repository";
import {validationResult} from "express-validator";
import {
    authorValidator,
    availableResolutionsValidator, canBeDownloadedValidator,
    minAgeRestrictionValidator, publicationDateValidator,
    titleValidator
} from "../validators/video-validators";

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

videosRoute.post('/', titleValidator, authorValidator, availableResolutionsValidator, (req, res) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions

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

videosRoute.put('/:id', titleValidator, authorValidator, availableResolutionsValidator,
    minAgeRestrictionValidator, publicationDateValidator, canBeDownloadedValidator, (req, res) => {
        const id = req.params!.id

        if (!id) {
            res.sendStatus(404)
            return;
        }

        const title = req.body.title
        const author = req.body.author
        const availableResolutions = req.body.availableResolutions
        let canBeDownloaded = req.body.canBeDownloaded = false
        const minAgeRestriction = req.body.minAgeRestriction
        let publicationDate = req.body.publicationDate

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