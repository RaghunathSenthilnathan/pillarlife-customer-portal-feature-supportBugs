import { useEffect, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { Stepper } from "@components/stepper";
import { Sider } from "@components/sidebar";
import { Flex, Container } from "@components/layout";
import { ROUTE_PATHS } from "src/constants";
import Link from "next/link";
import { Modal } from "@components/modal";
import * as FileSaver from "file-saver";
import { withAuthentication } from "@utils/route-hocs";
import { Button } from "@components/forms";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

import {
  Url,
  auxDataUrl,
  SendDoc
} from "../../../constants/apiconstant";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.SUITABILITY_CHECK}`;
const title = "Sign";
const description =
  "Enables you to resend the registration activation link to your email address.";
const sign = () => {
  const [link, SetLink] = useState();
  const [disable, setdisable] = useState();
  const [ACH, setACH] = useState(false);  
  const [prToken, setprToken] = useState(false);
  const [checkaccount, setcheckaccount] = useState(false);
  const [docCompleted, setdocCompleted] = useState(true);
  const [ispayment, setispayment] = useState(false);
  const [ispayment1, setispayment1] = useState(false);
  const [ispayment2, setispayment2] = useState(false);
  const [error1, seterror1] = useState(false);
  const [checkopen, setcheckopen] = useState(false);

  let closecheck = useCallback(() => {
    setcheckopen(false);
    window.location.href = "/dashboard";
  }, []);

  let closepopup = () => {
    seterror1(false);
    window.location.href = "/application/payment";
  };
  let closepopup1 = () => {
    setispayment(false);
    window.location.href = "/application/payment";
  };
  let closepopup2 = () => {
    if(prToken){
 window.location.href = "/dashboard"
    }
    setispayment1(false);
  };
  let closepopup3 =() => {
    if(prToken){
 window.location.href = "/dashboard"
    }
    setispayment2(false);
  };

  async function documentStatus() {
    const sentMail = {
      sign_status_cd: "P"
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
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .catch(error => {
        console.log("Error:", error);
      });
  }

  var auxcheck = false;

  async function getID() {
    const pl = sessionStorage.getItem("policyLocator");

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
     await fetch(Url + auxDataUrl +  "/processorToken/"+pl, {
      method: "GET",

      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(datas => {
        setprToken(true)
      })
      .catch(error => {
        console.log("Error:", error);
      });
     

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
        if (parseFloat(data.characteristics[0].fieldValues.achAmount[0]) > 0) {
          setACH(true);
        }
        if (parseFloat(data.characteristics[0].fieldValues.achAmount[0]) === 0) {
          setcheckaccount(true);
        }

        if (
          data.characteristics[0].fieldValues.esignatureStatus[0] !=
          "Not Started"
        ) {
          setdisable(true);
        } else {
          setdisable(false);
        }

        let email =
          data.characteristics &&
          data.characteristics[0].fieldValues.primaryOwnerEmail
            ? data.characteristics[0].fieldValues.primaryOwnerEmail[0]
            : data.characteristics[0].fieldValues.trustEmail[0];

        const docId = sessionStorage.getItem("docId");
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

    primaryownerstatus();
  }

  async function primaryownerstatus() {
    const docId = sessionStorage.getItem("docId");
    await fetch(SendDoc + docId, {
      method: "GET",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "document.completed") {
          setdocCompleted(false);
        }
      })

      .catch(error => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getID();
    getpagestatus();
  }, []);

  async function pagestatus() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const pl = sessionStorage.getItem("policyLocator");

    const status = {
      auxData: {
        key: "Primarysign",
        value: "Complete"
      }
    };

    await fetch(Url + auxDataUrl + pl, {
      method: "PUT",
      body: JSON.stringify(status),

      headers: {
        Authorization: auth.authorizationToken,

        "Content-Type": "application/json",

        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .catch(error => {
        console.log("Error:", error);
      });
  }

  async function getpagestatus() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const pl = sessionStorage.getItem("policyLocator");

    await fetch(Url + auxDataUrl + pl + "/" + "Primarysign", {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.value === "Complete") {
          auxcheck = true;
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    window.addEventListener("message", event => {
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
    primaryownerstatus();

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const pl = sessionStorage.getItem("policyLocator");

    await fetch(Url + auxDataUrl + pl + "/" + "Primarysign", {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.value === "Complete") {
          auxcheck = true;
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });

    if (auxcheck === true && docCompleted === true&&!prToken) {
      setispayment(true);
    } else if (auxcheck === false && docCompleted === true&&!prToken) {
      setispayment1(true);
    } else if (docCompleted === false && auxcheck === true &&!prToken) {
      seterror1(true);
    }
     else if (docCompleted === false && auxcheck === true &&!prToken) {
       setispayment1(true)
    }
    else if(prToken){
      setispayment2(true)
    }
  }

  async function checksignature1() {
    primaryownerstatus();

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const pl = sessionStorage.getItem("policyLocator");

    await fetch(Url + auxDataUrl + pl + "/" + "Primarysign", {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.value === "Complete") {
          auxcheck = true;
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });

    if (auxcheck === true && docCompleted === true) {
      setcheckopen(true);
    } else if (auxcheck === false && docCompleted === true) {
      setispayment1(true);
    } else if (docCompleted === false && auxcheck === true) {
      setcheckopen(true);
    }
  }

  async function handleDownloadForm() {
      const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + auxDataUrl + "staticDocumentLocation/1035Form", {
      method: "GET",

      headers: {
        Authorization: send.authorizationToken,
        "Content-Type": "application/json",

        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        FileSaver.saveAs(data.value);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  async function handleDownloadInstruction() {
       const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + auxDataUrl + "staticDocumentLocation/1035Instructions", {
      method: "GET",

      headers: {
        Authorization: send.authorizationToken,
        "Content-Type": "application/json",

        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        FileSaver.saveAs(data.value);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

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
        <Stepper percent={100} index={6} valid={disable} />
      </div>

      <div className="Flex flex-col md:ml-56">
        <div className="Flex justify-items-start m-4 ml-2">
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
          <Link className="w-1/3" href={ROUTE_PATHS.REVIEW}>
            <Button className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm   w-5/6 mt-5 sm:mt-3 sm:ml-0  sm:w-1/6">
              Back
            </Button>
          </Link>
          {error1 && (
            <Modal
              showsModal={true}
              description={
                <span className="text-left mt-3 text-neutral-900 font-bold">
                  Thank you for signing the application form. Your application
                  will be processed within 2-4 business days.
                </span>
              }
              body={
                <Flex className="items-center mt-10 justify-center">
                  <Button
                    className="w-3/6 sm:w-2/6 font-bold btncolor font-muli"
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
                Thank you for signing the application form. Your application
                will be processed once all the parties have signed the form.
              </span>
            }
            body={
              <Flex className="items-center mt-10 justify-center">
                <Button
                  className="w-3/6 sm:w-2/6 font-bold btncolor font-muli"
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
              ACH &&!prToken? (
                <span className="text-left mt-3 text-neutral-900 font-bold">
                  Please sign the document before continuing to Payment.
                </span>
              ) :
              prToken?(
                 <span className="text-left mt-3 text-neutral-900 font-bold">
                 You have already initiated a payment. Please wait for the payment to get processed.
                </span>
              ): (
                <span className="text-left mt-3 text-neutral-900 font-bold">
                  Please sign the document before continuing.
                </span>
              )
            }
            body={
              <Flex className="items-center mt-10 justify-center">
                <Button
                  className="w-3/6 sm:w-2/6 font-bold btncolor font-muli"
                  onClick={closepopup2}
                >
                  OK
                </Button>
              </Flex>
            }
          />
<Modal
            showsModal={ispayment2}
            description={
              prToken&&(
                 <span className="text-left mt-3 text-neutral-900 font-bold">
                 You have already initiated a payment. Please wait for the payment to get processed.
                </span>
              )
            }
            body={
              <Flex className="items-center mt-10 justify-center">
                <Button
                  className="w-3/6 sm:w-2/6 font-bold btncolor font-muli"
                  onClick={closepopup3}
                >
                  OK
                </Button>
              </Flex>
            }
          />
          <Modal
            showsModal={checkopen}
            description={
              <Container className="text-center sm:text-left mt-3 text-neutral-900 font-bold">
                Please follow the instructions to send the 1035 transfer form.
                Your application will be processed as soon as the 1035 transfer
                is completed.
                <div className="flex flex-col justify-center sm: justify-start items-center sm:items-start mt-5  ">
                  {/* <label
                    className="sm:w-2/3 text-sm font-semibold download"
                    onClick={() => handleDownloadInstruction()}
                  >
                    Download 1035 Instructions here
                  </label> */}
                  <label
                    className="sm:w-3/4 text-sm font-semibold download"
                    onClick={() => handleDownloadForm()}
                  >
                    Download 1035 Instructions and Form here
                  </label>
                </div>
              </Container>
            }
            body={
              <Flex className="flex items-center mt-10 justify-center ">
                <Button
                  className="btncolor h-10 font-bold font-muli py-2  px-4 rounded-r w-5/6 my-5 sm:ml-0  sm:w-2/6"
                  onClick={closecheck}
                >
                  OK
                </Button>
              </Flex>
            }
          />

          {checkaccount ? (
            <Button
              type="button"
              onClick={checksignature1}
              className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/4"
            >
              Continue
            </Button>
          ) : null}

          {ACH ? (
            <Button
              type="button"
              onClick={checksignature}
              className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/4"
            >
              Continue to Payment
            </Button>
          ) : null}
        </Flex>
      </div>
    </>
  );
};
export default withAuthentication(sign);
