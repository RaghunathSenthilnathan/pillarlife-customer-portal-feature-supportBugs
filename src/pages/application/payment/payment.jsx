import { useEffect, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { Sider } from "@components/sidebar";
import { Flex, Container } from "@components/layout";
import { ROUTE_PATHS } from "src/constants";
import Link from "next/link";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@components/forms";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Card } from "primereact/card";
import { Modal } from "@components/modal";
import { PaymentModal } from "./paymentmodal";
import {withAuthentication} from "@utils/route-hocs";
import * as FileSaver from "file-saver";
import { Url,auxDataUrl} from "../../../constants/apiconstant";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.SUITABILITY_CHECK}`;
const title = "Sign";
const description =
  "Enables you to resend the registration activation link to your email address.";

const payment = () => {
  const [linkToken, setlinkToken] = useState("");
  const [paymentselect, setpaymentselect] = useState(false);
    const [plaidselect, setplaidselect] = useState(false);
  const [useraccount, setuseraccount] = useState([]);
  const [token, settoken] = useState();
  const [show, setshow] = useState(false);
  const [showlink, setshowlink] = useState(false);
  const plaiddes="Plaid helps you link your financial institutions | Plaid"

  let closepayment = useCallback(() => {
    setpaymentselect(false);
  }, []);
  let closeplaid = useCallback(() => {
    setplaidselect(false);
  }, []);
  let closeaccountselection = useCallback(() => {
    setshow(true);
    setpaymentselect(false);
  }, []);

  async function getID() {
    const pl = sessionStorage.getItem("policyLocator");
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
      .then(data => {
       
        if (
          parseFloat(data.characteristics[0].fieldValues.achAmount[0]) > 0 &&
          parseFloat(data.characteristics[0].fieldValues.achAmount[0]) <
            parseFloat(data.characteristics[0].fieldValues.amountInvesting[0])
        ) {
          setshowlink(true);
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
    const policybody = {
      client_name: "Pillar Life",
      country_codes: ["US"],
      language: "en",
      user: {
        client_user_id: pl
      },
      products: ["auth"]
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
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        setlinkToken(data.link_token);
      
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getID();
  }, []);

  const onSuccess = useCallback((token, metadata) => {
    
    setpaymentselect(true);
    settoken(token);
    postpublictoken(token);
  }, []);
function titleselect(){
  return(
     <p className="text-left px-8">You are about to be taken to our partner Plaid to be connected to your bank account. Plaid provides a secure, encrypted connection that helps us to protect your personal data. If you want more information on how Plaid works you can find it at
       {"  "}<a href="https://plaid.com/how-it-works-for-consumers/" target="_blank" className="download">{plaiddes}</a>
     </p>
  )
}
  const config = {
    client_name: "  Pillar Life  ",
    env: process.env.NEXT_PUBLIC_PLAID_ENV,
    token: linkToken,
    product: ["auth", "transactions"],
    publicKey: "<YOUR_PLAID_PUBLIC_KEY>",
    onSuccess
  };

  const { open, ready, error } = usePlaidLink(config);

  async function postpublictoken(params) {
    const publicbody = {
      public_token: params
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
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        setuseraccount(data.accounts);
     
      })
      .catch(error => {
        console.log("Error:", error);
      });
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
        // "Content-Disposition": "attachment",
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
      <div className="flex flex-col  sm:px-6 lg:px-8">
        <div className="lg:flex">
          <div className="lg:flex-1">
            <div className="mt-6 sm:w-2/4 ">
              <div className="p-2 text-left">
                <div>
                  <Sider />
                  <div className="sm:visible md:hidden lg:hidden px-4">
                    <p className="text-blue-clr h-suitability font-bold text-lg md:text-xl ml-2 sm:ml-7">
                      Payment
                    </p>
                  </div>
                  {show === false && (
                    <>
                      <div className="Flex flex-col mt-4 w-full md:w-8/12">
                        <Card
                          className={"qstn-card question-card"}
                          footer={
                            <Flex
                              
                              className={`${
                                show === false ? "inline-block" : "hidden"
                              } border1 flex inline-block flex inline-block flex-col-reverse sm:flex-row  items-center justify-center space-y-3 sm:justify-between h-15 pt-10 sm:pt-0`}
                            >
                              <Link className="w-1/3" href={ROUTE_PATHS.DASHBOARD}>
                                <Button className=" btn-cancel  h-10 text-blue-500 font-muli border-blue-500 font-bold  py-2 rounded-sm   w-5/6 my-5 sm:ml-0  sm:w-1/6">
                                  Back
                                </Button>
                              </Link>
                              <Button
                                className="btncolor h-10 font-bold font-muli py-2  px-4 rounded-r w-5/6 my-5 sm:ml-0  sm:w-1/6"
                                disabled={!ready}
                                onClick={()=>setplaidselect(true)}
                              >
                                Pay
                              </Button>
                            </Flex>
                          }
                        >
                          <Container className="ml-7 sm:ml-0">
                            <h1 className={"text-blue-clr"}>
                              You are almost done!
                            </h1>

                            <Container className="pt-2 font-muli text-gray-800">
                              <h6 className="font-muli fotn-normal">
                                Just one last step to submit your application.
                                <h6 className="font-semibold">
                                  Please proceed with your payment
                                </h6>
                              </h6>
                            </Container>
                          </Container>
                        </Card>
                      </div>
                    </>
                  )}

                  {show && (
                    <>
                      <div className="Flex flex-col mt-4 w-full sm:w-max md:ml-56 md:mt-14 md:pt-14">
                        <Card
                          className="qstn-card md:ml-56"
                          footer={
                            <Flex className="flex-col-reverse sm:flex-row  items-center justify-center   h-15 pt-10 sm:pt-5">
                              <Link
                                className="w-1/3 mt-5"
                                href={ROUTE_PATHS.DASHBOARD}
                              >
                                <Button className="btncolor h-10 font-bold py-2 font-muli  px-4 rounded-r w-3/6 my-5 sm:ml-0  sm:w-2/6">
                                  OK
                                </Button>
                              </Link>
                            </Flex>
                          }
                        >
                          <h1
                            className=" font-bold text-19 font-muli  tracking-tight text-gray-800 text-lg  sm:leading-10 ml-1 sm:ml-0
"
                          >
                            Thank you for providing the ACH payment information.
                          </h1>
                          {showlink && (
                            <Container className="text-left mt-3 ml-1 sm:ml-0 text-neutral-900 font-bold">
                              Please follow the instructions to send the 1035
                              transfer form.
                              <div className="flex flex-col justify-start sm: justify-start items-start sm:items-start mt-5  ">
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
                          )}
                          <h3 className="sm:mt-3 max-w-2xl text-gray-800 font-muli mx-auto mt-3 text-md  sm:text-md font-normal sm:mt-0 ml-1 sm:ml-0">
                            Your application will be processed as soon as the
                            payment is received.
                          </h3>
                        </Card>
                      </div>
                    </>
                  )}
 {plaidselect && (
                              <Modal
                                title={titleselect()}
                                showsModal={true}
                                body={
                                 
                                  <Flex className="items-center mt-10 p-4 justify-center">
                                    <Button
                                      className="w-1/3 btn-cancel text-blue-500 font-bold border-blue-500"
                                      onClick={closeplaid}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="w-1/3 btncolor font-bold ml-10"
                                      onClick={open}
                                    >
                                      OK
                                    </Button>
                                  </Flex>
                                
                                }
                              />
                            )}
                  <PaymentModal
                    showsModal={paymentselect}
                    closeModal={closepayment}
                    select={closeaccountselection}
                    user={useraccount}
                    publictoken={token}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withAuthentication(payment);
