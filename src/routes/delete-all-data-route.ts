import {Router} from "express";
import {AvailableResolutions, VideoType} from "./videos-route";

export let videos: VideoType[] = [
    {
        id: 1,
        title: "Test",
        author: "Liza",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2022-12-17T16:27:02.560Z",
        publicationDate: "2022-12-17T16:27:02.560Z",
        availableResolutions: [
            AvailableResolutions.P144
        ]
    }
]

export const deleteAllDataRoute = Router({})

deleteAllDataRoute.delete('/', (req, res) => {
    videos = []
    res.sendStatus(204)
})