interface AppConfig {
  port: string;
  databaseUri: string;
}

type Mode = "test" | "dev" | "prod";

const config: (bootMode: Mode) => AppConfig = (bootMode) => {
  switch (bootMode) {
    case "test":
      return {
        port: "8888",
        databaseUri: "postgres://postgres:example@127.0.0.1:5432/demo",
      };

    case "test":
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
        `${bootMode} was selected as the startup mode. Select from prod, dev, or test character string.`
      );
  }
};
