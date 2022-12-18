import {AvailableResolutions, videos} from "./testing-repository";

export type CreateVideoType = {
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: AvailableResolutions[]
}

export type UpdateVideoType = {
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string,
    availableResolutions: AvailableResolutions[]
}

export class VideosRepository {
    static async getAllVideos() {
        return videos
    }

    static async getVideoById(id: number) {
        return videos.find(v => v.id === +id)
    }

    static createVideo(videoData: CreateVideoType) {
        const newVideo = {
            ...videoData,
            id: videos.length + 1,
        }
        videos.push(newVideo)
        return newVideo
    }

    static updateVideo(id: number, videoData: UpdateVideoType) {
        let videoIndex = videos.findIndex(v => v.id === +id)
        const video = videos.find(v => v.id === +id)

        let newItem = {
            ...video!,
            ...videoData
        }

        videos.splice(videoIndex, 1, newItem)
    }

    static deleteVideo(id: number) {
        let videoIndex = videos.findIndex(v => v.id === +id)

        videos.splice(videoIndex, 1)
    }
}