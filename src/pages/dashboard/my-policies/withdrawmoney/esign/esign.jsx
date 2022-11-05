import { useEffect, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { Sider } from "@components/sidebar";
import { Flex, Container } from "@components/layout";
import { ROUTE_PATHS } from "src/constants";
import { usePlaidLink } from "react-plaid-link";
import { PaymentModal } from "./paymentmodal";
import Link from "next/link";
import { Button } from "@components/forms";
import { Modal } from "@components/modal";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { withAuthentication } from "@utils/route-hocs";

import {
  Url,
  SendDoc,
  auxDataUrl,
} from "../../../../../constants/apiconstant";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.SUITABILITY_CHECK}`;
const title = "Sign";
const description =
  "Enables you to resend the registration activation link to your email address.";
const esign = () => {
  const [link, SetLink] = useState();
  const [error1, seterror1] = useState(false);
  const [docCompleted, setdocCompleted] = useState(true);
  const [ispayment, setispayment] = useState(false);
  const [ispayment1, setispayment1] = useState(false);
  const [check, setcheck] = useState();
  const [ACH, setACH] = useState(false);
  const [linkToken, setlinkToken] = useState("");
  const [paymentselect, setpaymentselect] = useState(false);
  const [useraccount, setuseraccount] = useState([]);
  const [token, settoken] = useState();
  const [showsuccess, setshowsuccess] = useState(false);
  const [ischeckmode, setischeckmode] = useState(true);
  const [checkpopup, setcheckpopup] = useState();
  const [joint, setjoint] = useState(false);

  let closepopup = () => {
    seterror1(false);

    open();
  };
  let closepopup1 = () => {
    setispayment(false);
    open();
  };
  let closepopup2 = () => {
    setispayment1(false);
  };

  let closepopupcheck = () => {
    setcheck(false);
  };

  let closepayment = useCallback(() => {
    setpaymentselect(false);
  }, []);

  let closeaccountselection = useCallback(() => {
    setshowsuccess(true);
    setpaymentselect(false);
  }, []);

  let successclose = useCallback(() => {
    setshowsuccess(false);
  }, []);

  let closecheckpopup = useCallback(() => {
    setcheckpopup(false);
  }, []);

  useEffect(() => {
    getID();
    getpagestatus();
    initiateplaid();
  }, []);

  async function initiateplaid() {
    const pl = sessionStorage.getItem("policyLocator");
    const policybody = {
      client_name: "  Pillar Life  ",
      country_codes: ["US"],
      language: "en",
      user: {
        client_user_id: pl,
      },
      products: ["auth"],
    };

    const jwt_key = sessionStorage.getItem("userName");
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );

    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
        "/esign/api/v1/communication/create-link-token",
      {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setlinkToken(data.link_token);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  const onSuccess = useCallback((token, metadata) => {
    // send token to server

    setpaymentselect(true);
    settoken(token);
    postpublictoken(token);
  }, []);

  const config = {
    client_name: "  Pillar Life  ",
    env: "sandbox",
    token: linkToken,
    product: ["auth", "transactions"],
    publicKey: "<YOUR_PLAID_PUBLIC_KEY>",
    onSuccess,
  };

  const { open, ready, error } = usePlaidLink(config);

  // Continue to Sign validation and code below---

  async function postpublictoken(params) {
    const publicbody = {
      public_token: params,
    };
    const jwt_key = sessionStorage.getItem("userName");
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );

    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
        "/esign/api/v1/communication/send-public-token",
      {
        method: "POST",
        body: JSON.stringify(publicbody),

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setuseraccount(data.accounts);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function documentStatus() {
    const sentMail = {
      sign_status_cd: "P",
    };

    const sentId = sessionStorage.getItem("sentId");
    const jwt_key = sessionStorage.getItem("userName");
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
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.log("Error:", error);
      });
  }

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
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.characteristics[0].fieldValues.appType[0] === "Joint") {
          setjoint(true);
        }
        let email =
          data.characteristics &&
          data.characteristics[0].fieldValues.primaryOwnerEmail
            ? data.characteristics[0].fieldValues.primaryOwnerEmail[0]
            : data.characteristics[0].fieldValues.trustEmail[0];

        const docId = sessionStorage.getItem("withdrawId");
        const body = {
          recipient: email,
          lifetime: 86400,
        };
        await fetch(SendDoc + docId + "/session", {
          method: "POST",
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((data) => {
            SetLink(`https://app.pandadoc.com/s/${data.id}`);
          })

          .catch((error) => {
            console.log("Error:", error);
          });
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    var endorselocator = JSON.parse(localStorage.getItem("EL"));

    await fetch(Url + "/endorsements/" + endorselocator, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.authorizationToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.addFieldGroups[0].fieldValues.paymentOption[0] == "ACH") {
          setACH(true);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    primaryownerstatus();
  }

  var auxcheck = false;

  async function pagestatus() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    var endorsementlocator = JSON.parse(localStorage.getItem("EL"));

    const status = {
      auxData: {
        key: "Primarysign",
        value: "Complete",
      },
    };

    await fetch(Url + auxDataUrl + endorsementlocator, {
      method: "PUT",
      body: JSON.stringify(status),

      headers: {
        Authorization: auth.authorizationToken,

        "Content-Type": "application/json",

        Accept: "application/json",
      },
    })
      .then((response) => setischeckmode(false))
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function getpagestatus() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    var endorsementlocator = JSON.parse(localStorage.getItem("EL"));

    await fetch(Url + auxDataUrl + endorsementlocator + "/" + "Primarysign", {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.value === "Complete") {
          auxcheck = true;
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function primaryownerstatus() {
    const docId = sessionStorage.getItem("docId");
    await fetch(SendDoc + docId, {
      method: "GET",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "document.completed") {
          setdocCompleted(false);
          setischeckmode(false);
        }
      })

      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const type = event.data && event.data.type;
      const payload = event.data && event.data.payload;

      switch (type) {
        case "session_view.document.loaded":
          break;
        case "session_view.document.completed":
          documentStatus();
          pagestatus();
          primaryownerstatus();

          break;
        case "session_view.document.exception":
      }
    });
  }, []);

  async function checksignature() {
    var auxcheck = false;

    primaryownerstatus();

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    var endorsementlocator = JSON.parse(localStorage.getItem("EL"));

    await fetch(Url + auxDataUrl + endorsementlocator + "/" + "Primarysign", {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.value === "Complete") {
          auxcheck = true;
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    if (auxcheck === true && docCompleted === true) {
      setispayment(true);
    } else if (auxcheck === false && docCompleted === true) {
      setispayment1(true);
    } else if (docCompleted === false && auxcheck === true) {
      seterror1(true);
    }
  }
  const checkissued = () => {
    setcheckpopup(true);
  };

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

      <div>
        <Sider />
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

        {error1 && (
          <Modal
            showsModal={true}
            description={
              <span className="text-left mt-3 text-neutral-900 font-bold">
                Thank you for signing the withdrawal form. Your withdrawal will
                be processed within 2-4 business days.
              </span>
            }
            body={
              <Flex className="items-center mt-10 justify-center">
                <Button
                  className=" w-3/6 sm:w-2/6 font-bold btncolor font-muli "
                  onClick={closepopup}
                >
                  OK
                </Button>
              </Flex>
            }
          />
        )}
        <Modal
          showsModal={ispayment}
          description={
            <span className="text-left mt-3 text-neutral-900 font-bold">
              Thank you for signing the withdrawal form. Your withdrawal will be
              processed once all the parties have signed the form.
            </span>
          }
          body={
            <Flex className="items-center mt-10 justify-center">
              <Button
                className=" w-3/6 sm:w-2/6 font-bold btncolor font-muli "
                onClick={closepopup1}
              >
                OK
              </Button>
            </Flex>
          }
        />

        <Modal
          showsModal={ispayment1}
          description={
            <span className="text-left mt-3 text-neutral-900 font-bold">
              Please sign the document before continuing to Payment.
            </span>
          }
          body={
            <Flex className="items-center mt-10 justify-center">
              <Button
                className=" w-3/6 sm:w-2/6 font-bold btncolor font-muli"
                onClick={closepopup2}
              >
                OK
              </Button>
            </Flex>
          }
        />

        <Modal
          showsModal={check}
          description={
            <span className="text-left mt-3 text-neutral-900 font-bold">
              Please sign the Document before entering the bank information.
            </span>
          }
          body={
            <Flex className="items-center mt-10 justify-center">
              <Button
                className=" w-3/6 sm:w-2/6  font-bold btncolor font-muli "
                onClick={closepopupcheck}
              >
                OK
              </Button>
            </Flex>
          }
        />
        <Modal
          showsModal={showsuccess}
          // title={successtitle}

          description={
            <Flex className="flex-col items-center sm:mt-10 justify-left">
              <Container>
                <h1 className="text-xl font-bold leading-9 tracking-tight text-gray-800 sm:text-2xl  sm:leading-10">
                  Thank you.
                </h1>
                <h3 className="ml-0 max-w-2xl mx-auto mt-3 text-lg sm:text-md font-semibold sm:mt-0">
                  Your withdrawal request has been submitted successfully. You
                  will receive the amount in your bank account in 2-4 business
                  days.
                </h3>
              </Container>
              <Link className="w-1/3 mt-5" href={ROUTE_PATHS.DASHBOARD}>
                <Button className="  h-10  font-bold  btncolor font-muli  py-2 rounded-sm my-5 sm:ml-0 w-3/6 sm:w-2/6">
                  OK
                </Button>
              </Link>
            </Flex>
          }
        />
        <Modal
          showsModal={checkpopup}
          // title={checktitle}

          description={
            <Flex className="flex-col items-center sm:mt-10 justify-left">
              <Container>
                <h1 className="text-xl font-bold leading-9 tracking-tight text-gray-800 sm:text-2xl  sm:leading-10">
                  Thank you.
                </h1>
                {joint ? (
                  <>
                    <h3 className="ml-0 max-w-2xl mx-auto mt-3 text-lg sm:text-md font-semibold sm:mt-0">
                      Your withdrawal request has been submitted successfully.
                      {/* </h3>
                 <h3 className="ml-0 max-w-2xl mx-auto mt-3 text-lg sm:text-md font-semibold sm:mt-0"> */}
                      You will receive the check within 1-2 weeks after all the
                      parties have signed the form.
                    </h3>
                  </>
                ) : (
                  <h3 className="ml-0 max-w-2xl mx-auto mt-3 text-lg sm:text-md font-semibold sm:mt-0">
                    Your withdrawal request has been submitted successfully. You
                    will receive the check in 1-2 weeks.
                  </h3>
                )}
              </Container>
              <Link className="w-1/3 mt-5" href={ROUTE_PATHS.DASHBOARD}>
                <Button className="   h-10  font-bold  btncolor font-muli py-2 rounded-sm  my-5 sm:ml-0 w-3/6 sm:w-2/6">
                  OK
                </Button>
              </Link>
            </Flex>
          }
        />
        <PaymentModal
          showsModal={paymentselect}
          closeModal={closepayment}
          select={closeaccountselection}
          user={useraccount}
          publictoken={token}
        />

        <Flex className="border1 flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-between mt-5 mb-5 h-15 pt-5 sm:pt-0">
          <Link className="w-1/3" href={ROUTE_PATHS.MY_POLICIES}>
            <Button className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm   w-5/6 my-5 sm:ml-0  sm:w-1/6">
              Back
            </Button>
          </Link>
          {ACH ? (
            <Button
              type="button"
              onClick={checksignature}
              disabled={!ready}
              className="btncolor h-10 font-bold py-2 mr-3 ml-2 px-4 rounded-r w-5/6 sm:w-1/4"
            >
              Enter Your Bank Information
            </Button>
          ) : (
            <Button
              type="button"
              onClick={checkissued}
              disabled={ischeckmode}
              className="btncolor h-10 font-bold py-2 mr-3 ml-2 px-4 rounded-r w-5/6 sm:w-1/4"
            >
              Continue
            </Button>
          )}
        </Flex>
      </div>
    </>
  );
};
export default withAuthentication(esign);
