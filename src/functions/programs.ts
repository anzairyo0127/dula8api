import { HyDatabase } from "../@types/Models";
import { Programs } from "../Models/Programs";
import * as I from "./../interfaces";
import {getFollowers} from "./follow"

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

  try {
    const _ = await program.save();
    return [program.toJSON(), true]
  } catch (e) {
    return [e.message, false]
  }

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

export const findCountAllProgramByUserId = async (
  db: HyDatabase,
  user_id: number,
  offset: number,
): Promise<[Programs[],number, boolean]> => {
  const followers = await getFollowers(db, user_id);
  const followerIds = followers.map(follower=>follower.id);
  const limit = 15;
  const {rows, count} = await db.programs.findAndCountAll(
    { 
      where: { id: followerIds },
      offset,
      limit
    });
  
  return [rows, count, true]
  
};
