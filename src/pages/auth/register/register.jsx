import { Button, Input, Label } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { LoadingInline } from "@components/loading-spinner";
import { NextLink } from "@components/next-link";
import {  useNotification } from "@context/notification";
import { isValidEmail } from "@shared/index";
import { withAnonymous } from "@utils/route-hocs";
import { NextSeo } from "next-seo";
import router from "next/router";
import { useEffect } from "react";
import {  ROUTE_PATHS } from "src/constants";
import { useRegister } from "./use-register";
import TagManager from "react-gtm-module";
import { analytics } from "@pages/analytics";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.REGISTER}`;
const title = "Register";
const description = "Register for an account";
export default withAnonymous(Register);
function Register() {
  const {
    handleSubmit,
    register,
    formErrors,
    passwordRef,
    isError,
    error,
    isSuccess,
    isLoading
  } = useRegister();
  const { addNotification } = useNotification();
  useEffect(() => {
    if (isSuccess) {
      router.push(ROUTE_PATHS.CHECK_EMAIL);
    }
  }, [addNotification, error, isError, isSuccess]);
    useEffect(() => {
    const tagManagerArgs = {
  gtmId: "GTM-PCZZK57",
  dataLayer: {
    userId: "001",
    userProject: "Pillar-Life",
  },
};
      TagManager.initialize(tagManagerArgs);
  }, []);

  console.log("Submit---",register,handleSubmit)

  useEffect(() => {
    analytics(window, document, 'script', 'dataLayer', 'GTM-PCZZK57');
  })
  
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description
        }}
      />
      <Flex className="flex-col sm:px-6 lg:px-8">
        <Container className="lg:flex">
          <Container className="lg:flex-1">
            <Container className="mt-8 sm:mx-auto sm:w-full sm:max-w-md test">
              <Container className="px-6  sm:rounded-lg sm:px-20 py-8  ">
                <Container className="text-center mb-5 customheader">
                  <Container className="text-900 text-2xl font-bold mb-1">
                    Welcome!
                  </Container>
                  <span className="text-600 font-medium text-base ">
                    Create an account
                  </span>
                </Container>
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <Container>
                    <Label
                      htmlFor="email"
                      className="text-600 font-bold line-height-3"
                    >
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="email@address.com"
                      ref={register({
                        required: "Email is required.",
                        validate: email =>
                          isValidEmail(email) || "Email address is invalid."
                      })}
                      error={formErrors.email?.message}
                    />
                  </Container>
                  <Flex className="flex-1">
                    <Container>
                      <Label
                        htmlFor="password"
                        className="text-600 font-bold line-height-3"
                      >
                        Password
                      </Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        ref={register({
                          required: "Password is required.",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be minimum 8 Characters with 1-Lowercase,1-Uppercase,1-Numeric,1-Special Character"
                          }
                        })}
                        error={formErrors.password?.message}
                      />
                    </Container>
                  </Flex>
                  <Container>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-600 font-bold line-height-3"
                    >
                      Confirm Password
                    </Label>

                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      ref={register({
                        required: "Password confirmation is required.",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters."
                        },
                        validate: confirmPassword =>
                          confirmPassword === passwordRef.current ||
                          "The passwords do not match."
                      })}
                      error={formErrors.confirmPassword?.message}
                    />
                  </Container>

                  <Container>
                    <Label
                      htmlFor="referralCode"
                      className="text-600 font-bold line-height-3"
                    >
                      Referral Code
                    </Label>
                    <Input
                      type="text"
                      id="referralCode"
                      name="referralCode"
                      placeholder="Referral Code"
                      
                    />
                  </Container>
                  {isError && error && (
                    <p className="text-center" style={{ color: "red" }}>
                      {error.message}
                    </p>
                  )}
                  <div>
                    <Button
                      className="btncolor mt-6 rounded-lg w-10/12 mx-auto h-10 font-semibold"
                      type="submit"
                      disabled={!!isLoading}
                    >
                      Create an account {isLoading && <LoadingInline />}
                    </Button>
                  </div>
                </form>
                <Container className="text-center mt-4 mb-4">
                  <span className=" font-normal line-height-3">
                    Already have an account?{" "}
                  </span>
                  <NextLink
                    href={ROUTE_PATHS.LOGIN}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 linkcolor"
                  >
                    Log In
                  </NextLink>
                </Container>
              </Container>
            </Container>
          </Container>
         
        </Container>
      </Flex>
    </>
  );
}
//# sourceMappingURL=register.jsx.map
