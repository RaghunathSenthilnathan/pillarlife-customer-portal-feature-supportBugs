import { useEffect, useState, useCallback, useRef } from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { NextSeo } from "next-seo";
import { NextLink } from "@components/next-link";
import { useRouter } from "next/router";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { Modal } from "@components/modal";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { Flex, Container, Grid } from "@components/layout";
import { Sider } from "@components/sidebar";
import { Dropdown } from "primereact/dropdown";
import { useMediaQuery } from "react-responsive";
import { withAnonymous, withAuthentication } from "@utils/route-hocs";
import { WithdrawModal } from "./withdrawModal";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { Button, Input, Label } from "@components/forms";
import { RadioButton } from "primereact/radiobutton";
import { ModalPopUp } from "../modalpopup";
import * as FileSaver from "file-saver";
import { Withdrawal1035modal } from "../withdrawal1035modal";
import {
  Url,
  authUrl,
  authOptions,
  auxMin,
  auxMinpolicy,
  updatePolicy,
  products,
  lambda,
  auxDataUrl,
} from "../../../../constants/apiconstant";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputNumber } from "primereact/inputnumber";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.WITHDRAW_MONEY}`;
const title = "Withdraw Money";
const description = "Enables you to withdraw money";

const withdrawmoney = () => {
  const router = useRouter();
  const { query } = router;
  const [selectedRider, setSelectedCity1] = useState("");
  const [polValue, setPolvalue] = useState();
  const [loader, setLoader] = useState(true);
  const [ridersFromProducts, setRidersFromProducts] = useState();
  const [inputValue, setInputValue] = useState("");
  const [results, setResponse] = useState();
  const [msg, setMsg] = useState();
  const [quoteData, setQuotedata] = useState();
  const [min, setMinValue] = useState();
  const [fedTaxPercent, setFedTaxPercent] = useState();
  const [stateTaxPercent, setStateTaxPercent] = useState();
  const [validation, setValidate] = useState(false);
  const [minPolicy, setMinPolicyValue] = useState();
  const [riders, setRiders] = useState();
  const [link, setLink] = useState("");
  const [val, setValue] = useState(false);
  const [fdnw, setFeddnwValue] = useState(false);
  const [fwh, setFedwhValue] = useState(false);
  const [sdnw, setStatednwValue] = useState(false);
  const [swh, setStatewhValue] = useState(false);
  const [val2, setValue2] = useState(false);
  const [val3, setValue3] = useState(false);
  const [checkopen, setcheckopen] = useState(false);
  const [show, setshowModal] = useState(false);
  const closeWithdrawal1035 = useCallback(() => setShowWithdrawal1035(false));
  const [showwithdrawal1035, setShowWithdrawal1035] = useState(false);
  const quantityInputRef = useRef(null);

  useEffect(() => {
    const ignoreScroll = (e) => {
      e.preventDefault();
    };

    quantityInputRef.current &&
      quantityInputRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputRef]);
  let closecheck = useCallback(() => {
    setcheckopen(false);
    // window.location.href = "/dashboard";
  }, []);
  const closeModal = useCallback(() => {
    setshowModal(false);
    setLoader(true);
  }, []);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });

  const items = [
    { label: "My Policies", icon: "pi pi-home", url: "/dashboard/my-policies" },
    { label: "Active Policies", url: "/dashboard/my-policies?index=0" },
    {
      label: `Policy No.${query.id}`,
      url: `/dashboard/my-policies/updatebeneficiary?id=${query.id}`,
    },
    { label: `Withdraw Money` },
  ];
  async function handleDownloadForm() {
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + auxDataUrl + "staticDocumentLocation/withdrawalForm", {
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
  async function getQuestions() {
    const pl = sessionStorage.getItem("policyLocator");
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + "/policy/" + query.id, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPolvalue(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    await fetch(Url + products, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.map((o) => {
          if (o.name === "MYGA") {
            const exposures = o.policyConfiguration.exposures;
            exposures.map((p) => {
              if (p.displayName === "Annuitant") {
                setRidersFromProducts(p.perils);
              }
            });
          }
        });
      })

      .catch((error) => {
        console.log("Error:", error);
      });
  }

  async function postDataDisplay(pl) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const minvalue = await fetch(Url + auxDataUrl + auxMin, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMinValue(data.value);
      });
    const minpolicyvalue = await fetch(Url + auxDataUrl + auxMinpolicy, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMinPolicyValue(data.value);
      });

    const body = {
      operation: "accountBalance",
      payload: {
        locator: pl,
      },
    };

    await fetch(Url + lambda, {
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
        setQuotedata(data.payload);
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    await fetch(Url + "/policy/" + query.id, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const RiderData = data.exposures && data.exposures[0].perils;
        let ridersdetails = [];
        RiderData?.map((o) => {
          if (
            o.name === "terminalConditionBenefitRider" ||
            o.name === "nursingHomeBenefitRider"
          ) {
            ridersdetails.push({
              name:
                ridersFromProducts &&
                ridersFromProducts.filter((x) => x.name === o.name)[0]
                  .displayName,
              value: o.name,
            });
          }
        });
        ridersdetails.push({ name: "Not Applicable", value: "Not Applicable" });
        setRiders(ridersdetails);
      })

      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getQuestions();
  }, [query.id]);
  useEffect(() => {
    postDataDisplay(query.id);
  }, [query.id, ridersFromProducts]);
  useEffect(() => {
    if (selectedRider) {
      handleValue(selectedRider);
    }
  }, [fedTaxPercent, stateTaxPercent, selectedRider, sdnw, fdnw]);
  useEffect(() => {
    if (val) {
      setInputValue(
        quoteData &&
          quoteData.endingAccountValue &&
          quoteData.endingAccountValue
      );
    } else {
      setInputValue("");
    }
  }, [val]);
  function withdrawal1035pop() {
    setShowWithdrawal1035(true);
  }

  const handleSubmit = async () => {
    // setcheckopen(true)
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    if (val2 === "1035transfer") {
      withdrawal1035pop();
    } else {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + "-" + mm + "-" + dd;

      const body = {
        endorsementName: "Withdrawal",
        state: "quoted",
        addFieldGroups: [
          {
            fieldName: "financialTransactions",
            fieldValues: {
              transactionStatus: "Pending",
              transactionType: "Withdrawal",
              transactionOption: val ? "Full" : "Partial",
              transactionEffectiveDate: today,
              transactionCreatedDate: today,
              transactinonApprovalDate: today,
              amountRequested: inputValue && inputValue,
              riderOpted: selectedRider,
              // paymentOption: val2,
            },
          },
        ],
      };

      await fetch(Url + "/policies/" + query.id + "/endorsements", {
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
          sessionStorage.setItem("withDrawlocator", data.locator);
          setLink(data.documents[0].url);
          setshowModal(true);
          localStorage.setItem("EL", JSON.stringify(data.locator));

          setBatchQueue(data);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };
  const handleValue = async (value) => {
    setSelectedCity1(value);
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const body = {
      operation: "withdrawalQuote",
      payload: {
        locator: query.id,
        transactionOption: val ? "Full" : "Partial",
        amountRequested: inputValue && inputValue,
        riderOpted: value,
        fedTaxOption: fdnw ? "donotwithhold" : fwh ? "percent" : "default",
        fedTaxPercent: fedTaxPercent,
        stateTaxOption: sdnw ? "donotwithhold" : swh ? "percent" : "default",
        stateTaxPercent: stateTaxPercent,
      },
    };

    await fetch(Url + lambda, {
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
        setResponse(data.payload);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  async function setBatchQueue(value) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const body = {
      auxData: {
        key: value.locator,
        value: "",
      },
    };

    await fetch(Url + auxDataUrl + query.id, {
      method: "PUT",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  const header = (
    <div className="p-4">
      <h2 className="ml-0 sm:ml-4  font-bold text-blue-800">
        Policy No. {query.id}
      </h2>
      <h2 className="ml-0 sm:ml-4 font-bold text-black-800">
        Multi-Year Guaranteed Annuity
      </h2>
    </div>
  );
  const handleBack = () => {
    router.push(`/dashboard/my-policies/updatebeneficiary?id=${query.id}`);
  };
  const footer = (
    <div>
      <Divider />
      <Grid className="sm:grid-cols-2 sm:gap-2 border-bt px-4">
        <i className="pi pi-info-circle" style={{ fontSize: "15px" }}>
          <span
            className=" tracking-wider text-sm font-normal"
            style={{ fontFamily: "Muli", marginLeft: "5px" }}
          >
            Market Value Adjustment (MVA) is calculated based on the latest
            available MVA Index. Actual value may differ from the estimated
            value.
          </span>
        </i>
        <Flex className="flex flex-col-reverse sm:flex-row place-items-center my-4 sm:space-x-4  sm:justify-end">
          <Button
            onClick={handleBack}
            className=" w-64 sm:w-36 h-10 mt-4 sm:mt-0 btn-cancel font-bold text-blue-500 border-blue-500"
          >
            Back
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              inputValue.length === 0 ||
              selectedRider.length === 0 ||
              !results ||
              validation
            }
            className="w-64 sm:w-36 mt-4 sm:mt-0 h-10 btncolor font-bold sm:ml-10"
          >
            Submit
          </Button>
        </Flex>
        <Modal
          showsModal={checkopen}
          withdrew={true}
          description={
            <Container className="text-center sm:text-left mt-3 text-neutral-900 font-bold">
              To initiate withdrawal request, please download withdrawal form
              and mail to Pillar Life.
              <div className="flex flex-col justify-center sm: justify-start items-center  mt-5  ">
                {/* <label
                    className="sm:w-2/3 text-sm font-semibold download"
                    onClick={() => handleDownloadInstruction()}
                  >
                    Download 1035 Instructions here
                  </label> */}
                <label
                  className="text-center sm:w-3/4 text-sm font-semibold download"
                  onClick={() => handleDownloadForm()}
                >
                  Download the Withdrawal Form here
                </label>
              </div>
            </Container>
          }
          body={
            <Flex className="flex items-center justify-center ">
              <Button
                className="btncolor h-10 font-bold font-muli py-2  rounded-r w-5/6 my-5 sm:ml-0  sm:w-2/6"
                onClick={closecheck}
              >
                OK
              </Button>
            </Flex>
          }
        />
      </Grid>
    </div>
  );
  const handleCheck = (e) => {
    setValue(e.checked);
    setValidate(false);
  };

  const handlefedCheck = (e, value) => {
    if (value === "dnw") {
      setFedwhValue(false);
      setFeddnwValue(e.checked);
    }
    if (value === "wh") {
      setFeddnwValue(false);
      setFedwhValue(e.checked);
    }
    setValidate(false);
  };
  const handlestateCheck = (e, value) => {
    if (value === "dnw") {
      setStatewhValue(false);
      setStatednwValue(e.checked);
    }
    if (value === "wh") {
      setStatednwValue(false);
      setStatewhValue(e.checked);
    }
    setValidate(false);
  };
  const updateInputValue = (event) => {
    var t = event.target.value;
    event.target.value =
      t.indexOf(".") >= 0
        ? t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)
        : t;
    setInputValue(event.target.value);
    if (!val) {
      if (event.target.value < parseInt(min)) {
        setValidate(true);
        setMsg("The minimum withdrawal amount is 5000");
      } else if (
        event.target.value > parseInt(quoteData && quoteData.endingAccountValue)
      ) {
        setValidate(true);
        setMsg("Withdrawal amount can't be greater than policy account value");
      } else if (
        event.target.value >
        parseInt(quoteData && quoteData.endingAccountValue) - 1000
      ) {
        setValidate(true);
        setMsg(
          "You should have at least $1000 account balance for policy to be in Active status"
        );
      } else {
        setValidate(false);
      }
    }
  };
  const handleClear = () => {
    setInputValue("");
    setFedTaxPercent("");
    setStateTaxPercent("");
    setSelectedCity1("");
    setFeddnwValue(false);
    setStatednwValue(false);
    setFedwhValue(false);
    setStatewhValue(false);
    setResponse("");
    setValue2(false);
    setValidate(false);
    setValue(false);
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
      <div className="flex md:flex-row md:space-x-1">
        <div className="sm:w-3/12 sm:h-10">
          <Sider />
        </div>
        {loader && (
          <div className={"block fixed inset-0 z-30 transition-opacity"}>
            <div className="absolute inset-0 bg-gray-500 opacity-75" />

            <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />
          </div>
        )}
        <div className="Flex w-full flex-col sm:pl-7 mt-2 sm:mt-4">
          <BreadCrumb className={"text-sm bread-crumb"} model={items} />
          <div className="pb-4 pr-4">
            <p className="sm:mt-0 mb-2 sm:mb-0 ml-4 sm:ml-6 h-policies font-bold text-lg md:text-lg">
              Withdraw Money
            </p>
          </div>
        </div>
        <div className=" w-0 sm:w-4/6 flex flex-col justify-end mt-4 ">
          {!isTabletOrMobile && (
            <div className="Flex self-end mt-4  ">
              <NextLink
                href={`/dashboard/my-policies/updatebeneficiary?id=${query.id}`}
              >
                <img
                  className="inline ml-5 mr-5   "
                  src={IMAGE_PATHS.BACK_ARROW}
                />
              </NextLink>
            </div>
          )}
        </div>
      </div>
      <div className="flex sm:ml-8">
        <Card className="withdraw" id="wd" header={header} footer={footer}>
          <div className="grey-background p-3 sm:p-4">
            <Grid className="grid-cols-6 gap-2 border-bt ">
              <Container className="col-span-6 sm:col-span-2 sm:my-4">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Policy Account Value As Of Today
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-4  sm:my-4">
                <Container className="grid-rows-2">
                  <span className="ml-1 sm: ml-0 font-semibold text-black">
                    {quoteData &&
                      quoteData.endingAccountValue &&
                      "$" + quoteData.endingAccountValue}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-col-10 sm:grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-10 sm:col-span-2 my-4 ">
                <Container className="grid-rows-3 ml-1 sm:ml-0">
                  <Label
                    htmlFor="amount"
                    className="text-black text-md font-semibold"
                  >
                    How Much Would you like to Withdraw?*
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-5 sm:col-span-2">
                <Container className="grid-rows-3">
                  <Input
                    className="w-40 sm:w-3/4"
                    pattern="^(\d+)(,\d{1,2}|.\d{1,2})?$"
                    // closeicon={true}
                    // iconClick={true}
                    type="number"
                    id="text"
                    disabled={val === true || selectedRider}
                    value={inputValue}
                    onChange={(evt) => updateInputValue(evt)}
                    name="$"
                    placeholder="$"
                    ref={quantityInputRef}
                  />
                  <span>
                    <i
                      id="clear-icon"
                      className={inputValue.length > 0 ? "pi pi pi-times" : ""}
                      onClick={() => handleClear()}
                    ></i>
                  </span>
                  {validation && (
                    <span className="text-red-400 text-900 font-base text-md">
                      {msg}
                    </span>
                  )}
                </Container>
              </Container>
              <Container className="col-span-5 sm:col-span-2">
                <Container className="grid-rows-3 mt-1 sm:mt-0 ">
                  <div className="p-field-radiobutton radio-border-fullaccount  radio-border w-44 sm:w-3/4">
                    <Checkbox
                      inputId="full account value"
                      name="full account value"
                      value="full account value"
                      checked={val}
                      onChange={(e) => handleCheck(e)}
                    />
                    <label htmlFor="False" className="text-sm sm: sm:px-1">
                      Full Account Value
                    </label>
                  </div>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-col-10 sm:grid-cols-12 gap-2 sm:gap-2 border-bt ">
              <Container className="col-span-10 sm:col-span-2 my-4 ">
                <Container className="grid-rows-3 ml-1 sm:ml-0">
                  <Label
                    htmlFor="amount"
                    className="text-black text-md font-semibold"
                  >
                    Federal Tax:
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-3">
                <Container className="grid-rows-4 mt-3">
                  <div className="p-field-radiobutton  w-44  sm:w-3/4">
                    <Checkbox
                      inputId="fed dnw"
                      name="fed dnw"
                      value="fed dnw"
                      checked={fdnw}
                      onChange={(e) => handlefedCheck(e, "dnw")}
                    />
                    <label htmlFor="False" className="text-sm sm: sm:px-1">
                      Do not withhold
                    </label>
                  </div>
                  <div className="p-field-radiobutton inline-flex mt-4 w-44 sm:w-3/4">
                    <Checkbox
                      inputId="fed wh"
                      name="fed wh"
                      value="fed wh"
                      checked={fwh}
                      onChange={(e) => handlefedCheck(e, "wh")}
                    />
                    <label htmlFor="False" className="text-sm sm: sm:px-1">
                      Withhold
                    </label>
                    <InputNumber
                      className="tax-input ml-2 sm:ml-0"
                      value={fedTaxPercent}
                      onValueChange={(e) => {
                        setFedTaxPercent(e.value);
                      }}
                      disabled={fdnw || fwh === false}
                      inputStyle={{
                        border: 0,
                        background: "#f8f8f8",
                        "box-shadow": "none",
                        padding: "0",
                      }}
                      locale="en-US"
                    />
                    <p>%</p>
                  </div>
                </Container>
              </Container>
              <Container className="col-span-10 sm:col-span-1 my-4 ">
                <Container className="grid-rows-4 ml-1 sm:ml-0">
                  <Label
                    htmlFor="amount"
                    className="text-black text-md font-semibold"
                  >
                    State Tax:
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-3">
                <Container className="grid-rows-4 mt-3">
                  <div className="p-field-radiobutton  w-44  sm:w-3/4">
                    <Checkbox
                      inputId="state dnw"
                      name="state dnw"
                      value="state dnw"
                      checked={sdnw}
                      onChange={(e) => handlestateCheck(e, "dnw")}
                    />
                    <label htmlFor="False" className="text-sm sm: sm:px-1">
                      Do not withhold
                    </label>
                  </div>
                  <div className="p-field-radiobutton inline-flex mt-4 w-44 sm:w-3/4">
                    <Checkbox
                      inputId="state wh"
                      name="state wh"
                      value="state wh"
                      checked={swh}
                      onChange={(e) => handlestateCheck(e, "wh")}
                    />
                    <label htmlFor="False" className="text-sm sm: sm:px-1">
                      Withhold
                    </label>
                    <InputNumber
                      className="tax-input ml-2 sm:ml-0"
                      disabled={sdnw || swh === false}
                      inputStyle={{
                        border: 0,
                        background: "#f8f8f8",
                        "box-shadow": "none",
                        padding: "0",
                      }}
                      value={stateTaxPercent}
                      onValueChange={(e) => {
                        setStateTaxPercent(e.value);
                      }}
                      locale="en-US"
                    />
                    <p>%</p>
                  </div>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-col-10 sm:grid-cols-6 gap-2 mt-4 sm:gap-4 border-bt "></Grid>
            <Grid className="grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-6 sm:col-span-2  my-2 sm:my-4">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Select Rider If Applicable*
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-5 sm:col-span-4 mb-1  sm:my-4">
                <Container className="grid-rows-2">
                  <Dropdown
                    optionLabel="name"
                    className="amount text-black text-md font-semibold"
                    value={selectedRider}
                    disabled={inputValue.length === 0}
                    options={riders}
                    onChange={(e) => {
                      handleValue(e.value);
                    }}
                    placeholder="Select"
                  />
                </Container>
              </Container>
            </Grid>
          </div>
          <div className="mt-2 sm:mt-0 pl-3 sm:pl-5 space-y-4 sm:space-y-0 p-0 sm:white-bg">
            <Grid className="grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-6 sm:col-span-2 sm:my-4">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Free Withdrawal Amount
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-4 sm:my-4">
                <Container className="grid-rows-2 ml-1 sm:ml-0">
                  <span className="font-semibold text-black">
                    {results && results.freeWithdrawalAmount
                      ? "$" + results.freeWithdrawalAmount
                      : "$0"}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-6 sm:col-span-2  sm:my-4">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Surrender Charges
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-4  sm:my-4">
                <Container className="grid-rows-2 ml-1 sm:ml-0">
                  <span className="font-semibold text-black">
                    {results && results.surrenderCharge
                      ? "$" + results.surrenderCharge
                      : "$0"}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-6 sm:col-span-2  sm:my-4">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Federal Tax Amount
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-4  sm:my-4">
                <Container className="grid-rows-2 ml-1 sm:ml-0">
                  <span className="font-semibold text-black">
                    {results && results.fedTaxAmount
                      ? "$" + results.fedTaxAmount
                      : "$0"}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-6 sm:col-span-2  sm:my-4">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    State Tax Amount
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-4  sm:my-4">
                <Container className="grid-rows-2 ml-1 sm:ml-0">
                  <span className="font-semibold text-black">
                    {results && results.stateTaxAmount
                      ? "$" + results.stateTaxAmount
                      : "$0"}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-6 sm:col-span-2  sm:my-4">
                <Container className="grid-rows-3 ml-1 sm:ml-0 rev-width">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Market Value Adjustment
                    <i
                      className="pi  pi-info-circle"
                      style={{
                        fontSize: "15px",
                        marginBottom: "5px",
                        marginLeft: "5px",
                      }}
                    ></i>
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-4  sm:my-4">
                <Container className="grid-rows-2 ml-1 sm:ml-0 rev-width">
                  <span className="font-semibold text-black">
                    {results && results.mva ? "$" + results.mva : "$0"}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-6 gap-2 sm:gap-4 border-bt ">
              <Container className="col-span-6 sm:col-span-2  sm:my-4">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Amount You Will Receive
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-4  sm:my-4">
                <Container className="grid-rows-2 ml-1 sm:ml-0 rev-width">
                  <span className="font-bold text-blue-800">
                    {results && results.amountDisbursed
                      ? "$" + results.amountDisbursed
                      : "$0"}
                  </span>
                </Container>
              </Container>
            </Grid>
            {/* <Grid className=" grid-cols-9 gap-1 sm:gap-4 border-bt p-0 sm:pr-3   ">
              <Container className="col-span-10 sm:col-span-3 sm:my-4">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    How do you want to receive*
                  </Label>
                </Container>
              </Container>
              <Container className="container col-span-6 sm:col-span-2 my-1 sm:my-4">
                <Container className="grid-rows-2">
                  <div className="p-field-radiobutton  radio-border">
                    <RadioButton
                      inputId="ACH"
                      name="ACH"
                      value="ACH"
                      onChange={e => setValue2(e.value)}
                      checked={val2 === "ACH"}
                    />
                    <label
                      htmlFor="ACH"
                      className="p-3 sm:px-2 text-sm sm:font-semibold"
                    >
                      Your Bank Account
                    </label>
                  </div>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-2  my-1 sm:my-4">
                <Container className="grid-rows-2">
                  <div className="p-field-radiobutton radio-border">
                    <RadioButton
                      inputId="Check"
                      name="Check"
                      value="Check"
                      onChange={e => setValue2(e.value)}
                      checked={val2 === "Check"}
                    />
                    <label
                      htmlFor="Check"
                      className="p-3 sm:px-2 text-sm sm:font-semibold"
                    >
                      Check
                    </label>
                  </div>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-2 my-1 sm:my-4">
                <Container className="grid-rows-2">
                  <div className="p-field-radiobutton radio-border">
                    <RadioButton
                      inputId="1035transfer"
                      name="1035transfer"
                      value="1035transfer"
                      onChange={e => setValue2(e.value)}
                      //onChange={withdrawal1035pop}
                      checked={val2 === "1035transfer"}
                    />
                    <label
                      htmlFor="1035transfer"
                      className="p-3 sm:px-2 text-sm sm:font-semibold"
                    >
                      1035 Transfer
                    </label>
                  </div>
                </Container>
              </Container>
            </Grid> */}

            {show && (
              <WithdrawModal
                polValue={polValue}
                value={val2}
                showsModal={true}
                link={link}
                closeModal={closeModal}
              />
            )}
            {showwithdrawal1035 && (
              <Withdrawal1035modal
                showsModal={true}
                //id={id}
                closeModal={closeWithdrawal1035}
              />
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default withAuthentication(withdrawmoney);
