"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosRepository = void 0;
const testing_repository_1 = require("./testing-repository");
class VideosRepository {
    static getAllVideos() {
        return testing_repository_1.videos;
    }
    static getVideoById(id) {
        return testing_repository_1.videos.find(v => v.id === +id);
    }
    static createVideo(videoData) {
        const newVideo = Object.assign(Object.assign({}, videoData), { id: testing_repository_1.videos.length + 1 });
        testing_repository_1.videos.push(newVideo);
        return newVideo;
    }
    static updateVideo(id, videoData) {
        let videoIndex = testing_repository_1.videos.findIndex(v => v.id === +id);
        const video = testing_repository_1.videos.find(v => v.id === +id);
        let newItem = Object.assign(Object.assign({}, video), videoData);
        testing_repository_1.videos.splice(videoIndex, 1, newItem);
    }
    static deleteVideo(id) {
        let videoIndex = testing_repository_1.videos.findIndex(v => v.id === +id);
        testing_repository_1.videos.splice(videoIndex, 1);
    }
}
exports.VideosRepository = VideosRepository;
