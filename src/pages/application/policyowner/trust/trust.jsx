import { useEffect, useState } from "react";
import { Button } from "@components/forms";
import { Sider } from "@components/sidebar";
import { Stepper } from "@components/stepper";
import { useAuth } from "@context/auth";
import { withAuthentication } from "@utils/route-hocs";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { NextLink } from "@components/next-link";
import { Card } from "primereact/card";
import { Tooltip } from "primereact/tooltip";
import moment from "moment";
import { Flex, Container, Grid } from "@components/layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import TrustInfo from "./../../commonForms/trustInfo";
import AddressInfo from "./../../commonForms/addressInfo";
import AnnuitantInfo from "../../commonForms/annuitantInfo";
import {
  Url,
  createPolicy,
  products,
  createPolicyHolder,
  auxDataUrl,
  policies,
  update,
  updatePolicy,
} from "../../../../constants/apiconstant";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Trust";
const description =
  "Enables you to resend the registration activation link to your email address.";

const trustForm = () => {
  const router = useRouter();
  const { query } = router;
  const [val, setValue] = useState();
  const [field, setValues] = useState();
  const [annuitant, setAnnuitant] = useState();
  const [prevLocators, setPrevLocators] = useState([]);
  const [isLocator, setIsLocator] = useState(false);
  const [locatorOnFetch, setLocatorOnFetch] = useState();
  const [state, setStates] = useState([]);
  const [queryLocator, setQueryLocator] = useState(query.polLocator);

  var locators = [];
  var previousLocator = [];
  const handleChange = (e) => {
    setValue(value);
  };

  const {
    state: { user },
  } = useAuth();

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

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

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
    fetchPolicyDetails();
    getStatesData();
    getPolicy();
  }, []);

  async function fetchPolicyDetails() {
    const pl = sessionStorage.getItem("policyLocator");
    const passLocator = queryLocator ? queryLocator : pl;
    sessionStorage.setItem("policyLocator", passLocator);
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
              sessionStorage.setItem(
                "AL",
                data.exposures[0].characteristics[0].exposureLocator
              );
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
    const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    var updateData = {
      finalize: false,
      // "policyholderLocator":policyFinder.locator,
      productName: "MYGA",
      // "policyStartTimestamp": "1634335715000",
      // "policyEndTimestamp":"1667372400000",
      fieldValues: {
        appType: "Trust",
        appReceivedDate: today,
        appSignedDate: today,
        // "issueState":"CA",
        polEffDate: today,
        qualType: "Non Qualified",
        // "amountInvesting": 1000,
        // "guaranteedTerm": "4",
        trustOwnerType: "Person",
        trustName: values.trustInfo.trustName,
        trusteeName: values.trustInfo.trusteeName,
        trustDate: moment(values.trustInfo.trustDate).format("YYYY-MM-DD"),
        trustGovtidtype: "SSN",
        polStatus: "Draft",
        esignatureStatus: "Not Started",
        guaranteedRate: "0",
        trustGovtid: values.trustInfo.trustGovtid,
        trustEmail: values.trustInfo.trustEmail,
        trustPhone: values.trustInfo.trustPhone,
        trustAddressLine1: values.addressInfo.primaryResidenceAddressLine1,
        trustAddressLine2: values.addressInfo.primaryResidenceAddressLine2,
        trustAddressCity: values.addressInfo.primaryResidenceAddressCity,
        trustAddressState: values.addressInfo.primaryResidenceAddressState,
        trustAddressZip: values.addressInfo.primaryResidenceAddressZip,
        trustAddressCountry: values.addressInfo.primaryResidenceAddressCountry,
      },

      updateExposures: {
        exposureLocator: sessionStorage.getItem("AL"),
        fieldValues: {
          annuitantFirstname: values.annuitantInfo.annuitantFirstname,
          annuitantMiddlename: values.annuitantInfo.annuitantMiddlename,
          annuitantLastname: values.annuitantInfo.annuitantLastname,
          annuitantGovtidtype: "SSN",
          annuitantGovtid: values.annuitantInfo.annuitantGovtid,
          annuitantDob: moment(values.annuitantInfo.annuitantDob).format(
            "YYYY-MM-DD"
          ),
          annuitantEmail: values.annuitantInfo.annuitantEmail,
          annuitantPhone: values.annuitantInfo.annuitantPhone,
          annuitantGender: values.annuitantInfo.annuitantGender,
          annuitantAddressLine1: values.annuitantInfo.annuitantAddressLine1,
          annuitantAddressLine2: values.annuitantInfo.annuitantAddressLine2,
          annuitantAddressCity: values.annuitantInfo.annuitantAddressCity,
          annuitantAddressZip: values.annuitantInfo.annuitantAddressZip,
          annuitantAddressState: values.annuitantInfo.annuitantAddressState,
        },
      },
    };

    await fetch(Url + updatePolicy + locatorOnFetch + update, {
      method: "POST",
      headers: {
        Authorization: send.authorizationToken,
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
        owner_full_name: values.trustInfo.trustName,
        owner_email: values.trustInfo.trustEmail,
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
        appType: "Trust",
        appReceivedDate: today,
        appSignedDate: today,
        // "issueState":"CA",
        polEffDate: today,
        qualType: "Non Qualified",
        // "amountInvesting": 1000,
        // "guaranteedTerm": "4",
        trustOwnerType: "Person",
        trustName: values.trustInfo.trustName,
        trusteeName: values.trustInfo.trusteeName,
        trustDate: moment(values.trustInfo.trustDate).format("YYYY-MM-DD"),
        trustGovtidtype: "SSN",
        trustGovtid: values.trustInfo.trustGovtid,
        trustEmail: values.trustInfo.trustEmail,
        trustPhone: values.trustInfo.trustPhone,
        trustAddressLine1: values.addressInfo.primaryResidenceAddressLine1,
        trustAddressLine2: values.addressInfo.primaryResidenceAddressLine2,
        trustAddressCity: values.addressInfo.primaryResidenceAddressCity,
        trustAddressState: values.addressInfo.primaryResidenceAddressState,
        trustAddressZip: values.addressInfo.primaryResidenceAddressZip,
        trustAddressCountry: values.addressInfo.primaryResidenceAddressCountry,
        achAmount: 0,
        "1035Amount": 0,
        amountInvested: 0,
        polStatus: "Draft",
        esignatureStatus: "Not Started",
        guaranteedRate: "0",
      },

      exposures: [
        {
          exposureName: "Annuitant",
          fieldValues: {
            annuitantFirstname: values.annuitantInfo.annuitantFirstname,
            annuitantMiddlename: values.annuitantInfo.annuitantMiddlename,
            annuitantLastname: values.annuitantInfo.annuitantLastname,
            annuitantGovtidtype: "SSN",
            annuitantGovtid: values.annuitantInfo.annuitantGovtid,
            annuitantDob: moment(values.annuitantInfo.annuitantDob).format(
              "YYYY-MM-DD"
            ),
            annuitantEmail: values.annuitantInfo.annuitantEmail,
            annuitantPhone: values.annuitantInfo.annuitantPhone,
            annuitantGender: values.annuitantInfo.annuitantGender,
            annuitantAddressLine1: values.annuitantInfo.annuitantAddressLine1,
            annuitantAddressLine2: values.annuitantInfo.annuitantAddressLine2,
            annuitantAddressCity: values.annuitantInfo.annuitantAddressCity,
            annuitantAddressZip: values.annuitantInfo.annuitantAddressZip,
            annuitantAddressState: values.annuitantInfo.annuitantAddressState,
          },
        },
      ],
    };

    const createTrustPolicy = await fetch(Url + createPolicy, {
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
          value: "false,false,true,true,true,false,false,false,false",
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
          setPrevLocators(previousLocator);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  // Formik Code

  const validation = Yup.object({
    trustInfo: Yup.object({
      trustName: Yup.string()
        .required("Trust Name is required")
        .min(3, "At least 03 characters")
        .max(50, "Maximum 50 characters are allowed"),
      // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
      trusteeName: Yup.string()
        .min(3, "At least 03 characters")
        .required("Trustee Name is required")
        .max(25, "Maximum 25 characters are allowed"),
      // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
      trustGovtid: Yup.string()
        .required("This field is required")
        .typeError("You must specify a number")
        .matches(/^[0-9-+()]*$/, "Must be only digits")
        .min(11, "Minimum 9 characters are allowed"),
      trustDate: Yup.date()
        .required("Trust Date is required")
        .typeError("You must specify a date")
        .test("DOB", "The entered date cannot be in the future.", (value) => {
          return moment().diff(moment(value), moment(today)) > 1;
        }),
      trustPhone: Yup.string()
        .required("A phone number is required")
        .typeError("That doesn't look like a phone number"),
      // .length(10, "10 characters are allowed")
      // .matches(/^[0-9]+$/, "Please enter numbers only"),
      trustEmail: Yup.string()
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
        .matches(/^[0-9]+$/, "Must be only digits")
        .max(5, "5 characters are allowed")
        .min(5, "5 characters are allowed"),
    }),
    annuitantInfo: Yup.object({
      annuitantFirstname: Yup.string()
        .required("First Name is required")
        .min(3, "At least 03 characters")
        .max(25, "Maximum 25 characters are allowed"),
      //.matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
      annuitantMiddlename: Yup.string(),
      // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
      annuitantLastname: Yup.string()
        .required("Last Name is required")
        .min(3, "At least 03 characters")
        .max(25, "Maximum 25 characters are allowed"),
      // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
      annuitantGovtid: Yup.string()
        .required("This field is required")
        .typeError("You must specify a number")
        .matches(/^[0-9-+()]*$/, "Must be only digits")
        .min(11, "Minimum 9 characters are allowed"),
      annuitantDob: Yup.date()
        .required("Birth Date is required")
        .typeError("You must specify a date")
        .test("DOB", "The entered date cannot be in the future.", (value) => {
          return moment().diff(moment(value), moment(today)) > 1;
        }),
      annuitantGender: Yup.string().required("Gender is required"),
      annuitantPhone: Yup.string()
        .required("A phone number is required")
        .typeError("That doesn't look like a phone number"),
      // .matches(/^[0-9]+$/, "Please enter numbers only")
      // .length(10, "10 characters are allowed"),
      annuitantEmail: Yup.string()
        .email(" Invalid email address")
        .max(255)
        .required("Email is required")
        .test(
          "state",
          "Email Id of Trust and annuitant cannot be same ",
          (mail) => {
            return mail !== formik.values.trustInfo.trustEmail;
          }
        ),
      annuitantAddressLine1: Yup.string()
        .required("Address Line 1 is required")
        .max(50, "Maximum 50 characters are allowed"),
      annuitantAddressCity: Yup.string().required("Enter city name"),
      annuitantAddressState: Yup.string().required("Please select a state"),
      annuitantAddressZip: Yup.string()
        .required("Postal Code is required ")
        .typeError("You must specify a number")
        .matches(/^[0-9]+$/, "Must be only digits")
        .max(5, "5 characters are allowed")
        .min(5, "5 characters are allowed"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      trustInfo: {
        trustName: field && field.trustName ? field.trustName[0] : "",
        trusteeName: field && field.trusteeName ? field.trusteeName[0] : "",
        trustGovtid: field && field.trustGovtid ? field.trustGovtid[0] : "",
        trustDate:
          field && field.trustDate
            ? moment(field.trustDate[0]).format("MM-DD-YYYY")
            : "",
        trustEmail:
          field && field.trustEmail
            ? field.trustEmail[0]
            : user
            ? user.email
            : "",
        trustPhone: field && field.trustPhone ? field.trustPhone[0] : "",
      },
      addressInfo: {
        primaryResidenceAddressLine1:
          field && field.trustAddressLine1 ? field.trustAddressLine1[0] : "",
        primaryResidenceAddressLine2:
          field && field.trustAddressLine2 ? field.trustAddressLine2[0] : "",
        primaryResidenceAddressCity:
          field && field.trustAddressCity ? field.trustAddressCity[0] : "",
        primaryResidenceAddressState:
          field && field.trustAddressState ? field.trustAddressState[0] : "",
        primaryResidenceAddressZip:
          field && field.trustAddressZip ? field.trustAddressZip[0] : "",
        primaryResidenceAddressCountry: "USA",
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
        <Flex className="flex-col md:ml-56 pi-t">
          <Flex className="justify-items-start m-4 sm:m-0 ml-9 md:ml-2 mb-0 sm:mb-5">
            <p className="h-suitability font-bold text-lg md:text-xl">
              Trust Information
            </p>
          </Flex>

          <Grid className="grid-cols-3 ">
            <Container className="col-span-3">
              <TrustInfo
                heading="Trust Details"
                icon={IMAGE_PATHS.TRUST}
                formik={formik}
              />
            </Container>

            <Container className="col-span-3">
              <AddressInfo
                heading="Address"
                icon={IMAGE_PATHS.TRUSTADDRESS}
                formik={formik}
              />
            </Container>
            <Card
              header={annuitantheader}
              className="mt-5 col-span-3 h-26 card-layout"
            >
              <Container className="col-span-3">
                <AnnuitantInfo showHeading={false} formik={formik} />
              </Container>
            </Card>
          </Grid>
          <Flex className="flex flex-col-reverse  place-items-center my-4 md:flex-row md:space-x-96  ml-0 sm:ml-0">
            <NextLink href={ROUTE_PATHS.POLICYOWNER}>
              <Button className="p-2 btn-cancel text-blue-500 border-blue-500 font-bold rounded-sm w-64 sm:w-44 mt-2 sm:mt-0">
                Back
              </Button>
            </NextLink>
            <div className="ml-0 sm:ml-10">
              <Button
                type="submit"
                className=" p-2 btncolor font-bold rounded-sm text-white-500 w-64 sm:w-48 ml-0 sm:ml-72"
              >
                Save & Continue
              </Button>
            </div>
          </Flex>
        </Flex>
      </form>
    </>
  );
};
export default withAuthentication(trustForm);
