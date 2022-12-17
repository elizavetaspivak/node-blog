import {Router} from "express";

export const videosRoute = Router({})

enum AvailableResolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: AvailableResolutions[]
}

const videos: VideoType[] = [
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

videosRoute.get('/', (req, res) => {
    res.send(videos)
})