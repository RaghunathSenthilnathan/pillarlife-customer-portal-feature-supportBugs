import {Auth} from '@aws-amplify/auth';
import { useAuth } from '@context/auth';
import { useAsync } from '@hooks/use-async';
import { handleLogin } from '@utils/log-user-in';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ROUTE_PATHS } from 'src/constants';
import {
  Url,
  policies,
  updatePolicy,
  update,
  auxDataUrl
} from "../../../constants/apiconstant";

export function useWelcomeBack() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, watch, setValue, errors: formErrors, } = useForm();
    const { initializeUser } = useAuth();
    const { status, error, isLoading, isError, run } = useAsync();
    const router = useRouter();
      var locators = [];
      var loc=[]
      const {
    state: { user },
  } = useAuth();
    useEffect(() => {
        getAllpolicies()
        if (router.isReady) {
                setValue('email', user.email);
            }
    }, [router, setValue]);


async function getAllpolicies(){
      let userId = sessionStorage.getItem("userName");
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
     await fetch(Url + auxDataUrl + userId + policies, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        locators.push(data.value);
          displayPolicy(...locators);
        
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
   
  
  async function displayPolicy(locators) {
    //  const token = localStorage.getItem(
    //   "CognitoIdentityServiceProvider." +
    //     process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
    //     "." +
    //     jwt_key +
    //     ".accessToken"
    // );
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
console.log(locators,"locators")
    let arrLocators = locators.split(",");
    await arrLocators.map(async (item) => {

        await fetch(Url + auxDataUrl +  "/processorToken/"+item, {
      method: "GET",

      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(datas => {
        loc.push(item)
      })
      .catch(error => {
        console.log("Error:", error);
      });
     
    })
}
        function onSubmit({ password }) {

        const email = String(user.email);
        run(handleLogin({ email, password, router, initializeUser, confirmpwd: true,loc }));
    }

    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        formErrors,
        isLoading,
        isError,
        error,
        status,
    };
}