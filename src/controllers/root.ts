import * as express from "express";

const root = express.Router();

root.get('/', async (req, res)=>{
    res.status(200).send("hoge")
});

export default root;
