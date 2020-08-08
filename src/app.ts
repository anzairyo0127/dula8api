import { appConfig } from "./config";
import { createContext, Context } from "./factory";

import * as dotenv from 'dotenv';

dotenv.config();
export const config = appConfig(process.env.BOOT_MODE);
export const context: Context = createContext(config);

(async () => {
  await context.sequelize.sync();
  context.app.listen(config.port, () => {
    console.log(`Listen to port http://localhost:${config.port}`);
  });
})();
