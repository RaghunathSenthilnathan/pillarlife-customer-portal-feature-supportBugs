
import { useRouter } from "next/router";
import { withAnonymous } from "@utils/route-hocs";
import { useEffect } from "react";
import { NextSeo } from "next-seo";
import TagManager from "react-gtm-module";
import {  ROUTE_PATHS } from "src/constants";
import { Container } from "@components/layout";
import { Flex } from "./../../../components/layout/flex";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Check Mail";

const description =
  "Enables you to resend the registration activation link to your email address.";
export default withAnonymous(CheckEmail);
function CheckEmail() {
  const router = useRouter();
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
  const { query } = router;
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
      <Container className="bg-white flex flex-col justify-center py-12 mt-12  sm:px-6 lg:px-8">
        <Flex className=" justify-center">
          <Container className="w-screen p-5 sm:w-7/12 ">
            <Container className=" mx-30 text-left">
              <h1 className="text-xl font-bold leading-9 tracking-tight text-gray-800 sm:text-2xl  sm:leading-10">
                Check your email
              </h1>
              {query.data === "reset" ? (
                <h2 className="ml-0 max-w-3xl mx-auto mt-3 text-lg font-bold leading-7  sm:mt-3">
                  We have sent a verification link to reset your password to the
                  email address provided by you.
                </h2>
              ) : (
                <div>
                  <h2 className="ml-0 mb-0 sm:mb-1 max-w-3xl mx-auto mt-3 text-sm sm:text-lg font-bold leading-7  sm:mt-3">
                    We'll send a verification link to the email address you used
                    to create the account.
                  </h2>
                  <h3 className="ml-0 max-w-2xl mx-auto mt-3 text-sm sm:text-md font-normal sm:mt-0">
                    If you don't verify your address, you may not be able to
                    continue investing with us
                  </h3>
                </div>
              )}
            </Container>
          </Container>
        </Flex>
      </Container>
    </>
  );
}
