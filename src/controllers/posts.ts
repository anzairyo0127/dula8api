import * as express from "express";

import {postsClient} from "../singletons"
import {delPostsClient} from "../singletons";
import {insertColumn, responseJson} from "../Models/Posts"

const postsRouter = express.Router();

postsRouter.get('/', async (req, res)=>{
    let ret: responseJson;
    if (req.query.id) {
        ret = await postsClient.row(req.query.id);
    } else {
        ret = await postsClient.rows();
    }
    res.status(ret.status).json(ret);
})

postsRouter.post('/post', async (req, res)=>{
    const requests:insertColumn = {
        title:req.body.title,
        text:req.body.text,
        name:req.body.name,
        password:req.body.password
    };
    if (requests) {
        const ret = await postsClient.post(requests)
        res.status(ret.status).json(ret);
    } else {
        res.status(400).json({
            message:"failed"
        });
    }
})

postsRouter.post('/del', async (req, res)=>{
    if(req.body.id != undefined || req.body.password != undefined){
        const ret = await delPostsClient.auth(req.body.id, req.body.password);
        res.status(ret.status).json(ret);
    } else {
        const date = new Date();
        res.status(401).json({
            status: 401,
            message: 'failed',
            date: date.toISOString(),
            count:0
        });
    } 
})


export default postsRouter;
