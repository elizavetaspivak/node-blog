import express from "express";
import {videosRoute} from "./routes/videos-route";
import bodyParser from "body-parser";
import {deleteAllDataRoute} from "./routes/delete-all-data-route";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";

const app = express()
const port = 3000


const parserMiddleware = bodyParser({})

app.use(parserMiddleware)

app.use('/videos', videosRoute)
app.use('/testing/all-data', deleteAllDataRoute)
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})