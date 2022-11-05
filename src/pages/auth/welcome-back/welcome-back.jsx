import { Button, Input, Label } from "@components/forms";
import { Heading, SubHeading } from "@components/heading/heading";
import { EmailIcon } from "@components/icons/icons";
import { LoadingInline } from "@components/loading-spinner";
import { Flex } from "@components/layout";
import { NextLink } from "@components/next-link";
import { NotificationType, useNotification } from "@context/notification";
import { isValidEmail } from "@shared/index";
import { withAnonymous } from "@utils/route-hocs";
import { NextSeo } from "next-seo";
import { useAuth } from "@context/auth";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { useRouter } from "next/router";
import { useWelcomeBack } from "./use-welcome-back";
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.WELCOME_BACK}`;
const title = "Welcome Back";
const description =
  "Enables you to enter your password to complete registration.";
export default withAnonymous(welcomeBack);
function welcomeBack() {
  const {
    handleSubmit,
    register,
    formErrors,
    isError,
    error,
    isLoading
  } = useWelcomeBack();
  const router = useRouter();

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
      <div className="flex flex-col py-12 sm:px-6 lg:px-8">
        <div className="lg:flex">
          <div className="lg:pr-16 lg:flex-1">
            <div className="sm:mx-auto sm:w-3/6 sm:max-w-3/6">
              <div className="px-4 py-8 sm:rounded-lg sm:px-10 test">
                <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                  <div className="text-left">
                    <div className="text-left mb-5 customheader">
                      <div className="text-900 text-3xl font-bold mb-3">
                        Welcome Back!
                      </div>
                      <span className="text-600 font-semibold line-height-3">
                        Your account was successfully created and verified.
                        Please enter the password for {router.query.email} to
                        continue your investment process
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-3/6">
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
                  </div>
                  <Flex className="items-center justify-start mt-0">
                    {/* <NextLink
                      href={ROUTE_PATHS.REGISTER}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Do not have an account?
                    </NextLink> */}

                    <NextLink
                      href={ROUTE_PATHS.REQUEST_PASSWORD_RESET}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 linkcolor"
                    >
                      Forgot password?
                    </NextLink>
                  </Flex>
                  {isError && error && (
                    <p className="text-center" style={{ color: "red" }}>
                      Incorrect Password
                    </p>
                  )}
                  <div className="w-full inline-flex">
                    {/* <Button className="w-2/6 btncolorgrey hover:bg-gray-400 font-bold py-2 px-4 rounded-l mr-5">
                    Cancel
                  </Button> */}
                    <Button
                      type="submit"
                      disabled={!!isLoading}
                      className="m-auto sm:m-0 w-5/6 sm:w-2/6 btncolor hover:bg-gray-400 font-bold py-2 px-4 rounded-r"
                    >
                      Get started {isLoading && <LoadingInline />}
                    </Button>
                  </div>

                  {/* <div>
                  <Button type="submit" disabled={!!isLoading} isFullWidth>
                    Reset Password {isLoading && <LoadingInline />}
                  </Button>
                </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
