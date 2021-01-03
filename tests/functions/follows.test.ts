import bcrypto from "bcrypt";
import { HyDatabase } from "../../src/@types/Models";
import { Sequelize } from "sequelize";
import { setModel } from "../../src/Models";
import * as follow from "../../src/functions/follow";

const dbUri = process.env.DATABASE_URL;
const sequelize: Sequelize = new Sequelize(dbUri, { logging: false });
const db: HyDatabase = setModel(sequelize);
const saltRound = 2;

const users = {
  momotaro: {
    id: null,
    username: "momotaro",
  },
  urashima: {
    id: null,
    username: "urashima",
  },
  yokohama: {
    id: null,
    username: "yokohama",
  },
  aomori: {
    id: null,
    username: "aomori",
  }
};

const init = async (db: HyDatabase, saltRound:number): Promise<void> => {
  const salt = bcrypto.genSaltSync(saltRound);
  const password = bcrypto.hashSync("test", salt);

  await db.users.bulkCreate(Object.keys(users).map((username)=>{
    return {username,password}
  }));

  const dbDatas = await db.users.findAll({
    attributes: ["id", "username"]
  });

  Object.keys(users).forEach((username) => {
    const r = dbDatas.filter((dbData)=>{
      return dbData.username === username;
    });
    users[username].id = r[0].id;
  });

  return;
};

describe("functions/follows.test.ts test.", () => {
  beforeAll(async () => {
    await sequelize.sync();
    await init(db, saltRound);
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  describe("followUser(db, user, followUser)", () => {
    test("ユーザーをフォローする機能", async () => {
      const user = users["momotaro"];
      const followUser = users["yokohama"];
      // momotaro が yokohama を フォローする。
      const [data, isSuccess] = await follow.followUser(db, user, followUser);
      expect(isSuccess).toBeTruthy();
      expect(data).toEqual({
        id: expect.any(Number),
        user_id: user.id,
        follow_id: followUser.id,
      });

      const dbResult = await db.follows.findAll({
        where: {
          id: user.id,
        },
        raw: true
      });

      const followData = dbResult[0];
      expect(followData.user_id).toEqual(user.id);
      expect(followData.follow_id,).toEqual(followUser.id);
    });
  });

  describe("getFollowers(db, user_id)", () => {
    test("フォロワー情報を取得する機能", async () => {
      const user = users["momotaro"];
      const [data, isSuccess] = await follow.getFollowers(db, user.id);
      expect(isSuccess).toBeTruthy();
      expect(data[0]["User.id"]).toEqual(users["yokohama"]["id"]);
      expect(data[0]["User.username"]).toEqual(users["yokohama"]["username"]);
    });
  });

  describe("unFollowUser(db, user)", () => {
    test("ユーザーのフォローを解除する機能", async () => {
      const user = users["momotaro"];
      const followUser = users["yokohama"];
      const [data, isSuccess] = await follow.unFollowUser(db, user, followUser);
      expect(isSuccess).toBeTruthy();
      expect(data).toEqual(1);

      const dbResult = await db.follows.findAll({
        where: {
          id: user.id,
        },
        raw: true
      });
      expect(dbResult).toHaveLength(0);
    });
  });

});
