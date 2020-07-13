import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LabCognito from '../lib/lab-cognito-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LabCognito.LabCognitoStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
