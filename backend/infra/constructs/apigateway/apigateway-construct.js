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
exports.HttpApiConstruct = void 0;
const apiGateway = __importStar(require("@aws-cdk/aws-apigatewayv2"));
const apiGatewayAuthorizers = __importStar(require("@aws-cdk/aws-apigatewayv2-authorizers"));
const cdk = __importStar(require("@aws-cdk/core"));
const constants_1 = require("../../constants");
class HttpApiConstruct extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.httpApi = new apiGateway.HttpApi(this, 'api', {
            description: `___${constants_1.DEPLOY_ENVIRONMENT}___ Api for ${constants_1.STACK_PREFIX}`,
            apiName: `${constants_1.STACK_PREFIX}-api-${constants_1.DEPLOY_ENVIRONMENT}`,
            corsPreflight: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: [
                    apiGateway.CorsHttpMethod.OPTIONS,
                    apiGateway.CorsHttpMethod.GET,
                    apiGateway.CorsHttpMethod.POST,
                    apiGateway.CorsHttpMethod.PUT,
                    apiGateway.CorsHttpMethod.PATCH,
                    apiGateway.CorsHttpMethod.DELETE,
                ],
                allowCredentials: true,
                allowOrigins: [constants_1.FRONTEND_BASE_URL],
            },
        });
        const { userPool, userPoolClient } = props;
        this.httpApiCognitoAuthorizer = new apiGatewayAuthorizers.HttpUserPoolAuthorizer({
            userPool,
            userPoolClient,
            identitySource: ['$request.header.Authorization'],
        });
    }
}
exports.HttpApiConstruct = HttpApiConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpZ2F0ZXdheS1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGlnYXRld2F5LWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXdEO0FBQ3hELDZGQUErRTtBQUUvRSxtREFBcUM7QUFDckMsK0NBSXlCO0FBT3pCLE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFLakQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUN4RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDakQsV0FBVyxFQUFFLE1BQU0sOEJBQWtCLGVBQWUsd0JBQVksRUFBRTtZQUNsRSxPQUFPLEVBQUUsR0FBRyx3QkFBWSxRQUFRLDhCQUFrQixFQUFFO1lBQ3BELGFBQWEsRUFBRTtnQkFDYixZQUFZLEVBQUU7b0JBQ1osY0FBYztvQkFDZCxZQUFZO29CQUNaLGVBQWU7b0JBQ2YsV0FBVztpQkFDWjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osVUFBVSxDQUFDLGNBQWMsQ0FBQyxPQUFPO29CQUNqQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUc7b0JBQzdCLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSTtvQkFDOUIsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHO29CQUM3QixVQUFVLENBQUMsY0FBYyxDQUFDLEtBQUs7b0JBQy9CLFVBQVUsQ0FBQyxjQUFjLENBQUMsTUFBTTtpQkFDakM7Z0JBQ0QsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsWUFBWSxFQUFFLENBQUMsNkJBQWlCLENBQUM7YUFDbEM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxHQUFHLEtBQUssQ0FBQztRQUV6QyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FDOUU7WUFDRSxRQUFRO1lBQ1IsY0FBYztZQUNkLGNBQWMsRUFBRSxDQUFDLCtCQUErQixDQUFDO1NBQ2xELENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXpDRCw0Q0F5Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcGlHYXRld2F5IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djInO1xuaW1wb3J0ICogYXMgYXBpR2F0ZXdheUF1dGhvcml6ZXJzIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djItYXV0aG9yaXplcnMnO1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0byc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQge1xuICBERVBMT1lfRU5WSVJPTk1FTlQsXG4gIEZST05URU5EX0JBU0VfVVJMLFxuICBTVEFDS19QUkVGSVgsXG59IGZyb20gJy4uLy4uL2NvbnN0YW50cyc7XG5cbnR5cGUgSHR0cEFwaUNvbnN0cnVjdFByb3BzID0ge1xuICB1c2VyUG9vbDogY29nbml0by5Vc2VyUG9vbDtcbiAgdXNlclBvb2xDbGllbnQ6IGNvZ25pdG8uVXNlclBvb2xDbGllbnQ7XG59O1xuXG5leHBvcnQgY2xhc3MgSHR0cEFwaUNvbnN0cnVjdCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgaHR0cEFwaTogYXBpR2F0ZXdheS5IdHRwQXBpO1xuXG4gIHB1YmxpYyByZWFkb25seSBodHRwQXBpQ29nbml0b0F1dGhvcml6ZXI6IGFwaUdhdGV3YXlBdXRob3JpemVycy5IdHRwVXNlclBvb2xBdXRob3JpemVyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSHR0cEFwaUNvbnN0cnVjdFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuaHR0cEFwaSA9IG5ldyBhcGlHYXRld2F5Lkh0dHBBcGkodGhpcywgJ2FwaScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBgX19fJHtERVBMT1lfRU5WSVJPTk1FTlR9X19fIEFwaSBmb3IgJHtTVEFDS19QUkVGSVh9YCxcbiAgICAgIGFwaU5hbWU6IGAke1NUQUNLX1BSRUZJWH0tYXBpLSR7REVQTE9ZX0VOVklST05NRU5UfWAsXG4gICAgICBjb3JzUHJlZmxpZ2h0OiB7XG4gICAgICAgIGFsbG93SGVhZGVyczogW1xuICAgICAgICAgICdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICdYLUFtei1EYXRlJyxcbiAgICAgICAgICAnQXV0aG9yaXphdGlvbicsXG4gICAgICAgICAgJ1gtQXBpLUtleScsXG4gICAgICAgIF0sXG4gICAgICAgIGFsbG93TWV0aG9kczogW1xuICAgICAgICAgIGFwaUdhdGV3YXkuQ29yc0h0dHBNZXRob2QuT1BUSU9OUyxcbiAgICAgICAgICBhcGlHYXRld2F5LkNvcnNIdHRwTWV0aG9kLkdFVCxcbiAgICAgICAgICBhcGlHYXRld2F5LkNvcnNIdHRwTWV0aG9kLlBPU1QsXG4gICAgICAgICAgYXBpR2F0ZXdheS5Db3JzSHR0cE1ldGhvZC5QVVQsXG4gICAgICAgICAgYXBpR2F0ZXdheS5Db3JzSHR0cE1ldGhvZC5QQVRDSCxcbiAgICAgICAgICBhcGlHYXRld2F5LkNvcnNIdHRwTWV0aG9kLkRFTEVURSxcbiAgICAgICAgXSxcbiAgICAgICAgYWxsb3dDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBbRlJPTlRFTkRfQkFTRV9VUkxdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHt1c2VyUG9vbCwgdXNlclBvb2xDbGllbnR9ID0gcHJvcHM7XG5cbiAgICB0aGlzLmh0dHBBcGlDb2duaXRvQXV0aG9yaXplciA9IG5ldyBhcGlHYXRld2F5QXV0aG9yaXplcnMuSHR0cFVzZXJQb29sQXV0aG9yaXplcihcbiAgICAgIHtcbiAgICAgICAgdXNlclBvb2wsXG4gICAgICAgIHVzZXJQb29sQ2xpZW50LFxuICAgICAgICBpZGVudGl0eVNvdXJjZTogWyckcmVxdWVzdC5oZWFkZXIuQXV0aG9yaXphdGlvbiddLFxuICAgICAgfSxcbiAgICApO1xuICB9XG59XG4iXX0=