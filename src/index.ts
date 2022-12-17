import express from "express";
import {videosRoute} from "./routes/videos-route";
import bodyParser from "body-parser";

const app = express()
const port = 3000


const parserMiddleware = bodyParser({})

app.use(parserMiddleware)

app.use('/videos', videosRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})