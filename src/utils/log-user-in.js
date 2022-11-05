import {Auth} from '@aws-amplify/auth';
import { TEMP_PWD_LOCALSTORAGE_KEY } from 'src/constants';
export async function handleLogin({ email, password, router, initializeUser,confirmpwd,loc }) {
    localStorage.removeItem(TEMP_PWD_LOCALSTORAGE_KEY);
    const user = (await Auth.signIn(email, password));
    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const { requiredAttributes } = user.challengeParam;
        const userAttributes = {};
        if (requiredAttributes.includes('given_name')) {
            userAttributes.given_name = 'Test';
        }
        if (requiredAttributes.includes('family_name')) {
            userAttributes.family_name = 'User';
        }
        await Auth.completeNewPassword(user, password, userAttributes);
    }
    if(confirmpwd&&loc){
 const jwt_key = sessionStorage.getItem("userName");
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );
     let userId = sessionStorage.getItem("userName");
     await loc.map(async (item) => {

    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
        "/pay/api/v1/"+item+"/unlinked",
      {
        method: "DELETE",
        // body: JSON.stringify(policybody),

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        // setlinkToken(data.link_token);
      
      })
      .catch(error => {
        console.log("Error:", error);
      });
    }
  )}
    initializeUser();
    sessionStorage.setItem("modalFlag",true)
    router.push('/dashboard');
    return user;
}
