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
exports.UserPoolClientConstruct = void 0;
const cognito = __importStar(require("@aws-cdk/aws-cognito"));
const cdk = __importStar(require("@aws-cdk/core"));
class UserPoolClientConstruct extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const clientReadAttributes = new cognito.ClientAttributes()
            .withStandardAttributes({
            givenName: true,
            familyName: true,
            email: true,
            emailVerified: true,
            address: true,
            birthdate: true,
            gender: true,
            locale: true,
            middleName: true,
            fullname: true,
            nickname: true,
            phoneNumber: true,
            phoneNumberVerified: true,
            profilePicture: true,
            preferredUsername: true,
            profilePage: true,
            timezone: true,
            lastUpdateTime: true,
            website: true,
        })
            .withCustomAttributes(...['bio', 'country', 'city', 'isAdmin', 'referral_code']);
        const clientWriteAttributes = new cognito.ClientAttributes()
            .withStandardAttributes({
            givenName: true,
            familyName: true,
            email: true,
            emailVerified: false,
            address: true,
            birthdate: true,
            gender: true,
            locale: true,
            middleName: true,
            fullname: true,
            nickname: true,
            phoneNumber: true,
            profilePicture: true,
            preferredUsername: true,
            profilePage: true,
            timezone: true,
            lastUpdateTime: true,
            website: true,
        })
            .withCustomAttributes(...['bio', 'country', 'city', 'referral_code']);
        this.userPoolClient = new cognito.UserPoolClient(this, 'userpool-client', {
            userPool: props.userPool,
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userSrp: true,
            },
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.COGNITO,
            ],
            preventUserExistenceErrors: true,
            readAttributes: clientReadAttributes,
            writeAttributes: clientWriteAttributes,
        });
    }
}
exports.UserPoolClientConstruct = UserPoolClientConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWNsaWVudC1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VyLXBvb2wtY2xpZW50LWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQWdEO0FBQ2hELG1EQUFxQztBQU1yQyxNQUFhLHVCQUF3QixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBR3hELFlBQ0UsS0FBb0IsRUFDcEIsRUFBVSxFQUNWLEtBQW1DO1FBRW5DLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTthQUN4RCxzQkFBc0IsQ0FBQztZQUN0QixTQUFTLEVBQUUsSUFBSTtZQUNmLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLEtBQUssRUFBRSxJQUFJO1lBQ1gsYUFBYSxFQUFFLElBQUk7WUFDbkIsT0FBTyxFQUFFLElBQUk7WUFDYixTQUFTLEVBQUUsSUFBSTtZQUNmLE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFLElBQUk7WUFDWixVQUFVLEVBQUUsSUFBSTtZQUNoQixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxJQUFJO1lBQ2QsV0FBVyxFQUFFLElBQUk7WUFDakIsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixjQUFjLEVBQUUsSUFBSTtZQUNwQixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsY0FBYyxFQUFFLElBQUk7WUFDcEIsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDO2FBQ0Qsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBRWxGLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7YUFDekQsc0JBQXNCLENBQUM7WUFDdEIsU0FBUyxFQUFFLElBQUk7WUFDZixVQUFVLEVBQUUsSUFBSTtZQUNoQixLQUFLLEVBQUUsSUFBSTtZQUNYLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsU0FBUyxFQUFFLElBQUk7WUFDZixNQUFNLEVBQUUsSUFBSTtZQUNaLE1BQU0sRUFBRSxJQUFJO1lBQ1osVUFBVSxFQUFFLElBQUk7WUFDaEIsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsSUFBSTtZQUNkLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsV0FBVyxFQUFFLElBQUk7WUFDakIsUUFBUSxFQUFFLElBQUk7WUFDZCxjQUFjLEVBQUUsSUFBSTtZQUNwQixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7YUFDRCxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUV2RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDeEUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFNBQVMsRUFBRTtnQkFDVCxpQkFBaUIsRUFBRSxJQUFJO2dCQUN2QixNQUFNLEVBQUUsSUFBSTtnQkFDWixPQUFPLEVBQUUsSUFBSTthQUNkO1lBQ0QsMEJBQTBCLEVBQUU7Z0JBQzFCLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPO2FBQy9DO1lBQ0QsMEJBQTBCLEVBQUUsSUFBSTtZQUNoQyxjQUFjLEVBQUUsb0JBQW9CO1lBQ3BDLGVBQWUsRUFBRSxxQkFBcUI7U0FDdkMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBeEVELDBEQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZ25pdG8nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG50eXBlIFVzZXJQb29sQ2xpZW50Q29uc3RydWN0UHJvcHMgPSB7XG4gIHVzZXJQb29sOiBjb2duaXRvLlVzZXJQb29sO1xufTtcblxuZXhwb3J0IGNsYXNzIFVzZXJQb29sQ2xpZW50Q29uc3RydWN0IGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSB1c2VyUG9vbENsaWVudDogY29nbml0by5Vc2VyUG9vbENsaWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBzY29wZTogY2RrLkNvbnN0cnVjdCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHByb3BzOiBVc2VyUG9vbENsaWVudENvbnN0cnVjdFByb3BzLFxuICApIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgY2xpZW50UmVhZEF0dHJpYnV0ZXMgPSBuZXcgY29nbml0by5DbGllbnRBdHRyaWJ1dGVzKClcbiAgICAgIC53aXRoU3RhbmRhcmRBdHRyaWJ1dGVzKHtcbiAgICAgICAgZ2l2ZW5OYW1lOiB0cnVlLFxuICAgICAgICBmYW1pbHlOYW1lOiB0cnVlLFxuICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgZW1haWxWZXJpZmllZDogdHJ1ZSxcbiAgICAgICAgYWRkcmVzczogdHJ1ZSxcbiAgICAgICAgYmlydGhkYXRlOiB0cnVlLFxuICAgICAgICBnZW5kZXI6IHRydWUsXG4gICAgICAgIGxvY2FsZTogdHJ1ZSxcbiAgICAgICAgbWlkZGxlTmFtZTogdHJ1ZSxcbiAgICAgICAgZnVsbG5hbWU6IHRydWUsXG4gICAgICAgIG5pY2tuYW1lOiB0cnVlLFxuICAgICAgICBwaG9uZU51bWJlcjogdHJ1ZSxcbiAgICAgICAgcGhvbmVOdW1iZXJWZXJpZmllZDogdHJ1ZSxcbiAgICAgICAgcHJvZmlsZVBpY3R1cmU6IHRydWUsXG4gICAgICAgIHByZWZlcnJlZFVzZXJuYW1lOiB0cnVlLFxuICAgICAgICBwcm9maWxlUGFnZTogdHJ1ZSxcbiAgICAgICAgdGltZXpvbmU6IHRydWUsXG4gICAgICAgIGxhc3RVcGRhdGVUaW1lOiB0cnVlLFxuICAgICAgICB3ZWJzaXRlOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIC53aXRoQ3VzdG9tQXR0cmlidXRlcyguLi5bJ2JpbycsICdjb3VudHJ5JywgJ2NpdHknLCAnaXNBZG1pbicsJ3JlZmVycmFsX2NvZGUnXSk7XG5cbiAgICBjb25zdCBjbGllbnRXcml0ZUF0dHJpYnV0ZXMgPSBuZXcgY29nbml0by5DbGllbnRBdHRyaWJ1dGVzKClcbiAgICAgIC53aXRoU3RhbmRhcmRBdHRyaWJ1dGVzKHtcbiAgICAgICAgZ2l2ZW5OYW1lOiB0cnVlLFxuICAgICAgICBmYW1pbHlOYW1lOiB0cnVlLFxuICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgZW1haWxWZXJpZmllZDogZmFsc2UsXG4gICAgICAgIGFkZHJlc3M6IHRydWUsXG4gICAgICAgIGJpcnRoZGF0ZTogdHJ1ZSxcbiAgICAgICAgZ2VuZGVyOiB0cnVlLFxuICAgICAgICBsb2NhbGU6IHRydWUsXG4gICAgICAgIG1pZGRsZU5hbWU6IHRydWUsXG4gICAgICAgIGZ1bGxuYW1lOiB0cnVlLFxuICAgICAgICBuaWNrbmFtZTogdHJ1ZSxcbiAgICAgICAgcGhvbmVOdW1iZXI6IHRydWUsXG4gICAgICAgIHByb2ZpbGVQaWN0dXJlOiB0cnVlLFxuICAgICAgICBwcmVmZXJyZWRVc2VybmFtZTogdHJ1ZSxcbiAgICAgICAgcHJvZmlsZVBhZ2U6IHRydWUsXG4gICAgICAgIHRpbWV6b25lOiB0cnVlLFxuICAgICAgICBsYXN0VXBkYXRlVGltZTogdHJ1ZSxcbiAgICAgICAgd2Vic2l0ZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgICAud2l0aEN1c3RvbUF0dHJpYnV0ZXMoLi4uWydiaW8nLCAnY291bnRyeScsICdjaXR5JywncmVmZXJyYWxfY29kZSddKTtcblxuICAgIHRoaXMudXNlclBvb2xDbGllbnQgPSBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCAndXNlcnBvb2wtY2xpZW50Jywge1xuICAgICAgdXNlclBvb2w6IHByb3BzLnVzZXJQb29sLFxuICAgICAgYXV0aEZsb3dzOiB7XG4gICAgICAgIGFkbWluVXNlclBhc3N3b3JkOiB0cnVlLFxuICAgICAgICBjdXN0b206IHRydWUsXG4gICAgICAgIHVzZXJTcnA6IHRydWUsXG4gICAgICB9LFxuICAgICAgc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnM6IFtcbiAgICAgICAgY29nbml0by5Vc2VyUG9vbENsaWVudElkZW50aXR5UHJvdmlkZXIuQ09HTklUTyxcbiAgICAgIF0sXG4gICAgICBwcmV2ZW50VXNlckV4aXN0ZW5jZUVycm9yczogdHJ1ZSxcbiAgICAgIHJlYWRBdHRyaWJ1dGVzOiBjbGllbnRSZWFkQXR0cmlidXRlcyxcbiAgICAgIHdyaXRlQXR0cmlidXRlczogY2xpZW50V3JpdGVBdHRyaWJ1dGVzLFxuICAgIH0pO1xuICB9XG59XG4iXX0=