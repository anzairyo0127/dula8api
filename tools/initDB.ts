import bcrypto from "bcrypt";
import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

import { appConfig } from "../src/config";
import { setModel } from "../src/Models";
import { Users } from "../src/Models/Users";

dotenv.config();

const config = appConfig(process.env.BOOT_MODE);
const sequelize = new Sequelize(config.databaseUri);
const db = setModel(sequelize);

(async () => {
  await sequelize.sync({ force: true });
  const password = "test";
  const salt = bcrypto.genSaltSync(config.stretch);
  const pyonkichi = db.users.build({
    username: "pyonkichi",
    password: bcrypto.hashSync(password, salt),
  });
  await pyonkichi.save();
  const programs = db.programs.build({
    title: "ほげやさん",
    content: "ハンバーグってなんやねんｗｗｗハンバーガー、な",
    status: "投稿前",
    user_id: pyonkichi.id,
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
  
})();
