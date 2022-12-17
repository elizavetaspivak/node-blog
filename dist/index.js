"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videos_route_1 = require("./routes/videos-route");
const body_parser_1 = __importDefault(require("body-parser"));
const delete_all_data_route_1 = require("./routes/delete-all-data-route");
const app = (0, express_1.default)();
const port = 3000;
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
app.use('/api/videos', videos_route_1.videosRoute);
app.use('/api/testing/all-data', delete_all_data_route_1.deleteAllDataRoute);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
