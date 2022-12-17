import {body} from "express-validator";
import {AvailableResolutions} from "../repositories/testing-repository";

export const titleValidator = body('title').isLength({min: 1, max: 40}).withMessage('Invalid title')
export const authorValidator = body('author').isLength({min: 1, max: 20}).withMessage('Invalid author')
export const availableResolutionsValidator = body('availableResolutions').custom((availableResolutions) => {
    return availableResolutions.every((availableResolutions: AvailableResolutions) =>
        Object.values(AvailableResolutions).includes(availableResolutions)
    );
})
    .withMessage("Please provide valid availableResolutions")

export const minAgeRestrictionValidator = body('minAgeRestriction').isFloat({
    min: 1,
    max: 18
}).withMessage('Invalid minAgeRestriction')

export const publicationDateValidator = body('publicationDate').optional().custom((value) => {
    if (!/^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(value)) {
        throw new Error('Invalid publicationDate');
    }
    return true
}).withMessage('Invalid publicationDate')

export const canBeDownloadedValidator = body('canBeDownloaded').optional().isBoolean().withMessage('Invalid canBeDownloaded')