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
exports.UserPoolConstruct = void 0;
const cognito = __importStar(require("@aws-cdk/aws-cognito"));
const iam = __importStar(require("@aws-cdk/aws-iam"));
const lambda = __importStar(require("@aws-cdk/aws-lambda"));
const aws_lambda_nodejs_1 = require("@aws-cdk/aws-lambda-nodejs");
const cdk = __importStar(require("@aws-cdk/core"));
const path = __importStar(require("path"));
const constants_1 = require("../../constants");
class UserPoolConstruct extends cdk.Construct {
    constructor(scope, id) {
        var _a;
        super(scope, id);
        const postAccountConfirmationTrigger = new aws_lambda_nodejs_1.NodejsFunction(this, 'post-confirmation', {
            runtime: lambda.Runtime.NODEJS_14_X,
            memorySize: 1024,
            timeout: cdk.Duration.seconds(6),
            handler: 'main',
            entry: path.join(__dirname, '/../../../src/cognito-triggers/post-confirmation/index.ts'),
            bundling: { externalModules: ['aws-sdk'] },
        });
        const customMessagesTrigger = new aws_lambda_nodejs_1.NodejsFunction(this, 'custom-messages', {
            runtime: lambda.Runtime.NODEJS_14_X,
            memorySize: 1024,
            timeout: cdk.Duration.seconds(6),
            handler: 'main',
            entry: path.join(__dirname, '/../../../src/cognito-triggers/custom-messages/index.ts'),
            environment: {
                FRONTEND_BASE_URL: constants_1.FRONTEND_BASE_URL,
            },
            bundling: { externalModules: ['aws-sdk'] },
        });
        this.userPool = new cognito.UserPool(this, 'userpool', {
            userPoolName: `${constants_1.STACK_PREFIX}-${constants_1.DEPLOY_ENVIRONMENT}`,
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
                bio: new cognito.StringAttribute({ mutable: true }),
                country: new cognito.StringAttribute({ mutable: true }),
                city: new cognito.StringAttribute({ mutable: true }),
                referral_code: new cognito.StringAttribute({ mutable: true }),
                isAdmin: new cognito.StringAttribute({ mutable: true }),
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
        (_a = postAccountConfirmationTrigger.role) === null || _a === void 0 ? void 0 : _a.attachInlinePolicy(new iam.Policy(this, 'post-confirm-trigger-policy', {
            statements: [adminAddUserToGroupPolicyStatement],
        }));
    }
}
exports.UserPoolConstruct = UserPoolConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXItcG9vbC1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQUFnRDtBQUNoRCxzREFBd0M7QUFDeEMsNERBQThDO0FBQzlDLGtFQUEwRDtBQUMxRCxtREFBcUM7QUFDckMsMkNBQTZCO0FBQzdCLCtDQUl5QjtBQUV6QixNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBR2xELFlBQVksS0FBb0IsRUFBRSxFQUFVOztRQUMxQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sOEJBQThCLEdBQUcsSUFBSSxrQ0FBYyxDQUN2RCxJQUFJLEVBQ0osbUJBQW1CLEVBQ25CO1lBQ0UsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxNQUFNO1lBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQ2QsU0FBUyxFQUNULDJEQUEyRCxDQUM1RDtZQUNELFFBQVEsRUFBRSxFQUFDLGVBQWUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFDO1NBQ3pDLENBQ0YsQ0FBQztRQUVGLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN4RSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsT0FBTyxFQUFFLE1BQU07WUFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FDZCxTQUFTLEVBQ1QseURBQXlELENBQzFEO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLGlCQUFpQixFQUFqQiw2QkFBaUI7YUFDbEI7WUFDRCxRQUFRLEVBQUUsRUFBQyxlQUFlLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBQztTQUN6QyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3JELFlBQVksRUFBRSxHQUFHLHdCQUFZLElBQUksOEJBQWtCLEVBQUU7WUFDckQsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixhQUFhLEVBQUU7Z0JBQ2IsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNELFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2xCLFNBQVMsRUFBRTtvQkFDVCxRQUFRLEVBQUUsS0FBSztvQkFDZixPQUFPLEVBQUUsSUFBSTtpQkFDZDtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsT0FBTyxFQUFFLElBQUk7aUJBQ2Q7YUFDRjtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixHQUFHLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO2dCQUNqRCxPQUFPLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO2dCQUNyRCxJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO2dCQUNsRCxhQUFhLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO2dCQUMzRCxPQUFPLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO2FBQ3REO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixjQUFjLEVBQUUsSUFBSTthQUNyQjtZQUNELGVBQWUsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVU7WUFDbkQsY0FBYyxFQUFFO2dCQUNkLGdCQUFnQixFQUFFLDhCQUE4QjtnQkFDaEQsYUFBYSxFQUFFLHFCQUFxQjthQUNyQztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sa0NBQWtDLEdBQUcsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ2pFLE9BQU8sRUFBRSxDQUFDLGlDQUFpQyxDQUFDO1lBQzVDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztRQUVILE1BQUEsOEJBQThCLENBQUMsSUFBSSwwQ0FBRSxrQkFBa0IsQ0FDckQsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSw2QkFBNkIsRUFBRTtZQUNsRCxVQUFVLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FBQztTQUNqRCxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXhGRCw4Q0F3RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2duaXRvJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7Tm9kZWpzRnVuY3Rpb259IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEtbm9kZWpzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge1xuICBERVBMT1lfRU5WSVJPTk1FTlQsXG4gIEZST05URU5EX0JBU0VfVVJMLFxuICBTVEFDS19QUkVGSVgsXG59IGZyb20gJy4uLy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjbGFzcyBVc2VyUG9vbENvbnN0cnVjdCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgdXNlclBvb2w6IGNvZ25pdG8uVXNlclBvb2w7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgcG9zdEFjY291bnRDb25maXJtYXRpb25UcmlnZ2VyID0gbmV3IE5vZGVqc0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgICdwb3N0LWNvbmZpcm1hdGlvbicsXG4gICAgICB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2KSxcbiAgICAgICAgaGFuZGxlcjogJ21haW4nLFxuICAgICAgICBlbnRyeTogcGF0aC5qb2luKFxuICAgICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgICAnLy4uLy4uLy4uL3NyYy9jb2duaXRvLXRyaWdnZXJzL3Bvc3QtY29uZmlybWF0aW9uL2luZGV4LnRzJyxcbiAgICAgICAgKSxcbiAgICAgICAgYnVuZGxpbmc6IHtleHRlcm5hbE1vZHVsZXM6IFsnYXdzLXNkayddfSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGNvbnN0IGN1c3RvbU1lc3NhZ2VzVHJpZ2dlciA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnY3VzdG9tLW1lc3NhZ2VzJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNiksXG4gICAgICBoYW5kbGVyOiAnbWFpbicsXG4gICAgICBlbnRyeTogcGF0aC5qb2luKFxuICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICcvLi4vLi4vLi4vc3JjL2NvZ25pdG8tdHJpZ2dlcnMvY3VzdG9tLW1lc3NhZ2VzL2luZGV4LnRzJyxcbiAgICAgICksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBGUk9OVEVORF9CQVNFX1VSTCxcbiAgICAgIH0sXG4gICAgICBidW5kbGluZzoge2V4dGVybmFsTW9kdWxlczogWydhd3Mtc2RrJ119LFxuICAgIH0pO1xuXG4gICAgdGhpcy51c2VyUG9vbCA9IG5ldyBjb2duaXRvLlVzZXJQb29sKHRoaXMsICd1c2VycG9vbCcsIHtcbiAgICAgIHVzZXJQb29sTmFtZTogYCR7U1RBQ0tfUFJFRklYfS0ke0RFUExPWV9FTlZJUk9OTUVOVH1gLFxuICAgICAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXG4gICAgICBzaWduSW5BbGlhc2VzOiB7XG4gICAgICAgIGVtYWlsOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGF1dG9WZXJpZnk6IHtcbiAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICB9LFxuICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XG4gICAgICAgIGdpdmVuTmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBmYW1pbHlOYW1lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIG11dGFibGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY3VzdG9tQXR0cmlidXRlczoge1xuICAgICAgICBiaW86IG5ldyBjb2duaXRvLlN0cmluZ0F0dHJpYnV0ZSh7bXV0YWJsZTogdHJ1ZX0pLFxuICAgICAgICBjb3VudHJ5OiBuZXcgY29nbml0by5TdHJpbmdBdHRyaWJ1dGUoe211dGFibGU6IHRydWV9KSxcbiAgICAgICAgY2l0eTogbmV3IGNvZ25pdG8uU3RyaW5nQXR0cmlidXRlKHttdXRhYmxlOiB0cnVlfSksXG4gICAgICAgIHJlZmVycmFsX2NvZGU6IG5ldyBjb2duaXRvLlN0cmluZ0F0dHJpYnV0ZSh7bXV0YWJsZTogdHJ1ZX0pLFxuICAgICAgICBpc0FkbWluOiBuZXcgY29nbml0by5TdHJpbmdBdHRyaWJ1dGUoe211dGFibGU6IHRydWV9KSxcbiAgICAgIH0sXG4gICAgICBwYXNzd29yZFBvbGljeToge1xuICAgICAgICBtaW5MZW5ndGg6IDgsXG4gICAgICAgIHJlcXVpcmVMb3dlcmNhc2U6IHRydWUsXG4gICAgICAgIHJlcXVpcmVEaWdpdHM6IHRydWUsXG4gICAgICAgIHJlcXVpcmVVcHBlcmNhc2U6IHRydWUsXG4gICAgICAgIHJlcXVpcmVTeW1ib2xzOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGFjY291bnRSZWNvdmVyeTogY29nbml0by5BY2NvdW50UmVjb3ZlcnkuRU1BSUxfT05MWSxcbiAgICAgIGxhbWJkYVRyaWdnZXJzOiB7XG4gICAgICAgIHBvc3RDb25maXJtYXRpb246IHBvc3RBY2NvdW50Q29uZmlybWF0aW9uVHJpZ2dlcixcbiAgICAgICAgY3VzdG9tTWVzc2FnZTogY3VzdG9tTWVzc2FnZXNUcmlnZ2VyLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFkbWluQWRkVXNlclRvR3JvdXBQb2xpY3lTdGF0ZW1lbnQgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2NvZ25pdG8taWRwOkFkbWluQWRkVXNlclRvR3JvdXAnXSxcbiAgICAgIHJlc291cmNlczogW3RoaXMudXNlclBvb2wudXNlclBvb2xBcm5dLFxuICAgIH0pO1xuXG4gICAgcG9zdEFjY291bnRDb25maXJtYXRpb25UcmlnZ2VyLnJvbGU/LmF0dGFjaElubGluZVBvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5KHRoaXMsICdwb3N0LWNvbmZpcm0tdHJpZ2dlci1wb2xpY3knLCB7XG4gICAgICAgIHN0YXRlbWVudHM6IFthZG1pbkFkZFVzZXJUb0dyb3VwUG9saWN5U3RhdGVtZW50XSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==