"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoute = void 0;
const express_1 = require("express");
const videos_repository_1 = require("../repositories/videos-repository");
const express_validator_1 = require("express-validator");
const video_validators_1 = require("../validators/video-validators");
exports.videosRoute = (0, express_1.Router)({});
exports.videosRoute.get('/', async (req, res) => {
    const videos = await videos_repository_1.VideosRepository.getAllVideos();
    res.send(videos);
});
exports.videosRoute.get('/:id', async (req, res) => {
    const id = +req.params.id;
    const video = await videos_repository_1.VideosRepository.getVideoById(id);
    if (!video) {
        res.sendStatus(404);
        return;
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
    };
    res.status(200).json(videoForClient);
});
exports.videosRoute.post('/', video_validators_1.titleValidator, video_validators_1.authorValidator, video_validators_1.availableResolutionsValidator, async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const err = errors.array();
        return res.status(400).json({
            errorsMessages: err.map(er => ({
                message: er.msg, field: er.param
            }))
        });
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const video = await videos_repository_1.VideosRepository.createVideo({
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    });
    res.status(201).json(video);
});
exports.videosRoute.put('/:id', video_validators_1.titleValidator, video_validators_1.authorValidator, video_validators_1.availableResolutionsValidator, video_validators_1.minAgeRestrictionValidator, video_validators_1.publicationDateValidator, video_validators_1.canBeDownloadedValidator, async (req, res) => {
    var _a;
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    let canBeDownloaded = (_a = req.body.canBeDownloaded) !== null && _a !== void 0 ? _a : false;
    const minAgeRestriction = req.body.minAgeRestriction;
    let publicationDate = req.body.publicationDate;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const err = errors.array();
        return res.status(400).json({
            errorsMessages: err.map(er => ({
                message: er.msg, field: er.param
            }))
        });
    }
    let video = await videos_repository_1.VideosRepository.getVideoById(+id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    let newItem = {
        canBeDownloaded,
        minAgeRestriction,
        publicationDate: publicationDate,
        title,
        author,
        availableResolutions
    };
    await videos_repository_1.VideosRepository.updateVideo(+id, newItem);
    res.sendStatus(204);
});
exports.videosRoute.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const video = await videos_repository_1.VideosRepository.getVideoById(+id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    await videos_repository_1.VideosRepository.deleteVideo(+id);
    res.sendStatus(204);
});
