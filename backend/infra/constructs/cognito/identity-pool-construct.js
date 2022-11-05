"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityPoolConstruct = void 0;
const cognito = __importStar(require("@aws-cdk/aws-cognito"));
const iam = __importStar(require("@aws-cdk/aws-iam"));
const cdk = __importStar(require("@aws-cdk/core"));
const constants_1 = require("../../constants");
class IdentityPoolConstruct extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const { userPool, userPoolClient } = props;
        this.identityPool = new cognito.CfnIdentityPool(this, 'identitypool', {
            allowUnauthenticatedIdentities: true,
            identityPoolName: `${constants_1.STACK_PREFIX}-${constants_1.DEPLOY_ENVIRONMENT}`,
            cognitoIdentityProviders: [
                {
                    clientId: userPoolClient.userPoolClientId,
                    providerName: userPool.userPoolProviderName,
                },
            ],
        });
        const isUserCognitoGroupRole = new iam.Role(this, 'users-group-role', {
            description: 'Default role for authenticated users',
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated',
                },
            }, 'sts:AssumeRoleWithWebIdentity'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ],
        });
        const isAnonymousCognitoGroupRole = new iam.Role(this, 'anonymous-group-role', {
            description: 'Default role for anonymous users',
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated',
                },
            }, 'sts:AssumeRoleWithWebIdentity'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ],
        });
        const isAdminCognitoGroupRole = new iam.Role(this, 'admins-group-role', {
            description: 'Default role for administrator users',
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated',
                },
            }, 'sts:AssumeRoleWithWebIdentity'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ],
        });
        new cognito.CfnUserPoolGroup(this, 'users-group', {
            groupName: 'Users',
            userPoolId: userPool.userPoolId,
            description: 'The default group for authenticated users',
            precedence: 3,
            roleArn: isUserCognitoGroupRole.roleArn,
        });
        new cognito.CfnUserPoolGroup(this, 'admins-group', {
            groupName: 'Admins',
            userPoolId: userPool.userPoolId,
            description: 'The group for admin users with special privileges',
            precedence: 2,
            roleArn: isAdminCognitoGroupRole.roleArn,
        });
        new cognito.CfnIdentityPoolRoleAttachment(this, 'identity-pool-role-attachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                authenticated: isUserCognitoGroupRole.roleArn,
                unauthenticated: isAnonymousCognitoGroupRole.roleArn,
            },
            roleMappings: {
                mapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `cognito-idp.${cdk.Stack.of(this).region}.amazonaws.com/${userPool.userPoolId}:${userPoolClient.userPoolClientId}`,
                },
            },
        });
    }
}
exports.IdentityPoolConstruct = IdentityPoolConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpdHktcG9vbC1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpZGVudGl0eS1wb29sLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQWdEO0FBQ2hELHNEQUF3QztBQUN4QyxtREFBcUM7QUFDckMsK0NBQWlFO0FBT2pFLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFHdEQsWUFDRSxLQUFvQixFQUNwQixFQUFVLEVBQ1YsS0FBaUM7UUFFakMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxHQUFHLEtBQUssQ0FBQztRQUV6QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3BFLDhCQUE4QixFQUFFLElBQUk7WUFDcEMsZ0JBQWdCLEVBQUUsR0FBRyx3QkFBWSxJQUFJLDhCQUFrQixFQUFFO1lBQ3pELHdCQUF3QixFQUFFO2dCQUN4QjtvQkFDRSxRQUFRLEVBQUUsY0FBYyxDQUFDLGdCQUFnQjtvQkFDekMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxvQkFBb0I7aUJBQzVDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLHNCQUFzQixHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDcEUsV0FBVyxFQUFFLHNDQUFzQztZQUNuRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQ25DLGdDQUFnQyxFQUNoQztnQkFDRSxZQUFZLEVBQUU7b0JBQ1osb0NBQW9DLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHO2lCQUM1RDtnQkFDRCx3QkFBd0IsRUFBRTtvQkFDeEIsb0NBQW9DLEVBQUUsZUFBZTtpQkFDdEQ7YUFDRixFQUNELCtCQUErQixDQUNoQztZQUNELGVBQWUsRUFBRTtnQkFDZixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUN4QywwQ0FBMEMsQ0FDM0M7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sMkJBQTJCLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUM5QyxJQUFJLEVBQ0osc0JBQXNCLEVBQ3RCO1lBQ0UsV0FBVyxFQUFFLGtDQUFrQztZQUMvQyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQ25DLGdDQUFnQyxFQUNoQztnQkFDRSxZQUFZLEVBQUU7b0JBQ1osb0NBQW9DLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHO2lCQUM1RDtnQkFDRCx3QkFBd0IsRUFBRTtvQkFDeEIsb0NBQW9DLEVBQUUsZUFBZTtpQkFDdEQ7YUFDRixFQUNELCtCQUErQixDQUNoQztZQUNELGVBQWUsRUFBRTtnQkFDZixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUN4QywwQ0FBMEMsQ0FDM0M7YUFDRjtTQUNGLENBQ0YsQ0FBQztRQUVGLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN0RSxXQUFXLEVBQUUsc0NBQXNDO1lBQ25ELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FDbkMsZ0NBQWdDLEVBQ2hDO2dCQUNFLFlBQVksRUFBRTtvQkFDWixvQ0FBb0MsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUc7aUJBQzVEO2dCQUNELHdCQUF3QixFQUFFO29CQUN4QixvQ0FBb0MsRUFBRSxlQUFlO2lCQUN0RDthQUNGLEVBQ0QsK0JBQStCLENBQ2hDO1lBQ0QsZUFBZSxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQ3hDLDBDQUEwQyxDQUMzQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNoRCxTQUFTLEVBQUUsT0FBTztZQUNsQixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVU7WUFDL0IsV0FBVyxFQUFFLDJDQUEyQztZQUN4RCxVQUFVLEVBQUUsQ0FBQztZQUNiLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxPQUFPO1NBQ3hDLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDakQsU0FBUyxFQUFFLFFBQVE7WUFDbkIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO1lBQy9CLFdBQVcsRUFBRSxtREFBbUQ7WUFDaEUsVUFBVSxFQUFFLENBQUM7WUFDYixPQUFPLEVBQUUsdUJBQXVCLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCxJQUFJLE9BQU8sQ0FBQyw2QkFBNkIsQ0FDdkMsSUFBSSxFQUNKLCtCQUErQixFQUMvQjtZQUNFLGNBQWMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUc7WUFDckMsS0FBSyxFQUFFO2dCQUNMLGFBQWEsRUFBRSxzQkFBc0IsQ0FBQyxPQUFPO2dCQUM3QyxlQUFlLEVBQUUsMkJBQTJCLENBQUMsT0FBTzthQUNyRDtZQUNELFlBQVksRUFBRTtnQkFDWixPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE9BQU87b0JBQ2IsdUJBQXVCLEVBQUUsbUJBQW1CO29CQUM1QyxnQkFBZ0IsRUFBRSxlQUNoQixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUNyQixrQkFBa0IsUUFBUSxDQUFDLFVBQVUsSUFDbkMsY0FBYyxDQUFDLGdCQUNqQixFQUFFO2lCQUNIO2FBQ0Y7U0FDRixDQUNGLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFqSUQsc0RBaUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0byc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQge0RFUExPWV9FTlZJUk9OTUVOVCwgU1RBQ0tfUFJFRklYfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuXG50eXBlIElkZW50aXR5UG9vbENvbnN0cnVjdFByb3BzID0ge1xuICB1c2VyUG9vbDogY29nbml0by5Vc2VyUG9vbDtcbiAgdXNlclBvb2xDbGllbnQ6IGNvZ25pdG8uVXNlclBvb2xDbGllbnQ7XG59O1xuXG5leHBvcnQgY2xhc3MgSWRlbnRpdHlQb29sQ29uc3RydWN0IGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBpZGVudGl0eVBvb2w6IGNvZ25pdG8uQ2ZuSWRlbnRpdHlQb29sO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHNjb3BlOiBjZGsuQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgcHJvcHM6IElkZW50aXR5UG9vbENvbnN0cnVjdFByb3BzLFxuICApIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qge3VzZXJQb29sLCB1c2VyUG9vbENsaWVudH0gPSBwcm9wcztcblxuICAgIHRoaXMuaWRlbnRpdHlQb29sID0gbmV3IGNvZ25pdG8uQ2ZuSWRlbnRpdHlQb29sKHRoaXMsICdpZGVudGl0eXBvb2wnLCB7XG4gICAgICBhbGxvd1VuYXV0aGVudGljYXRlZElkZW50aXRpZXM6IHRydWUsXG4gICAgICBpZGVudGl0eVBvb2xOYW1lOiBgJHtTVEFDS19QUkVGSVh9LSR7REVQTE9ZX0VOVklST05NRU5UfWAsXG4gICAgICBjb2duaXRvSWRlbnRpdHlQcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNsaWVudElkOiB1c2VyUG9vbENsaWVudC51c2VyUG9vbENsaWVudElkLFxuICAgICAgICAgIHByb3ZpZGVyTmFtZTogdXNlclBvb2wudXNlclBvb2xQcm92aWRlck5hbWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaXNVc2VyQ29nbml0b0dyb3VwUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAndXNlcnMtZ3JvdXAtcm9sZScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmYXVsdCByb2xlIGZvciBhdXRoZW50aWNhdGVkIHVzZXJzJyxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5GZWRlcmF0ZWRQcmluY2lwYWwoXG4gICAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nLFxuICAgICAgICB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmF1ZCc6IHRoaXMuaWRlbnRpdHlQb29sLnJlZixcbiAgICAgICAgICB9LFxuICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlJzoge1xuICAgICAgICAgICAgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphbXInOiAnYXV0aGVudGljYXRlZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5JyxcbiAgICAgICksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFxuICAgICAgICAgICdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBpc0Fub255bW91c0NvZ25pdG9Hcm91cFJvbGUgPSBuZXcgaWFtLlJvbGUoXG4gICAgICB0aGlzLFxuICAgICAgJ2Fub255bW91cy1ncm91cC1yb2xlJyxcbiAgICAgIHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdEZWZhdWx0IHJvbGUgZm9yIGFub255bW91cyB1c2VycycsXG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5GZWRlcmF0ZWRQcmluY2lwYWwoXG4gICAgICAgICAgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAge1xuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206YXVkJzogdGhpcy5pZGVudGl0eVBvb2wucmVmLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlJzoge1xuICAgICAgICAgICAgICAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmFtcic6ICdhdXRoZW50aWNhdGVkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3RzOkFzc3VtZVJvbGVXaXRoV2ViSWRlbnRpdHknLFxuICAgICAgICApLFxuICAgICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXG4gICAgICAgICAgICAnc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgKSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGNvbnN0IGlzQWRtaW5Db2duaXRvR3JvdXBSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdhZG1pbnMtZ3JvdXAtcm9sZScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmYXVsdCByb2xlIGZvciBhZG1pbmlzdHJhdG9yIHVzZXJzJyxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5GZWRlcmF0ZWRQcmluY2lwYWwoXG4gICAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nLFxuICAgICAgICB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmF1ZCc6IHRoaXMuaWRlbnRpdHlQb29sLnJlZixcbiAgICAgICAgICB9LFxuICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlJzoge1xuICAgICAgICAgICAgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphbXInOiAnYXV0aGVudGljYXRlZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5JyxcbiAgICAgICksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFxuICAgICAgICAgICdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBuZXcgY29nbml0by5DZm5Vc2VyUG9vbEdyb3VwKHRoaXMsICd1c2Vycy1ncm91cCcsIHtcbiAgICAgIGdyb3VwTmFtZTogJ1VzZXJzJyxcbiAgICAgIHVzZXJQb29sSWQ6IHVzZXJQb29sLnVzZXJQb29sSWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBkZWZhdWx0IGdyb3VwIGZvciBhdXRoZW50aWNhdGVkIHVzZXJzJyxcbiAgICAgIHByZWNlZGVuY2U6IDMsIC8vIHRoZSByb2xlIG9mIHRoZSBncm91cCB3aXRoIHRoZSBsb3dlc3QgcHJlY2VkZW5jZSAtIDAgdGFrZXMgZWZmZWN0IGFuZCBpcyByZXR1cm5lZCBieSBjb2duaXRvOnByZWZlcnJlZF9yb2xlXG4gICAgICByb2xlQXJuOiBpc1VzZXJDb2duaXRvR3JvdXBSb2xlLnJvbGVBcm4sXG4gICAgfSk7XG5cbiAgICBuZXcgY29nbml0by5DZm5Vc2VyUG9vbEdyb3VwKHRoaXMsICdhZG1pbnMtZ3JvdXAnLCB7XG4gICAgICBncm91cE5hbWU6ICdBZG1pbnMnLFxuICAgICAgdXNlclBvb2xJZDogdXNlclBvb2wudXNlclBvb2xJZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGdyb3VwIGZvciBhZG1pbiB1c2VycyB3aXRoIHNwZWNpYWwgcHJpdmlsZWdlcycsXG4gICAgICBwcmVjZWRlbmNlOiAyLCAvLyB0aGUgcm9sZSBvZiB0aGUgZ3JvdXAgd2l0aCB0aGUgbG93ZXN0IHByZWNlZGVuY2UgLSAwIHRha2VzIGVmZmVjdCBhbmQgaXMgcmV0dXJuZWQgYnkgY29nbml0bzpwcmVmZXJyZWRfcm9sZVxuICAgICAgcm9sZUFybjogaXNBZG1pbkNvZ25pdG9Hcm91cFJvbGUucm9sZUFybixcbiAgICB9KTtcblxuICAgIG5ldyBjb2duaXRvLkNmbklkZW50aXR5UG9vbFJvbGVBdHRhY2htZW50KFxuICAgICAgdGhpcyxcbiAgICAgICdpZGVudGl0eS1wb29sLXJvbGUtYXR0YWNobWVudCcsXG4gICAgICB7XG4gICAgICAgIGlkZW50aXR5UG9vbElkOiB0aGlzLmlkZW50aXR5UG9vbC5yZWYsXG4gICAgICAgIHJvbGVzOiB7XG4gICAgICAgICAgYXV0aGVudGljYXRlZDogaXNVc2VyQ29nbml0b0dyb3VwUm9sZS5yb2xlQXJuLFxuICAgICAgICAgIHVuYXV0aGVudGljYXRlZDogaXNBbm9ueW1vdXNDb2duaXRvR3JvdXBSb2xlLnJvbGVBcm4sXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGVNYXBwaW5nczoge1xuICAgICAgICAgIG1hcHBpbmc6IHtcbiAgICAgICAgICAgIHR5cGU6ICdUb2tlbicsXG4gICAgICAgICAgICBhbWJpZ3VvdXNSb2xlUmVzb2x1dGlvbjogJ0F1dGhlbnRpY2F0ZWRSb2xlJyxcbiAgICAgICAgICAgIGlkZW50aXR5UHJvdmlkZXI6IGBjb2duaXRvLWlkcC4ke1xuICAgICAgICAgICAgICBjZGsuU3RhY2sub2YodGhpcykucmVnaW9uXG4gICAgICAgICAgICB9LmFtYXpvbmF3cy5jb20vJHt1c2VyUG9vbC51c2VyUG9vbElkfToke1xuICAgICAgICAgICAgICB1c2VyUG9vbENsaWVudC51c2VyUG9vbENsaWVudElkXG4gICAgICAgICAgICB9YCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApO1xuICB9XG59XG4iXX0=