import { appConfig } from "./config";
import { createContext } from "./factory";

import * as dotenv from 'dotenv';

dotenv.config();

export const config = appConfig(process.env.BOOT_MODE);
export const context = createContext(config);
context.app.listen(config.port, () => {
  console.log(`Listen to port http://localhost:${config.port}`);
});