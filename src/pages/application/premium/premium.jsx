import { useEffect, useState } from "react";
import { Button } from "@components/forms";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { Stepper } from "@components/stepper";
import { InputNumber } from "primereact/inputnumber";
import { useMediaQuery } from "react-responsive";
import { Flex } from "@components/layout";
import { Sider } from "@components/sidebar";
import { withAuthentication } from "@utils/route-hocs";
import { ROUTE_PATHS } from "src/constants";
import * as FileSaver from "file-saver";
import {
  Url,
  updatePolicy,
  update,
  auxDataUrl,
} from "../../../constants/apiconstant";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Premium";
const description =
  "Enables you to resend the registration activation link to your email address.";

const premium = () => {
  const [account, setAccount] = useState();
  const [exchange, setExchange] = useState();
  const [premium, setPremium] = useState();
  const [state, setState] = useState();
  const [disableFlag, setDisableFlag] = useState();
  const [paymentModeACH, setPaymentModeACH] = useState(false);
  const [paymentMode1035, setPaymentMode1035] = useState(false);
  const [paymentModeBoth, setPaymentModeBoth] = useState(false);
  const [dataACH, setDataACH] = useState();
  const [data1035, setData1035] = useState();
  const [ACHLocator, setACHLocator] = useState();
  const [locator1035, set1035Locator] = useState();
  const [isExpLocator, setIsExpLocator] = useState(false);
  const [exposureLocator, setExposureLocator] = useState();
  const [type, setType] = useState();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const { query } = router;

  var body = {};
  var addExp = {};
  var addExpBoth = {};
  var updateExp = {};
  var updateExpBoth = {};
  var paymentExpLocator = [];
  var isBothModes = false;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });
  useEffect(() => {
    fetchPolicyDetails();
  }, []);

  const validateAmount = () => {
    if (account && exchange) {
      var sum = parseFloat(account) + parseFloat(exchange);
      isBothModes = true;
      if (premium == sum) {
        setError(false);

        updatePolicyPayment(account, exchange);
      } else if (premium != sum) {
        setError(true);
        setMsg("Please enter a value that equals the amount you are investing");
      }
    } else if (exchange) {
      setPaymentMode1035(true);
      if (premium == parseFloat(exchange)) {
        setError(false);
        updatePolicyPayment(account, exchange);
      } else {
        setError(true);
        setMsg("Please enter a value that equals the amount you are investing");
      }
    } else if (account) {
      setPaymentModeACH(true);
      if (premium == account) {
        setError(false);
        updatePolicyPayment(account, exchange);
      } else {
        setError(true);
        setMsg("Please enter a value that equals the amount you are investing");
      }
    }
  };

  async function fetchPolicyDetails() {
    const pl = sessionStorage.getItem("policyLocator");

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
      .then((data) => {
        setState(
          data.characteristics[0].fieldValues.issueState &&
            data.characteristics[0].fieldValues.issueState[0]
        );
        if (data.characteristics[0].fieldValues.amountInvesting[0] != "") {
          const suitable = Object.values(
            data.characteristics && data.characteristics[0].fieldGroupsByLocator
          )[0];

          if (suitable.suitabilityQuestion1[0] === "No") {
            setDisableFlag(true);
          }
          setPremium(data.characteristics[0].fieldValues.amountInvesting[0]);
          setDataACH(data.characteristics[0].fieldValues.achAmount[0]);
          setAccount(data.characteristics[0].fieldValues.achAmount[0]);
          setData1035(data.characteristics[0].fieldValues["1035Amount"][0]);
          setExchange(data.characteristics[0].fieldValues["1035Amount"][0]);
        } else {
          let quote = sessionStorage.getItem("quoteParmeters");
          quote = JSON.parse(quote);
          setPremium(quote.amount);
        }
        data &&
          data.exposures.map((o) => {
            if (
              o.name === "Payment" &&
              o.characteristics[0].fieldValues.paymentType[0] === "ACH"
            ) {
              setDataACH(o.characteristics[0].fieldValues.paymentAmount[0]);
              setAccount(o.characteristics[0].fieldValues.paymentAmount[0]);
              setACHLocator(o.characteristics[0].exposureLocator);
            }
          });
        data &&
          data.exposures.map((o) => {
            if (
              o.name === "Payment" &&
              o.characteristics[0].fieldValues.paymentType[0] === "1035"
            ) {
              setData1035(o.characteristics[0].fieldValues.paymentAmount[0]);
              setExchange(o.characteristics[0].fieldValues.paymentAmount[0]);
              set1035Locator(o.characteristics[0].exposureLocator);
            }
          });
        data &&
          data.exposures.map((item) => {
            if (item.name === "Payment") {
              paymentExpLocator.push(item.locator);
              if (paymentExpLocator.length === 1)
                setExposureLocator(paymentExpLocator);
            }
            paymentExpLocator.length > 0
              ? setIsExpLocator(true)
              : setIsExpLocator(false);
          });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function updatePolicyPayment(acc, exch) {
    let locator = sessionStorage.getItem("policyLocator");

    addExp = {
      addExposures: [
        {
          exposureName: "Payment",
          fieldValues: {
            paymentType: "ACH",
            paymentAmount: acc === null || acc === "" ? 0 : acc,
            paymentStatus: "Pending",
          },
        },
        {
          exposureName: "Payment",
          fieldValues: {
            paymentType: "1035",
            paymentAmount: exch === null || exch === "" ? 0 : exch,
            paymentStatus: "Processed",
          },
        },
      ],
    };

    updateExp = {
      updateExposures: [
        {
          exposureLocator: ACHLocator,
          fieldValues: {
            paymentType: "ACH",
            paymentAmount: acc === null || acc === "" ? 0 : acc,
            paymentStatus: "Processed",
          },
        },
        {
          exposureLocator: locator1035,
          fieldValues: {
            paymentType: "1035",
            paymentAmount: exch === null || exch === "" ? 0 : exch,
            paymentStatus: "Processed",
          },
        },
      ],
    };
    if (isExpLocator === true) {
      if (isBothModes === true) {
        body = updateExp;
      } else if (isBothModes === false) {
        body = updateExp;
      }
    } else if (isExpLocator === false) {
      if (isBothModes === true) {
        body = addExp;
      } else if (isBothModes === false) {
        body = addExp;
      }
    }
    const paymentbody = {
      fieldValues: {
        achAmount: acc === null || acc === "" ? 0 : acc,
        "1035Amount": exch === null || exch === "" ? 0 : exch,
      },
    };
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + updatePolicy + locator + update, {
      method: "POST",
      headers: {
        Authorization: send.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(paymentbody),
    })
      .then((response) => response.json())
      .then((data) => {
        pagestatus(send, locator);
        pagestatus1(send, locator);
      })

      .catch((errors) => {
        console.log("Error:", errors);
      });
  }

  async function pagestatus(auth, locator) {
    const pl = sessionStorage.getItem("policyLocator");

    const status = {
      auxData: {
        key: "stepper",
        value: "true,false,false,true,true,true,true,false,false",
      },
    };
    await fetch(Url + auxDataUrl + locator, {
      method: "PUT",
      body: JSON.stringify(status),

      headers: {
        Authorization: auth.authorizationToken,

        "Content-Type": "application/json",

        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function pagestatus1(auth, locator) {
    const pl = sessionStorage.getItem("policyLocator");

    const status = {
      auxData: {
        key: "stepper",
        value: "true,false,false,true,true,true,true,true,false",
      },
    };

    await fetch(Url + auxDataUrl + locator, {
      method: "PUT",
      body: JSON.stringify(status),

      headers: {
        Authorization: auth.authorizationToken,

        "Content-Type": "application/json",

        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log("Error:", error);
      });

    router.push(ROUTE_PATHS.REVIEW);
  }
  async function handleDownloadForm() {
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(
      Url + auxDataUrl + "staticDocumentLocation/1035WithdrawalForm",
      {
        method: "GET",

        headers: {
          Authorization: send.authorizationToken,
          "Content-Type": "application/json",

          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        FileSaver.saveAs(data.value);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function handleDownloadInstruction() {
    const stateValue = "stateReplacement" + state;
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + auxDataUrl + "/staticDocumentLocation/" + stateValue, {
      method: "GET",

      headers: {
        Authorization: send.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        FileSaver.saveAs(data.value);
      })
      .catch((error) => {
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
          description,
        }}
      />
      <div>
        <Sider />
        <Stepper percent={66} index={4} />
      </div>
      <div className=" md:ml-56">
        <div className="Flex flex-col justify-items-start m-4 ml-4 sm:ml-0">
          <p className="h-suitability font-bold text-lg md:text-xl pb-2">
            Premium
          </p>
          <p className="font-bold text-base md:text-lg">
            How are you going to pay?
          </p>
        </div>
        <div className="md: border md:border-gray-500 mb-2">
          <div className="bg-fill h-14">
            <div className="flex flex-row">
              <div className="w-full sm:w-5/6">
                <div className=" py-4 pl-4 md:p-4 ">
                  <p className="font-medium text-icon">
                    Amount you are investing
                  </p>
                </div>
              </div>
              <div className=" ml-2 sm:ml-20 pl-0 sm:pl-12 p-2 font-bold text-lg w-2/5 sm:w-2/5">
                <InputNumber
                  inputClassName={"font-bold premium ml-0 sm:ml-3 opacity-100"}
                  value={premium}
                  // mode="decimal"
                  minFractionDigits={2}
                  maxFractionDigits={2}
                  disabled
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="p-4 border-b-2 border-gray-300">
              <p className="text-sm font-bold">
                Enter the values you wish to pay using the following mode(s) for
                premium payment.
              </p>
            </div>
            <div className="flex flex-row p-4 border-b-2 border-gray-300">
              <div className="w-3/4 ">
                <label htmlFor="bank" className="text-sm font-semibold ">
                  From your bank account
                </label>
              </div>
              <div>
                <InputNumber
                  id="account"
                  inputClassName={" money p-4"}
                  value={dataACH && dataACH != undefined ? dataACH : account}
                  // value={dataACH && dataACH }
                  onValueChange={(e) => {
                    setAccount(e.value);
                    setType("ACH");
                    // setError(false);
                  }}
                  // mode="decimal"
                  minFractionDigits={2}
                  maxFractionDigits={2}
                  min={0}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  placeholder="$"
                />
              </div>
            </div>

            {!disableFlag && (
              <div className="flex flex-row p-4">
                <div className="flex flex-col w-3/4 ">
                  <label className="text-sm font-semibold">1035 Exchange</label>
                  {!isTabletOrMobile && (
                    <div className="flex flex-col">
                      <label
                        className="sm:w-1/4 text-sm font-semibold download"
                        onClick={() => handleDownloadForm()}
                      >
                        Download 1035 Instructions and Form here
                      </label>
                      <label
                        className="sm:w-1/4 text-sm font-semibold download"
                        onClick={() => handleDownloadInstruction()}
                      >
                        State replacement notice
                      </label>
                    </div>
                  )}
                </div>

                <InputNumber
                  id="exchange"
                  inputClassName={" money p-4"}
                  value={
                    data1035 && data1035 != undefined ? data1035 : exchange
                  }
                  // value={data1035 && data1035 }
                  onValueChange={(e) => {
                    setExchange(e.value);
                    setType("1035");
                    // setError(false);
                  }}
                  disabled={disableFlag}
                  // mode="decimal"
                  minFractionDigits={2}
                  maxFractionDigits={2}
                  min={0}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  placeholder="$"
                />
              </div>
            )}
          </div>
          {isTabletOrMobile && !disableFlag && (
            <div className="flex flex-col p-4 w-3/4 ">
              <label
                className="sm:w-1/4 text-sm font-semibold download"
                onClick={() => handleDownloadForm()}
              >
                Download 1035 Instructions and Form here
              </label>
              <label
                className="sm:w-1/4 text-sm font-semibold download"
                onClick={() => handleDownloadInstruction()}
              >
                State replacement notice
              </label>
            </div>
          )}
          <div></div>
        </div>
        {error && (
          <p className="text-base font-medium text-red-500 px-4 sm:p-0">
            {msg}
          </p>
        )}

        <Flex className="border1 flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-between     mt-5 mb-5 h-15 pt-5 sm:pt-0">
          <Link className="w-1/3" href={ROUTE_PATHS.SUITABILITY_CHECK}>
            <Button
              type="submit"
              className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm  w-5/6 my-5 mt-5 sm:mt-8  sm:ml-0 sm:w-1/6"
            >
              Back
            </Button>
          </Link>

          <Button
            type="submit"
            onClick={validateAmount}
            className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
          >
            Save & Continue
          </Button>
        </Flex>
        {/* </Card> */}
      </div>
    </>
  );
};

export default withAuthentication(premium);
