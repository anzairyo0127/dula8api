#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Dula8LambdaStack } from './aws-stack';

const app = new cdk.App();
new Dula8LambdaStack(app, 'Dula8LambdaStack');
