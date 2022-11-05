import { NextSeo } from "next-seo";
import {  ROUTE_PATHS } from "src/constants";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "My Policies";
const description =
  "Enables you to resend the registration activation link to your email address.";

const needHelp = () => {
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
      <div className="invisible md:visible">
       
          <div className=" ">
            <div className="flex flex-col hidden sm:inline-block pl-5 pr-3 my-2 help text-sm font-semibold divide-y-2 divide-gray-200 rounded-md">
              <div className="p-2"> Need Help? </div>
              <div className="flex flex-col p-2">
                <div className="text-black font-medium">
                  We are available 24/7
                </div>
                <div> 1 866 931 7542</div>
              </div>
            </div>
          </div>
       
      </div>
    </>
  );
};
export default needHelp;
