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
    res.sendStatus(200).send(delete_all_data_route_1.videos);
});
exports.videosRoute.post('/', (req, res) => {
    const video = delete_all_data_route_1.videos.find(v => v.id === +id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(200).send(delete_all_data_route_1.videos);
});
