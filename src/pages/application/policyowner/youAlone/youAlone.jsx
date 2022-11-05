import { useEffect, useState } from "react";
import { Button, Label } from "@components/forms";
import { Sider } from "@components/sidebar";
import { Stepper } from "@components/stepper";
import { useAuth } from "@context/auth";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { withAuthentication } from "@utils/route-hocs";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Tooltip } from "primereact/tooltip";
import { Flex, Container, Grid } from "@components/layout";
import { Divider } from "primereact/divider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import PersonalInfo from "./../../commonForms/personalInfo";
import AddressInfo from "./../../commonForms/addressInfo";
import MailInfo from "./../../commonForms/mailInfo";
import AnnuitantInfo from "../../commonForms/annuitantInfo";
import Link from "next/link";
import moment from "moment";
import {
  Url,
  createPolicy,
  products,
  createPolicyHolder,
  auxDataUrl,
  policies,
  updatePolicy,
  update,
} from "../../../../constants/apiconstant";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.YOUALONE}`;
const title = "You Alone";
const description = "Application flow You Alone.";

const personalInformationForm = () => {
  const router = useRouter();
  const { query } = router;
  const [val, setValue] = useState();
  const [value, setValues] = useState();
  const [isAnnuitant, setisAnnuitant] = useState();
  const [isLocator, setIsLocator] = useState(false);
  const [locatorOnFetch, setLocatorOnFetch] = useState();
  const [annuitant, setAnnuitant] = useState();
  const [state, setStates] = useState([]);
  const [prevLocators, setPrevLocators] = useState([]);
  const [queryLocator, setQueryLocator] = useState(query.polLocator);
  const {
    state: { user },
  } = useAuth();

  var previousLocator = [];
  var currentLocator = [];

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  const annuitantheader = (
    <Flex className="card-header ml-9 sm:ml-0">
      <img className="icon-image" src={IMAGE_PATHS.ANNUITANT} />
      <h4 className="p-1 my-1 sub-font-size font-semibold">
        Annuitant Details
      </h4>
      <label className="m-2 text-base text-black-700">
      <Tooltip target=".custom-target-icon" />
        <i className="custom-target-icon pi pi-info-circle"
        data-pr-tooltip="The annuitant is the person whose life governs the contract. If you have an Enhanced Death Benefit or Nursing Home Rider, they are the person whose death or nursing home confinement triggers the rider. If you chose to annuitize the contract at any point then the annuity payment will be based on their life. In this contract, the annuitant is assumed to be the primary owner unless you state otherwise. However, in the event that the purchaser is a trust, then the trustee must name a true person as an annuitant."
         data-pr-position="right"></i>  
      </label>
    </Flex>
  );

  // API Call

  async function getStatesData() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

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
        const stateValue = data[1].policyConfiguration.fields;

        stateValue.map((o) => {
          if (o.name === "eligibleStates") {
            setStates(o.values);
          }
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getStatesData();
    getPolicy();
    fetchPolicyDetails();
    setisAnnuitant(true);
    setValue(false);
  }, []);

  async function fetchPolicyDetails() {
    const pl = sessionStorage.getItem("policyLocator");
    const passLocator = queryLocator ? queryLocator : pl;
    sessionStorage.setItem("policyLocator", passLocator);
    const beneficiary = [];
    const contigent = [];
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + "/policy/" + passLocator, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.locator) {
          const loc = data.locator;
          setIsLocator(true);
          setLocatorOnFetch(data.locator);
        }
        data.exposures &&
          data.exposures.map((o) => {
            if (o.name === "Annuitant") {
              setAnnuitant(o.characteristics[0].fieldValues);
              if (
                o.characteristics[0].fieldValues.annuitantFirstname[0] ===
                data.characteristics[0].fieldValues.primaryOwnerFirstname[0]
              ) {
                setisAnnuitant(true);
                sessionStorage.setItem(
                  "AL",
                  data.exposures[0].characteristics[0].exposureLocator
                );
              } else {
                setisAnnuitant(false);
              }
              if (
                data.characteristics[0].fieldValues
                  .primaryResidenceAddressLine1[0] ===
                data.characteristics[0].fieldValues
                  .primaryMailingAddressLine1[0]
              ) {
                setValue(false);
              } else {
                setValue(true);
              }
            }
          });

        setValues(data.characteristics && data.characteristics[0].fieldValues);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  const checkCreateOrUpdate = (values) => {
    if (isLocator === false) {
      postdata(values);
    } else if (isLocator === true) {
      policyUpdate(values);
    }
  };

  async function policyUpdate(values) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    var updateData = {
      finalize: false,
      // "policyholderLocator":policyFinder.locator,
      productName: "MYGA",
      // "policyStartTimestamp": "1634335715000",
      // "policyEndTimestamp":"1667372400000",
      fieldValues: {
        appType: "Individual",
        appReceivedDate: today,
        appSignedDate: today,
        // "issueState":"CA",
        polEffDate: today,
        qualType: "Non Qualified",
        // "amountInvesting": 1000,
        // "guaranteedTerm": "4",
        primaryOwnerType: "Person",
        primaryOwnerFirstname: values.personalInfo.primaryOwnerFirstname,
        primaryOwnerMiddlename: values.personalInfo.primaryOwnerMiddlename,
        primaryOwnerLastname: values.personalInfo.primaryOwnerLastname,
        primaryOwnerGender: values.personalInfo.primaryOwnerGender,
        primaryOwnerDob: moment(values.personalInfo.primaryOwnerDob).format(
          "YYYY-MM-DD"
        ),
        primaryOwnerGovtidtype: "SSN",
        primaryOwnerGovtid: values.personalInfo.primaryOwnerGovtid,
        primaryOwnerEmail: values.personalInfo.primaryOwnerEmail,
        primaryOwnerPhone: values.personalInfo.primaryOwnerPhone,
        primaryResidenceAddressLine1:
          values.addressInfo.primaryResidenceAddressLine1,
        primaryResidenceAddressLine2:
          values.addressInfo.primaryResidenceAddressLine2,
        primaryResidenceAddressCity:
          values.addressInfo.primaryResidenceAddressCity,
        primaryResidenceAddressState:
          values.addressInfo.primaryResidenceAddressState,
        primaryResidenceAddressZip:
          values.addressInfo.primaryResidenceAddressZip,
        primaryResidenceAddressCountry:
          values.addressInfo.primaryResidenceAddressCountry,
        primaryMailingAddressLine1:
          values.mailInfo.primaryMailingAddressLine1 === ""
            ? values.addressInfo.primaryResidenceAddressLine1
            : values.mailInfo.primaryMailingAddressLine1,
        primaryMailingAddressLine2:
          values.mailInfo.primaryMailingAddressLine1 === ""
            ? values.addressInfo.primaryResidenceAddressLine2
            : values.mailInfo.primaryMailingAddressLine2,
        primaryMailingAddressCity:
          values.mailInfo.primaryMailingAddressCity === ""
            ? values.addressInfo.primaryResidenceAddressCity
            : values.mailInfo.primaryMailingAddressCity,
        primaryMailingAddressState:
          values.mailInfo.primaryMailingAddressState === ""
            ? values.addressInfo.primaryResidenceAddressState
            : values.mailInfo.primaryMailingAddressState,
        primaryMailingAddressZip:
          values.mailInfo.primaryMailingAddressZip === ""
            ? values.addressInfo.primaryResidenceAddressZip
            : values.mailInfo.primaryMailingAddressZip,
        primaryMailingAddressCountry:
          values.mailInfo.primaryMailingAddressCountry === ""
            ? values.addressInfo.primaryResidenceAddressCountry
            : values.mailInfo.primaryMailingAddressCountry,
        polStatus: "Draft",
        isPrimaryOwnerSameAsAnnuitant: isAnnuitant ? "Yes" : "No",
        esignatureStatus: "Not Started",
        guaranteedRate: "0",
      },

      updateExposures: {
        exposureLocator: sessionStorage.getItem("AL"),
        fieldValues: {
          annuitantFirstname:
            isAnnuitant === true
              ? values.personalInfo.primaryOwnerFirstname
              : values.annuitantInfo.annuitantFirstname,
          annuitantMiddlename:
            isAnnuitant === true
              ? values.personalInfo.primaryOwnerMiddlename
              : values.annuitantInfo.annuitantMiddlename,
          annuitantLastname:
            isAnnuitant === true
              ? values.personalInfo.primaryOwnerLastname
              : values.annuitantInfo.annuitantLastname,
          annuitantGovtidtype: "SSN",
          annuitantGovtid:
            isAnnuitant === true
              ? values.personalInfo.primaryOwnerGovtid
              : values.annuitantInfo.annuitantGovtid,
          annuitantDob:
            isAnnuitant === true
              ? moment(values.personalInfo.primaryOwnerDob).format("YYYY-MM-DD")
              : moment(values.annuitantInfo.annuitantDob).format("YYYY-MM-DD"),
          annuitantEmail:
            isAnnuitant === true
              ? values.personalInfo.primaryOwnerEmail
              : values.annuitantInfo.annuitantEmail,
          annuitantPhone:
            isAnnuitant === true
              ? values.personalInfo.primaryOwnerPhone
              : values.annuitantInfo.annuitantPhone,
          annuitantGender:
            isAnnuitant === true
              ? values.personalInfo.primaryOwnerGender
              : values.annuitantInfo.annuitantGender,
          annuitantAddressLine1:
            isAnnuitant === true
              ? values.addressInfo.primaryResidenceAddressLine1
              : values.annuitantInfo.annuitantAddressLine1,
          annuitantAddressLine2:
            isAnnuitant === true
              ? values.addressInfo.primaryResidenceAddressLine2
              : values.annuitantInfo.annuitantAddressLine2,
          annuitantAddressCity:
            isAnnuitant === true
              ? values.addressInfo.primaryResidenceAddressCity
              : values.annuitantInfo.annuitantAddressCity,
          annuitantAddressZip:
            isAnnuitant === true
              ? values.addressInfo.primaryResidenceAddressZip
              : values.annuitantInfo.annuitantAddressZip,
          annuitantAddressState:
            isAnnuitant === true
              ? values.addressInfo.primaryResidenceAddressState
              : values.annuitantInfo.annuitantAddressState,
        },
      },
    };
    await fetch(Url + updatePolicy + locatorOnFetch + update, {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = "/application/beneficiary";
      })
      .catch((errors) => {
        console.log("Error:", errors);
      });
  }

  async function postdata(values) {
    const body = {
      values: {
        owner_full_name: values.personalInfo.primaryOwnerMiddlename
          ? values.personalInfo.primaryOwnerFirstname +
            " " +
            values.personalInfo.primaryOwnerMiddlename +
            " " +
            values.personalInfo.primaryOwnerLastname
          : values.personalInfo.primaryOwnerFirstname +
            " " +
            values.personalInfo.primaryOwnerLastname,
        owner_email: values.personalInfo.primaryOwnerEmail,
      },
    };

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const policyFinder = await fetch(Url + createPolicyHolder, {
      method: "POST",
      body: JSON.stringify(body),

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

    const policy = {
      finalize: false,
      policyholderLocator: policyFinder.locator,
      productName: "MYGA",
      // "policyStartTimestamp": "1634335715000",
      // "policyEndTimestamp":"1667372400000",
      fieldValues: {
        appType: "Individual",
        appReceivedDate: today,
        appSignedDate: today,
        // "issueState":"CA",
        polEffDate: today,
        qualType: "Non Qualified",
        // "amountInvesting": 1000,
        // "guaranteedTerm": "4",
        primaryOwnerType: "Person",
        achAmount: 0,
        "1035Amount": 0,
        amountInvested: 0,
        // amountInvested:"0",
        primaryOwnerFirstname: values.personalInfo.primaryOwnerFirstname,
        primaryOwnerMiddlename: values.personalInfo.primaryOwnerMiddlename,
        primaryOwnerLastname: values.personalInfo.primaryOwnerLastname,
        primaryOwnerGender: values.personalInfo.primaryOwnerGender,
        primaryOwnerDob: moment(values.personalInfo.primaryOwnerDob).format(
          "YYYY-MM-DD"
        ),
        primaryOwnerGovtidtype: "SSN",
        primaryOwnerGovtid: values.personalInfo.primaryOwnerGovtid,
        primaryOwnerEmail: values.personalInfo.primaryOwnerEmail,
        primaryOwnerPhone: values.personalInfo.primaryOwnerPhone,
        primaryResidenceAddressLine1:
          values.addressInfo.primaryResidenceAddressLine1,
        primaryResidenceAddressLine2:
          values.addressInfo.primaryResidenceAddressLine2,
        primaryResidenceAddressCity:
          values.addressInfo.primaryResidenceAddressCity,
        primaryResidenceAddressState:
          values.addressInfo.primaryResidenceAddressState,
        primaryResidenceAddressZip:
          values.addressInfo.primaryResidenceAddressZip,
        primaryResidenceAddressCountry:
          values.addressInfo.primaryResidenceAddressCountry,
        primaryMailingAddressLine1:
          values.mailInfo.primaryMailingAddressLine1 === ""
            ? values.addressInfo.primaryResidenceAddressLine1
            : values.mailInfo.primaryMailingAddressLine1,
        primaryMailingAddressLine2:
          values.mailInfo.primaryMailingAddressLine1 === ""
            ? values.addressInfo.primaryResidenceAddressLine2
            : values.mailInfo.primaryMailingAddressLine2,
        primaryMailingAddressCity:
          values.mailInfo.primaryMailingAddressCity === ""
            ? values.addressInfo.primaryResidenceAddressCity
            : values.mailInfo.primaryMailingAddressCity,
        primaryMailingAddressState:
          values.mailInfo.primaryMailingAddressState === ""
            ? values.addressInfo.primaryResidenceAddressState
            : values.mailInfo.primaryMailingAddressState,
        primaryMailingAddressZip:
          values.mailInfo.primaryMailingAddressZip === ""
            ? values.addressInfo.primaryResidenceAddressZip
            : values.mailInfo.primaryMailingAddressZip,
        primaryMailingAddressCountry:
          values.mailInfo.primaryMailingAddressCountry === ""
            ? values.addressInfo.primaryResidenceAddressCountry
            : values.mailInfo.primaryMailingAddressCountry,
        isPrimaryOwnerSameAsAnnuitant:
          values.annuitantInfo.annuitantFirstname === "" ? "Yes" : "No",
        polStatus: "Draft",
        esignatureStatus: "Not Started",
        guaranteedRate: "0",
      },

      exposures: [
        {
          exposureName: "Annuitant",
          fieldValues: {
            annuitantFirstname:
              values.annuitantInfo.annuitantFirstname === ""
                ? values.personalInfo.primaryOwnerFirstname
                : values.annuitantInfo.annuitantFirstname,
            annuitantMiddlename:
              values.annuitantInfo.annuitantMiddlename === ""
                ? values.personalInfo.primaryOwnerMiddlename
                : values.annuitantInfo.annuitantMiddlename,
            annuitantLastname:
              values.annuitantInfo.annuitantLastname === ""
                ? values.personalInfo.primaryOwnerLastname
                : values.annuitantInfo.annuitantLastname,
            annuitantGovtidtype: "SSN",
            annuitantGovtid:
              values.annuitantInfo.annuitantGovtid === ""
                ? values.personalInfo.primaryOwnerGovtid
                : values.annuitantInfo.annuitantGovtid,
            annuitantDob:
              values.annuitantInfo.annuitantDob === ""
                ? moment(values.personalInfo.primaryOwnerDob).format(
                    "YYYY-MM-DD"
                  )
                : moment(values.annuitantInfo.annuitantDob).format(
                    "YYYY-MM-DD"
                  ),
            annuitantEmail:
              values.annuitantInfo.annuitantEmail === ""
                ? values.personalInfo.primaryOwnerEmail
                : values.annuitantInfo.annuitantEmail,
            annuitantPhone:
              values.annuitantInfo.annuitantPhone === ""
                ? values.personalInfo.primaryOwnerPhone
                : values.annuitantInfo.annuitantPhone,
            annuitantGender:
              values.annuitantInfo.annuitantGender === ""
                ? values.personalInfo.primaryOwnerGender
                : values.annuitantInfo.annuitantGender,
            annuitantAddressLine1:
              values.annuitantInfo.annuitantAddressLine1 === ""
                ? values.addressInfo.primaryResidenceAddressLine1
                : values.annuitantInfo.annuitantAddressLine1,
            annuitantAddressLine2:
              values.annuitantInfo.annuitantAddressLine1 === ""
                ? values.addressInfo.primaryResidenceAddressLine2
                : values.annuitantInfo.annuitantAddressLine2,
            annuitantAddressCity:
              values.annuitantInfo.annuitantAddressCity === ""
                ? values.addressInfo.primaryResidenceAddressCity
                : values.annuitantInfo.annuitantAddressCity,
            annuitantAddressZip:
              values.annuitantInfo.annuitantAddressZip === ""
                ? values.addressInfo.primaryResidenceAddressZip
                : values.annuitantInfo.annuitantAddressZip,
            annuitantAddressState:
              values.annuitantInfo.annuitantAddressState === ""
                ? values.addressInfo.primaryResidenceAddressState
                : values.annuitantInfo.annuitantAddressState,
          },
        },
      ],
    };

    const createIndividualPolicy = await fetch(Url + createPolicy, {
      method: "POST",
      body: JSON.stringify(policy),

      headers: {
        Authorization: auth.authorizationToken,

        "Content-Type": "application/json",

        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        sessionStorage.setItem("policyLocator", data.locator);
        sessionStorage.setItem(
          "AL",
          data.exposures[0].characteristics[0].exposureLocator
        );
        if (data.locator) {
          currentLocator.push(data.locator);
        }
        const allpolicies = {
          auxData: {
            key: data.locator,
            value: data.locator,
          },
        };
        await fetch(Url + auxDataUrl + "allPolicies", {
          method: "PUT",
          body: JSON.stringify(allpolicies),

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

        pagestatus(auth, data.locator);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    async function pagestatus(auth, locator) {
      const pl = sessionStorage.getItem("policyLocator");

      const status = {
        auxData: {
          key: "stepper",
          value: "true,false,false,true,true,false,false,false,false",
        },
      };
      let userId = sessionStorage.getItem("userName");
      var finalData = [].concat(prevLocators, currentLocator);
      var value = finalData.join();

      const user = {
        auxData: {
          key: "policies",
          value: value,
        },
      };

      const setUser = await fetch(Url + auxDataUrl + userId, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          Authorization: auth.authorizationToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
          console.log("Error:", error);
        });
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

      window.location.href = "/application/beneficiary";
    }
  }

  async function getPolicy() {
    let userId = sessionStorage.getItem("userName");

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + auxDataUrl + userId + policies, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.value !== "") {
          previousLocator.push(data.value);
          setPrevLocators(previousLocator);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  // Formik Code

  const validation = Yup.object({
    personalInfo: Yup.object({
      primaryOwnerFirstname: Yup.string()
        .required("First Name is required")
        .min(3, "At least 03 characters")
        .max(25, "Maximum 25 characters are allowed"),
      primaryOwnerMiddlename: Yup.string(),
      primaryOwnerLastname: Yup.string()
        .required("Last Name is required")
        .min(3, "At least 03 characters")
        .max(25, "Maximum 25 characters are allowed"),
      primaryOwnerGovtid: Yup.string()
        .required("This field is required")
        .typeError("You must specify a number")
        .min(11, "Minimum 9 characters are allowed")
        .matches(/^[0-9-+()]*$/, "Must be only digits"),

      primaryOwnerDob: Yup.date()
        .required("Birth Date is required")
        .typeError("You must specify a date")
        .test("DOB", "The entered date cannot be in the future.", (value) => {
          return moment().diff(moment(value), moment(today)) > 1;
        })
        .test(
          "DOB",
          "The Minimum Age for Owner Should be 18 Years",
          (value) => {
            return moment().diff(moment(value), "years") >= 18;
          }
        )
        .test(
          "DOB",
          "The Maximum Age for Owner Should be 80 Years",
          (value) => {
            return moment().diff(moment(value), "years") <= 80;
          }
        ),
      primaryOwnerGender: Yup.string().required("Gender is required"),
      primaryOwnerPhone: Yup.string()
        .required("A phone number is required")
        .typeError("That doesn't look like a phone number"),
      // .length(10, "10 characters are allowed")
      // .matches(/^[0-9]+$/, "Please enter numbers only"),
      primaryOwnerEmail: Yup.string()
        .email(" Invalid email address")
        .max(255)
        .required("Email is required"),
    }),

    addressInfo: Yup.object({
      primaryResidenceAddressLine1: Yup.string()
        .required("Address Line 1 is required")
        .max(50, "Maximum 50 characters are allowed"),
      primaryResidenceAddressCity: Yup.string().required("Enter city name"),
      primaryResidenceAddressState: Yup.string()
        .required("Please select a state")
        .oneOf(state, "Selected state is not Approved"),
      primaryResidenceAddressZip: Yup.string()
        .required("Postal Code is required ")
        .typeError("You must specify a number")
        .matches(/^[0-9]+$/, "Must be only digits")
        .max(5, "5 characters are allowed")
        .min(5, "5 characters are allowed"),
    }),
    mailInfo: val
      ? Yup.object({
          primaryMailingAddressLine1: Yup.string()
            .required("Address Line 1 is required")
            .max(50, "Maximum 50 characters are allowed"),
          primaryMailingAddressCity: Yup.string().required("Enter city name"),
          primaryMailingAddressState: Yup.string().required(
            "Please select a state"
          ),
          primaryMailingAddressZip: Yup.string()
            .required("Postal Code is required ")
            .typeError("You must specify a number")
            .matches(/^[0-9]+$/, "Must be only digits")
            .max(5, "5 characters are allowed")
            .min(5, "5 characters are allowed"),
        })
      : null,

    annuitantInfo:
      isAnnuitant === false
        ? Yup.object({
            annuitantFirstname: Yup.string()
              .required("First Name is required")
              .min(3, "At least 03 characters")
              .max(25, "Maximum 25 characters are allowed"),
            annuitantMiddlename: Yup.string(),
            annuitantLastname: Yup.string()
              .required("Last Name is required")
              .min(3, "At least 03 characters")
              .max(25, "Maximum 25 characters are allowed"),
            annuitantGovtid: Yup.string()
              .required("This field is required")
              .typeError("You must specify a number")
              .matches(/^[0-9-+()]*$/, "Must be only digits")
              .min(11, "Minimum 9 characters are allowed"),
            annuitantDob: Yup.date()
              .required("Birth Date is required")
              .typeError("You must specify a date")
              .test(
                "DOB",
                "The entered date cannot be in the future.",
                (value) => {
                  return moment().diff(moment(value), moment(today)) > 1;
                }
              )
              .test(
                "DOB",
                "The Maximum Age for  Annuitant  Should be 80 Years",
                (value) => {
                  return moment().diff(moment(value), "years") <= 80;
                }
              ),
            annuitantGender: Yup.string().required("Gender is required"),
            annuitantPhone: Yup.string()
              .required("A phone number is required")
              .typeError("That doesn't look like a phone number"),
            // .length(10, "10 characters are allowed")
            // .matches(/^[0-9]+$/, "Please enter numbers only"),
            annuitantEmail: Yup.string()
              .email(" Invalid email address")
              .max(255)
              .required("Email is required")
              .test(
                "state",
                "Email Id of owner and annuitant cannot be same ",
                (mail) => {
                  return mail !== formik.values.personalInfo.primaryOwnerEmail;
                }
              ),
            annuitantAddressLine1: Yup.string()
              .required("Address Line 1 is required")
              .max(50, "Maximum 50 characters are allowed"),
            annuitantAddressCity: Yup.string().required("Enter city name"),
            annuitantAddressState: Yup.string().required(
              "Please select a state"
            ),
            annuitantAddressZip: Yup.string()
              .required("Postal Code is required ")
              .typeError("You must specify a number")
              .matches(/^[0-9]+$/, "Must be only digits")
              .max(5, "5 characters are allowed")
              .min(5, "5 characters are allowed"),
          })
        : null,
  });

  const formik = useFormik({
    initialValues: {
      personalInfo: {
        primaryOwnerFirstname:
          value && value.primaryOwnerFirstname
            ? value.primaryOwnerFirstname[0]
            : "",
        primaryOwnerMiddlename:
          value && value.primaryOwnerMiddlename
            ? value.primaryOwnerMiddlename[0]
            : "",
        primaryOwnerLastname:
          value && value.primaryOwnerLastname
            ? value.primaryOwnerLastname[0]
            : "",
        primaryOwnerGovtid:
          value && value.primaryOwnerGovtid ? value.primaryOwnerGovtid[0] : "",
        primaryOwnerDob:
          value && value.primaryOwnerDob
            ? moment(value.primaryOwnerDob[0]).format("MM-DD-YYYY")
            : "",
        primaryOwnerGender:
          value && value.primaryOwnerGender ? value.primaryOwnerGender[0] : "",
        primaryOwnerPhone:
          value && value.primaryOwnerPhone ? value.primaryOwnerPhone[0] : "",
        primaryOwnerEmail:
          value && value.primaryOwnerEmail
            ? value.primaryOwnerEmail[0]
            : user
            ? user.email
            : "",
      },
      addressInfo: {
        primaryResidenceAddressLine1:
          value && value.primaryResidenceAddressLine1
            ? value.primaryResidenceAddressLine1[0]
            : "",
        primaryResidenceAddressLine2:
          value && value.primaryResidenceAddressLine2
            ? value.primaryResidenceAddressLine2[0]
            : "",
        primaryResidenceAddressCity:
          value && value.primaryResidenceAddressCity
            ? value.primaryResidenceAddressCity[0]
            : "",
        primaryResidenceAddressState:
          value && value.primaryResidenceAddressState
            ? value.primaryResidenceAddressState[0]
            : "",
        primaryResidenceAddressZip:
          value && value.primaryResidenceAddressZip
            ? value.primaryResidenceAddressZip[0]
            : "",
        primaryResidenceAddressCountry: "USA",
      },
      mailInfo: {
        primaryMailingAddressLine1:
          value && value.primaryMailingAddressLine1
            ? value.primaryMailingAddressLine1[0]
            : "",
        primaryMailingAddressLine2:
          value && value.primaryMailingAddressLine2
            ? value.primaryMailingAddressLine2[0]
            : "",
        primaryMailingAddressCity:
          value && value.primaryMailingAddressCity
            ? value.primaryMailingAddressCity[0]
            : "",
        primaryMailingAddressState:
          value && value.primaryMailingAddressState
            ? value.primaryMailingAddressState[0]
            : "",
        primaryMailingAddressZip:
          value && value.primaryMailingAddressZip
            ? value.primaryMailingAddressZip[0]
            : "",
        primaryMailingAddressCountry: "USA",
      },
      annuitantInfo: {
        annuitantFirstname:
          annuitant && annuitant.annuitantFirstname
            ? annuitant.annuitantFirstname[0]
            : "",
        annuitantMiddlename:
          annuitant && annuitant.annuitantMiddlename
            ? annuitant.annuitantMiddlename[0]
            : "",
        annuitantLastname:
          annuitant && annuitant.annuitantLastname
            ? annuitant.annuitantLastname[0]
            : "",
        annuitantGovtid:
          annuitant && annuitant.annuitantGovtid
            ? annuitant.annuitantGovtid[0]
            : "",
        annuitantDob:
          annuitant && annuitant.annuitantDob
            ? moment(annuitant.annuitantDob[0]).format("MM-DD-YYYY")
            : "",
        annuitantGender:
          annuitant && annuitant.annuitantGender
            ? annuitant.annuitantGender[0]
            : "",
        annuitantPhone:
          annuitant && annuitant.annuitantPhone
            ? annuitant.annuitantPhone[0]
            : "",
        annuitantEmail:
          annuitant && annuitant.annuitantEmail
            ? annuitant.annuitantEmail[0]
            : "",
        annuitantAddressLine1:
          annuitant && annuitant.annuitantAddressLine1
            ? annuitant.annuitantAddressLine1[0]
            : "",
        annuitantAddressLine2:
          annuitant && annuitant.annuitantAddressLine2
            ? annuitant.annuitantAddressLine2[0]
            : "",
        annuitantAddressCity:
          annuitant && annuitant.annuitantAddressCity
            ? annuitant.annuitantAddressCity[0]
            : "",
        annuitantAddressState:
          annuitant && annuitant.annuitantAddressState
            ? annuitant.annuitantAddressState[0]
            : "",
        annuitantAddressZip:
          annuitant && annuitant.annuitantAddressZip
            ? annuitant.annuitantAddressZip[0]
            : "",
        annuitantAddressCountry: "USA",
      },
    },
    enableReinitialize: true,
    validationSchema: validation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      checkCreateOrUpdate(values);
    },
  });

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
        <Stepper percent={0} index={0} />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Flex className="flex-col pi-ml">
          <Flex className="flex justify-items-start m-4 sm:m-0 ml-10 md:ml-2 mb-2 sm:mb-5">
            <p className="h-suitability font-bold text-lg md:text-xl">
              Personal Information
            </p>
          </Flex>

          <Grid className="grid-cols-3 ">
            <Container className="col-span-3">
              <PersonalInfo
                heading="Owner"
                icon={IMAGE_PATHS.PERSON}
                formik={formik}
              />
            </Container>

            <Container className="col-span-3">
              <AddressInfo
                heading="Residence Address"
                icon={IMAGE_PATHS.RESIDENCE}
                formik={formik}
              />
            </Container>

            <Card className="card-layout sm:boxes">
              <Grid className="grid grid-cols-2 pr-2">
                <div className="col-span-2 ml-5 pt-0 sm:col-span-1 text-black pt-0 sm:pt-4 text-sm px-2 font-semibold">
                  <Label className="">
                    Is the mailing address different from the residence address?
                  </Label>
                </div>
                <div className="col-span-2 sm:col-span-1 text-black p-1 pt-0 text-md px-2 font-semibold">
                  <Grid className="grid grid-cols-2 ">
                    <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 p-field-radiobutton radio-border h-11 ml-4 sm:ml-0">
                      <RadioButton
                        inputId="mail"
                        name="val"
                        value="yes"
                        onChange={(e) => setValue(true)}
                        checked={val === true}
                      />
                      <label htmlFor="yes" className="p-2 text-sm">
                        Yes
                      </label>
                    </div>
                    <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12  mt-3 p-field-radiobutton radio-border h-11">
                      <RadioButton
                        inputId="mail2"
                        name="val"
                        value="no"
                        onChange={(e) => setValue(false)}
                        checked={val === false}
                      />
                      <label htmlFor="no" className="p-2 text-sm">
                        No
                      </label>
                    </div>
                  </Grid>
                </div>
              </Grid>
            </Card>

            {val && (
              <Container className="col-span-3">
                <MailInfo
                  heading="Mailing Address"
                  icon={IMAGE_PATHS.MAILING}
                  formik={formik}
                />
              </Container>
            )}
            <Card
              header={annuitantheader}
              className="col-span-3 h-26 card-layout"
            >
              <Grid className="grid grid-cols-2  pr-2">
                <div className="col-span-2 ml-5 pt-0 sm:col-span-1 text-black pt-0 sm:pt-4 text-sm px-2 font-semibold">
                  <Label className="">Is this person the annuitant?</Label>
                </div>
                <div className="col-span-2 sm:col-span-1 text-black p-1 pt-0 text-md px-2 font-semibold">
                  <Grid className="grid grid-cols-2 ">
                    <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11 ml-4 sm:ml-0">
                      <RadioButton
                        inputId="annuitant"
                        name="isAnnuitant"
                        value="yes"
                        onChange={(e) => setisAnnuitant(true)}
                        checked={isAnnuitant === true}
                      />
                      <label htmlFor="yes" className="p-2 text-sm">
                        Yes
                      </label>
                    </div>
                    <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12  mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                      <RadioButton
                        inputId="annuitant"
                        name="isAnnuitant"
                        value="no"
                        onChange={(e) => setisAnnuitant(false)}
                        checked={isAnnuitant === false}
                      />
                      <label htmlFor="no" className="p-2 text-sm">
                        No
                      </label>
                    </div>
                  </Grid>
                </div>
              </Grid>

              {isAnnuitant === false && (
                <>
                  <Divider />
                  <Container className="col-span-3">
                    <AnnuitantInfo
                      showHeading={false}
                      header="Annuitant Primary Details"
                      formik={formik}
                    />
                  </Container>
                </>
              )}
            </Card>
          </Grid>
          <Flex className="flex-col-reverse md:flex-row pl-0 sm:pl-55 items-center justify-center space-y-3 sm:justify-between border-gray-400 mt-3 sm:mt-5 mb-5 h-15 pt-5 sm:pt-0 ml-0 sm:ml-0">
            <Link className="w-1/3 " href={ROUTE_PATHS.POLICYOWNER}>
              <Button className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm  w-5/6 my-5 mt-5 sm:mt-8 sm:ml-0 sm:w-1/6">
                Back
              </Button>
            </Link>

            <Button
              type="submit"
              className="btncolor h-10 font-bold py-2 mr-3 ml-2 px-4 rounded-r w-5/6 sm:w-1/6"
            >
              Save & Continue
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
};
export default withAuthentication(personalInformationForm);
