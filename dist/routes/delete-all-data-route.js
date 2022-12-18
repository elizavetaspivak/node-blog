"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllDataRoute = void 0;
const express_1 = require("express");
const testing_repository_1 = require("../repositories/testing-repository");
exports.deleteAllDataRoute = (0, express_1.Router)({});
exports.deleteAllDataRoute.delete('/', async (req, res) => {
    await testing_repository_1.TestingRepository.deleteAllData();
    res.sendStatus(204);
});
