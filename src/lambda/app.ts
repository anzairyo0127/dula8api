import { Sequelize } from "sequelize";

import { Discord } from "./discord";
import { setModel } from "../Models";
// import { createNewUser } from "../functions/auth";

const discord = new Discord(<string>process.env.DISCORD_WEBHOOK, "testman");
const dbUri = <string>process.env.DATABASE_URI;
const config = {
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
};
const sequelize = new Sequelize(dbUri, config);
const db = setModel(sequelize);

exports.handler = async (event:any, context:any, callback:any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await discord.send(JSON.stringify(event, null, 2));
  if (event.request.userAttributes["cognito:user_status"] !== "FORCE_CHANGE_PASSWORD") { // CONFIRMED
    try {
      const username = event["userName"];
      const cognitoSub = event.request.userAttributes["sub"];
      const authInfo = {
        username,
        cognitoSub,
      };
      // const [res, isSuccess] = await createNewUser(db, authInfo);
      // console.log({res, isSuccess});
      // await discord.send(JSON.stringify({res, isSuccess}, null, 2));  
    } catch (e) {
      console.log(e);
      await discord.send(JSON.stringify(e, null, 2));  
    }
  };
  callback(null, event);
  return ;
};
