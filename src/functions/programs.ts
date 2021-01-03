import { HyDatabase } from "../@types/Models";
import { Programs } from "../Models/Programs";
import * as I from "./../interfaces";
import { getFollowers } from "./follow"
import { Op } from "sequelize";

export const createProgram = async (
  db: HyDatabase,
  user: I.UserInfo,
  postData: I.Program
): Promise<[any, Boolean]> => {
  const program = db.programs.build({
    user_id: user.id,
    title: postData.title,
    content: postData.content,
    status: postData.status,
    start_time: new Date(postData.start_timeStr),
    end_time: new Date(postData.end_timeStr)
  });

  const result = await program.save();
  if (result) {
    return [result.toJSON(), true];
  } else {
    return [null, false];
  };

};

export const updateProgram = async (
  db: HyDatabase,
  programId: number,
  postData: I.Program
): Promise<[any, boolean]> => {
  const result = await db.programs.update(
    {
      title: postData.title,
      content: postData.content,
      status: postData.status,
      start_time: new Date(postData.start_timeStr),
      end_time: new Date(postData.end_timeStr)
    }, {
    where: { id: programId }
  });

  if (result) {
    return [result, true]
  } else {
    return [null, false]
  };

};

export const findProgramByUserIds = async (
  db: HyDatabase,
  user_ids: number[],
  offset: number,
): Promise<[any[], boolean]> => {
  const limit = 15;
  const rows = await db.programs.findAll(
    { 
      where: { user_id: user_ids },
      offset,
      limit,
      raw: true,
      order: [["updatedAt", "ASC"]],
    });
  
  return [rows, true]
  
};

export const findProgramBetween = async (
  db: HyDatabase, 
  startTime: Date, 
  endTime: Date,
  user_ids: number[],
) => {
  const rows = await db.programs.findAll(
    {
      raw: true,
      where : {
       user_id: user_ids,
       start_time: {
          [Op.gte]: startTime,
          [Op.lt]: endTime
        }
      }
    }
  );
  return [rows, true];
};
