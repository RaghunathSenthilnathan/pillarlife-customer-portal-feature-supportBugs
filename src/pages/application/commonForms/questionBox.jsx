import { useEffect, useState } from "react";
import { Button } from "@components/forms";
import { ProgressSpinner } from "primereact/progressspinner";
import { RadioButton } from "primereact/radiobutton";
import { NextSeo } from "next-seo";
import Link from "next/link";
import router from "next/router";
import { Flex } from "@components/layout";
import { Modal } from "@components/modal";
import { ROUTE_PATHS } from "src/constants";
import {
  Url,
  lambda,
  updatePolicy,
  update,
  auxDataUrl,
} from "../../../constants/apiconstant";
import * as FileSaver from "file-saver";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Suitability Check";
const description =
  "Enables you to resend the registration activation link to your email address.";

const questionBox = (value) => {
  const [val, setValue] = useState();
  const [state, setState] = useState();
  const [loader, setLoader] = useState(false);
  const [mvaFlag, setMvaFlag] = useState(false);
  const [disable, setDisable] = useState(true);
  const [options, setOptions] = useState({});
  const [loop, setLoop] = useState([]);
  const [FGlocator, setFGLocator] = useState();
  const [isFieldGroupLocator, setIsFieldGroupLocator] = useState();

  var FG;
  const handleChange = (selection, name) => {
    if (options["suitabilityQuestion1"] === "No") {
      delete options["suitabilityQuestion2"];
    }
    if (name === "suitabilityQuestion5" && selection === "No") {
      setMvaFlag(true);
    }

    setOptions({ ...options, [name]: selection });
  };

  const handleClick = () => {
    setMvaFlag(false);
  };
  async function sendQuestions() {
    setLoader(true);
    if (options["suitabilityQuestion1"] === "No") {
      delete options["suitabilityQuestion2"];
    }
    let locator = sessionStorage.getItem("policyLocator");
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    var addData = {
      addFieldGroups: [
        {
          fieldName: "suitabilityQuestions",
          fieldValues: options,
        },
      ],
    };
    var updateData = {
      updateFieldGroups: [
        {
          fieldGroupLocator: FGlocator,
          fieldName: "suitabilityQuestions",
          fieldValues: options,
        },
      ],
    };

    await fetch(Url + updatePolicy + locator + update, {
      method: "POST",
      headers: {
        Authorization: send.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(isFieldGroupLocator ? updateData : addData),
    })
      .then((response) => response.json())
      .then((data) => {
        validateQuestion(locator);
      })
      .catch((errors) => {
        console.log("Error:", errors);
      });
  }
  async function validateQuestion(pl) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const body = {
      operation: "suitabilityCheck",
      payload: {
        locator: pl,
      },
    };

    const status = {
      auxData: {
        key: "stepper",
        value: "true,false,false,true,true,false,false,false,false",
      },
    };
    const status1 = {
      auxData: {
        key: "stepper",
        value: "true,false,false,true,true,true,false,false,false",
      },
    };

    fetch(Url + lambda, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.authorizationToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoader(false);
        if (data.payload.decision === "REJECTED") {
          fetchPolicyDetails();
          value.setModal(true);
          setIsFieldGroupLocator(true);
          pagestatus(auth, pl, status);
          localStorage.setItem("suitability_show", "true");
        }
        if (data.payload.decision === "ACCEPTED") {
          pagestatus1(auth, pl, status1);
          localStorage.setItem("suitability_show", "false");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function pagestatus1(auth, locator, status) {
    const pl = sessionStorage.getItem("policyLocator");

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

    router.push("/application/premium");
  }

  async function pagestatus(auth, locator, status) {
    const pl = sessionStorage.getItem("policyLocator");

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
          data.characteristics[data.characteristics.length - 1].fieldValues
            .issueState[0]
        );
        FG =
          data.characteristics[data.characteristics.length - 1].fieldValues
            .suitabilityQuestions[0];
        setFGLocator(FG);
        FG.length > 0
          ? setIsFieldGroupLocator(true)
          : setIsFieldGroupLocator(false);
        const peril = [];
        const selectingqstn = {};

        const suitable = Object.values(
          data.characteristics &&
            data.characteristics[data.characteristics.length - 1]
              .fieldGroupsByLocator
        )[0];
        for (const [key, values] of Object.entries(suitable)) {
          selectingqstn[key] = values[0];
        }
        setOptions(selectingqstn);
        if (selectingqstn) {
          setDisable(false);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  useEffect(() => {
    setValue(value.result);
  }, [value]);
  useEffect(() => {
    fetchPolicyDetails();
  }, []);

  const validation = () => {
    let key = Object.keys(options).length;
    if (options["suitabilityQuestion1"] === "Yes" && key === 7) {
      return false;
    } else if (options["suitabilityQuestion1"] === "No") {
      if (Object.keys(options).includes("suitabilityQuestion2") && key === 7) {
        return false;
      } else if (
        !Object.keys(options).includes("suitabilityQuestion2") &&
        key === 6
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (val?.length > 0) {
      if (options["suitabilityQuestion1"] === "Yes") {
        setLoop([...val]);
      } else if (options["suitabilityQuestion1"] === "No") {
        setLoop(val.filter((item) => item.name !== "suitabilityQuestion2"));
      } else {
        setLoop([val[0]]);
      }
    }
  }, [val, options]);

  const handletitle = (item) => {
    if (item.title.includes("Buyer’s Guide")) {
      return (
        <p className="text-base md:text-lg">
          The applicant has received{" "}
          <span onClick={() => handleDownload()} className="download">The Buyer’s Guide</span>{" "}
          to Deferred Annuities. (Note: Included with this application packet.)
        </p>
      );
    }
    if (item.title.includes("state replacement notice")) {
      return (
        <p className="text-base md:text-lg">
          The contract applied for will replace an existing life insurance
          policy or annuity contract. If yes, please complete the applicable  {" "}
          <span onClick={() => handleDownloadState()} className="download">
          
            state replacement notice
          </span>{" "}
          and submit it with this application
        </p>
      );
    } 
    if(item.title.includes("product disclosure")){
      return (
        <p className="text-base md:text-lg">
        The signatories to this application have read through the applicable{" "}<span onClick={() => handleDownloadProduct()} className="download">product disclosure.</span>{" "}The applicant understands the various product features, including but not limited to: (a) surrenders and withdrawals; (b) surrender charges and surrender charge period(s); (c) early withdrawal tax penalty; and (d) annuitization.As signed product disclosure
is enclosed with this application.
        </p>
      );
    }
    else {
      return <p className="text-base md:text-lg">{item.title}</p>;
    }
  };
  async function handleDownloadState() {
    const stateValue = "stateReplacement" + state;
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + auxDataUrl + "staticDocumentLocation/" + stateValue, {
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
    async function   handleDownloadProduct() {
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + auxDataUrl + "staticDocumentLocation/" + "MYGADisclosure", {
      method: "GET",

      headers: {
        Authorization: send.authorizationToken,
        "Content-Type": "application/xml",
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

  async function handleDownload() {
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(
      Url + auxDataUrl + "staticDocumentLocation/deferredAnnuityBuyersGuide",
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
        // window.open(data.value, "1035Form");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  function download(fileUrl, fileName) {
    var a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.click();
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
      {loader && (
        <div className={"block fixed inset-0 z-30 transition-opacity"}>
          <div className="absolute inset-0 bg-gray-500 opacity-75" />

          <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />
        </div>
      )}
      {loop?.map((item) => {
        return (
          <div className=" boxes md:box-left-right md:mb-3">
            <div className="flex flex-col   md:flex md:flex-row ">
              <div className="font-medium p-4 w-full md:w-3/4">
                <p className="text-base md:text-lg">{handletitle(item)}</p>
              </div>

              <div>
                <div className="flex ml-6  pb-2 md:flex-row space-x-3 md:ml-20 md:m-4 md:justify-items-end md:space-x-3">
                  <div
                    onClick={() => handleChange("Yes", item.name)}
                    className="flex p-field-radiobutton radio-border items-center rounded-md w-24 h-9"
                  >
                    <RadioButton
                      inputId={item.name}
                      name="radioInput1"
                      value="Yes"
                      onChange={(e) => handleChange("Yes", item.name)}
                      checked={options[item.name] === "Yes"}
                    />

                    <label htmlFor="Yes" className="px-2">
                      Yes
                    </label>
                  </div>
                  <div
                    onClick={() => handleChange("No", item.name)}
                    className="flex p-field-radiobutton radio-border items-center rounded-md w-24 h-9"
                  >
                    <RadioButton
                      inputId={item.name}
                      name="radioInput1"
                      value="No"
                      onChange={(e) => handleChange("No", item.name)}
                      checked={options[item.name] === "No"}
                    />
                    <label htmlFor="No" className="px-2">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {mvaFlag && (
              <Modal
                showsModal={true}
                body={
                  <div>
                    <div className="text-left text-gray-500 px-6">
                      You checked no for your understanding of the market value
                      adjustment feature. All of our policies have a market
                      value adjustment. If you need further information on this
                      please go back to the product details page for a written
                      explanation or contact customer service
                    </div>
                    <Flex className="items-center justify-center">
                      <Button
                        className="w-2/6 bg-linkcolor"
                        onClick={handleClick}
                      >
                        OK
                      </Button>
                    </Flex>
                  </div>
                }
              />
            )}
          </div>
        );
      })}

      <Flex className="border1 flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-between     mt-5 mb-5 h-15 pt-5 sm:pt-0">
        <Link className="w-1/3" href={ROUTE_PATHS.PRODUCT_DETAILS}>
          <Button
            type="submit"
            className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm  w-5/6 my-5 mt-5 sm:mt-8  sm:ml-0 sm:w-1/6"
          >
            Back
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={validation()}
          onClick={sendQuestions}
          className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
        >
          Save & Continue
        </Button>
      </Flex>
    </>
  );
};
export default questionBox;
