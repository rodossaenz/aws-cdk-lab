#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LabCognitoStack } from '../lib/lab-cognito-stack';

const app = new cdk.App();
new LabCognitoStack(app, 'LabCognitoStack');
