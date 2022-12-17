"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canBeDownloadedValidator = exports.publicationDateValidator = exports.minAgeRestrictionValidator = exports.availableResolutionsValidator = exports.authorValidator = exports.titleValidator = void 0;
const express_validator_1 = require("express-validator");
const testing_repository_1 = require("../repositories/testing-repository");
exports.titleValidator = (0, express_validator_1.body)('title').isLength({ min: 1, max: 40 }).withMessage('Invalid title');
exports.authorValidator = (0, express_validator_1.body)('author').isLength({ min: 1, max: 20 }).withMessage('Invalid author');
exports.availableResolutionsValidator = (0, express_validator_1.body)('availableResolutions').custom((availableResolutions) => {
    return availableResolutions.every((availableResolutions) => Object.values(testing_repository_1.AvailableResolutions).includes(availableResolutions));
})
    .withMessage("Please provide valid availableResolutions");
exports.minAgeRestrictionValidator = (0, express_validator_1.body)('minAgeRestriction').isFloat({
    min: 1,
    max: 18
}).withMessage('Invalid minAgeRestriction');
exports.publicationDateValidator = (0, express_validator_1.body)('publicationDate').optional().custom((value) => {
    if (!/^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(value)) {
        throw new Error('Invalid publicationDate');
    }
    return true;
}).withMessage('Invalid publicationDate');
exports.canBeDownloadedValidator = (0, express_validator_1.body)('canBeDownloaded').optional().isBoolean().withMessage('Invalid canBeDownloaded');
