import {Router} from "express";
import {TestingRepository} from "../repositories/testing-repository";

export const deleteAllDataRoute = Router({})

deleteAllDataRoute.delete('/', (req, res) => {
    TestingRepository.deleteAllData()
    res.sendStatus(204)
})