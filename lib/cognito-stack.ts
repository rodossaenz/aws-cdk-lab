import * as cdk from '@aws-cdk/core';
import * as Cognito from "@aws-cdk/aws-cognito";
import * as CustomResources from "@aws-cdk/custom-resources";
import * as IAM from "@aws-cdk/aws-iam";

export class CognitoStack extends cdk.Stack {

  userPool: Cognito.UserPool;
  applicationName?: string;

  constructor(scope: cdk.Construct, id: string, name?: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.applicationName = name;
  }

  build(){

    // Cognito user pool
    const userPool = new Cognito.UserPool(this, this.applicationName + '-UserPool', {
      userPoolName: this.applicationName + '-UserPool',
      selfSignUpEnabled: true,
      customAttributes: {
        member_status: new Cognito.StringAttribute()
      },
      signInAliases: {
        email: true,
        phone: true,
        username: true
      }
    });

    userPool.addDomain(this.applicationName + '-UserPool-Domain',{
      cognitoDomain: {
        domainPrefix: 'rodosaenz'
      }
    });

    // Cognito user pool client
    const userPoolClient = userPool.addClient(this.applicationName + '-AppClient', {
      userPoolClientName: this.applicationName + '-AppClient',
      oAuth: {
        flows: {
          implicitCodeGrant: true
        },
        scopes: [Cognito.OAuthScope.OPENID],
        callbackUrls: ['https://www.google.com']
      }
    });

    new cdk.CfnOutput(this, "Cognito-Client-ID", { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, "Cognito-UserPool-ID", { value: userPool.userPoolId });

    this.userPool = userPool;

    // Cognito test user as a custom resource
    /* new CustomResources.AwsCustomResource(this, "UserPoolDomainNameCustomResource", {
      policy: CustomResources.AwsCustomResourcePolicy.fromStatements([
        new IAM.PolicyStatement({
          effect: IAM.Effect.ALLOW,
          actions: [
            "cognito-idp:*"
          ],
          resources: ["*"]
        })
      ]),
      onCreate: {
        service: "CognitoIdentityServiceProvider",
        action: "adminCreateUser",
        parameters: {
          UserPoolId: userPool.userPoolId,
          Username: "testuser",
          TemporaryPassword: "Password123!",
          UserAttributes: [
            { "Name": "email", "Value": "testuser@somewhere.com" },
            { "Name": "email_verified", "Value": "True" },
            { "Name": "custom:member_status", "Value": "gold_member_status" }
          ],
          MessageAction: "SUPPRESS"
        },
        physicalResourceId: {
          id: 'userpoolcreateid' + Date.now().toString()
        }
      }
    }); */
    

    /*
      aws cognito-idp admin-set-user-password --user-pool-id 'us-east-1_dIEc0QOw0' --username testuser --password 'Test123!' --permanent
    */

  }
}

