import { HyDatabase } from "../@types/Models";
import * as I from "../interfaces";

export const followUser = async (
  db: HyDatabase,
  user: I.UserInfo,
  followUser: I.UserInfo
): Promise<[any, Boolean]> => {
  const follow = db.follows.build({
    user_id: user.id,
    follow_id: followUser.id,
  });

  const result = await follow.save();

  if (result) {
    return [follow.toJSON(), true]
  } else {
    return [null, false]
  };

};

export const unFollowUser = async (
  db: HyDatabase,
  user: I.UserInfo,
  followUser: I.UserInfo
): Promise<[any, Boolean]> => {
  const result = await db.follows.destroy({
    where: {
      user_id: user.id,
      follow_id: followUser.id,
    },
  });

  if (result) {
    return [result, true]
  } else {
    return [null, false]
  };

};

export const getFollowers = async (
  db: HyDatabase,
  user_id: number,
): Promise<any[]> => {
  const result = await db.follows.findAll({
    where: { user_id: user_id },
    raw: true,
    include: [{
      model: db.users,
      required: true,
      attributes: ["id", "username"],
    }]
  });
  if (result) {
    return [result, true]
  } else {
    return [null, false]
  };
};
