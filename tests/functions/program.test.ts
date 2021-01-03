import bcrypto from "bcrypt";
import { HyDatabase } from "../../src/@types/Models";
import { Sequelize } from "sequelize";
import { setModel } from "../../src/Models";
import * as programs from "../../src/functions/programs";
import * as I from "../../src/interfaces";
import * as follow from "../../src/functions/follow";

const dbUri = process.env.DATABASE_URL;
// const dbUri = "postgres://postgres:example@127.0.0.1:5432/demo";
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

const init = async (db: HyDatabase, saltRound: number): Promise<void> => {
  const salt = bcrypto.genSaltSync(saltRound);
  const password = bcrypto.hashSync("test", salt);

  await db.users.bulkCreate(Object.keys(users).map((username) => {
    return { username, password }
  }));

  const dbDatas = await db.users.findAll({
    attributes: ["id", "username"]
  });

  Object.keys(users).forEach((username) => {
    const r = dbDatas.filter((dbData) => {
      return dbData.username === username;
    });
    users[username].id = r[0].id;
  });

  return;
};

describe("functions/programs.test.ts test.", () => {
  beforeEach(async () => {
    await sequelize.sync();
    await init(db, saltRound);
  });

  afterEach(async () => {
    await sequelize.drop();
  });

  afterAll(async ()=> {
    await sequelize.close();
  })

  describe("createProgram(db, user, postData)", () => {
    test("Programを投稿する機能", async () => {
      const user = users["momotaro"];
      const title = "hogehoge";
      const content = "aiueoaiueo";
      const status = "決定";
      const startTime = new Date(2020, 10, 10, 10, 10, 10).toISOString();
      const endTime = new Date(2020, 10, 10, 11, 10, 10).toISOString();
      const program:I.Program = {user_id:user.id, title, content, status, start_timeStr:startTime, end_timeStr: endTime };
      const [data, isSuccess] = await programs.createProgram(db, user, program);
      expect(isSuccess).toBeTruthy();
      expect(data).toEqual({
        id: expect.any(Number),
        user_id: user.id,
        content,
        title,
        status,
        start_time: new Date(startTime),
        end_time: new Date(endTime),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });

      const dbResult = await db.programs.findOne({
        where: {
          id: user.id,
        },
        raw: true
      });

      const programData = dbResult;
      expect(programData["user_id"]).toEqual(user.id);
      expect(programData["content"]).toEqual(content);
      expect(programData["title"]).toEqual(title);
      expect(programData["status"]).toEqual(status);
      expect(programData["start_time"]).toEqual(new Date(startTime));
      expect(programData["end_time"]).toEqual(new Date(endTime));
    });
  });

  describe("updateProgram(db, programId, postData)", () => {
    test("Programを更新する機能", async () => {
      const user = users["momotaro"];
      const user_id = user.id;
      const title = "ほげほげ";
      const content = "あかさたな";
      const status = "皮膚たろう";
      const startTime = new Date(2020, 10, 10, 10, 10, 10).toISOString();
      const endTime = new Date(2020, 10, 10, 11, 10, 10).toISOString();
      const program:I.Program = {user_id, title, content, status, start_timeStr:startTime, end_timeStr: endTime }
      const [data, isSuccess] = await programs.createProgram(db, user, program);

      const updatedContent = "かきくけこ";
      const updatedProgram:I.Program = {user_id, title, content:updatedContent, status, start_timeStr:startTime, end_timeStr: endTime }
      
      const programId = data.id;
      const [_, isSuccess2] = await programs.updateProgram(db, programId, updatedProgram);
      
      expect(isSuccess2).toBeTruthy();

      const data2 = await db.programs.findOne({where:{id: programId}});

      expect(data2.content).not.toEqual(content);
      expect(data2.content).toEqual(updatedContent);
      expect(data2.title).toEqual(title);
      expect(data2.status).toEqual(status);
      expect(data2.start_time).toEqual(new Date(startTime));
      expect(data2.end_time).toEqual(new Date(endTime));
    });
  });

  describe("findProgramByUserIds(db, user_id, offset)", () => {
    test("UserIdの複数を指定してProgramを更新度順に出力する機能", async () => {
      // await programs.updateProgram(db, programId, program);
      const user = users["momotaro"];
      const user_id = user.id;
      const title = "hogehoge";
      const content = "aiueoaiueo";
      const status = "決定";
      const startTime = new Date(2020, 10, 10, 10, 10, 10).toISOString();
      const endTime = new Date(2020, 10, 10, 11, 10, 10).toISOString();
      const program:I.Program = {user_id, title, content, status, start_timeStr:startTime, end_timeStr: endTime }
      const [, postIsSuccess] = await programs.createProgram(db, user, program);

      expect(postIsSuccess).toBeTruthy();

      const user2 = users["aomori"];
      // aomori が momotaro をフォローする。
      const [hoge, followIsSuccess] = await follow.followUser(db, user2, user);
      expect(followIsSuccess).toBeTruthy();

      const [followers, getFollowersIsSuccess] = await follow.getFollowers(db, user2.id);
      const followerIds = followers.map(follow=>follow.follow_id);

      // aomori の タイムラインを見る
      const [followerProgram, isSuccess] = await programs.findProgramByUserIds(db, followerIds, 0);
      const followerProgramData = followerProgram[0];
      expect(isSuccess).toBeTruthy();
      expect(followerProgramData["content"]).toEqual(content);
      
    });
  });
  
  describe("findProgramBetween(db, startTime, endTime)", () => {
    test("期間を指定するとその期間のプログラムを取得できる.", async () => {
      const results = [];

      const initData = async () => {
        const nums = [0, 1, 2, 3, 4];
        for (let i = 0; i < nums.length; i++) {
          const num = nums[i];
          const user = users["momotaro"];
          const user_id = user.id;
          const title = "hogehoge";
          const content = "aiueoaiueo";
          const status = "決定";
          const startTime = new Date(2020, 0, num + 1);
          const endTime = new Date(2020, 0, num + 2);
          const program:I.Program = {
            user_id, 
            title, 
            content, 
            status, 
            start_timeStr: startTime.toISOString(), 
            end_timeStr: endTime.toISOString()
          };
          const [result, postIsSuccess] = await programs.createProgram(db, user, program);
          results.push(result)
          expect(postIsSuccess).toBeTruthy();
        };
      };
      await initData();
      const startTime = new Date(2020, 0, 1);
      const endTime = new Date(2020, 0, 3);
      const [result, isSuccess ] = await programs.findProgramBetween(db, startTime, endTime, [1]);
      expect(isSuccess).toBeTruthy();
      expect(result).toEqual([
        results[0],
        results[1]
      ]);
    });
  });
});
