interface AppConfig {
  port: string;
  databaseUri: string;
  secret: string;
};

export type Mode = "test" | "develop" | "prod" | string;

export const appConfig: (bootMode: Mode) => AppConfig = (bootMode) => {
  console.log(`BootMode:"${bootMode}"`);
  switch (bootMode) {
    case "test":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
        secret: "secret"
      };
    case "develop":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
        secret: "secret"
      };
    case "prod":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
        secret: "secret"
      };
    default:
      throw Error(
        `${bootMode} was selected as the startup mode. Select from prod, develop, or test character string.`
      );
  }
};
