import { useEffect, useState,useCallback } from "react";
import { Button, Label, SelectMenu } from "@components/forms";
import { ProgressSpinner } from "primereact/progressspinner";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { withAuthentication } from "@utils/route-hocs";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { InputNumber } from "primereact/inputnumber";
import { Flex } from "@components/layout";
import { Stepper } from "@components/stepper";
import { Sider } from "@components/sidebar";
import {
  ROUTE_PATHS,
  MYGA,
  ELIGIBLE_STATES,
  GUARANTEED_TERM,
  AMOUNT_INVESTING
} from "src/constants";
import { ProductModal } from "./productModal";
import {
  Url,
  products,
  updatePolicy,
  update,
  lambda,
  auxDataUrl
} from "../../../constants/apiconstant";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Tooltip } from "primereact/tooltip";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Product-Details";
const description =
  "Enables you to resend the registration activation link to your email address.";

const productDetails = () => {
  const router = useRouter();
  const { query } = router;
  const [check, setCheck] = useState(false);
  const [valueState, setValue] = useState();
  const [premium, setPremium] = useState();
  const [blur,setBlur]= useState(false);
  const [view, setshowModal] = useState(false);
  const closeModal = useCallback(() => setshowModal(false), []);
  const [validation, setValidate] = useState(false);
  const [max, setmax] = useState();
  const [min, setmin] = useState();
  const [For, setTerm] = useState();
  const [termList, setTermList] = useState();
  const [loader, setLoader] = useState(false);
  const [stateList, setStateList] = useState();
  const [state, setStates] = useState();
  const [riderSel, setRiderSel] = useState([]);
  const [show, setShow] = useState(false);
  const [perils, setremovePerils] = useState([]);
  const [quoteData, setQuotedata] = useState();
  const [options, setOptions] = useState({});
  const [val, setVal] = useState();
  const [isDefaultRider, setDefaultRider] = useState();
  const [riders, setRiders] = useState();
  const [termerror, setTermError] = useState(true);
  const [stateerror, setStateError] = useState();
  const [ridernote, setridernote] = useState();
  const [ridernote1, setridernote1] = useState();
  const [ridertopic, setriderTopic] = useState([]);

  let riderNames = [];
  const validate = e => {
    setPremium(e);
    if (e >= min && e <= max) {
      setValidate(false);
    } else {
      setValidate(true);
    }
  };

  const termcheck = e => {
    setTerm(e.target.value);
    if (e.target.value != "Select") {
      setTermError(false);
    } else {
      setTermError(true);
    }
  };

  // const statecheck = e => {
  //   setStates(e.target.value);
  //   if (e.target.value != "Select") {
  //     setStateError(false);
  //   } else {
  //     setStateError(true);
  //   }
  // };

  var riderValue = "";
  var riderTopic = [];

  async function getRiderData() {
 var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + auxDataUrl + "riderDescription", {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        data.keys.map(e => {
          riderTopic.push(e.key);
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });
    setriderTopic(riderTopic);
  }

  async function getRiderDetails(riderheading, index) {
 var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const description = await fetch(
      Url + auxDataUrl + "riderDescription/" + riderheading,
      {
        method: "GET",
        headers: {
          Authorization: auth.authorizationToken,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        return data.value;
      })

      .catch(error => {
        console.log("Error:", error);
      });
    riderValue = description;

    setridernote(description);

    setridernote1(
      riderheading
        .toUpperCase()
        .replace(/\s/g, "")
        .slice(0, 5)
    );
  }

  function riderContent(e) {
    ridertopic.map((item, index) => {
      if (
        item
          .toUpperCase()
          .replace(/\s/g, "")
          .slice(0, 5) ===
        e
          .toUpperCase()
          .replace(/\s/g, "")
          .slice(0, 5)
      ) {
        getRiderDetails(item, index);
      }
    });
  }
  async function getStatesData() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + products, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        data.map(item => {
          if (item.name === MYGA) {
            getProducts(item);
          }
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  const getProducts = item => {
    const fields = item.policyConfiguration.fields;
    const RiderData = item.policyConfiguration.exposures[0].perils;
    setRiders(RiderData);
    fields.map(o => {
      if (o.name === GUARANTEED_TERM) {
        const Term = o.values;
        Term.unshift("Select");
        setTermList(Term);
      }
      if (o.name === ELIGIBLE_STATES) {
        const State = o.values;
        State.unshift("Select");
        setStateList(State);
      }
      if (o.name === AMOUNT_INVESTING) {
        setmax(o.maximum);
        setmin(o.minimum);
      }
    });
  };
  const handleChange = (selection, name) => {
    setOptions({ ...options, [name]: selection });
  };
  async function fetchPolicyDetails() {
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
        const peril = [];
        const selectingRiders = {};
        setValue(data)
        setPremium(
          data.characteristics &&
            data.characteristics[0].fieldValues.amountInvesting[0]
        );
        setTerm(
          data.characteristics &&
            data.characteristics[0].fieldValues.guaranteedTerm[0]
        );
        setStates(
          data.characteristics &&
            data.characteristics[0].fieldValues.primaryResidenceAddressState[0]
        );
        setTermError(false);
        setStateError(false);

        data.exposures &&
          data.exposures[0].perils.map(o => {
            selectingRiders[o.name] = "True";
            peril.push(o.locator);
          });
        var keys = Object.keys(selectingRiders);
        riderSel &&
          riderSel.map(o => {
            if (!keys.includes(o.name)) {
              selectingRiders[o.name] = "False";
            }
          });
        setOptions(selectingRiders);
        setremovePerils(peril);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getStatesData();
    const pageId = query && parseInt(query.id);
    if (pageId) {
      setId(pageId);
    }
    setCheck(query.check);
    getRiderData();
    fetchPolicyDetails();
  }, []);
  useEffect(() => {
    fetchPolicyDetails();
  }, [riderSel]);
  useEffect(() => {
    setLoader(true);
    postDataDisplay();
  }, [options]);
  useEffect(() => {
    setLoader(true);
    postDataDisplay();
  }, [blur, For, state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  async function postDataDisplay() {
  var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const body = {
      operation: "quoteAccount",
      payload: {
        guaranteedTerm: For,
        premium: premium,
        riders: options
      }
    };

    fetch(Url + lambda, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.authorizationToken}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        if(For&&data.payload.projectedValue==="NaN"){
            setLoader(false);
 setshowModal(true);  
        }
        else{
          data = { ...data, For, premium };
        setQuotedata(data);
        setLoader(false);
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }
  const quoteParmeters = { amount: premium, term: For, state: state };
  const saveData = async () => {
    sessionStorage.setItem("quoteParmeters", JSON.stringify(quoteParmeters));
    let locator = sessionStorage.getItem("policyLocator");
    let exposureLocator = sessionStorage.getItem("AL");
    let value = Object.entries(options);
    var selectedRider = [];
    if (perils.length < 1) {
      selectedRider.push({ name: "marketValueAdjustment" });
    }
    value.map(o => {
      if (o[1] === "True") {
        selectedRider.push({ name: o[0] });
      }
    });
    var data = {
      fieldValues: {
        issueState: valueState&&valueState.characteristics[0].fieldValues.primaryResidenceAddressState?
                    valueState&&valueState.characteristics[0].fieldValues.primaryResidenceAddressState[0]:
                  valueState&&valueState.characteristics[0].fieldValues.trustAddressState?
                  valueState&&valueState.characteristics[0].fieldValues.trustAddressState[0]:"",
        amountInvesting: premium,
        guaranteedTerm: For,
        guaranteedRate: quoteData?.payload.interestRate
                        ? quoteData.payload.interestRate
                        : ""
      },
      updateExposures: {
        exposureLocator: exposureLocator,
        removePerils: perils,
        addPerils: selectedRider
      }
    };
   var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + updatePolicy + locator + update, {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        response.json();
      })

      .catch(errors => {
        console.log("Error:", errors);
      });

    pagestatus(auth, locator);
  };

  // Pagestatus Call---
  
  async function pagestatus(auth, locator) {
    const status = {
      auxData: {
        key: "Product",
        value: "Complete"
      }
    };

    await fetch(Url + auxDataUrl + locator, {
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

    window.location.href = "/application/suitability-check";
  }

  const getDefaultRider = () => {
    if (riders?.length > 0) {
      riders?.map(item => {
        if (item.fields.length > 0) {
          if (item.fields[0].name === "isDefaultRider") {
            setDefaultRider(true);
            setVal(item.displayName);
          }
        } else {
          const defRid={}
          setRiderSel(
            riders.filter(item => item.fields[0]?.name !== "isDefaultRider")
          );
          riders.filter(item => item.fields[0]?.name !== "isDefaultRider").map(o=>{
                 defRid[o.name]= "False"
          })
          setOptions(defRid );
        }
      });
    }
  };

  useEffect(() => {
    getDefaultRider();
  }, [riders]);
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
        <Stepper check={check} percent={33} index={2} />
      </div>
      {loader && (
        <div className={"block fixed inset-0 z-30 transition-opacity"}>
          <div className="absolute inset-0 bg-gray-500 opacity-75" />

          <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />
        </div>
      )}
      {/* <Tooltip target=".pi pi-info-circle" mouseTrack mouseTrackLeft={10} /> */}
      <Flex className="flex-col md:ml-56">
        <Flex className="flex justify-items-start mb-2 sm:mb-5 mt-4 sm:mt-1 ml-5 sm:ml-2">
          <p className="h-suitability font-bold text-lg md:text-xl">
            Product Details
          </p>
        </Flex>
        <Flex className="flex-col mb-5">
          <div
            className="blue-bg"
            //style={{ borderTopRightRadius: "8px", borderTopLeftRadius: "8px" }}
          >
            <p className="m-2 ml-5 sm:ml-4 text-base">
              Step 1. Amount you want to invest
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 product-step md:border-gray-200 pl-1 sm:pl-4">
            <div className="m-4 mb-0 sm:mb-4 text-base flex flex-col">
              <Label className="text-sm font-semibold" htmlFor="Amount">
                Amount Investing*
              </Label>
              <InputNumber
                inputClassName={validation ? "productamount" : "amount"}
                value={premium}
                maxFracionDigits={2}
                required
                onChange={e => validate(e.value)}
                mode="currency"
                onBlur={()=>setBlur(true)}
                currency="USD"
                locale="en-US"
              />
              {min && max && (
                <span className="text-gray-600 text-900 font-medium text-sm">
                  {"$" + min + "-" + "$" + max}{" "}
                  {validation && (
                    <span className="text-red-400 text-900 font-base text-md">
                      Enter a valid amount
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="m-4 mb-0 sm:mb-4 text-base">
              <div>
                <Label
                  className="pt-2 pb-1 text-sm font-semibold"
                  htmlFor="country"
                >
                  Term*
                </Label>
              </div>
              <div className="pb-0 md:pb-6">
                <SelectMenu
                  className="amount"
                  id="For"
                  name="For"
                  value={For}
                  onChange={termcheck}
                >
                  {termList &&
                    termList.map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                </SelectMenu>
              </div>
            </div>
            <div className="m-4 text-base">
              <div>
                <Label
                  className=" pt-2 pb-1 text-sm font-semibold"
                  htmlFor="country"
                >
                  State*
                </Label>
              </div>
              <InputText
               className="amount"
                  type="text"
                  id="state"
                  name="state"
                  disabled
                  value={valueState&&valueState.characteristics[0].fieldValues.primaryResidenceAddressState?
                    valueState&&valueState.characteristics[0].fieldValues.primaryResidenceAddressState[0]:
                  valueState&&valueState.characteristics[0].fieldValues.trustAddressState?
                  valueState&&valueState.characteristics[0].fieldValues.trustAddressState[0]:""}
          />
              <div></div>
            </div>
          </div>
        </Flex>
        <Flex className="flex-col mb-5">
          <div className="blue-bg">
            <p className="m-2 ml-5 sm:ml-4 text-base">
              Step 2. Choose Rider{" "}
              <span className="font-normal text-base">
                {" "}
                (Interest rate may vary depending on the Riders chosen)
              </span>
            </p>
          </div>
          <div style={{ border: "1px solid #dee2e6" }}>
            <div
              className="border-b-2 border-gray-200"
              // style={{ border: "1px solid #707070" }}
            >
              <div>
                <div className="flex flex-col m-4 md:flex-row md:space-x-72">
                  <div
                    className="m-2 w-full"
                    onMouseOver={() => riderContent(val)}
                    // onMouseEnter={() => riderContent( val)}
                    onClick={() => riderContent(val)}
                  >
                    {isDefaultRider && (
                      <label className="m-2 text-base text-black-700">
                        {val} <Tooltip target=".disabled-button" />{" "}
                        <span
                          className="disabled-button mr-2 w-screen"
                          // data-pr-tooltip={ridernote}
                          data-pr-tooltip={
                            ridernote1 ===
                            val
                              .toUpperCase()
                              .replace(/\s/g, "")
                              .slice(0, 5)
                              ? ridernote
                              : ""
                          }
                        >
                          <i
                            className="pi  pi-info-circle"
                            style={{
                              fontSize: "15px",
                              marginBottom: "5px",
                              marginLeft: "5px"
                            }}
                          ></i>
                        </span>
                      </label>
                    )}
                  </div>
                  <div
                    className="flex flex-row sm:flex-col  space-x-5 sm:space-y-3 md:flex-row pl-4 md:pl-40 justify-start md:justify-end md:space-x-3 md:space-y-0"
                    style={{ opacity: "40%" }}
                  >
                    <div className="flex p-field-radiobutton radio-border rounded-md w-24 h-9">
                      <RadioButton
                        disabled={true}
                        inputId="yes"
                        name="radioInput1"
                        value="Yes"
                        checked="Yes"
                      />
                      <label htmlFor="Yes" className="px-2">
                        Yes
                      </label>
                    </div>
                    <div className="flex  p-field-radiobutton radio-border rounded-md w-24 h-9">
                      <RadioButton
                        disabled={true}
                        inputId="no"
                        name="radioInput1"
                        value="No"
                      />
                      <label htmlFor="No" className="px-1">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {riderSel?.map(item => {
              return (
                <div
                  className="border-b-2 border-gray-200"

                  // style={{ border: "1px solid #707070" }}
                >
                  <div className="flex flex-col m-4 md:flex-row md:space-x-84">
                    <div
                      className="m-2 w-full"
                      onMouseOver={() => riderContent(item.name)}
                      // onMouseEnter={() => riderContent( item.displayName)}
                      onClick={() => riderContent(item.name)}
                    >
                      <label className="m-2 text-base text-black-700">
                        {item.displayName} <Tooltip target=".disabled-button" />{" "}
                        <span
                          className="disabled-button mr-2 w-screen"
                          // data-pr-tooltip={ridernote}
                          data-pr-tooltip={
                            ridernote1 ===
                            item.name
                              .toUpperCase()
                              .replace(/\s/g, "")
                              .slice(0, 5)
                              ? ridernote
                              : ""
                          }
                        >
                          <i
                            className="pi  pi-info-circle"
                            onClick={() => riderContent(item.displayName)}
                            type="button"
                            tooltip="Click to proceed"
                            tooltipOptions={{ mouseTrack: true }}
                            style={{
                              fontSize: "15px",
                              marginBottom: "5px",
                              marginLeft: "5px"
                            }}
                          ></i>
                        </span>
                      </label>
                    </div>
                    <div className="flex flex-row sm:flex-col space-x-5 sm:space-y-3 md:flex-row pl-4 md:pl-40 justify-start md:justify-end md:space-x-3 md:space-y-0">
                      <div
                        onClick={() => handleChange("True", item.name)}
                        className="flex p-field-radiobutton radio-border rounded-md w-24 h-9"
                      >
                        <RadioButton
                          inputId={item.name}
                          name="radioInput1"
                          value="True"
                          onChange={e => handleChange("True", item.name)}
                          checked={options[item.name] === "True"}
                        />
                        <label htmlFor="True" className="px-2">
                          Yes
                        </label>
                      </div>
                      <div
                        onClick={() => handleChange("False", item.name)}
                        className="flex p-field-radiobutton radio-border rounded-md w-24 h-9"
                      >
                        <RadioButton
                          inputId={item.name}
                          name="radioInput1"
                          value="False"
                          onChange={e => handleChange("False", item.name)}
                          checked={options[item.name] === "False"}
                        />
                        <label htmlFor="False" className="px-1">
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Flex>

        <Flex className="flex flex-col border-gray-200">
          <div
            className="blue-bg"
            // style={{ borderTopRightRadius: "8px", borderTopLeftRadius: "8px" }}
          >
            <p className="m-2 ml-5 sm:ml-4 text-base">Your Guaranteed Growth</p>
          </div>
          <div>
            <div className="flex flex-col  product-step md:flex-row pl-2 sm:pl-3">
              <div className="flex flex-col ml-4 p-2 ">
                <div className="flex">
                  <label className="text-base font-bold">
                    Guaranteed Interest Rate:
                  </label>
                </div>
                <div className="flex">
                  <InputNumber
                    inputClassName={
                      " font-bold text-lg  pl-0 interestRate ir-op ml-2"
                    }
                    inputStyle={{ border: "none" }}
                    value={
                      quoteData?.payload.interestRate
                        ? quoteData.payload.interestRate
                        : ""
                    }
                    disabled
                    suffix="%"
                    placeholder="Guaranteed Rate (%) "
                  />
                </div>
              </div>
              <div className="ml-4 md:ml-24 p-2">
                <div className="">
                  <label className="text-base font-bold">
                    Guaranteed Amount Value:
                  </label>
                </div>
                <InputNumber
                  inputClassName={" interestRate ir-op text-lg  pl-0 font-bold"}
                  value={
                    quoteData
                      ? quoteData.payload.projectedValue === "NaN"
                        ? "0"
                        : quoteData.payload.projectedValue
                      : ""
                  }
                  disabled
                  inputStyle={{ border: 0 }}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  placeholder="Guaranteed Amount "
                />
              </div>
            </div>
          </div>
        </Flex>

        <Flex className="borderTop flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-between     mt-5 mb-5 h-15 pt-5 sm:pt-0">
          <Link className="w-1/3" href={ROUTE_PATHS.BENEFICIARY}>
            <Button className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm  w-5/6 my-5 mt-5 sm:mt-8  sm:ml-0 sm:w-1/6">
              Back
            </Button>
          </Link>

          <Button
            type="submit"
            onClick={saveData}
            disabled={
              validation || termerror || stateerror || quoteData === undefined
            }
            // className=" btncolor h-10 font-bold py-2 px-4 rounded-r w-2/6 sm:w-1/3"
            //className=" p-2 btncolor font-bold rounded-sm text-white-500 w-2/3"
            className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
          >
            Save & Continue
          </Button>
            {view && (
                    <ProductModal showsModal={true} closeModal={closeModal} />
                  )}
        </Flex>
      </Flex>
    </>
  );
};

export default withAuthentication(productDetails);