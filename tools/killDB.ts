import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

import { appConfig } from "../src/config";
import { setModel } from "../src/Models";

dotenv.config();

const config = appConfig(process.env.BOOT_MODE);
const sequelize = new Sequelize(config.databaseUri, config.seqConfig);
const db = setModel(sequelize);

(async () => {
  await sequelize.sync({ force: true });
  await sequelize.drop();
})();
