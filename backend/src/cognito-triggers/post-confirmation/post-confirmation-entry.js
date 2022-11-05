"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const admin_add_user_to_group_1 = require("./admin-add-user-to-group");
async function main(event, _context, callback) {
    const { userPoolId, userName } = event;
    console.log('POST CONFIRMATION EVENT', JSON.stringify(event, null, 2));
    try {
        await (0, admin_add_user_to_group_1.adminAddUserToGroup)({
            userPoolId,
            username: userName,
            groupName: 'Users',
        });
        return callback(null, event);
    }
    catch (error) {
        return callback(error, event);
    }
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdC1jb25maXJtYXRpb24tZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb3N0LWNvbmZpcm1hdGlvbi1lbnRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1RUFBOEQ7QUFFdkQsS0FBSyxVQUFVLElBQUksQ0FDeEIsS0FBbUMsRUFDbkMsUUFBaUIsRUFDakIsUUFBa0I7SUFFbEIsTUFBTSxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsR0FBRyxLQUFLLENBQUM7SUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RSxJQUFJO1FBQ0YsTUFBTSxJQUFBLDZDQUFtQixFQUFDO1lBQ3hCLFVBQVU7WUFDVixRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7UUFFSCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDOUI7SUFBQyxPQUFPLEtBQVMsRUFBRTtRQUNsQixPQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0I7QUFDSCxDQUFDO0FBbkJELG9CQW1CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2FsbGJhY2ssIENvbnRleHQsIFBvc3RDb25maXJtYXRpb25UcmlnZ2VyRXZlbnR9IGZyb20gJ2F3cy1sYW1iZGEnO1xuaW1wb3J0IHthZG1pbkFkZFVzZXJUb0dyb3VwfSBmcm9tICcuL2FkbWluLWFkZC11c2VyLXRvLWdyb3VwJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4oXG4gIGV2ZW50OiBQb3N0Q29uZmlybWF0aW9uVHJpZ2dlckV2ZW50LFxuICBfY29udGV4dDogQ29udGV4dCxcbiAgY2FsbGJhY2s6IENhbGxiYWNrLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHt1c2VyUG9vbElkLCB1c2VyTmFtZX0gPSBldmVudDtcbiAgY29uc29sZS5sb2coJ1BPU1QgQ09ORklSTUFUSU9OIEVWRU5UJywgSlNPTi5zdHJpbmdpZnkoZXZlbnQsIG51bGwsIDIpKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFkbWluQWRkVXNlclRvR3JvdXAoe1xuICAgICAgdXNlclBvb2xJZCxcbiAgICAgIHVzZXJuYW1lOiB1c2VyTmFtZSxcbiAgICAgIGdyb3VwTmFtZTogJ1VzZXJzJyxcbiAgICB9KTtcblxuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBldmVudCk7XG4gIH0gY2F0Y2ggKGVycm9yOmFueSkge1xuICAgIHJldHVybiBjYWxsYmFjayhlcnJvciwgZXZlbnQpO1xuICB9XG59XG4iXX0=