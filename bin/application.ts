#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CognitoStack } from '../lib/cognito-stack';
import { APIRestStack } from '../lib/api-rest-stack';

const app = new cdk.App();
const applicationName = 'Labs'

const cognitoStack = new CognitoStack(app, applicationName + 'CognitoStack', applicationName);
cognitoStack.build();

const apirestStack = new APIRestStack(app, applicationName + 'APIRestStack', applicationName);
apirestStack.userPoolArn = cognitoStack.userPool.userPoolArn;
apirestStack.build();
