import * as express from "express";

import * as programs from "../functions/programs";
import * as follow from "../functions/follow";
import * as utils from "../utils";
import * as I from "../interfaces";

import { Programs } from "../Models/Programs";

import { context } from "../app"

export const porgramsSearch = async (req, res) => {
  const startTime = new Date(<string>req.query.start_time);
  const endTime = new Date(<string>req.query.end_time);
  if (startTime && endTime) {
    const followUsers = <any[]>res.locals.followUsers;
    const followIds:number[] = followUsers.map(follow=>follow["User.id"]);
    const transaction = await context.sequelize.transaction();
    const [result, isSuccess] = await programs.findProgramBetween(
      context.db, startTime, endTime, followIds
    );
    await transaction.commit();
    return utils.sendPayload(res, 200, 
      { message: JSON.stringify(result)}
    );
  };
  return utils.sendPayload(res, 200, 
    { message: `hogehoge`}
  );
};
