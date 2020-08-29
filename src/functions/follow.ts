import { HyDatabase } from "../@types/Models";

export interface UserInfo {
  id: number;
  username: string;
}

export const followUser = async (
  db: HyDatabase,
  user: UserInfo,
  followUser: UserInfo
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
  user: UserInfo,
  followUser: UserInfo
): Promise<[any, Boolean]> => {
  const result = await db.follows.destroy({
    where:{
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
  user: UserInfo,
):Promise<any[]> => {
  const result = await db.follows.findAll({
    where: { id: user.id },
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
