import * as express from "express";

import * as utils from "../utils";

import * as prgorams from "./programsCtr";

const api = express.Router();
api.get("/", (req, res, next) => {
  const user = <string>res.locals.username;
  const followUsers = <number[]>res.locals.followUsers;
  return utils.sendPayload(res, 200, 
    { message: `Hello ${user} Follow:${JSON.stringify(followUsers)}`}
  );
});
api.get("/programs/search/", prgorams.porgramsSearch);
export default api;
