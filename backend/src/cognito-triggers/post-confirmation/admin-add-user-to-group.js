"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAddUserToGroup = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
function adminAddUserToGroup({ userPoolId, username, groupName, }) {
    const params = {
        GroupName: groupName,
        UserPoolId: userPoolId,
        Username: username,
    };
    const cognitoIdp = new aws_sdk_1.default.CognitoIdentityServiceProvider();
    return cognitoIdp.adminAddUserToGroup(params).promise();
}
exports.adminAddUserToGroup = adminAddUserToGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4tYWRkLXVzZXItdG8tZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZG1pbi1hZGQtdXNlci10by1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBMEI7QUFFMUIsU0FBZ0IsbUJBQW1CLENBQUMsRUFDbEMsVUFBVSxFQUNWLFFBQVEsRUFDUixTQUFTLEdBS1Y7SUFHQyxNQUFNLE1BQU0sR0FBRztRQUNiLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLFFBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7SUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLGlCQUFHLENBQUMsOEJBQThCLEVBQUUsQ0FBQztJQUM1RCxPQUFPLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMxRCxDQUFDO0FBbkJELGtEQW1CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBV1MgZnJvbSAnYXdzLXNkayc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZG1pbkFkZFVzZXJUb0dyb3VwKHtcbiAgdXNlclBvb2xJZCxcbiAgdXNlcm5hbWUsXG4gIGdyb3VwTmFtZSxcbn06IHtcbiAgdXNlclBvb2xJZDogc3RyaW5nO1xuICB1c2VybmFtZTogc3RyaW5nO1xuICBncm91cE5hbWU6IHN0cmluZztcbn0pOiBQcm9taXNlPHtcbiAgJHJlc3BvbnNlOiBBV1MuUmVzcG9uc2U8UmVjb3JkPHN0cmluZywgc3RyaW5nPiwgQVdTLkFXU0Vycm9yPjtcbn0+IHtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIEdyb3VwTmFtZTogZ3JvdXBOYW1lLFxuICAgIFVzZXJQb29sSWQ6IHVzZXJQb29sSWQsXG4gICAgVXNlcm5hbWU6IHVzZXJuYW1lLFxuICB9O1xuXG4gIGNvbnN0IGNvZ25pdG9JZHAgPSBuZXcgQVdTLkNvZ25pdG9JZGVudGl0eVNlcnZpY2VQcm92aWRlcigpO1xuICByZXR1cm4gY29nbml0b0lkcC5hZG1pbkFkZFVzZXJUb0dyb3VwKHBhcmFtcykucHJvbWlzZSgpO1xufVxuIl19