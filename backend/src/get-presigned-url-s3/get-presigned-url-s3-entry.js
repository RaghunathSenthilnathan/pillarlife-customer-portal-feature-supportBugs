"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const create_presigned_post_1 = require("./create-presigned-post");
const get_cognito_identity_id_1 = require("./get-cognito-identity-id");
if (!process.env.BUCKET_NAME ||
    !process.env.USER_POOL_ID ||
    !process.env.IDENTITY_POOL_ID ||
    !process.env.ACCOUNT_ID ||
    !process.env.REGION)
    throw new Error('Environment variables BUCKET_NAME, USER_POOL_ID, IDENTITY_POOL_ID, ACCOUNT_ID, REGION are required.');
async function main(event) {
    var _a;
    console.log('Event is', JSON.stringify(event, null, 2));
    try {
        if (!((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.fileType))
            throw new Error('Querystring parameter fileType must be provided when creating a presigned URL, i.e. ?fileType=image/png');
        const { fileType } = event.queryStringParameters;
        const identityId = await (0, get_cognito_identity_id_1.getCognitoIdentityId)(event.headers.authorization);
        const filePath = (0, create_presigned_post_1.getFilePath)(identityId);
        const presignedPost = await (0, create_presigned_post_1.createPresignedPost)({
            fileType,
            filePath,
            identityId,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ ...presignedPost, filePath }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                statusCode: 400,
                body: JSON.stringify([{ message: error.message }]),
            };
        }
        return {
            statusCode: 400,
            body: JSON.stringify([{ message: 'Something went wrong.' }]),
        };
    }
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXByZXNpZ25lZC11cmwtczMtZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXQtcHJlc2lnbmVkLXVybC1zMy1lbnRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtRUFBeUU7QUFDekUsdUVBQStEO0FBRS9ELElBQ0UsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7SUFDeEIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7SUFDekIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQjtJQUM3QixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVTtJQUN2QixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTTtJQUVuQixNQUFNLElBQUksS0FBSyxDQUNiLHFHQUFxRyxDQUN0RyxDQUFDO0FBT0csS0FBSyxVQUFVLElBQUksQ0FBQyxLQUFZOztJQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxJQUFJO1FBQ0YsSUFBSSxDQUFDLENBQUEsTUFBQSxLQUFLLENBQUMscUJBQXFCLDBDQUFFLFFBQVEsQ0FBQTtZQUN4QyxNQUFNLElBQUksS0FBSyxDQUNiLHlHQUF5RyxDQUMxRyxDQUFDO1FBRUosTUFBTSxFQUFDLFFBQVEsRUFBQyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztRQUUvQyxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUEsOENBQW9CLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzRSxNQUFNLFFBQVEsR0FBRyxJQUFBLG1DQUFXLEVBQUMsVUFBVSxDQUFDLENBQUM7UUFFekMsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDJDQUFtQixFQUFDO1lBQzlDLFFBQVE7WUFDUixRQUFRO1lBQ1IsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILE9BQU87WUFDTCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsR0FBRyxhQUFhLEVBQUUsUUFBUSxFQUFDLENBQUM7U0FDbkQsQ0FBQztLQUNIO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7WUFDMUIsT0FBTztnQkFDTCxVQUFVLEVBQUUsR0FBRztnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO2FBQ2pELENBQUM7U0FDSDtRQUNELE9BQU87WUFDTCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQyxDQUFDO1NBQzNELENBQUM7S0FDSDtBQUNILENBQUM7QUFuQ0Qsb0JBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBUElHYXRld2F5UHJveHlFdmVudFYyLCBBUElHYXRld2F5UHJveHlSZXN1bHRWMn0gZnJvbSAnYXdzLWxhbWJkYSc7XG5pbXBvcnQge2NyZWF0ZVByZXNpZ25lZFBvc3QsIGdldEZpbGVQYXRofSBmcm9tICcuL2NyZWF0ZS1wcmVzaWduZWQtcG9zdCc7XG5pbXBvcnQge2dldENvZ25pdG9JZGVudGl0eUlkfSBmcm9tICcuL2dldC1jb2duaXRvLWlkZW50aXR5LWlkJztcblxuaWYgKFxuICAhcHJvY2Vzcy5lbnYuQlVDS0VUX05BTUUgfHxcbiAgIXByb2Nlc3MuZW52LlVTRVJfUE9PTF9JRCB8fFxuICAhcHJvY2Vzcy5lbnYuSURFTlRJVFlfUE9PTF9JRCB8fFxuICAhcHJvY2Vzcy5lbnYuQUNDT1VOVF9JRCB8fFxuICAhcHJvY2Vzcy5lbnYuUkVHSU9OXG4pXG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAnRW52aXJvbm1lbnQgdmFyaWFibGVzIEJVQ0tFVF9OQU1FLCBVU0VSX1BPT0xfSUQsIElERU5USVRZX1BPT0xfSUQsIEFDQ09VTlRfSUQsIFJFR0lPTiBhcmUgcmVxdWlyZWQuJyxcbiAgKTtcblxudHlwZSBFdmVudCA9IEFQSUdhdGV3YXlQcm94eUV2ZW50VjIgJiB7XG4gIGhlYWRlcnM6IHthdXRob3JpemF0aW9uOiBzdHJpbmd9O1xuICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtmaWxlVHlwZTogc3RyaW5nfTtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKGV2ZW50OiBFdmVudCk6IFByb21pc2U8QVBJR2F0ZXdheVByb3h5UmVzdWx0VjI+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50IGlzJywgSlNPTi5zdHJpbmdpZnkoZXZlbnQsIG51bGwsIDIpKTtcbiAgdHJ5IHtcbiAgICBpZiAoIWV2ZW50LnF1ZXJ5U3RyaW5nUGFyYW1ldGVycz8uZmlsZVR5cGUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdRdWVyeXN0cmluZyBwYXJhbWV0ZXIgZmlsZVR5cGUgbXVzdCBiZSBwcm92aWRlZCB3aGVuIGNyZWF0aW5nIGEgcHJlc2lnbmVkIFVSTCwgaS5lLiA/ZmlsZVR5cGU9aW1hZ2UvcG5nJyxcbiAgICAgICk7XG5cbiAgICBjb25zdCB7ZmlsZVR5cGV9ID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzO1xuXG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IGF3YWl0IGdldENvZ25pdG9JZGVudGl0eUlkKGV2ZW50LmhlYWRlcnMuYXV0aG9yaXphdGlvbik7XG4gICAgY29uc3QgZmlsZVBhdGggPSBnZXRGaWxlUGF0aChpZGVudGl0eUlkKTtcblxuICAgIGNvbnN0IHByZXNpZ25lZFBvc3QgPSBhd2FpdCBjcmVhdGVQcmVzaWduZWRQb3N0KHtcbiAgICAgIGZpbGVUeXBlLFxuICAgICAgZmlsZVBhdGgsXG4gICAgICBpZGVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsuLi5wcmVzaWduZWRQb3N0LCBmaWxlUGF0aH0pLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoW3ttZXNzYWdlOiBlcnJvci5tZXNzYWdlfV0pLFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KFt7bWVzc2FnZTogJ1NvbWV0aGluZyB3ZW50IHdyb25nLid9XSksXG4gICAgfTtcbiAgfVxufVxuIl19