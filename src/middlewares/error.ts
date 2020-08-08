import {Response, Request, NextFunction} from "express";

import * as utils from "../utils";

export const errorHandler = async (err:any, req:Request, res:Response, next:NextFunction) => {
  console.log(err.stack);
  return utils.sendPayload(res, 500, {message: err.message})
}