#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {Pillarlife} from './cognito-integration';
import {DEPLOY_ENVIRONMENT, DEPLOY_REGION, STACK_PREFIX} from './constants';

const app = new cdk.App();

// DEV Stack
new Pillarlife(app, `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`, {
  stackName: `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`,
  env: {
    region: DEPLOY_REGION,
  },
  tags: {env: `${DEPLOY_ENVIRONMENT}`},
});
