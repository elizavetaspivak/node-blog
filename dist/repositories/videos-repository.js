"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosRepository = void 0;
const mongo_1 = require("../db/mongo");
const mongodb_1 = require("mongodb");
class VideosRepository {
    static async getAllVideos() {
        const videos = await mongo_1.videosCollections.find({}).toArray();
        return videos.map((v) => ({
            id: v._id,
            title: v.title,
            author: v.author,
            canBeDownloaded: v.canBeDownloaded,
            minAgeRestriction: v.minAgeRestriction,
            createdAt: v.createdAt,
            publicationDate: v.publicationDate,
            availableResolutions: v.availableResolutions
        }));
    }
    static async getVideoById(id) {
        const video = await mongo_1.videosCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
        return video;
    }
    static async createVideo(videoData) {
        const res = await mongo_1.videosCollections.insertOne(videoData);
        return Object.assign({ id: res.insertedId }, videoData);
    }
    static async updateVideo(id, videoData) {
        const res = await mongo_1.videosCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                title: videoData.title,
                author: videoData.author,
                canBeDownloaded: videoData.canBeDownloaded,
                minAgeRestriction: videoData.minAgeRestriction,
                publicationDate: videoData.publicationDate,
                availableResolutions: videoData.availableResolutions
            }
        }, { upsert: true });
        return !!res.upsertedCount;
    }
    static async deleteVideo(id) {
        const res = await mongo_1.videosCollections.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return !!res.deletedCount;
    }
}
exports.VideosRepository = VideosRepository;
