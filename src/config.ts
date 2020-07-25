export interface AppConfig {
  port: string;
  databaseUri: string;
  secret: string;
  stretch: number;
};
export type Mode = "test" | "develop" | "prod" | string;

export const appConfig = (bootMode:Mode = "test"):AppConfig => {
  console.log(`BootMode:"${bootMode}"`);
  switch (bootMode) {
    case "test":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
        secret: "secret",
        stretch: 10,
      };
    case "develop":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
        secret: "secret",
        stretch: 10,
      };
    case "prod":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
        secret: "secret",
        stretch: 10,
      };
    default:
      throw Error(
        `${bootMode} was selected as the startup mode. Select from prod, develop, or test character string.`
      );
  }
};
