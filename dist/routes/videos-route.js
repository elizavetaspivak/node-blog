"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoute = void 0;
const express_1 = require("express");
const delete_all_data_route_1 = require("./delete-all-data-route");
exports.videosRoute = (0, express_1.Router)({});
exports.videosRoute.get('/', (req, res) => {
    res.send(delete_all_data_route_1.videos);
});
exports.videosRoute.get('/:id', (req, res) => {
    const id = req.params.id;
    const video = delete_all_data_route_1.videos.find(v => v.id === +id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(delete_all_data_route_1.videos);
});
exports.videosRoute.post('/', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    console.log(req.body);
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    if (!title || title.length > 40) {
        errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
    }
    if (!author || author.length > 20) {
        errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
    }
    if (availableResolutions) {
        availableResolutions.map((a) => {
            !delete_all_data_route_1.AvailableResolutions[a] && errors.errorsMessages.push({
                message: 'Incorrect availableResolutions',
                field: 'availableResolutions'
            });
        });
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    let createdAt = new Date();
    const newVideo = {
        id: delete_all_data_route_1.videos.length + 1,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: new Date(createdAt.getDate() + 1).toISOString(),
        title,
        author,
        availableResolutions
    };
    delete_all_data_route_1.videos.push(newVideo);
    res.status(201).json(newVideo);
});
exports.videosRoute.put('/:id', (req, res) => {
    let createdAt = new Date();
    const id = req.params.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    let errors = {
        errorsMessages: []
    };
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    let canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    let publicationDate = req.body.publicationDate;
    if (!title || title.length > 40) {
        errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
    }
    if (!author || author.length > 20) {
        errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
    }
    if (availableResolutions) {
        availableResolutions.map((a) => {
            !delete_all_data_route_1.AvailableResolutions[a] && errors.errorsMessages.push({
                message: 'Incorrect availableResolutions',
                field: 'availableResolutions'
            });
        });
    }
    if (!canBeDownloaded) {
        canBeDownloaded = false;
    }
    if (minAgeRestriction) {
        minAgeRestriction < 1 || minAgeRestriction > 18 && errors.errorsMessages.push({
            message: 'Incorrect minAgeRestriction',
            field: 'minAgeRestriction'
        });
    }
    if (!publicationDate) {
        publicationDate = new Date(createdAt.getDate() + 1).toISOString();
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    let videoIndex = delete_all_data_route_1.videos.findIndex(v => v.id === +id);
    const video = delete_all_data_route_1.videos.find(v => v.id === +id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    let newItem = Object.assign(Object.assign({}, video), { canBeDownloaded,
        minAgeRestriction, createdAt: createdAt.toISOString(), publicationDate,
        title,
        author,
        availableResolutions });
    delete_all_data_route_1.videos.splice(videoIndex, 1, newItem);
    res.sendStatus(204);
});
