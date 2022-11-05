import { useEffect, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Sider } from "@components/sidebar";
import { Flex } from "@components/layout";
import { ROUTE_PATHS } from "src/constants";
import Link from "next/link";
import { withAuthentication } from "@utils/route-hocs";
import { Button } from "@components/forms";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import {
  Url,
  authUrl,
  authOptions,
  SendDoc
} from "../../../../../constants/apiconstant";
import { BeneSubmitModal } from "./bene.jsx";
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.SUITABILITY_CHECK}`;
const title = "Sign";
const description =
  "Enables you to resend the registration activation link to your email address.";

const esign = () => {
  const router = useRouter();
  const [link, SetLink] = useState();
  const [flag, setFlag] = useState(false);
  const [Modals, setModal] = useState(false);
  const closeModal = useCallback(() => {
    setModal(false);
    sessionStorage.clear();
    router.push(ROUTE_PATHS.DASHBOARD);
  });

  async function getID() {
    const pl = sessionStorage.getItem("policyLocator");

    const beneficiary = [];
    const contigent = [];
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + "/policy/" + pl, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(async data => {
        let email =
          data.characteristics &&
          data.characteristics[0].fieldValues.primaryOwnerEmail
            ? data.characteristics[0].fieldValues.primaryOwnerEmail[0]
            : data.characteristics[0].fieldValues.trustEmail[0];

        const docId = sessionStorage.getItem("changeBeneId");
        const body = {
          recipient: email,
          lifetime: 86400
        };
        await fetch(SendDoc + docId + "/session", {
          method: "POST",
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(data => {
            SetLink(`https://app.pandadoc.com/s/${data.id}`);
          })

          .catch(error => {
            console.log("Error:", error);
          });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }
  async function documentStatus(payload) {
    const sentMail = {
      sign_status_cd: "P"
    };
    const jwt_key = sessionStorage.getItem("userName");
    const sentId = sessionStorage.getItem("sentId");
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );

    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
        `/esign/api/v1/communication/update/${sentId}`,
      {
        method: "PUT",
        body: JSON.stringify(sentMail),

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .catch(error => {
        console.log("Error:", error);
      });
  }
  useEffect(() => {
    getID();
  }, []);

  useEffect(() => {
    window.addEventListener("message", event => {
      const type = event.data && event.data.type;
      const payload = event.data && event.data.payload;

      switch (type) {
        case "session_view.document.loaded":
          console.log("Session view is loaded");
          break;
        case "session_view.document.completed":
          console.log("Document is completed");
          documentStatus(payload);
          setFlag(true);

          break;
        case "session_view.document.exception":
          console.log("Exception during document finalization", type, payload);
      }
    });
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
          description
        }}
      />

      <div>
        <Sider />
        {/* <Stepper percent={100} index={6} valid={disable} /> */}
      </div>

      <div className="Flex flex-col md:ml-56">
        <div className="Flex justify-items-start m-4">
          <p className="h-suitability font-bold text-lg md:text-xl">
            Sign & Submit
          </p>
        </div>
        <div className="Flex flex-col justify-items-start bg-gray-100 md:bg-white md:pb-4">
          <iframe
            src={link}
            title="W3Schools Free Online Web Tutorials"
            width="100%"
            height="520px"
          ></iframe>
        </div>

        <Flex className="border1 flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-between mt-5 mb-5 h-15 pt-5 sm:pt-0">
          <Link className="w-1/3" href={ROUTE_PATHS.MY_POLICIES}>
            <Button onClick={()=> {sessionStorage.clear();}} className="btn-cancel h-10 text-blue-500 border-blue-500 font-bold py-2 rounded-sm w-5/6 mt-5 sm:mt-3 sm:ml-0 sm:w-1/6">
              Back
            </Button>
          </Link>

          <Button
            disabled={!flag}
            onClick={() => setModal(true)}
            type="submit"
            className="btncolor font-bold rounded-sm py-2 text-white-500 ml-0 sm:ml-72 sm:mt-0 w-5/6 sm:w-1/6"
          >
            Continue
          </Button>
        </Flex>
        {Modals && (
          <BeneSubmitModal showsModal={true} closeModal={closeModal} />
        )}
      </div>
    </>
  );
};
export default withAuthentication(esign);
