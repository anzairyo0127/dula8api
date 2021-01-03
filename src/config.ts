import * as Seq from "sequelize";

export interface AppConfig {
  port: string;
  databaseUri: string;
  secret: string;
  stretch: number;
  isTest: boolean;
  seqConfig: Seq.Options;
  /*
  awsRegion: string;
  cognitoUserPoolId: string;
  */
};
export type Mode = "test" | "develop" | "prod" | string;

export const appConfig = (bootMode: Mode = "test"): AppConfig => {
  console.log(`BootMode:"${bootMode}"`);
  switch (bootMode) {
    case "test":
      return {
        port: "8888",
        databaseUri: "postgres://test-user@localhost:5432/demo",
        secret: "secret",
        stretch: 10,
        isTest: true,
        seqConfig: { logging: true },
      };
    case "develop":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
        secret: "secret",
        stretch: 10,
        isTest: false,
        seqConfig: { logging: false },
      };
    case "prod":
      return {
        port: "8888",
        databaseUri: <string>process.env.DATABASE_URI,
        secret: "secret",
        stretch: 10,
        isTest: false,
        seqConfig: {
          logging: false,
          dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
        },
      };
    default:
      throw Error(
        `${bootMode} was selected as the startup mode. Select from prod, develop, or test character string.`
      );
  }
};
