import { createContext } from "./factory";

import * as dotenv from 'dotenv';

dotenv.config();
export const context = createContext(process.env.BOOT_MODE);

context.app.listen(context.port, () => {
  console.log(`Listen to port http://localhost:${context.port}`);
});
