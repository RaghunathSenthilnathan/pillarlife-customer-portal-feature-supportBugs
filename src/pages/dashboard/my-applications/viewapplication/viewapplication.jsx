import { useEffect, useState } from "react";
import { Label } from "@components/forms";
import { BreadCrumb } from "primereact/breadcrumb";
import { Panel } from "primereact/panel";
import { NextSeo } from "next-seo";
import { NextLink } from "@components/next-link";
import { useRouter } from "next/router";
import { Stepper } from "@components/stepper";
import { Card } from "primereact/card";
import { withAnonymous, withAuthentication } from "@utils/route-hocs";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import { Flex, Container } from "@components/layout";
import { Grid } from "@components/layout";
import { Sider } from "@components/sidebar";
import { IMAGE_PATHS, ROUTE_PATHS, MYGA } from "src/constants";
import {
  Url,
  products,
  authUrl,
  authOptions,
  updatePolicy,
  lambda
} from "../../../../constants/apiconstant";
import moment from "moment";
// import  NeedHelp  from "../../application/commonForms/needHelp";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "View Application";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const viewapplication = () => {
  const router = useRouter();
  const { query } = router;
  const [questions, setQuestions] = useState();
  const [value, setValue] = useState();
  const [riders, setRiders] = useState([]);
  const [ridersFromProducts, setRidersFromProducts] = useState();
  const [annuitant, setAnnuitant] = useState();
  const [benefi, setBeneficiary] = useState();
  const [ach, setAch] = useState();
  const [transfer, setTransfer] = useState();
  const [cont, setcontBeneficiary] = useState();
  const [suit, setSuitablity] = useState();
  const [quoteData, setQuotedata] = useState();

  let disp;

  const items = [
    { label: "My applications", url: "/dashboard/my-applications?index=0" },
    {
      label: "Submitted Applications",
      url: "/dashboard/my-applications?index=0"
    },
    {
      label: `Reference No. ${query.polLocator?query.polLocator:query.id}`,
      url: `/dashboard/my-applications/viewapplication?id=${query.polLocator}`
    }
  ];
  const header = (
    <Grid className="grid-cols-10 gap-2 border-bt sm:divide-x-0 divide-gray-200 sm:px-4 pl-4 sm:pl-4">
      <Container className="col-span-6 sm:col-span-5 my-4 sm:mt-3">
        <Container className="grid-rows-1">
          <h2 className="sm:ml-0  font-bold text-blue-800">
            Reference No. {query.polLocator}
          </h2>
          <h2 className="text-black text-sm font-semibold sm:ml-0">
            Multi-Year Guaranteed Annuity
          </h2>
        </Container>
      </Container>
      <Container className="col-span-4 sm:col-start-7 sm:col-span-5 ml-4 sm:ml-0 sm:p-4 my-4 sm:my-2  w-24 sm:w-40">
        <Container className="grid-rows-1">
          <div
            className={`${
              value && value.polStatus[0] === "In Review" ? "block" : "hidden"
            }`}
          >
            <Tag severity={"info"} value={"Under Review"} rounded></Tag>
          </div>
          <div
            className={`${
              value && value.polStatus[0] === "Approved" ? "block" : "hidden"
            }`}
          >
            <Tag severity={"info"} value={"Approved"} rounded></Tag>
          </div>
        </Container>
      </Container>
    </Grid>
  );
  async function fetchPolicyDetails(pl) {
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
      .then(data => {
        setValue(data.characteristics[data.characteristics.length-1].fieldValues);
        setAnnuitant(data.exposures[0].characteristics[data.exposures[0].characteristics.length-1].fieldValues);
        data &&
          data.exposures.map(o => {
            if (
              o.name === "Beneficiary" &&
              o.characteristics[o.characteristics.length-1].fieldValues.beneType[0] === "Primary"
            ) {
              beneficiary.push(o.characteristics[o.characteristics.length-1].fieldValues);
            }
            if (
              o.name === "Beneficiary" &&
              o.characteristics[o.characteristics.length-1].fieldValues.beneType[0] === "Contingent"
            ) {
              contigent.push(o.characteristics[o.characteristics.length-1].fieldValues);
            }
            if (
              o.name === "Payment" &&
              o.characteristics[o.characteristics.length-1].fieldValues.paymentType[0] === "ACH"
            ) {
              setAch(o.characteristics[o.characteristics.length-1].fieldValues);
            }
            if (
              o.name === "Payment" &&
              o.characteristics[o.characteristics.length-1].fieldValues.paymentType[0] === "1035"
            ) {
              setTransfer(o.characteristics[o.characteristics.length-1].fieldValues);
            }
          });
        setBeneficiary(beneficiary);
        setcontBeneficiary(contigent);
        const suitablity = Object.values(
          data.characteristics[data.characteristics.length-1].fieldGroupsByLocator
        )[0];
        setSuitablity(Object.entries(suitablity));
        const RiderData = data.exposures && data.exposures[0].perils;
        setRiders(RiderData);
        let term =
          data.characteristics &&
          data.characteristics[data.characteristics.length-1].fieldValues.guaranteedTerm[0];
        let premium =
          data.characteristics &&
          data.characteristics[data.characteristics.length-1].fieldValues.amountInvesting[0];

        const body = {
          operation: "quoteAccount",
          payload: {
            guaranteedTerm: term,
            premium: premium,
            riders: {}
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
            setQuotedata(data);
          })
          .catch(error => {
            console.log("Error:", error);
          });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  function ordinal(number) {
    const english_ordinal_rules = new Intl.PluralRules("en", {
      type: "ordinal"
    });
    const suffixes = {
      one: "st",
      two: "nd",
      few: "rd",
      other: "th"
    };
    const suffix = suffixes[english_ordinal_rules.select(number)];
    return number + suffix;
  }
  async function getQuestions() {
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
        data.map(o => {
          if (o.name === "MYGA") {
            const exposures = o.policyConfiguration.exposures;
            exposures.map(p => {
              if (p.displayName === "Annuitant") {
                setRidersFromProducts(p.perils);
              }
            });
            const resp = o.policyConfiguration.fields;
            const qstns = resp.filter(obj => {
              return obj.name === "suitabilityQuestions";
            });
            const check = x => x[0] === "suitabilityQuestion2";
            if (suit&&!suit.some(check)) {
              qstns[0].fields.splice(1, 1);
            }
            setQuestions(qstns[0].fields);
          }
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  const mapRiderNames = item => {
    ridersFromProducts?.map(obj => {
      if (item.name === obj.name) {
        disp = obj.displayName;
      }
    });
  };

  useEffect(() => {
    const pl = query && parseInt(query.polLocator?query.polLocator:query.id);
    fetchPolicyDetails(pl);
  }, [query]);
  useEffect(() => {
    getQuestions();
  }, [suit]);

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
      <div className="flex md:flex-row md:space-x-1">
        <div className="sm:w-1/6">
          <Sider />
        </div>
        <div className="Flex flex-col ml-4 sm:ml-0">
          <BreadCrumb
            className={"bread-crumb pl-0 ml-5 text-sm"}
            model={items}
          />
          <div className="pr-4">
            <p className="sm:mt-0 mb-2 sm:mb-0 sm:ml-2 h-policies font-bold text-lg md:text-lg">
              Submitted Applications
            </p>
          </div>
        </div>
      </div>
      <div className="flex">
        <Card header={header} className="submitted-card p-card-p0 mt-2">
          <Panel>
            <div className="flex flex-col sm:flex-row sm:space-x-48 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-300">
              <div className="flex flex-col space-y-14  md:p-2 md:pl-0 md:w-1/3 ">
                <div className="flex flex-col  ml-3 sm:ml-0">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 sm:pl-0 text-sm font-semibold mt-2 sm:mt-0"
                  >
                    Submitted date:
                    <span className="text-sm font-bold ml-8 text-black">
                      {value &&
                        moment(value.appReceivedDate[0]).format("MM-DD-YYYY")}
                    </span>
                  </Label>
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 sm:pl-0 text-sm font-semibold mb-2 sm:mb-0"
                  >
                    Amount Investing:
                    <span className="text-sm font-bold ml-8 text-black">
                      {" "}
                      {value && "$" + value.amountInvesting[0]}
                    </span>
                  </Label>
                </div>
              </div>
              <div className="flex flex-col space-y-14  md:p-2 md:w-1/3 ">
                <div className="flex flex-col  ml-3 sm:ml-0">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-sm font-semibold mt-2 sm:mt-0"
                  >
                    Premium Paid
                  </Label>
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Bank:{" "}
                    <span className="text-sm font-bold ml-8 text-black">
                      {value && "$" + value.achAmount[0]}
                    </span>
                  </Label>
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    1035 Transfer :{" "}
                    <span className="text-sm font-bold ml-8 text-black">
                      {value && "$" + value["1035Amount"][0]}
                    </span>
                    <span className="font-bold ml-2 text-black">
                      {transfer && "$" + transfer.paymentAmount[0] && (
                        <Tag
                          className="tag-list"
                          value={transfer && transfer.paymentStatus[0]}
                          rounded
                        ></Tag>
                      )}
                    </span>
                  </Label>
                </div>
              </div>
            </div>
          </Panel>
          <Panel
            header={
              value && value.jointOwnerFirstname
                ? "Owner Personal Information - Joint Owners"
                : "Owner Personal Information"
            }
            className="review-header"
          >
            {value && value.primaryOwnerFirstname ? (
              <Panel header="Primary Owner" className="review-panel">
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mt-2 sm:mt-0">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Full Name
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold ">
                        {value &&
                          value.primaryOwnerFirstname[0] +
                            " " +
                            value.primaryOwnerMiddlename[0] +
                            " " +
                            value.primaryOwnerLastname[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Gender assigned at birth
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryOwnerGender[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt  ml-3 sm:ml-0  ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Birth Date
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value &&
                          moment(value.primaryOwnerDob[0]).format("MM-DD-YYYY")}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Phone Number
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryOwnerPhone[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Social Security Number
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value &&
                          "XXX-XX-" + value.primaryOwnerGovtid[0].substr(-4)}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Email ID
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryOwnerEmail[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Address Line 1
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryResidenceAddressLine1[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Address Line 2
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryResidenceAddressLine2
                          ? value.primaryResidenceAddressLine2[0]
                          : ""}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        City
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryResidenceAddressCity[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        State
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryResidenceAddressState[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mb-2 sm:mb-0">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Zip
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.primaryResidenceAddressZip[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
              </Panel>
            ) : value && value.trustName ? (
              <Panel header="Trust" className="review-panel">
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mt-2 sm:mt-0">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Full Legal Name of Trust
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustName[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Trustee
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trusteeName[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Tax ID of Trust
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && "XXX-XX-" + value.trustGovtid[0].substr(-4)}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Phone Number
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustPhone[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Email ID
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustEmail[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Address Line 1
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustAddressLine1[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Address Line 2
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustAddressLine2
                          ? value.trustAddressLine2[0]
                          : ""}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        City
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustAddressCity[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        State
                      </Label>
                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustAddressState[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider className="hidden sm:block" />
                <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mb-2 sm:mb-0 ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                      <Label
                        htmlFor="amount"
                        className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                      >
                        Zip
                      </Label>

                      <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                        {value && value.trustAddressZip[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
              </Panel>
            ) : (
              ""
            )}
            {value && value.jointOwnerFirstname && (
              <div>
                <Panel header="Joint Owner" className="review-panel">
                  <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mt-2 sm:mt-0">
                    <Container className="col-span-3 sm:col-span-1">
                      <Container className="grid-rows-3">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Full Name
                        </Label>

                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value &&
                            value.jointOwnerFirstname[0] +
                              " " +
                              value.jointOwnerMiddlename[0] +
                              " " +
                              value.jointOwnerLastname[0]}
                        </span>
                      </Container>
                    </Container>
                    <Container className="col-span-6 sm:col-span-1">
                      <Container className="grid-rows-2">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Gender
                        </Label>
                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointOwnerGender[0]}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                  <Divider className="hidden sm:block" />
                  <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                    <Container className="col-span-3 sm:col-span-1">
                      <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Birth Date
                        </Label>

                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value &&
                            moment(value.jointOwnerDob[0]).format("MM-DD-YYYY")}
                        </span>
                      </Container>
                    </Container>
                    <Container className="col-span-6 sm:col-span-1">
                      <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Phone Number
                        </Label>
                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointOwnerPhone[0]}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                  <Divider className="hidden sm:block" />
                  <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                    <Container className="col-span-3 sm:col-span-1">
                      <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Social Security Number
                        </Label>

                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value &&
                            "XXX-XX-" + value.jointOwnerGovtid[0].substr(-4)}
                        </span>
                      </Container>
                    </Container>
                    <Container className="col-span-6 sm:col-span-1">
                      <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Email ID
                        </Label>
                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointOwnerEmail[0]}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                  <Divider className="hidden sm:block" />
                  <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                    <Container className="col-span-3 sm:col-span-1">
                      <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Address Line 1
                        </Label>
                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointResidenceAddressLine1[0]}
                        </span>
                      </Container>
                    </Container>
                    <Container className="col-span-6 sm:col-span-1">
                      <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Address Line 2
                        </Label>
                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointResidenceAddressLine2
                            ? value.jointResidenceAddressLine2[0]
                            : ""}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                  <Divider className="hidden sm:block" />
                  <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                    <Container className="col-span-3 sm:col-span-1">
                      <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          City
                        </Label>

                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointResidenceAddressCity[0]}
                        </span>
                      </Container>
                    </Container>
                    <Container className="col-span-6 sm:col-span-1">
                      <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          State
                        </Label>
                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointResidenceAddressState[0]}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                  <Divider className="hidden sm:block" />
                  <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mb-2 sm:mb-0 ">
                    <Container className="col-span-3 sm:col-span-1">
                      <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                        >
                          Zip
                        </Label>

                        <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {value && value.jointResidenceAddressZip
                            ? value.jointResidenceAddressZip[0]
                            : ""}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                </Panel>
              </div>
            )}
            <Panel header="Annuitant Details" className="review-panel">
              <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  mt-2 sm:mt-0">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Full Name
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant &&
                        annuitant.annuitantFirstname[0] +
                          " " +
                          annuitant.annuitantMiddlename[0] +
                          " " +
                          annuitant.annuitantLastname[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Gender
                    </Label>
                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant && annuitant.annuitantGender[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Birth Date
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant &&
                        moment(annuitant.annuitantDob[0]).format("MM-DD-YYYY")}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Phone Number
                    </Label>
                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant && annuitant.annuitantPhone[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Social Security Number
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant &&
                        "XXX-XX-" + annuitant.annuitantGovtid[0].substr(-4)}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Email ID
                    </Label>
                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant && annuitant.annuitantEmail[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Address Line 1
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant && annuitant.annuitantAddressLine1[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Address Line 2
                    </Label>
                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant && annuitant.annuitantAddressLine2
                        ? annuitant.annuitantAddressLine2[0]
                        : ""}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      City
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant && annuitant.annuitantAddressCity[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      State
                    </Label>
                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant &&
                        annuitant.annuitantAddressState &&
                        annuitant.annuitantAddressState[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mb-2 sm:mb-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Zip
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {annuitant &&
                        annuitant.annuitantAddressZip &&
                        annuitant.annuitantAddressZip[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
            </Panel>
          </Panel>
          <Panel header={"Beneficiary Information"} className="review-header">
            {benefi &&
              benefi.map((bene, index) => {
                return (
                  <div>
                    <Panel
                      header={ordinal(index + 1) + " " + " Primary Beneficiary"}
                      className="review-panel"
                    >
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  mt-2 sm:mt-0">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            {bene.benePartyType[0] === "Trust" ? (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Trust Name
                                </Label>
                                <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                  {bene &&
                                    bene.beneTrustName &&
                                    bene.beneTrustName[0]}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Full Name
                                </Label>
                                <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                  {bene && bene.beneMiddlename
                                    ? bene.beneFirstname[0] +
                                      " " +
                                      bene.beneMiddlename[0] +
                                      " " +
                                      bene.beneLastname[0]
                                    : bene.beneFirstname[0] +
                                      " " +
                                      bene.beneLastname[0]}
                                </span>
                              </div>
                            )}
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2">
                            {bene.benePartyType[0] === "Trust" ? (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Trustee Name
                                </Label>
                                <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                  {bene &&
                                    bene.beneTrustee &&
                                    bene.beneTrustee[0]}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Gender assigned at birth
                                </Label>
                                <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                  {bene &&
                                    bene.beneGender &&
                                    bene.beneGender[0]}
                                </span>
                              </div>
                            )}
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="hidden sm:block" />
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                            {bene.benePartyType[0] === "Trust" ? (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Tax ID of Trust
                                </Label>

                                <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                  {bene &&
                                    bene.beneGovtid &&
                                    "XXX-XX-" + bene.beneGovtid[0].substr(-4)}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Birth Date
                                </Label>

                                <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                  {bene &&
                                    bene.beneDob &&
                                    moment(bene.beneDob[0]).format(
                                      "MM-DD-YYYY"
                                    )}
                                </span>
                              </div>
                            )}
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Phone Number
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene && bene.benePhone && bene.benePhone[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="hidden sm:block" />
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                        {bene.benePartyType[0] === "Person" && (
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Social Security Number
                              </Label>

                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneGovtid &&
                                  "XXX-XX-" + bene.beneGovtid[0].substr(-4)}
                              </span>
                            </Container>
                          </Container>
                        )}
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Email ID
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene && bene.beneEmail && bene.beneEmail[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="hidden sm:block" />
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 1
                            </Label>

                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene &&
                                bene.beneAddressLine1 &&
                                bene.beneAddressLine1[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 2
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene && bene.beneAddressLine2
                                ? bene.beneAddressLine2[0]
                                : ""}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="hidden sm:block" />
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              City
                            </Label>

                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene &&
                                bene.beneAddressCity &&
                                bene.beneAddressCity[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              State
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene &&
                                bene.beneAddressState &&
                                bene.beneAddressState[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="hidden sm:block" />
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Zip
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene &&
                                bene.beneAddressZip &&
                                bene.beneAddressZip[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="hidden sm:block" />
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Relationship with owner
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene &&
                                bene.beneRelationOwner &&
                                bene.beneRelationOwner[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3 mt-0 sm:mt-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Percentage Sharing (%)
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene &&
                                bene.beneSharingPercent &&
                                bene.beneSharingPercent[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="hidden sm:block" />
                      <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mb-2 sm:mb-0  ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Is this designation irrevocable?
                            </Label>
                            <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                              {bene &&
                                bene.beneIrrevocable &&
                                bene.beneIrrevocable[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                    </Panel>
                  </div>
                );
              })}

            {cont &&
              cont.map((bene, index) => {
                return (
                  bene.beneSharingPercent && (
                    <div>
                      <Panel
                        header={
                          ordinal(index + 1) + " " + "Contigent Beneficiary"
                        }
                        className="review-panel"
                      >
                        <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0 mt-2 sm:mt-0 ">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3">
                              {bene.benePartyType[0] === "Trust" ? (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Trust Name
                                  </Label>
                                  <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                    {bene &&
                                      bene.beneTrustName &&
                                      bene.beneTrustName[0]}
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Full Name
                                  </Label>
                                  <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                    {bene && bene.beneMiddlename
                                      ? bene.beneFirstname[0] +
                                        " " +
                                        bene.beneMiddlename[0] +
                                        " " +
                                        bene.beneLastname[0]
                                      : bene.beneFirstname[0] +
                                        " " +
                                        bene.beneLastname[0]}
                                  </span>
                                </div>
                              )}
                            </Container>
                          </Container>
                          <Container className="col-span-6 sm:col-span-1">
                            <Container className="grid-rows-2">
                              {bene.benePartyType[0] === "Trust" ? (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Trustee Name
                                  </Label>
                                  <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                    {bene &&
                                      bene.beneTrustee &&
                                      bene.beneTrustee[0]}
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Gender assigned at birth
                                  </Label>
                                  <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                    {bene &&
                                      bene.beneGender &&
                                      bene.beneGender[0]}
                                  </span>
                                </div>
                              )}
                            </Container>
                          </Container>
                        </Grid>
                        <Divider className="hidden sm:block" />
                        <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                              {bene.benePartyType[0] === "Trust" ? (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Tax ID of Trust
                                  </Label>

                                  <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                    {bene &&
                                      bene.beneGovtid &&
                                      "XXX-XX-" + bene.beneGovtid[0].substr(-4)}
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Birth Date
                                  </Label>

                                  <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                    {bene &&
                                      bene.beneDob &&
                                      moment(bene.beneDob[0]).format(
                                        "MM-DD-YYYY"
                                      )}
                                  </span>
                                </div>
                              )}
                            </Container>
                          </Container>
                          <Container className="col-span-6 sm:col-span-1">
                            <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Phone Number
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene && bene.benePhone && bene.benePhone[0]}
                              </span>
                            </Container>
                          </Container>
                        </Grid>
                        <Divider className="hidden sm:block" />
                        <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                          {bene.benePartyType[0] === "Person" && (
                            <Container className="col-span-3 sm:col-span-1">
                              <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                                <Label
                                  htmlFor="amount"
                                  className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Social Security Number
                                </Label>

                                <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                  {bene &&
                                    bene.beneGovtid &&
                                    "XXX-XX-" + bene.beneGovtid[0].substr(-4)}
                                </span>
                              </Container>
                            </Container>
                          )}
                          <Container className="col-span-6 sm:col-span-1">
                            <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Email ID
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene && bene.beneEmail && bene.beneEmail[0]}
                              </span>
                            </Container>
                          </Container>
                        </Grid>
                        <Divider className="hidden sm:block" />
                        <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Address Line 1
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneAddressLine1 &&
                                  bene.beneAddressLine1[0]}
                              </span>
                            </Container>
                          </Container>
                          <Container className="col-span-6 sm:col-span-1">
                            <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Address Line 2
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene && bene.beneAddressLine2
                                  ? bene.beneAddressLine2[0]
                                  : ""}
                              </span>
                            </Container>
                          </Container>
                        </Grid>
                        <Divider className="hidden sm:block" />
                        <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                City
                              </Label>

                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneAddressCity &&
                                  bene.beneAddressCity[0]}
                              </span>
                            </Container>
                          </Container>
                          <Container className="col-span-6 sm:col-span-1">
                            <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                State
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneAddressState &&
                                  bene.beneAddressState[0]}
                              </span>
                            </Container>
                          </Container>
                        </Grid>
                        <Divider className="hidden sm:block" />
                        <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Zip
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneAddressZip &&
                                  bene.beneAddressZip[0]}
                              </span>
                            </Container>
                          </Container>
                        </Grid>
                        <Divider className="hidden sm:block" />
                        <Grid className="grid-cols-2 gap-0 sm:gap-4 border-bt ml-3 sm:ml-0  ">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Relationship with owner
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneRelationOwner &&
                                  bene.beneRelationOwner[0]}
                              </span>
                            </Container>
                          </Container>
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Percentage Sharing (%)
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneSharingPercent &&
                                  bene.beneSharingPercent[0]}
                              </span>
                            </Container>
                          </Container>
                        </Grid>
                        <Divider className="hidden sm:block" />
                        <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mb-2 sm:mb-0">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                              <Label
                                htmlFor="amount"
                                className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Is this designation irrevocable?
                              </Label>
                              <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                                {bene &&
                                  bene.beneIrrevocable &&
                                  bene.beneIrrevocable[0]}
                              </span>
                            </Container>
                          </Container>
                        </Grid>
                      </Panel>
                    </div>
                  )
                );
              })}
          </Panel>
          <Panel header={"Product Details"} className="review-header">
            <Panel header="Amount you want to invest" className="review-panel">
              <Grid className="grid-cols-1 gap-4 border-bt  ml-3 sm:ml-0 mt-2 sm:mt-0">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Amount Investing
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {value &&
                        value.amountInvesting &&
                        value.amountInvesting[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-1 gap-4 border-bt  ml-3 sm:ml-0">
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Term
                    </Label>
                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {value && value.guaranteedTerm && value.guaranteedTerm[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-1 gap-4 border-bt mb-2 sm:mb-0">
                <Container className="rev-width col-span-6 sm:col-span-1  ml-3 sm:ml-0">
                  <Container className="grid-rows-2 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      State
                    </Label>
                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {value && value.issueState && value.issueState[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
            </Panel>
            <Panel header="Selected Rider(s)" className="review-panel">
              {riders?.map(item => {
                mapRiderNames(item);
                return (
                  <div className=" mt-2 sm:mt-0 mb-2 sm:mb-0">
                    <Grid className="grid-cols-1 gap-0 sm:gap-4 border-bt  ml-3 sm:ml-0 ">
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                          <Label
                            htmlFor="amount"
                            className="text-black pl-1 sm:pl-0 p-0 sm:p-1 mt-1 sm:mt-0 mb-1sm:mb-0 text-13 sm:text-sm font-semibold sm:font-normal"
                          >
                            {disp}
                          </Label>

                          <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                            {""}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    <Divider className="hidden sm:block" />
                  </div>
                );
              })}
            </Panel>
            <Panel header="Your Guaranteed Growth" className="review-panel">
              <Grid className="grid-cols-1 gap-4 border-bt  ml-3 sm:ml-0 mt-2 sm:mt-0">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Guaranteed Interest Rate
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {value && value.guaranteedRate && value.guaranteedRate[0] + "%"}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Divider className="hidden sm:block" />
              <Grid className="grid-cols-1 gap-4 border-bt  ml-3 sm:ml-0 mb-2 sm:mb-0">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3 mt-0 sm:mt-3 ">
                    <Label
                      htmlFor="amount"
                      className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Guaranteed Amount Value
                    </Label>

                    <span className="ml-8 text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                      {quoteData && "$" + quoteData.payload.projectedValue}
                    </span>
                  </Container>
                </Container>
              </Grid>
            </Panel>
          </Panel>
          <Panel header={"Suitability Check"} className="review-header">
            {questions?.map((o, i) => {
              return (
                <div>
                  <Grid className="grid-cols-2 gap-4 p-4">
                    <Container className="w-full col-span-3 sm:col-span-1">
                      <Container className="grid-rows-1">
                        <Label
                          htmlFor="amount"
                          className="text-black text-13 sm:text-sm font-semibold sm:font-normal"
                        >
                          {o.title}
                        </Label>
                      </Container>
                    </Container>
                    <Container className="w-1/4 col-span-3 sm:col-span-1">
                      <Container className="grid-rows-2">
                        <span className="ml-72  text-blue-800 text-13 sm:text-sm font-semibold sm:font-semibold">
                          {suit?.map((x, u) => {
                            return o.name === x[0] && x[1][0];
                          })}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                  <Divider />
                </div>
              );
            })}
          </Panel>
        </Card>
      </div>
    </>
  );
};
export default withAuthentication(viewapplication);
