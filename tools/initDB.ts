import bcrypto from "bcrypt";
import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

import { appConfig } from "../src/config";
import { setModel } from "../src/Models";

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
})();
