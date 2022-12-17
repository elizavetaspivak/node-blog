import {Router} from "express";
import {AvailableResolutions, videos} from "./delete-all-data-route";

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
    const video = videos.find(v => v.id === +id)

    if (!video) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(200).send(videos)
})