import { useEffect, useState } from "react";
import { Button, Label } from "@components/forms";
import { Sider } from "@components/sidebar";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Card } from "primereact/card";
import { withAuthentication } from "@utils/route-hocs";
import { Stepper } from "@components/stepper";
import { useAuth } from "@context/auth";
import { RadioButton } from "primereact/radiobutton";
import { Tooltip } from "primereact/tooltip";
import { Divider } from "primereact/divider";
import { Flex, Container, Grid } from "@components/layout";
import { TabView, TabPanel } from "primereact/tabview";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { NextLink } from "@components/next-link";
import { useFormik } from "formik";
import * as Yup from "yup";
import PersonalInfo from "../../commonForms/personalInfo";
import AddressInfo from "../../commonForms/addressInfo";
import MailInfo from "./../../commonForms/mailInfo";
import AnnuitantInfo from "../../commonForms/annuitantInfo";
import moment from "moment";
import {
  Url,
  createPolicy,
  createPolicyHolder,
  products,
  auxDataUrl,
  policies,
  updatePolicy,
  update,
} from "../../../../constants/apiconstant";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Joint Owner";
const description =
  "Enables you to resend the registration activation link to your email address.";

const jointOwnerForm = () => {
  const router = useRouter();
  const { query } = router;
  const [val, setValue] = useState();
  const [value, setValues] = useState();
  const [jointval, setjointValue] = useState();
  const [annuitant, setAnnuitant] = useState();
  const [primOwner, setPrimaryOwner] = useState();
  const [prevLocators, setPrevLocators] = useState([]);
  const [isLocator, setIsLocator] = useState(false);
  const [locatorOnFetch, setLocatorOnFetch] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnnuitant, setisAnnuitant] = useState();
  const [isjointAnnuitant, setisjointAnnuitant] = useState();
  const [state, setStates] = useState([]);
  const [queryLocator, setQueryLocator] = useState(query.polLocator);

  var locators = [];
  const handleChange = (e) => {
    setValue(value);
  };

  const {
    state: { user },
  } = useAuth();

  var previousLocator = [];

  async function fetchPolicyDetails() {
    const pl = sessionStorage.getItem("policyLocator");
    const passLocator = queryLocator ? queryLocator : pl;
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
              if (
                o.characteristics[0].fieldValues.annuitantFirstname[0] ===
                data.characteristics[0].fieldValues.jointOwnerFirstname[0]
              ) {
                setisjointAnnuitant(true);
              } else {
                setisjointAnnuitant(false);
              }
              if (
                data.characteristics[0].fieldValues
                  .jointResidenceAddressLine1[0] ===
                data.characteristics[0].fieldValues.jointMailingAddressLine1[0]
              ) {
                setjointValue(false);
              } else {
                setjointValue(true);
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
    setisAnnuitant(true);
    setValue(false);
    setjointValue(false);
    fetchPolicyDetails();
    getStatesData();
    getPolicy();
  }, []);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  var today = yyyy + "-" + mm + "-" + dd;

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
        .matches(/^[0-9-+()]*$/, "Must be only digits")
        .min(11, "Minimum 9 characters are allowed"),
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
      isjointAnnuitant === false
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
            //   annuitantEmail: Yup.string()
            //     .email(" Invalid email address")
            //     .max(255)
            //     .required("Email is required")
            //     .test("state",
            // "Mail Id of owner and annuitant cannot be same ",
            // (mail) => {
            //   console.log(mail,formik.values.personalInfo.primaryOwnerEmail,"mail")
            //   return mail!==formik.values.personalInfo.primaryOwnerEmail
            // }),
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
  const validation2 = Yup.object({
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
        .matches(/^[0-9-+()]*$/, "Must be only digits")
        .min(11, "Minimum 9 characters are allowed"),
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
        .required("Email is required")
        .test(
          "state",
          "Email Id of Primary owner and joint Owner cannot be same ",
          (mail) => {
            return mail !== formik.values.personalInfo.primaryOwnerEmail;
          }
        ),
    }),

    addressInfo: Yup.object({
      primaryResidenceAddressLine1: Yup.string()
        .required("Address Line 1 is required")
        .max(50, "Maximum 50 characters are allowed"),
      primaryResidenceAddressCity: Yup.string().required("Enter city name"),
      primaryResidenceAddressState: Yup.string()
        .required("Please select a state")
        .test(
          "state",
          "Primary owner and joint owner must be resident of same state”",
          (value) => {
            return value === primOwner.addressInfo.primaryResidenceAddressState;
          }
        ),
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
      isjointAnnuitant === false
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
                  return (
                    mail !== formik2.values.personalInfo.primaryOwnerEmail &&
                    mail !== formik.values.personalInfo.primaryOwnerEmail
                  );
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
  async function postdata(jointOwner) {
    const body = {
      values: {
        owner_full_name: primOwner.personalInfo.primaryOwnerMiddlename
          ? primOwner.personalInfo.primaryOwnerFirstname +
            " " +
            primOwner.personalInfo.primaryOwnerMiddlename +
            " " +
            primOwner.personalInfo.primaryOwnerLastname
          : primOwner.personalInfo.primaryOwnerFirstname +
            " " +
            primOwner.personalInfo.primaryOwnerLastname,
        owner_email: primOwner.personalInfo.primaryOwnerEmail,
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

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    var today = yyyy + "-" + mm + "-" + dd;

    const policy = {
      finalize: false,
      policyholderLocator: policyFinder.locator,
      productName: "MYGA",
      fieldValues: {
        appType: "Joint",
        appReceivedDate: today,
        appSignedDate: today,
        issueState: "WA",
        polEffDate: today,
        qualType: "Non Qualified",
        // "amountInvesting": 1000,
        // "guaranteedTerm": "4",
        primaryOwnerType: "Person",
        primaryOwnerFirstname: primOwner.personalInfo.primaryOwnerFirstname,
        primaryOwnerMiddlename: primOwner.personalInfo.primaryOwnerMiddlename,
        primaryOwnerLastname: primOwner.personalInfo.primaryOwnerLastname,
        primaryOwnerGender: primOwner.personalInfo.primaryOwnerGender,
        primaryOwnerDob: moment(primOwner.personalInfo.primaryOwnerDob).format(
          "YYYY-MM-DD"
        ),
        primaryOwnerGovtidtype: "SSN",
        primaryOwnerGovtid: primOwner.personalInfo.primaryOwnerGovtid,
        primaryOwnerEmail: primOwner.personalInfo.primaryOwnerEmail,
        primaryOwnerPhone: primOwner.personalInfo.primaryOwnerPhone,
        primaryResidenceAddressLine1:
          primOwner.addressInfo.primaryResidenceAddressLine1,
        primaryResidenceAddressLine2:
          primOwner.addressInfo.primaryResidenceAddressLine2,
        primaryResidenceAddressCity:
          primOwner.addressInfo.primaryResidenceAddressCity,
        primaryResidenceAddressState:
          primOwner.addressInfo.primaryResidenceAddressState,
        primaryResidenceAddressZip:
          primOwner.addressInfo.primaryResidenceAddressZip,
        primaryResidenceAddressCountry:
          primOwner.addressInfo.primaryResidenceAddressCountry,
        primaryMailingAddressLine1:
          primOwner.mailInfo.primaryMailingAddressLine1 === ""
            ? primOwner.addressInfo.primaryResidenceAddressLine1
            : primOwner.mailInfo.primaryMailingAddressLine1,
        primaryMailingAddressLine2:
          primOwner.mailInfo.primaryMailingAddressLine2 === ""
            ? primOwner.addressInfo.primaryResidenceAddressLine2
            : primOwner.mailInfo.primaryMailingAddressLine2,
        primaryMailingAddressCity:
          primOwner.mailInfo.primaryMailingAddressCity === ""
            ? primOwner.addressInfo.primaryResidenceAddressCity
            : primOwner.mailInfo.primaryMailingAddressCity,
        primaryMailingAddressState:
          primOwner.mailInfo.primaryMailingAddressState === ""
            ? primOwner.addressInfo.primaryResidenceAddressState
            : primOwner.mailInfo.primaryMailingAddressState,
        primaryMailingAddressZip:
          primOwner.mailInfo.primaryMailingAddressZip === ""
            ? primOwner.addressInfo.primaryResidenceAddressZip
            : primOwner.mailInfo.primaryMailingAddressZip,
        primaryMailingAddressCountry:
          primOwner.mailInfo.primaryMailingAddressCountry === ""
            ? primOwner.addressInfo.primaryResidenceAddressCountry
            : primOwner.mailInfo.primaryMailingAddressCountry,
        jointOwnerType: "Person",
        polStatus: "Draft",
        isPrimaryOwnerSameAsAnnuitant: isAnnuitant ? "Yes" : "No",
        isJointOwnerSameAsAnnuitant: isjointAnnuitant ? "Yes" : "No",
        esignatureStatus: "Not Started",
        guaranteedRate: "0",
        achAmount: 0,
        "1035Amount": 0,
        amountInvested: 0,
        jointOwnerFirstname: jointOwner.personalInfo.primaryOwnerFirstname,
        jointOwnerMiddlename: jointOwner.personalInfo.primaryOwnerMiddlename,
        jointOwnerLastname: jointOwner.personalInfo.primaryOwnerLastname,
        jointOwnerGender: jointOwner.personalInfo.primaryOwnerGender,
        jointOwnerDob: moment(jointOwner.personalInfo.primaryOwnerDob).format(
          "YYYY-MM-DD"
        ),
        jointOwnerGovtidtype: "SSN",
        jointOwnerGovtid: jointOwner.personalInfo.primaryOwnerGovtid,
        jointOwnerEmail: jointOwner.personalInfo.primaryOwnerEmail,
        jointOwnerPhone: jointOwner.personalInfo.primaryOwnerPhone,
        jointResidenceAddressLine1:
          jointOwner.addressInfo.primaryResidenceAddressLine1,
        jointResidenceAddressLine2:
          jointOwner.addressInfo.primaryResidenceAddressLine2,
        jointResidenceAddressCity:
          jointOwner.addressInfo.primaryResidenceAddressCity,
        jointResidenceAddressState:
          jointOwner.addressInfo.primaryResidenceAddressState,
        jointResidenceAddressZip:
          jointOwner.addressInfo.primaryResidenceAddressZip,
        jointResidenceAddressCountry: "USA",
        jointMailingAddressLine1:
          jointOwner.mailInfo.primaryMailingAddressLine1 === ""
            ? jointOwner.addressInfo.primaryResidenceAddressLine1
            : jointOwner.mailInfo.primaryMailingAddressLine1,
        jointMailingAddressLine2:
          jointOwner.mailInfo.primaryMailingAddressLine1 === ""
            ? jointOwner.addressInfo.primaryResidenceAddressLine2
            : jointOwner.mailInfo.primaryMailingAddressLine2,
        jointMailingAddressCity:
          jointOwner.mailInfo.primaryMailingAddressCity === ""
            ? jointOwner.addressInfo.primaryResidenceAddressCity
            : jointOwner.mailInfo.primaryMailingAddressCity,
        jointMailingAddressState:
          jointOwner.mailInfo.primaryMailingAddressState === ""
            ? jointOwner.addressInfo.primaryResidenceAddressState
            : jointOwner.mailInfo.primaryMailingAddressState,
        jointMailingAddressZip:
          jointOwner.mailInfo.primaryMailingAddressZip === ""
            ? jointOwner.addressInfo.primaryResidenceAddressZip
            : jointOwner.mailInfo.primaryMailingAddressZip,
        jointMailingAddressCountry: "USA",
      },

      exposures: [
        {
          exposureName: "Annuitant",
          fieldValues: {
            annuitantFirstname:
              isAnnuitant && primOwner.annuitantInfo.annuitantFirstname === ""
                ? primOwner.personalInfo.primaryOwnerFirstname
                : isjointAnnuitant
                ? jointOwner.personalInfo.primaryOwnerFirstname
                : jointOwner.annuitantInfo.annuitantFirstname,

            annuitantMiddlename:
              isAnnuitant && primOwner.annuitantInfo.annuitantMiddlename === ""
                ? primOwner.personalInfo.primaryOwnerMiddlename
                : isjointAnnuitant
                ? jointOwner.personalInfo.primaryOwnerMiddlename
                : jointOwner.annuitantInfo.annuitantMiddlename,

            annuitantLastname:
              isAnnuitant && primOwner.annuitantInfo.annuitantLastname === ""
                ? primOwner.personalInfo.primaryOwnerLastname
                : isjointAnnuitant
                ? jointOwner.personalInfo.primaryOwnerLastname
                : jointOwner.annuitantInfo.annuitantLastname,
            annuitantGovtidtype: "SSN",

            annuitantGovtid:
              isAnnuitant && primOwner.annuitantInfo.annuitantGovtid === ""
                ? primOwner.personalInfo.primaryOwnerGovtid
                : isjointAnnuitant
                ? jointOwner.personalInfo.primaryOwnerGovtid
                : jointOwner.annuitantInfo.annuitantGovtid,

            annuitantDob:
              isAnnuitant && primOwner.annuitantInfo.annuitantDob === ""
                ? moment(primOwner.personalInfo.primaryOwnerDob).format(
                    "YYYY-MM-DD"
                  )
                : isjointAnnuitant
                ? moment(jointOwner.personalInfo.primaryOwnerDob).format(
                    "YYYY-MM-DD"
                  )
                : moment(jointOwner.annuitantInfo.annuitantDob).format(
                    "YYYY-MM-DD"
                  ),

            annuitantEmail:
              isAnnuitant && primOwner.annuitantInfo.annuitantEmail === ""
                ? primOwner.personalInfo.primaryOwnerEmail
                : isjointAnnuitant
                ? jointOwner.personalInfo.primaryOwnerEmail
                : jointOwner.annuitantInfo.annuitantEmail,

            annuitantPhone:
              isAnnuitant && primOwner.annuitantInfo.annuitantPhone === ""
                ? primOwner.personalInfo.primaryOwnerPhone
                : isjointAnnuitant
                ? jointOwner.personalInfo.primaryOwnerPhone
                : jointOwner.annuitantInfo.annuitantPhone,

            annuitantGender:
              isAnnuitant && primOwner.annuitantInfo.annuitantGender === ""
                ? primOwner.personalInfo.primaryOwnerGender
                : isjointAnnuitant
                ? jointOwner.personalInfo.primaryOwnerGender
                : jointOwner.annuitantInfo.annuitantGender,

            annuitantAddressLine1:
              isAnnuitant &&
              primOwner.annuitantInfo.annuitantAddressLine1 === ""
                ? primOwner.addressInfo.primaryResidenceAddressLine1
                : isjointAnnuitant
                ? jointOwner.addressInfo.primaryResidenceAddressLine1
                : jointOwner.annuitantInfo.annuitantAddressLine1,
            annuitantAddressLine2:
              isAnnuitant &&
              primOwner.annuitantInfo.annuitantAddressLine1 === ""
                ? primOwner.addressInfo.primaryResidenceAddressLine2
                : isjointAnnuitant
                ? jointOwner.addressInfo.primaryResidenceAddressLine2
                : jointOwner.annuitantInfo.annuitantAddressLine2,

            annuitantAddressCity:
              isAnnuitant && primOwner.annuitantInfo.annuitantAddressCity === ""
                ? primOwner.addressInfo.primaryResidenceAddressCity
                : isjointAnnuitant
                ? jointOwner.addressInfo.primaryResidenceAddressCity
                : jointOwner.annuitantInfo.annuitantAddressCity,
            annuitantAddressZip:
              isAnnuitant && primOwner.annuitantInfo.annuitantAddressZip === ""
                ? primOwner.addressInfo.primaryResidenceAddressZip
                : isjointAnnuitant
                ? jointOwner.addressInfo.primaryResidenceAddressZip
                : jointOwner.annuitantInfo.annuitantAddressZip,
            annuitantAddressState:
              isAnnuitant &&
              primOwner.annuitantInfo.annuitantAddressState === ""
                ? primOwner.addressInfo.primaryResidenceAddressState
                : isjointAnnuitant
                ? jointOwner.addressInfo.primaryResidenceAddressState
                : jointOwner.annuitantInfo.annuitantAddressState,
          },
        },
      ],
    };

    const createJointPolicy = await fetch(Url + createPolicy, {
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
          locators.push(data.locator);
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
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    async function pagestatus(auth, locator) {
      const pl = sessionStorage.getItem("policyLocator");

      const status = {
        auxData: {
          key: "stepper",
          value: "false,true,false,true,true,false,false,false,false",
        },
      };
      let userId = sessionStorage.getItem("userName");

      var finalData = [].concat(prevLocators, locators);

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

  async function policyUpdate(jointOwner) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    const updateData = {
      finalize: false,
      // "policyholderLocator": policyFinder.locator,
      productName: "MYGA",
      fieldValues: {
        appType: "Joint",
        appReceivedDate: today,
        appSignedDate: today,
        // "issueState": "WA",
        polEffDate: today,
        qualType: "Non Qualified",
        // "amountInvesting": 1000,
        // "guaranteedTerm": "4",
        primaryOwnerType: "Person",
        primaryOwnerFirstname: primOwner.personalInfo.primaryOwnerFirstname,
        primaryOwnerMiddlename: primOwner.personalInfo.primaryOwnerMiddlename,
        primaryOwnerLastname: primOwner.personalInfo.primaryOwnerLastname,
        primaryOwnerGender: primOwner.personalInfo.primaryOwnerGender,
        polStatus: "Draft",
        isPrimaryOwnerSameAsAnnuitant: isAnnuitant ? "Yes" : "No",
        isJointOwnerSameAsAnnuitant: isjointAnnuitant ? "Yes" : "No",
        esignatureStatus: "Not Started",
        guaranteedRate: "0",
        primaryOwnerDob: moment(primOwner.personalInfo.primaryOwnerDob).format(
          "YYYY-MM-DD"
        ),
        primaryOwnerGovtidtype: "SSN",
        primaryOwnerGovtid: primOwner.personalInfo.primaryOwnerGovtid,
        primaryOwnerEmail: primOwner.personalInfo.primaryOwnerEmail,
        primaryOwnerPhone: primOwner.personalInfo.primaryOwnerPhone,
        primaryResidenceAddressLine1:
          primOwner.addressInfo.primaryResidenceAddressLine1,
        primaryResidenceAddressLine2:
          primOwner.addressInfo.primaryResidenceAddressLine2,
        primaryResidenceAddressCity:
          primOwner.addressInfo.primaryResidenceAddressCity,
        primaryResidenceAddressState:
          primOwner.addressInfo.primaryResidenceAddressState,
        primaryResidenceAddressZip:
          primOwner.addressInfo.primaryResidenceAddressZip,
        primaryResidenceAddressCountry:
          primOwner.addressInfo.primaryResidenceAddressCountry,
        primaryMailingAddressLine1:
          primOwner.mailInfo.primaryMailingAddressLine1 === ""
            ? primOwner.addressInfo.primaryResidenceAddressLine1
            : primOwner.mailInfo.primaryMailingAddressLine1,
        primaryMailingAddressLine2:
          primOwner.mailInfo.primaryMailingAddressLine2 === ""
            ? primOwner.addressInfo.primaryResidenceAddressLine2
            : primOwner.mailInfo.primaryMailingAddressLine2,
        primaryMailingAddressCity:
          primOwner.mailInfo.primaryMailingAddressCity === ""
            ? primOwner.addressInfo.primaryResidenceAddressCity
            : primOwner.mailInfo.primaryMailingAddressCity,
        primaryMailingAddressState:
          primOwner.mailInfo.primaryMailingAddressState === ""
            ? primOwner.addressInfo.primaryResidenceAddressState
            : primOwner.mailInfo.primaryMailingAddressState,
        primaryMailingAddressZip:
          primOwner.mailInfo.primaryMailingAddressZip === ""
            ? primOwner.addressInfo.primaryResidenceAddressZip
            : primOwner.mailInfo.primaryMailingAddressZip,
        primaryMailingAddressCountry:
          primOwner.mailInfo.primaryMailingAddressCountry === ""
            ? primOwner.addressInfo.primaryResidenceAddressCountry
            : primOwner.mailInfo.primaryMailingAddressCountry,
        jointOwnerType: "Person",
        jointOwnerFirstname: jointOwner.personalInfo.primaryOwnerFirstname,
        jointOwnerMiddlename: jointOwner.personalInfo.primaryOwnerMiddlename,
        jointOwnerLastname: jointOwner.personalInfo.primaryOwnerLastname,
        jointOwnerGender: jointOwner.personalInfo.primaryOwnerGender,
        jointOwnerDob: moment(jointOwner.personalInfo.primaryOwnerDob).format(
          "YYYY-MM-DD"
        ),
        jointOwnerGovtidtype: "SSN",
        jointOwnerGovtid: jointOwner.personalInfo.primaryOwnerGovtid,
        jointOwnerEmail: jointOwner.personalInfo.primaryOwnerEmail,
        jointOwnerPhone: jointOwner.personalInfo.primaryOwnerPhone,
        jointResidenceAddressLine1:
          jointOwner.addressInfo.primaryResidenceAddressLine1,
        jointResidenceAddressLine2:
          jointOwner.addressInfo.primaryResidenceAddressLine2,
        jointResidenceAddressCity:
          jointOwner.addressInfo.primaryResidenceAddressCity,
        jointResidenceAddressState:
          jointOwner.addressInfo.primaryResidenceAddressState,
        jointResidenceAddressZip:
          jointOwner.addressInfo.primaryResidenceAddressZip,
        jointMailingAddressLine1:
          jointOwner.mailInfo.primaryMailingAddressLine1 === ""
            ? jointOwner.addressInfo.primaryResidenceAddressLine1
            : jointOwner.mailInfo.primaryMailingAddressLine1,
        jointMailingAddressLine2:
          jointOwner.mailInfo.primaryMailingAddressLine1 === ""
            ? jointOwner.addressInfo.primaryResidenceAddressLine2
            : jointOwner.mailInfo.primaryMailingAddressLine2,
        jointMailingAddressCity:
          jointOwner.mailInfo.primaryMailingAddressCity === ""
            ? jointOwner.addressInfo.primaryResidenceAddressCity
            : jointOwner.mailInfo.primaryMailingAddressCity,
        jointMailingAddressState:
          jointOwner.mailInfo.primaryMailingAddressState === ""
            ? jointOwner.addressInfo.primaryResidenceAddressState
            : jointOwner.mailInfo.primaryMailingAddressState,
        jointMailingAddressZip:
          jointOwner.mailInfo.primaryMailingAddressZip === ""
            ? jointOwner.addressInfo.primaryResidenceAddressZip
            : jointOwner.mailInfo.primaryMailingAddressZip,
        jointMailingAddressCountry: "USA",
      },

      updateExposures: {
        exposureLocator: sessionStorage.getItem("AL"),
        fieldValues: {
          annuitantFirstname: isAnnuitant
            ? primOwner.personalInfo.primaryOwnerFirstname
            : isjointAnnuitant
            ? jointOwner.personalInfo.primaryOwnerFirstname
            : jointOwner.annuitantInfo.annuitantFirstname,

          annuitantMiddlename: isAnnuitant
            ? primOwner.personalInfo.primaryOwnerMiddlename
            : isjointAnnuitant
            ? jointOwner.personalInfo.primaryOwnerMiddlename
            : jointOwner.annuitantInfo.annuitantMiddlename,

          annuitantLastname: isAnnuitant
            ? primOwner.personalInfo.primaryOwnerLastname
            : isjointAnnuitant
            ? jointOwner.personalInfo.primaryOwnerLastname
            : jointOwner.annuitantInfo.annuitantLastname,
          annuitantGovtidtype: "SSN",

          annuitantGovtid: isAnnuitant
            ? primOwner.personalInfo.primaryOwnerGovtid
            : isjointAnnuitant
            ? jointOwner.personalInfo.primaryOwnerGovtid
            : jointOwner.annuitantInfo.annuitantGovtid,

          annuitantDob: isAnnuitant
            ? moment(primOwner.personalInfo.primaryOwnerDob).format(
                "YYYY-MM-DD"
              )
            : isjointAnnuitant
            ? moment(jointOwner.personalInfo.primaryOwnerDob).format(
                "YYYY-MM-DD"
              )
            : moment(jointOwner.annuitantInfo.annuitantDob).format(
                "YYYY-MM-DD"
              ),

          annuitantEmail: isAnnuitant
            ? primOwner.personalInfo.primaryOwnerEmail
            : isjointAnnuitant
            ? jointOwner.personalInfo.primaryOwnerEmail
            : jointOwner.annuitantInfo.annuitantEmail,

          annuitantPhone: isAnnuitant
            ? primOwner.personalInfo.primaryOwnerPhone
            : isjointAnnuitant
            ? jointOwner.personalInfo.primaryOwnerPhone
            : jointOwner.annuitantInfo.annuitantPhone,

          annuitantGender: isAnnuitant
            ? primOwner.personalInfo.primaryOwnerGender
            : isjointAnnuitant
            ? jointOwner.personalInfo.primaryOwnerGender
            : jointOwner.annuitantInfo.annuitantGender,

          annuitantAddressLine1: isAnnuitant
            ? primOwner.addressInfo.primaryResidenceAddressLine1
            : isjointAnnuitant
            ? jointOwner.addressInfo.primaryResidenceAddressLine1
            : jointOwner.annuitantInfo.annuitantAddressLine1,
          annuitantAddressLine2: isAnnuitant
            ? primOwner.addressInfo.primaryResidenceAddressLine2
            : isjointAnnuitant
            ? jointOwner.addressInfo.primaryResidenceAddressLine2
            : jointOwner.annuitantInfo.annuitantAddressLine2,

          annuitantAddressCity: isAnnuitant
            ? primOwner.addressInfo.primaryResidenceAddressCity
            : isjointAnnuitant
            ? jointOwner.addressInfo.primaryResidenceAddressCity
            : jointOwner.annuitantInfo.annuitantAddressCity,
          annuitantAddressZip: isAnnuitant
            ? primOwner.addressInfo.primaryResidenceAddressZip
            : isjointAnnuitant
            ? jointOwner.addressInfo.primaryResidenceAddressZip
            : jointOwner.annuitantInfo.annuitantAddressZip,
          annuitantAddressState: isAnnuitant
            ? primOwner.addressInfo.primaryResidenceAddressState
            : isjointAnnuitant
            ? jointOwner.addressInfo.primaryResidenceAddressState
            : jointOwner.annuitantInfo.annuitantAddressState,
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
        sessionStorage.setItem("policyLocator", data.locator);
        if (data.locator) {
          locators.push(data.locator);
        }
        window.location.href = "/application/beneficiary";
      })
      .catch((error) => {
        console.log("Error:", error);
      });
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
          locators.push(data.value);

          previousLocator.push(data.value);
          setPrevLocators(locators);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

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
      setPrimaryOwner(values);
      setActiveIndex(1);
    },
  });
  const formik2 = useFormik({
    initialValues: {
      personalInfo: {
        primaryOwnerFirstname:
          value && value.jointOwnerFirstname
            ? value.jointOwnerFirstname[0]
            : "",
        primaryOwnerMiddlename:
          value && value.jointOwnerMiddlename
            ? value.jointOwnerMiddlename[0]
            : "",
        primaryOwnerLastname:
          value && value.jointOwnerLastname ? value.jointOwnerLastname[0] : "",
        primaryOwnerGovtid:
          value && value.jointOwnerGovtid ? value.jointOwnerGovtid[0] : "",
        primaryOwnerDob:
          value && value.jointOwnerDob
            ? moment(value.jointOwnerDob[0]).format("MM-DD-YYYY")
            : "",
        primaryOwnerGender:
          value && value.jointOwnerGender ? value.jointOwnerGender[0] : "",
        primaryOwnerPhone:
          value && value.jointOwnerPhone ? value.jointOwnerPhone[0] : "",
        primaryOwnerEmail:
          value && value.jointOwnerEmail ? value.jointOwnerEmail[0] : "",
      },
      addressInfo: {
        primaryResidenceAddressLine1:
          value && value.jointResidenceAddressLine1
            ? value.jointResidenceAddressLine1[0]
            : "",
        primaryResidenceAddressLine2:
          value && value.jointResidenceAddressLine2
            ? value.jointResidenceAddressLine2[0]
            : "",
        primaryResidenceAddressCity:
          value && value.jointResidenceAddressCity
            ? value.jointResidenceAddressCity[0]
            : "",
        primaryResidenceAddressState:
          value && value.jointResidenceAddressState
            ? value.jointResidenceAddressState[0]
            : "",
        primaryResidenceAddressZip:
          value && value.jointResidenceAddressZip
            ? value.jointResidenceAddressZip[0]
            : "",
        primaryResidenceAddressCountry: "USA",
      },
      mailInfo: {
        primaryMailingAddressLine1:
          value && value.jointMailingAddressLine1
            ? value.jointMailingAddressLine1[0]
            : "",
        primaryMailingAddressLine2:
          value && value.jointMailingAddressLine2
            ? value.jointMailingAddressLine2[0]
            : "",
        primaryMailingAddressCity:
          value && value.jointMailingAddressCity
            ? value.jointMailingAddressCity[0]
            : "",
        primaryMailingAddressState:
          value && value.primaryMailingAddressState
            ? value.primaryMailingAddressState[0]
            : "",
        primaryMailingAddressZip:
          value && value.jointMailingAddressZip
            ? value.jointMailingAddressZip[0]
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
    validationSchema: validation2,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      checkCreateOrUpdate(values);
      // postdata(values);
    },
  });
  const handleIndex = (e) => {
    if (e.index === 1) {
      formik.handleSubmit();
    } else {
      setActiveIndex(e.index);
    }
  };
  const annuitantheader = (
    <Flex className="card-header ml-9 sm:ml-0">
      {" "}
      <img className="icon-image" src={IMAGE_PATHS.ANNUITANT} />
      <h4 className="p-1 text-md font-semibold">Annuitant Details</h4>
      <label className="m-2 text-base text-black-700">
      <Tooltip target=".custom-target-icon" />
        <i className="custom-target-icon pi pi-info-circle"
        data-pr-tooltip="The annuitant is the person whose life governs the contract. If you have an Enhanced Death Benefit or Nursing Home Rider, they are the person whose death or nursing home confinement triggers the rider. If you chose to annuitize the contract at any point then the annuity payment will be based on their life. In this contract, the annuitant is assumed to be the primary owner unless you state otherwise. However, in the event that the purchaser is a trust, then the trustee must name a true person as an annuitant."
         data-pr-position="right"></i>  
      </label>
    </Flex>
  );

  const Primaryowner = <span className="mx-6">Primary owner</span>;
  const Jointowner = <span className="mx-9">Joint owner</span>;

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
      <Flex className="flex-col j-pi-ml p-jo">
        <Flex className="flex justify-items-start  m-4 sm:m-0 ml-10 md:ml-6 mb-0 sm:mb-5">
          <p className="h-suitability font-bold text-lg md:text-xl">
            Personal Information
          </p>
        </Flex>
        <TabView activeIndex={activeIndex} onTabChange={(e) => handleIndex(e)}>
          <TabPanel header={Primaryowner}>
            <form>
              <Grid className="grid-cols-3">
                <Container className="col-span-3">
                  <PersonalInfo
                    icon={IMAGE_PATHS.PERSON}
                    heading="Primary Owner"
                    formik={formik}
                    ssn={(e) => setssnfinalvalueprimary(e)}
                    subheading={null}
                  />
                </Container>
                <Container className="col-span-3">
                  <AddressInfo
                    icon={IMAGE_PATHS.RESIDENCE}
                    formik={formik}
                    heading="Residence Address"
                  />
                </Container>
                <Card className="card-layout sm:boxes">
                  <Grid className="grid grid-cols-2 pr-2">
                    <div className="col-span-2 ml-5 pt-0 sm:col-span-1 text-black pt-0 sm:pt-4 text-sm px-2 font-semibold">
                      <Label className="">
                        Is the mailing address different from the residence
                        address?
                      </Label>
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-black p-1 pt-0 text-md px-2 font-semibold">
                      <Grid className="grid grid-cols-2 ">
                        <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 p-field-radiobutton radio-border h-11 ml-4 sm:ml-0">
                          <RadioButton
                            inputId="jointmail"
                            name="val"
                            value="yes"
                            onChange={(e) => setValue(true)}
                            checked={val === true}
                          />
                          <label htmlFor="yes" className="px-2">
                            Yes
                          </label>
                        </div>
                        <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12  mt-3 p-field-radiobutton radio-border h-11">
                          <RadioButton
                            inputId="jointmail2"
                            name="val"
                            value="no"
                            onChange={(e) => setValue(false)}
                            checked={val === false}
                          />
                          <label htmlFor="no" className="px-1">
                            No
                          </label>
                        </div>
                      </Grid>
                    </div>
                  </Grid>
                  {/* <Flex className="col-span-2">
    <Label
                className="text-black p-1 text-sm px-2 font-semibold"
              >
                Is the mailing address different from the residence address?
              </Label>
   
                   <div className="p-field-radiobutton ml-3 radio-border">
                   <RadioButton  inputId="jointmail" name="val" value="yes" onChange={(e) =>setValue(true)} checked={val ===true}/>
                   <label htmlFor="yes" className="px-2">Yes</label>
               </div>
                <div className="p-field-radiobutton ml-5 radio-border">
                   <RadioButton inputId="jointmail2" name="val" value="no"onChange={(e) => setValue(false)} checked={val === false}/>
                   <label htmlFor="no" className="px-1">No</label>
               </div>
    </Flex> */}
                </Card>

                {val && (
                  <Container className="col-span-3">
                    <MailInfo
                      icon={IMAGE_PATHS.MAILING}
                      formik={formik}
                      heading="Mailing Address"
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
                            inputId="isAnnuitant"
                            name="isAnnuitant"
                            value="yes"
                            onChange={(e) => setisAnnuitant(true)}
                            checked={isAnnuitant === true}
                          />
                          <label htmlFor="isAnnuitant" className="p-2 text-sm">
                            Yes
                          </label>
                        </div>
                        <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12  mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                          <RadioButton
                            inputId="isAnnuitant2"
                            name="isAnnuitant"
                            value="no"
                            onChange={(e) => setisAnnuitant(false)}
                            checked={isAnnuitant === false}
                          />
                          <label htmlFor="isAnnuitant2" className="p-2 text-sm">
                            No
                          </label>
                        </div>
                      </Grid>
                    </div>
                  </Grid>

                  {/* <Flex className="col-span-6">
                <Label className="text-black p-1 text-sm px-2 font-semibold">
                  Is this person the annuitant?
                </Label>
                <div className="p-field-radiobutton ml-52 radio-border w-1/12">
                  <RadioButton
                    inputId="isAnnuitant"
                    name="isAnnuitant"
                    value="yes"
                    onChange={(e) => setisAnnuitant(true)}
                    checked={isAnnuitant === true}
                  />
                  <label htmlFor="isAnnuitant" className="p-2">
                    Yes
                  </label>
                </div>
                <div className="p-field-radiobutton ml-5 radio-border w-1/12">
                  <RadioButton
                    inputId="isAnnuitant2"
                    name="isAnnuitant"
                    value="no"
                    onChange={(e) => setisAnnuitant(false)}
                    checked={isAnnuitant === false}
                  />
                  <label htmlFor="isAnnuitant2" className="p-2">
                    No
                  </label>
                </div>
              </Flex> */}
                </Card>
                {/* {isAnnuitant === false && (
              <>
                <Container className="col-span-3">
                  <AnnuitantInfo
                    showHeading={false}
                    header="Annuitant Primary Details"
                    formik={formik}
                  />
                </Container>
              </>
            )} */}
              </Grid>
              <Flex className="flex flex-col-reverse place-items-center my-4 md:flex-row md:space-x-96 ml-0 sm:ml-0">
                <div className="m-0">
                  <NextLink className="w-full" href={ROUTE_PATHS.POLICYOWNER}>
                    <Button
                      type="submit"
                      className="p-2 btn-cancel text-blue-500 border-blue-500 font-bold rounded-sm w-64 sm:w-44 mt-5 sm:mt-0"
                    >
                      Back
                    </Button>
                  </NextLink>
                </div>
                <div className="m-0">
                  <Button
                    type="submit"
                    onClick={formik.handleSubmit}
                    className="p-2 btncolor font-bold rounded-sm text-white-500 w-64 sm:w-56 ml-0 sm:ml-64 mt-2 sm:mt-0"
                  >
                    Next to Joint Owner
                  </Button>
                </div>
              </Flex>
            </form>
          </TabPanel>
          <TabPanel className="mx-5" header={Jointowner}>
            <form onSubmit={formik2.handleSubmit}>
              <Grid className="grid-cols-3">
                <Container className="col-span-3">
                  <PersonalInfo
                    icon={IMAGE_PATHS.PERSON}
                    formik={formik2}
                    heading="Joint Owner"
                    ssn={(e) => setssnfinalvaluejoint(e)}
                  />
                </Container>
                <Container className="col-span-3">
                  <AddressInfo
                    icon={IMAGE_PATHS.RESIDENCE}
                    formik={formik2}
                    heading="Residence Address"
                  />
                </Container>

                <Container className="mt-5 col-span-3">
                  <Card className="card-layout sm:boxes">
                    <Grid className="grid grid-cols-2 pr-2">
                      <div className="col-span-2 ml-5 pt-0 sm:col-span-1 text-black pt-0 sm:pt-4 text-sm px-2 font-semibold">
                        <Label className="">
                          Is the mailing address different from the residence
                          address?
                        </Label>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-black p-1 pt-0 text-md px-2 font-semibold">
                        <Grid className="grid grid-cols-2 ">
                          <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 p-field-radiobutton radio-border h-11 ml-4 sm:ml-0">
                            <RadioButton
                              inputId="mailyes"
                              name="jointval"
                              value="yes"
                              onChange={(e) => setjointValue(true)}
                              checked={jointval === true}
                            />
                            <label htmlFor="yes" className="px-2">
                              Yes
                            </label>
                          </div>
                          <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12  mt-3 p-field-radiobutton radio-border h-11">
                            <RadioButton
                              inputId="mailno"
                              name="jointval"
                              value="no"
                              onChange={(e) => setjointValue(false)}
                              checked={jointval === false}
                            />
                            <label htmlFor="no" className="px-1">
                              No
                            </label>
                          </div>
                        </Grid>
                      </div>
                    </Grid>
                    {/* <Flex className="col-span-2">
    <Label
                className="text-black p-1 text-sm px-2 font-semibold"
              >
                Is the mailing address different from the residence address?
              </Label>
   
                   <div className="p-field-radiobutton ml-3 radio-border">
                   <RadioButton  inputId="mailyes" name="jointval" value="yes" onChange={(e) =>setjointValue(true)} checked={jointval ===true}/>
                   <label htmlFor="yes" className="px-2">Yes</label>
               </div>
                <div className="p-field-radiobutton ml-5 radio-border">
                   <RadioButton inputId="mailno" name="jointval" value="no"onChange={(e) => setjointValue(false)} checked={jointval === false}/>
                   <label htmlFor="no" className="px-1">No</label>
               </div>
    </Flex> */}
                  </Card>
                </Container>

                {jointval && (
                  <Container className="col-span-3">
                    <MailInfo
                      icon={IMAGE_PATHS.MAILING}
                      formik={formik2}
                      heading="Mailing Address"
                    />
                  </Container>
                )}
                {isAnnuitant === false && (
                  <Card
                    header={annuitantheader}
                    className=" col-span-3 h-26 card-layout"
                  >
                    <Grid className="grid grid-cols-2  pr-2">
                      <div className="col-span-2 ml-5 pt-0 sm:col-span-1 text-black pt-0 sm:pt-4 text-sm px-2 font-semibold">
                        <Label className="">
                          Is this person the annuitant?
                        </Label>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-black p-1 pt-0 text-md px-2 font-semibold">
                        <Grid className="grid grid-cols-2 ">
                          <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11 ml-4 sm:ml-0">
                            <RadioButton
                              inputId="isjointAnnuitant1"
                              name="isjointAnnuitant"
                              value="yes"
                              onChange={(e) => setisjointAnnuitant(true)}
                              checked={isjointAnnuitant === true}
                            />
                            <label htmlFor="yes" className="px-2 text-sm">
                              Yes
                            </label>
                          </div>
                          <div className=" w-1/4 col-span-1 sm:col-span-1 w-3/4 sm:w-6/12  mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                            <RadioButton
                              inputId="isjointAnnuitant2"
                              name="isjointAnnuitant"
                              value="no"
                              onChange={(e) => setisjointAnnuitant(false)}
                              checked={isjointAnnuitant === false}
                            />
                            <label htmlFor="no" className="px-2 text-sm">
                              No
                            </label>
                          </div>
                        </Grid>
                      </div>
                    </Grid>
                    {/* <Flex className="col-span-6">
    <Label className="text-black p-1 text-sm px-2 font-semibold">
                Is this person the annuitant?                                
              </Label>
              <div className="p-field-radiobutton ml-48 radio-border">
                   <RadioButton  inputId="isjointAnnuitant1" name="isjointAnnuitant" value="yes" onChange={(e) =>setisjointAnnuitant(true)} checked={isjointAnnuitant ===true}/>
                   <label htmlFor="yes" className="px-2">Yes</label>
               </div>
                <div className="p-field-radiobutton ml-5 radio-border">
                   <RadioButton inputId="isjointAnnuitant2" name="isjointAnnuitant" value="no"onChange={(e) => setisjointAnnuitant(false)} checked={isjointAnnuitant === false}/>
                   <label htmlFor="no" className="px-1">No</label>
               </div>
               </Flex> */}
                    {isjointAnnuitant === false && (
                      <>
                        <Divider />
                        <Container className="col-span-3">
                          <AnnuitantInfo
                            showHeading={false}
                            header="Annuitant Primary Details"
                            formik={formik2}
                            ssn={(e) => setssnfinalvalueannuitant(e)}
                          />
                        </Container>
                      </>
                    )}
                  </Card>
                )}
              </Grid>
              <Flex className="flex flex-col-reverse  place-items-center my-4 md:flex-row md:space-x-96  ml-0 sm:ml-0">
                <div className="m-0">
                  <Button
                    type="submit"
                    onClick={() => setActiveIndex(0)}
                    className="p-2 btn-cancel text-blue-500 border-blue-500 font-bold rounded-sm w-64 sm:w-44 mt-5 sm:mt-0"
                  >
                    Back
                  </Button>
                </div>
                <div className="m-0">
                  <Button
                    type="submit"
                    className=" p-2 btncolor font-bold rounded-sm text-white-500 w-64 sm:w-48 ml-0 sm:ml-72  mt-2 sm:mt-0"
                  >
                    Save & Continue
                  </Button>
                </div>
              </Flex>
            </form>
          </TabPanel>
        </TabView>
      </Flex>
    </>
  );
};
export default withAuthentication(jointOwnerForm);
