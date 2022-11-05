import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import {
  DEPLOY_ENVIRONMENT,
  FRONTEND_BASE_URL,
  STACK_PREFIX,
} from '../../constants';

export class UserPoolConstruct extends cdk.Construct {
  public readonly userPool: cognito.UserPool;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const postAccountConfirmationTrigger = new NodejsFunction(
      this,
      'post-confirmation',
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(6),
        handler: 'main',
        entry: path.join(
          __dirname,
          '/../../../src/cognito-triggers/post-confirmation/index.ts',
        ),
        bundling: {externalModules: ['aws-sdk']},
      },
    );

    const customMessagesTrigger = new NodejsFunction(this, 'custom-messages', {
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(6),
      handler: 'main',
      entry: path.join(
        __dirname,
        '/../../../src/cognito-triggers/custom-messages/index.ts',
      ),
      environment: {
        FRONTEND_BASE_URL,
      },
      bundling: {externalModules: ['aws-sdk']},
    });

    this.userPool = new cognito.UserPool(this, 'userpool', {
      userPoolName: `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        givenName: {
          required: false,
          mutable: true,
        },
        familyName: {
          required: false,
          mutable: true,
        },
      },
      customAttributes: {
        bio: new cognito.StringAttribute({mutable: true}),
        country: new cognito.StringAttribute({mutable: true}),
        city: new cognito.StringAttribute({mutable: true}),
        referral_code: new cognito.StringAttribute({mutable: true}),
        policy_locators: new cognito.StringAttribute({mutable: true, minLen:0, maxLen: 512}),
        isAdmin: new cognito.StringAttribute({mutable: true}),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      lambdaTriggers: {
        postConfirmation: postAccountConfirmationTrigger,
        customMessage: customMessagesTrigger,
      },
    });

    const adminAddUserToGroupPolicyStatement = new iam.PolicyStatement({
      actions: ['cognito-idp:AdminAddUserToGroup'],
      resources: [this.userPool.userPoolArn],
    });

    postAccountConfirmationTrigger.role?.attachInlinePolicy(
      new iam.Policy(this, 'post-confirm-trigger-policy', {
        statements: [adminAddUserToGroupPolicyStatement],
      }),
    );
  }
}
