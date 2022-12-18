"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingRepository = exports.posts = exports.videos = exports.AvailableResolutions = void 0;
const mongo_1 = require("../db/mongo");
var AvailableResolutions;
(function (AvailableResolutions) {
    AvailableResolutions["P144"] = "P144";
    AvailableResolutions["P240"] = "P240";
    AvailableResolutions["P360"] = "P360";
    AvailableResolutions["P480"] = "P480";
    AvailableResolutions["P720"] = "P720";
    AvailableResolutions["P1080"] = "P1080";
    AvailableResolutions["P1440"] = "P1440";
    AvailableResolutions["P2160"] = "P2160";
})(AvailableResolutions = exports.AvailableResolutions || (exports.AvailableResolutions = {}));
exports.videos = [
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
];
exports.posts = [
    {
        id: "fsdyuifye",
        title: "fsfsfdsf",
        shortDescription: "fsdfsdfsd",
        content: "fgfsd",
        blogId: "fdsfdsfsd",
        blogName: "fsdf"
    }
];
class TestingRepository {
    static async deleteAllData() {
        await mongo_1.database.dropDatabase();
        exports.videos = [];
    }
}
exports.TestingRepository = TestingRepository;
