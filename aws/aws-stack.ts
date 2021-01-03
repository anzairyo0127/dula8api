import * as cdk from '@aws-cdk/core';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import dotenv from "dotenv";
dotenv.config();

export class Dula8LambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const Dula8LambdaFunction = new NodejsFunction(this, "Dula8Lambda", {
      entry: "src/lambda/app.ts",
      handler: "handler",
      // minify: true,
      memorySize: 256,
      bundling: {
        nodeModules: ["pg", "pg-hstore"],
      },
      runtime: Runtime.NODEJS_12_X,
      environment: {
        DATABASE_URI: process.env.DATABASE_URI,
        DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK,
      },
    });
  }
}
