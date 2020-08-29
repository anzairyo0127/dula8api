import bcrypto from "bcrypt";
import { HyDatabase } from "../../src/@types/Models";
import { Sequelize } from "sequelize";
import { setModel } from "../../src/Models";
import * as follow from "../../src/functions/follow";

const dbUri = process.env.DATABASE_URL;
const sequelize: Sequelize = new Sequelize(dbUri);
const db: HyDatabase = setModel(sequelize);
const saltRound = 2;

const users = {
  pyonkichi: {
    id: null,
    username: "pyonkichi",
  },
  cchan: {
    id: null,
    username: "cchan",
  },
  anzai: {
    id: null,
    username: "anzai",
  },
  saeki: {
    id: null,
    username: "saeki",
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
    await sequelize.sync({ force: true });
    await init(db, saltRound);
  });

  afterAll(async () => {
    await sequelize.drop();
  });

  describe("followUser(db, user, followUser)", () => {
    test("ユーザーをフォローする機能", async () => {
      const user = users["pyonkichi"];
      const followUser = users["cchan"];
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
        raw: true,
        include: [{
          model: db.users,
          required: true,
        }],
      });

      // TODO:ここから開始
      console.log(dbResult);
      expect(dbResult[0]).toEqual({});
    });
  });

  describe("getFollowers(db, user)", () => {
    test("フォロワー情報を取得する機能", async () => {
      const user = users["pyonkichi"];
      const [data, isSuccess] = await follow.getFollowers(db, user);
      expect(isSuccess).toBeTruthy();
      expect(data[0]["User.id"]).toEqual(users["cchan"]["id"]);
      expect(data[0]["User.username"]).toEqual(users["cchan"]["username"]);
    });
  });

  describe("unFollowUser(db, user)", () => {
    test("ユーザーのフォローを解除する機能", async () => {
      const user = users["pyonkichi"];
      const followUser = users["cchan"];
      const [data, isSuccess] = await follow.unFollowUser(db, user, followUser);
      console.log(data);
      expect(isSuccess).toBeTruthy();
      expect(data).toEqual(1);
    });
  });

});
