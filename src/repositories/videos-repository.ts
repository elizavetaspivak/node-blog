import {AvailableResolutions, videos} from "./testing-repository";
import {blogsCollections, videosCollections} from "../db/mongo";
import {ObjectId} from "mongodb";

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
        const videos = await videosCollections.find({}).toArray()

        return videos.map((v: any) => ({
            id: v._id,
            title: v.title,
            author: v.author,
            canBeDownloaded: v.canBeDownloaded,
            minAgeRestriction: v.minAgeRestriction,
            createdAt: v.createdAt,
            publicationDate: v.publicationDate,
            availableResolutions: v.availableResolutions
        }))
    }

    static async getVideoById(id: string) {
        const video = await videosCollections.findOne({_id: new ObjectId(id)})

        return video
    }

    static async createVideo(videoData: CreateVideoType) {
        const res = await videosCollections.insertOne(videoData)

        return {
            id: res.insertedId,
            ...videoData
        }

    }

    static async updateVideo(id: string, videoData: UpdateVideoType) {
        const res = await videosCollections.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    title: videoData.title,
                    author: videoData.author,
                    canBeDownloaded: videoData.canBeDownloaded,
                    minAgeRestriction: videoData.minAgeRestriction,
                    publicationDate: videoData.publicationDate,
                    availableResolutions: videoData.availableResolutions
                }
            }, {upsert: true}
        )

        return !!res.upsertedCount;
    }

    static async deleteVideo(id: string) {
        const res = await videosCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}