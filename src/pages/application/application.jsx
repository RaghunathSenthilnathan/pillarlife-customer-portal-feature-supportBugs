import { useEffect, useState  } from "react";
import { Button } from "@components/forms";
import { Sider } from "@components/sidebar";
import { NextSeo } from "next-seo";
import {  Container } from "@components/layout";

import {withAuthentication} from "@utils/route-hocs";
import { ROUTE_PATHS } from "src/constants";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Application";
const description =
  "Enables you to resend the registration activation link to your email address.";
  
 export default withAuthentication(Application);
 function Application() {
  const [visibleLeft, setVisibleLeft] = useState(false);
 


  const footer = (
    <Container className="w-auto flex">
      <Button className=" btn-cancel h-10 text-blue-500 border-blue-500 font-bold py-2 px-4 rounded-sm mr-60 w-1/6 sm:w-1/6">
        Back
      </Button>

      <Button
        type="submit"
        className=" btncolor h-10 font-bold py-2 px-4 rounded-r ml-80 w-1/6 sm:w-1/6"
      >
        Next
      </Button>
    </Container>
  );
  useEffect(() => {
    window.location.href="/application/qualifiedfunds"
  }, []);
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description,
        }}
      />
      <Sider />
     
     
    </>
  );
}
