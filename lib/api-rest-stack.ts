import * as cdk from '@aws-cdk/core';
import * as Lambda from '@aws-cdk/aws-lambda';
import * as APIGateway from '@aws-cdk/aws-apigateway';

export class APIRestStack extends cdk.Stack {

  userPoolArn: string;
  applicationName?: string;

  constructor(scope: cdk.Construct, id: string, name?: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.applicationName = name;
  }

  build() {

    const helloWorldLambdaFunction = new Lambda.Function(this, this.applicationName + '-HelloWorld-LambdaFunction', {
      functionName: this.applicationName + '-HelloWorld-LambdaFunction',
      code: new Lambda.AssetCode('lambda/apirest/helloworld'),
      handler: 'helloworld.handler',
      runtime: Lambda.Runtime.NODEJS_10_X
    });

    const restApi = new APIGateway.LambdaRestApi(this, this.applicationName + '-LambdaRestApi', {
      restApiName: this.applicationName + '-LambdaRestApi',
      handler: helloWorldLambdaFunction,
      proxy: false,
    });

    const authorizer = new APIGateway.CfnAuthorizer(this, this.applicationName + '-API-REST-Authorizer', {
      restApiId: restApi.restApiId,
      name: this.applicationName + '-API-REST-Authorizer',
      type: 'COGNITO_USER_POOLS',
      identitySource: 'method.request.header.Authorization',
      providerArns: [this.userPoolArn],
    });

    const helloWorldResource = restApi.root
      .addResource('hello')
      .addMethod('GET', new APIGateway.LambdaIntegration(helloWorldLambdaFunction), {
          authorizationType: APIGateway.AuthorizationType.COGNITO,
          authorizer: {
            authorizerId: authorizer.ref
          }
        });


    let apiURL = restApi.url + "hello";

    new cdk.CfnOutput(this, "HelloWorld-Rest-API-URL", { value: apiURL });

  }
}