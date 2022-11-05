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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointConstruct = void 0;
const apiGatewayIntegrations = __importStar(require("@aws-cdk/aws-apigatewayv2-integrations"));
const lambda = __importStar(require("@aws-cdk/aws-lambda"));
const aws_lambda_nodejs_1 = require("@aws-cdk/aws-lambda-nodejs");
const cdk = __importStar(require("@aws-cdk/core"));
const path_1 = __importDefault(require("path"));
class EndpointConstruct extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const { httpApi, dynamo, authorizer, routePath, assetPath, methods, environment, layers, externalModules, } = props;
        this.lambda = new aws_lambda_nodejs_1.NodejsFunction(this, id, {
            runtime: lambda.Runtime.NODEJS_14_X,
            memorySize: 1024,
            timeout: cdk.Duration.seconds(5),
            handler: 'main',
            entry: path_1.default.join(__dirname, `/../../../src/${assetPath}`),
            environment: environment && environment,
            layers: layers && layers,
            bundling: {
                minify: false,
                externalModules: externalModules
                    ? ['aws-sdk', ...externalModules]
                    : ['aws-sdk'],
            },
        });
        if (dynamo === null || dynamo === void 0 ? void 0 : dynamo.table) {
            dynamo.table.grant(this.lambda, ...dynamo.permissions);
        }
        this.endpoint = httpApi.addRoutes({
            path: routePath,
            methods,
            integration: new apiGatewayIntegrations.LambdaProxyIntegration({
                handler: this.lambda,
            }),
            authorizer,
        });
    }
}
exports.EndpointConstruct = EndpointConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kcG9pbnQtY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW5kcG9pbnQtY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSwrRkFBaUY7QUFFakYsNERBQThDO0FBQzlDLGtFQUEwRDtBQUMxRCxtREFBcUM7QUFDckMsZ0RBQXdCO0FBaUJ4QixNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBS2xELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQixNQUFNLEVBQ0osT0FBTyxFQUNQLE1BQU0sRUFDTixVQUFVLEVBQ1YsU0FBUyxFQUNULFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLE1BQU0sRUFDTixlQUFlLEdBQ2hCLEdBQUcsS0FBSyxDQUFDO1FBRVYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN6QyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsT0FBTyxFQUFFLE1BQU07WUFDZixLQUFLLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLFNBQVMsRUFBRSxDQUFDO1lBQ3pELFdBQVcsRUFBRSxXQUFXLElBQUksV0FBVztZQUN2QyxNQUFNLEVBQUUsTUFBTSxJQUFJLE1BQU07WUFDeEIsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxLQUFLO2dCQUViLGVBQWUsRUFBRSxlQUFlO29CQUM5QixDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxlQUFlLENBQUM7b0JBQ2pDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzthQUNoQjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLEtBQUssRUFBRTtZQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2hDLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTztZQUNQLFdBQVcsRUFBRSxJQUFJLHNCQUFzQixDQUFDLHNCQUFzQixDQUFDO2dCQUM3RCxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDckIsQ0FBQztZQUNGLFVBQVU7U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFqREQsOENBaURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBpR2F0ZXdheSBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyJztcbmltcG9ydCAqIGFzIGFwaUdhdGV3YXlBdXRob3JpemVycyBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyLWF1dGhvcml6ZXJzJztcbmltcG9ydCAqIGFzIGFwaUdhdGV3YXlJbnRlZ3JhdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnMnO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnQGF3cy1jZGsvYXdzLWR5bmFtb2RiJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7Tm9kZWpzRnVuY3Rpb259IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEtbm9kZWpzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG50eXBlIEVuZHBvaW50Q29uc3RydWN0UHJvcHMgPSB7XG4gIGh0dHBBcGk6IGFwaUdhdGV3YXkuSHR0cEFwaTtcbiAgYXV0aG9yaXplcjogYXBpR2F0ZXdheUF1dGhvcml6ZXJzLkh0dHBVc2VyUG9vbEF1dGhvcml6ZXI7XG4gIHJvdXRlUGF0aDogc3RyaW5nO1xuICBtZXRob2RzOiBhcGlHYXRld2F5Lkh0dHBNZXRob2RbXTtcbiAgYXNzZXRQYXRoOiBzdHJpbmc7XG4gIGVudmlyb25tZW50PzogbGFtYmRhLkZ1bmN0aW9uT3B0aW9uc1snZW52aXJvbm1lbnQnXTtcbiAgbGF5ZXJzPzogbGFtYmRhLkxheWVyVmVyc2lvbltdO1xuICAvLyBzcGVjaWZ5IGxheWVycyBvciBwYWNrYWdlcyB0byBub3QgYmUgaW5jbHVkZWQgaW4gbGFtYmRhIGNvZGUgYXMgZXh0ZXJuYWxzXG4gIGV4dGVybmFsTW9kdWxlcz86IHN0cmluZ1tdO1xuICBkeW5hbW8/OiB7XG4gICAgdGFibGU6IGR5bmFtb2RiLlRhYmxlO1xuICAgIHBlcm1pc3Npb25zOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5leHBvcnQgY2xhc3MgRW5kcG9pbnRDb25zdHJ1Y3QgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGVuZHBvaW50OiBhcGlHYXRld2F5Lkh0dHBSb3V0ZVtdO1xuXG4gIHB1YmxpYyByZWFkb25seSBsYW1iZGE6IE5vZGVqc0Z1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRW5kcG9pbnRDb25zdHJ1Y3RQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgY29uc3Qge1xuICAgICAgaHR0cEFwaSxcbiAgICAgIGR5bmFtbyxcbiAgICAgIGF1dGhvcml6ZXIsXG4gICAgICByb3V0ZVBhdGgsXG4gICAgICBhc3NldFBhdGgsXG4gICAgICBtZXRob2RzLFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICBsYXllcnMsXG4gICAgICBleHRlcm5hbE1vZHVsZXMsXG4gICAgfSA9IHByb3BzO1xuXG4gICAgdGhpcy5sYW1iZGEgPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgaWQsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDUpLFxuICAgICAgaGFuZGxlcjogJ21haW4nLFxuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIGAvLi4vLi4vLi4vc3JjLyR7YXNzZXRQYXRofWApLFxuICAgICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50ICYmIGVudmlyb25tZW50LFxuICAgICAgbGF5ZXJzOiBsYXllcnMgJiYgbGF5ZXJzLFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbWluaWZ5OiBmYWxzZSxcbiAgICAgICAgLy8gbW9kdWxlcyBhbHJlYWR5IGF2YWlsYWJsZSBpbiBhIGxheWVyIHNob3VsZCBub3QgYmUgYnVuZGxlZFxuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IGV4dGVybmFsTW9kdWxlc1xuICAgICAgICAgID8gWydhd3Mtc2RrJywgLi4uZXh0ZXJuYWxNb2R1bGVzXVxuICAgICAgICAgIDogWydhd3Mtc2RrJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKGR5bmFtbz8udGFibGUpIHtcbiAgICAgIGR5bmFtby50YWJsZS5ncmFudCh0aGlzLmxhbWJkYSwgLi4uZHluYW1vLnBlcm1pc3Npb25zKTtcbiAgICB9XG5cbiAgICB0aGlzLmVuZHBvaW50ID0gaHR0cEFwaS5hZGRSb3V0ZXMoe1xuICAgICAgcGF0aDogcm91dGVQYXRoLFxuICAgICAgbWV0aG9kcyxcbiAgICAgIGludGVncmF0aW9uOiBuZXcgYXBpR2F0ZXdheUludGVncmF0aW9ucy5MYW1iZGFQcm94eUludGVncmF0aW9uKHtcbiAgICAgICAgaGFuZGxlcjogdGhpcy5sYW1iZGEsXG4gICAgICB9KSxcbiAgICAgIGF1dGhvcml6ZXIsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==