interface AppConfig {
  port: string;
  databaseUri: string;
}

export type Mode = "test" | "develop" | "prod" | string;

export const appConfig: (bootMode: Mode) => AppConfig = (bootMode) => {
  console.log(bootMode)
  switch (bootMode) {
    case "test":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
      };
    
    case "develop":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
      };

    case "prod":
      return {
        port: "5000",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
      };

    default:
      throw Error(
        `${bootMode} was selected as the startup mode. Select from prod, develop, or test character string.`
      );
  }
};
