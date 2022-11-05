"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCognitoIdentityId = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
function getCognitoIdentityId(jwtToken) {
    const params = getCognitoIdentityIdParams(jwtToken);
    const cognitoIdentity = new aws_sdk_1.default.CognitoIdentity();
    return cognitoIdentity
        .getId(params)
        .promise()
        .then(data => {
        if (data.IdentityId) {
            return data.IdentityId;
        }
        throw new Error('Invalid authorization token.');
    });
}
exports.getCognitoIdentityId = getCognitoIdentityId;
function getCognitoIdentityIdParams(jwtToken) {
    const { USER_POOL_ID, ACCOUNT_ID, IDENTITY_POOL_ID, REGION } = process.env;
    const loginsKey = `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
    return {
        IdentityPoolId: IDENTITY_POOL_ID,
        AccountId: ACCOUNT_ID,
        Logins: {
            [loginsKey]: jwtToken,
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWNvZ25pdG8taWRlbnRpdHktaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXQtY29nbml0by1pZGVudGl0eS1pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBMEI7QUFFMUIsU0FBZ0Isb0JBQW9CLENBQ2xDLFFBQWdCO0lBRWhCLE1BQU0sTUFBTSxHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sZUFBZSxHQUFHLElBQUksaUJBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUVsRCxPQUFPLGVBQWU7U0FDbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUNiLE9BQU8sRUFBRTtTQUNULElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNYLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDeEI7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBZkQsb0RBZUM7QUFFRCxTQUFTLDBCQUEwQixDQUFDLFFBQWdCO0lBQ2xELE1BQU0sRUFBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDekUsTUFBTSxTQUFTLEdBQUcsZUFBZSxNQUFNLGtCQUFrQixZQUFZLEVBQUUsQ0FBQztJQUV4RSxPQUFPO1FBQ0wsY0FBYyxFQUFFLGdCQUFnQjtRQUNoQyxTQUFTLEVBQUUsVUFBVTtRQUNyQixNQUFNLEVBQUU7WUFDTixDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVE7U0FDdEI7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBV1MgZnJvbSAnYXdzLXNkayc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2duaXRvSWRlbnRpdHlJZChcbiAgand0VG9rZW46IHN0cmluZyxcbik6IFByb21pc2U8c3RyaW5nPiB8IG5ldmVyIHtcbiAgY29uc3QgcGFyYW1zID0gZ2V0Q29nbml0b0lkZW50aXR5SWRQYXJhbXMoand0VG9rZW4pO1xuICBjb25zdCBjb2duaXRvSWRlbnRpdHkgPSBuZXcgQVdTLkNvZ25pdG9JZGVudGl0eSgpO1xuXG4gIHJldHVybiBjb2duaXRvSWRlbnRpdHlcbiAgICAuZ2V0SWQocGFyYW1zKVxuICAgIC5wcm9taXNlKClcbiAgICAudGhlbihkYXRhID0+IHtcbiAgICAgIGlmIChkYXRhLklkZW50aXR5SWQpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuSWRlbnRpdHlJZDtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhdXRob3JpemF0aW9uIHRva2VuLicpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDb2duaXRvSWRlbnRpdHlJZFBhcmFtcyhqd3RUb2tlbjogc3RyaW5nKSB7XG4gIGNvbnN0IHtVU0VSX1BPT0xfSUQsIEFDQ09VTlRfSUQsIElERU5USVRZX1BPT0xfSUQsIFJFR0lPTn0gPSBwcm9jZXNzLmVudjtcbiAgY29uc3QgbG9naW5zS2V5ID0gYGNvZ25pdG8taWRwLiR7UkVHSU9OfS5hbWF6b25hd3MuY29tLyR7VVNFUl9QT09MX0lEfWA7XG5cbiAgcmV0dXJuIHtcbiAgICBJZGVudGl0eVBvb2xJZDogSURFTlRJVFlfUE9PTF9JRCxcbiAgICBBY2NvdW50SWQ6IEFDQ09VTlRfSUQsXG4gICAgTG9naW5zOiB7XG4gICAgICBbbG9naW5zS2V5XTogand0VG9rZW4sXG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==