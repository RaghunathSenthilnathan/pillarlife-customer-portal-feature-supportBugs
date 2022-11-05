import { Button, Input, Label } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { LoadingInline } from "@components/loading-spinner";
import { NextLink } from "@components/next-link";
import {  useNotification } from "@context/notification";
import { isValidEmail } from "@shared/index";
import { withAnonymous } from "@utils/route-hocs";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import {  ROUTE_PATHS } from "src/constants";
import { useLogin } from "./use-login";
import TagManager from "react-gtm-module";
import { analytics } from "@pages/analytics";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.LOGIN}`;
const title = "Login";
const description = "Sign into your account";
export default withAnonymous(Login);
function Login() {
  const {
    handleSubmit,
    register,
    formErrors,
    isError,
    error,
    isLoading
  } = useLogin();
  const { addNotification } = useNotification();
  useEffect(() => {
    // if (isError && error) {
    //     addNotification({
    //         type: NotificationType.ERROR,
    //         title: error.message,
    //         message: 'Your request has failed.',
    //     });
    // }
  }, [addNotification, error, isError]);
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
      <Flex className=" flex-col sm:px-6 lg:px-8">
        <Container className="lg:flex">
          <Container className="lg:flex-1">
            <Container className="mt-8 sm:mx-auto sm:w-full sm:max-w-md test">
              <Container className="px-4 sm:px-12 py-8 ">
                <Container className="sm:mx-auto sm:w-full sm:max-w-md">
                  <Container className="text-center">
                    <Container className="text-center mb-5 customheader">
                      <Container className="text-900 text-xl sm:text-2xl font-bold mb-1">
                        Welcome Back!
                      </Container>
                      <span className="text-600 text-sm font-normal">
                        Access your Pillar Life personal account:
                      </span>
                    </Container>
                  </Container>
                </Container>
                <form
                  className="space-y-4 px-4"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <Container>
                    <Label htmlFor="email" className="font-bold">
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

                  <Container>
                    <Label htmlFor="password" className="font-bold">
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
                          message: "Password must be at least 8 characters."
                        }
                      })}
                      error={formErrors.password?.message}
                    />
                  </Container>

                  <Flex className="items-center justify-start ">
                    {/* <NextLink
                      href={ROUTE_PATHS.REGISTER}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Do not have an account?
                    </NextLink> */}

                    <NextLink
                      href={ROUTE_PATHS.REQUEST_PASSWORD_RESET}
                      className="text-sm  font-bold text-indigo-600 hover:text-indigo-500 linkcolor"
                    >
                      Forgot password?
                    </NextLink>
                  </Flex>
                  {isError && error && (
                    <p className="text-center" style={{ color: "red" }}>
                      {error.message}
                    </p>
                  )}
                  <div className="text-center p-2">
                    <Button
                      type="submit"
                      className="btncolor font-bold w-11/12 mx-auto"
                      disabled={!!isLoading}
                    >
                      Log In {isLoading && <LoadingInline />}
                    </Button>
                  </div>
                </form>
                <Container className="text-center mt-1 mb-5">
                  <span className=" font-medium text-sm line-height-3">
                    Not a member?{" "}
                  </span>
                  <NextLink
                    href={ROUTE_PATHS.REGISTER}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-500 linkcolor"
                  >
                    Create an account now
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
//# sourceMappingURL=login.jsx.map
