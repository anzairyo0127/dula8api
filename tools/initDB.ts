import bcrypto from "bcrypt";
import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

import { appConfig } from "../src/config";
import { setModel } from "../src/Models";
import { Users } from "../src/Models/Users";
import { createNewUser } from "../src/functions/auth";

dotenv.config();

const config = appConfig(process.env.BOOT_MODE);
const sequelize = new Sequelize(config.databaseUri, config.seqConfig);
const db = setModel(sequelize);

(async () => {
  await sequelize.sync({ force: true });
  const password = "test";
  const salt = bcrypto.genSaltSync(config.stretch);
  const kuzunoha = db.users.build({
    username: "kuzunoha2",
    password: bcrypto.hashSync(password, salt),
  });
  await kuzunoha.save();
  const programs = db.programs.build({
    title: "ほげやさん",
    content: "ハンバーグってなんやねんｗｗｗハンバーガー、な",
    status: "投稿前",
    user_id: kuzunoha.id,
  });
  const result = await programs.save();
  console.log(result);
  const r = await db.programs.findOne({
    where: {user_id: 1},
    include: [{
      model: Users,
      required: true,
    }]
  });
  console.log(r.toJSON());

  const user1 = db.users.build({
    username: "user1",
    password: bcrypto.hashSync(password, salt),
    cognito_sub: "user1"
  });

  const user2 = db.users.build({
    username: "user2",
    password: bcrypto.hashSync(password, salt),
    cognito_sub: "user2"
  });

  const user3 = db.users.build({
    username: "user3",
    password: bcrypto.hashSync(password, salt),
    cognito_sub: "user3"
  });

  await user1.save();
  await user2.save();
  await user3.save();

  const user1Progmrams = db.programs.build({
    title: "アンドロメダ星雲",
    content: "二個目の波動拳がすぐそこまで来ている！！！！１１",
    status: "投稿前",
    user_id: user1.id,
  });

  await user1Progmrams.save();

  const follow = db.follows.build({
    user_id: kuzunoha.id,
    follow_id: user1.id,
  });
  const result1 = await follow.save();
  console.log(result1);

  const follow2 = db.follows.build({
    user_id: kuzunoha.id,
    follow_id: user2.id,
  });
  const result2 = await follow2.save();
  console.log(result2.toJSON());

  const rr = await db.follows.findAll({
    where: {user_id: kuzunoha.id},
    include: [{
      model: Users,
      required: true,
    }]
  });
  rr.forEach(r=>console.log(r.toJSON()));
})();
