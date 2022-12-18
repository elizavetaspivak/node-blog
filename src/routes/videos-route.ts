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


videosRoute.get('/', async (req, res) => {
    const videos = await VideosRepository.getAllVideos()
    res.send(videos)
})

videosRoute.get('/:id', async (req, res) => {
    const id = req.params.id
    const video = await VideosRepository.getVideoById(id)

    if (!video) {
        res.sendStatus(404)
        return
    }

    const videoForClient = {
        id,
        title: video.title,
        author: video.author,
        canBeDownloaded: video.canBeDownloaded,
        minAgeRestriction: video.minAgeRestriction,
        createdAt: video.createdAt,
        publicationDate: video.publicationDate,
        availableResolutions: video.availableResolutions
    }

    res.status(200).json(videoForClient)
})

videosRoute.post('/', titleValidator, authorValidator, availableResolutionsValidator, async (req, res) => {
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

    const video = await VideosRepository.createVideo({
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
    minAgeRestrictionValidator, publicationDateValidator, canBeDownloadedValidator, async (req, res) => {
        const id = req.params!.id

        if (!id) {
            res.sendStatus(404)
            return;
        }

        const title = req.body.title
        const author = req.body.author
        const availableResolutions = req.body.availableResolutions
        let canBeDownloaded = req.body.canBeDownloaded ?? false
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

        let video = await VideosRepository.getVideoById(id)

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

        await VideosRepository.updateVideo(+id, newItem)

        res.sendStatus(204)
    })

videosRoute.delete('/:id', async (req, res) => {
    const id = req.params.id

    const video = await VideosRepository.getVideoById(id)

    if (!video) {
        res.sendStatus(404)
        return;
    }

    await VideosRepository.deleteVideo(id)

    res.sendStatus(204)
})