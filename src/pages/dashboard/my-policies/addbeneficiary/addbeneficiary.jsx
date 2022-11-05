import { useEffect, useState, useCallback } from "react";
import { Label, Button, SecureMaskInput } from "@components/forms";
import { BreadCrumb } from "primereact/breadcrumb";
import { Panel } from "primereact/panel";
import { NextSeo } from "next-seo";
import { NextLink } from "@components/next-link";
import { useRouter } from "next/router";
import { Card } from "primereact/card";
import { Sider } from "@components/sidebar";
import { RadioButton } from "primereact/radiobutton";
import { withAuthentication } from "@utils/route-hocs";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Container } from "@components/layout";
import { Grid } from "@components/layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalPopUp } from "../modalpopup";
import moment from "moment";
import { PercentageSharingAppModal } from "../percentagesharingappmodal";
import { Flex } from "@components/layout";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { Divider } from "primereact/divider";
import { v1 as uuidv1 } from "uuid";
import { SecureMaskedInput } from "react-control-library";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.ADD_PRIMARY_BENEFICIARY}`;
const title = "Add Beneficiary";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const addbeneficiary = () => {
  const router = useRouter();
  const { query } = router;
  const [id, setID] = useState();

  const [benetype, setBeneType] = useState(true);
  const [show1, setshowModal1] = useState(false);

  const [show, setShowModal] = useState(false);

  const closeModal = useCallback(() => setShowModal(false));
  const closeModal1 = useCallback(() => setshowModal1(false), []);

  const handleClick = () => {
    setShowModal(true);
  };
  // const { v4: uuidv4 } = require('uuid');

  const relation = [
    {
      name: "Spouse",
      value: "Spouse"
    },
    {
      name: "Son",
      value: "Son"
    },
    {
      name: "Father",
      value: "Father"
    },
    {
      name: "Mother",
      value: "Mother"
    },
    {
      name: "Daughter",
      value: "Daughter"
    },
    {
      name: "Friend",
      value: "Friend"
    },
    {
      name: "Others",
      value: "Others"
    }
  ];

  const gender = [
    {
      name: "Male",
      value: "Male"
    },
    {
      name: "Female",
      value: "Female"
    }
  ];
  const allStateList = [
    {
      name: "Alabama",
      value: "AL"
    },
    {
      name: "Alaska",
      value: "AK"
    },
    {
      name: "Arizona",
      value: "AZ"
    },
    {
      name: "Arkansas",
      value: "AR"
    },
    {
      name: "California",
      value: "CA"
    },
    {
      name: "Colorado",
      value: "CO"
    },
    {
      name: "Connecticut",
      value: "CT"
    },
    {
      name: "Delaware",
      value: "DE"
    },
    {
      name: "District of Columbia",
      value: "DC"
    },
    {
      name: "Florida",
      value: "FL"
    },
    {
      name: "Georgia",
      value: "GA"
    },
    {
      name: "Hawaii",
      value: "HI"
    },
    {
      name: "Idaho",
      value: "ID"
    },
    {
      name: "Illinois",
      value: "IL"
    },
    {
      name: "Indiana",
      value: "IN"
    },
    {
      name: "Iowa",
      value: "IA"
    },
    {
      name: "Kansas",
      value: "KS"
    },
    {
      name: "Kentucky",
      value: "KY"
    },
    {
      name: "Louisiana",
      value: "LA"
    },
    {
      name: "Maine",
      value: "ME"
    },
    {
      name: "Maryland",
      value: "MD"
    },
    {
      name: "Massachusetts",
      value: "MA"
    },
    {
      name: "Michigan",
      value: "MI"
    },
    {
      name: "Minnesota",
      value: "MN"
    },
    {
      name: " Mississippi	",
      value: "MS"
    },
    {
      name: " Missouri",
      value: "MO"
    },
    {
      name: "Montana",
      value: "MT"
    },
    {
      name: "Nebraska",
      value: "NE"
    },
    {
      name: "Nevada",
      value: "NV"
    },
    {
      name: "New Hampshire",
      value: "NH"
    },
    {
      name: "New Jersey",
      value: "NJ"
    },
    {
      name: "New Mexico",
      value: "NM"
    },
    {
      name: "New York",
      value: "NY"
    },
    {
      name: "North Carolina",
      value: "NC"
    },
    {
      name: "North Dakota",
      value: "ND"
    },
    {
      name: "Ohio",
      value: "OH"
    },
    {
      name: "Oklahoma",
      value: "OK"
    },
    {
      name: "Oregon",
      value: "OR"
    },
    {
      name: "Pennsylvania",
      value: "PA"
    },
    {
      name: "Rhode Island",
      value: "RI"
    },
    {
      name: "South Carolina",
      value: "SC"
    },
    {
      name: "South Dakota",
      value: "SD"
    },
    {
      name: "Tennessee",
      value: "TN"
    },
    {
      name: " Texas",
      value: "TX"
    },
    {
      name: "Utah",
      value: "UT"
    },
    {
      name: "Vermont",
      value: "VT"
    },
    {
      name: "Virginia",
      value: "VA"
    },
    {
      name: "Washington",
      value: "WA"
    },
    {
      name: "West Virginia",
      value: "WV"
    },
    {
      name: "Wisconsin",
      value: "WI"
    },
    {
      name: "Wyoming",
      value: "WY"
    }
  ];

  const items = [
    {
      label: "My Policies",
      icon: "pi pi-home",
      url: "/dashboard/my-policies"
    },
    {
      label: "Active Policies",
      url: "/dashboard/my-policies?index=0"
    },
    {
      label: `Policy No. ${query.id}`,
      url: `/dashboard/my-policies/updatebeneficiary?id=${id}`
    },
    {
      label: "Change beneficiary",
      url: `/dashboard/my-policies/changebeneficiary?id=${id}`
    },
    {
      label: "Add beneficiary"
    }
  ];

  useEffect(() => {
    const pl = query && parseInt(query.id);
    if (pl) {
      setID(pl);
    }
  }, [query]);

  function postdata(item) {
    let locator = id.toString();
    var retrievedData = localStorage.getItem("percentage");
    var data = JSON.parse(retrievedData);
    const allstoredbeneficiary = JSON.parse(sessionStorage.getItem(locator));

    data &&
      data.map(o => {
        for (let i = 0; i < allstoredbeneficiary.length; i++) {
          if (
            allstoredbeneficiary[i].locator === o.locator ||
            allstoredbeneficiary[i].id === o.locator
          ) {
            allstoredbeneficiary[i].beneSharingPercent[0] =
              o.beneSharingPercent;
          }
        }
      });

    var userDetails = {
      beneType: "Primary",
      benePartyType: item.benePartyType ? item.benePartyType : "",
      beneTrustName: item.beneTrustName ? item.beneTrustName : "",
      beneTrustee: item.beneTrustee ? item.beneTrustee : "",
      beneFirstname: item.beneFirstname ? item.beneFirstname : "",
      beneMiddlename: item.beneMiddlename ? item.beneMiddlename : "",
      beneLastname: item.beneLastname ? item.beneLastname : "",
      beneGovtidtype: "SSN",
      beneGovtid: item.beneGovtid ? item.beneGovtid : "",
      beneDob: item.beneDob ? moment(item.beneDob).format("YYYY-MM-DD") : "",
      beneGender: item.beneGender ? item.beneGender : "",
      benePhone: item.benePhone ? item.benePhone : "",
      beneEmail: item.beneEmail ? item.beneEmail : "",
      beneSharingPercent: item.beneSharingPercent
        ? item.beneSharingPercent
        : "",
      beneRelationOwner: item.beneRelationOwner ? item.beneRelationOwner : "",
      beneAddressLine1: item.beneAddressLine1 ? item.beneAddressLine1 : "",
      beneAddressLine2: item.beneAddressLine2 ? item.beneAddressLine2 : "",
      beneAddressCity: item.beneAddressCity ? item.beneAddressCity : "",
      beneAddressState: item.beneAddressState ? item.beneAddressState : "",
      beneAddressZip: item.beneAddressZip ? item.beneAddressZip : "",
      beneAddressCountry: "USA",
      beneIrrevocable: item.beneIrrevocable ? item.beneIrrevocable : ""
    };

    var PrimaryData = {};

    PrimaryData = Object.keys(userDetails).reduce((newObj, key) => {
      const value = userDetails[key];
      if (value !== "") {
        newObj[key] = [value];
      }
      return newObj;
    }, {});

    PrimaryData.id = uuidv1();

    allstoredbeneficiary.push(PrimaryData);

    sessionStorage.removeItem(locator);
    sessionStorage.setItem(
      locator.toString(),
      JSON.stringify(allstoredbeneficiary)
    );

    setshowModal1(true);
  }

  const header = (
    <div className="flex justify-between p-4">
      {" "}
      <div>
        <h2 className="ml-1 sm:ml-5 font-bold text-blue-800">
          Primary Beneficiary Details
        </h2>
      </div>
    </div>
  );

  const initialValues = {
    beneType: "Primary",
    benePartyType: "Person",
    beneTrustName: "",
    beneTrustee: "",
    beneFirstname: "",
    beneMiddlename: "",
    beneLastname: "",
    beneGovtidtype: "SSN",
    beneGovtid: "",
    beneDob: "",
    beneGender: "",
    benePhone: "",
    beneEmail: "",
    beneSharingPercent: "",
    beneRelationOwner: "",
    beneAddressLine1: "",
    beneAddressLine2: "",
    beneAddressCity: "",
    beneAddressState: "",
    beneAddressZip: "",
    beneAddressCountry: "USA",
    beneIrrevocable: "No"
  };

  const validation = Yup.object({
    benePartyType: Yup.string().required("Beneficiary Type is required"),

    beneFirstname: Yup.string()
      .when("benePartyType", {
        is: "Person",
        then: Yup.string().required("First Name is required"),
        otherwise: Yup.string()
      })
      .min(3, "At least 03 characters")
      .max(25, "Maximum 25 characters are allowed"),
    beneLastname: Yup.string()
      .min(3, "At least 03 characters")
      .max(25, "Maximum 25 characters are allowed")
      .when("benePartyType", {
        is: "Person",
        then: Yup.string().required("Last Name is required"),
        otherwise: Yup.string()
      }),
    beneTrustName: Yup.string()
      .when("benePartyType", {
        is: "Trust",
        then: Yup.string().required("Trust Name is required"),
        otherwise: Yup.string()
      })
      .min(3, "At least 03 characters")
      .max(50, "Maximum 50 characters are allowed"),

    beneTrustee: Yup.string()
      .when("benePartyType", {
        is: "Trust",
        then: Yup.string().required("Trustee Name is required"),
        otherwise: Yup.string()
      })
      .min(3, "At least 03 characters")
      .max(50, "Maximum 50 characters are allowed"),
    beneGovtid: Yup.string()
      .matches(/^[0-9-+()]*$/, "Must be only digits")
      .typeError("You must specify a number")
      .min(11, "Minimum 9 characters are allowed"),
    benePhone: Yup.string()
      .matches(/^[0-9]+$/, "Please enter numbers only")
      .length(10, "10 characters are allowed"),
    beneEmail: Yup.string()
      .email(" Invalid email address")
      .max(255),
    beneSharingPercent: Yup.number()
      .required("Percentage sharing is required")
      .min(1, "Minimum 1 percent is required")
      .max(100, "Maximum 100 percent is allowed"),

    beneAddressLine1: Yup.string().max(30, "Maximum 30 characters are allowed"),
    beneAddressZip: Yup.string().length(5, "5 characters are allowed"),
    beneIrrevocable: Yup.string().required("Designation Revocable is required")
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validation,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: values => {
      postdata(values);
    }
  });

  const [show2, setshow2] = useState(false);

  const ssnMask = [
    /^[0-9]*$/,
    /^[0-9]*$/,
    /^[0-9]*$/,
    "-",
    /^[0-9]*$/,
    /^[0-9]*$/,
    "-",
    /^[0-9]*$/,
    /^[0-9]*$/,
    /^[0-9]*$/,
    /^[0-9]*$/
  ];

  const title = (
    <Container>
      The primary beneficiary details have been added successfully.
    </Container>
  );
  // console.log("Formik---",formik, "Isvalid--", formik.isValid,"Submit---", formik.isSubmitting)

  return (
    <>
      {" "}
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description
        }}
      />{" "}
      <div className="flex md:flex-row md:space-x-1">
        <div className="sm:w-2/12 sm:h-10 ">
          <Sider />{" "}
        </div>
        <div className="Flex flex-col sm:w-2/3">
          <BreadCrumb
            className={"bread-crumb pl-4 sm:pl-0 ml-5 text-sm"}
            model={items}
          />
          <div className="px-4 sm:px-2">
            <p className="sm:mt-0 mb-2 sm:mb-0 sm:ml-0 h-policies font-bold text-lg md:text-lg">
              Add Beneficiary
            </p>
          </div>
        </div>
        <div className="w-1/6 flex flex-col justify-end mt-4">
          <div className="Flex  hidden sm:inline-block self-end mt-0  ">
            <NextLink
              href={`/dashboard/my-policies/changebeneficiary?id=${id}`}
            >
              <img
                className="iinline mb-5 ml-5 "
                src={IMAGE_PATHS.BACK_ARROW}
              />
            </NextLink>
          </div>
        </div>
      </div>{" "}
      <div className="flex">
        {" "}
        <Card header={header} className="addben-card space-y-0">
          <Panel className="bene-panel mb-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-row justify-between mb-7 space-x-35">
                <div className="font-bold text-lg text-blue-800">
                  {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}

                  <Card className=" ">
                    <Grid className="grid grid-cols-2 mt-2 pr-2 ml-0 sm:ml-5">
                      <div className="col-span-2 sm:col-span-1 ">
                        <Label className="col-span-1 sm: col-span-3 ">
                          <h5 className="sub-font-size font-bold text-gray-700">
                            Beneficiary Type
                          </h5>
                          <div className="text-sm text-black font-semibold">
                            Who is the primary beneficiary on the policy?
                          </div>
                        </Label>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-black p-1 text-md px-0 sm:px-2 font-semibold">
                        <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                          <div className=" w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-0 sm:ml-32 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                            <RadioButton
                              inputId="benePartyType"
                              name="benePartyType"
                              value="Person"
                              checked={formik.values.benePartyType === "Person"}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="Person"
                              className="pl-2 text-sm text-black"
                            >
                              Person
                            </label>
                          </div>

                          <div className="w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-1 sm:ml-12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                            <RadioButton
                              inputId="benePartyType"
                              name="benePartyType"
                              value="Trust"
                              checked={formik.values.benePartyType === "Trust"}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="Trust"
                              className="pl-2 text-sm text-black"
                            >
                              Trust
                            </label>
                          </div>
                        </Grid>
                      </div>
                    </Grid>
                  </Card>

                  <Card className="prim-beneficiary border-transparent">
                    <div className="ml-0 sm:ml-5">
                      <h2 className="ml-1 h-5 sm:h-0 mb-0 sm:mb-10 font-bold sub-font-size quotecolor">
                        Primary Details
                      </h2>

                      {formik.values.benePartyType === "Person" ? (
                        <Grid className="grid-cols-3 gap-4 mt-4 sm:mt-10">
                          <Container className="col-span-3 sm:col-span-1 w-3/4">
                            <Container className="grid-rows-2">
                              <Label
                                htmlFor="beneFirstname"
                                className="text-black p-1 text-sm font-semibold"
                              >
                                First Name*
                              </Label>
                              <InputText
                                id="beneFirstname"
                                name="beneFirstname"
                                value={formik.values.beneFirstname}
                                placeholder="First Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-describedby=""
                                className="amount"
                              />{" "}
                              {formik.errors.beneFirstname && (
                                <small
                                  id="beneFirstname"
                                  className="p-error grid  p-d-block"
                                >
                                  {formik.errors.beneFirstname}
                                </small>
                              )}
                            </Container>
                          </Container>
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-2">
                              <Label
                                htmlFor="beneMiddlename"
                                className="text-black p-1 text-sm font-semibold"
                              >
                                Middle Name
                              </Label>
                              <InputText
                                id="beneMiddlename"
                                name="beneMiddlename"
                                placeholder="Middle Name"
                                value={formik.values.beneMiddlename}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                aria-describedby="username2-help"
                                className="amount"
                              />
                            </Container>
                          </Container>
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-2">
                              <Label
                                htmlFor="beneLastname"
                                className="text-black p-1 text-sm font-semibold"
                              >
                                Last Name*
                              </Label>
                              <InputText
                                id="beneLastname"
                                name="beneLastname"
                                placeholder="Last Name"
                                value={formik.values.beneLastname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-describedby="username2-help"
                                className="amount"
                              />{" "}
                              {formik.errors.beneLastname && (
                                <small
                                  id="beneLastname"
                                  className="p-error grid  p-d-block"
                                >
                                  {formik.errors.beneLastname}
                                </small>
                              )}
                            </Container>
                          </Container>
                        </Grid>
                      ) : null}

                      {formik.values.benePartyType === "Trust" ? (
                        <Grid className="grid-cols-1 gap-4 mt-4 sm:mt-10">
                          <Container className="col-span-1 sm:col-span-1 w-4/6 ">
                            <Container className="grid-rows-2 pr-4">
                              <Label
                                htmlFor="beneTrustName"
                                className="text-black p-1 text-sm font-semibold"
                              >
                                Full Legal Name of Trust*
                              </Label>
                              <InputText
                                id="beneTrustName"
                                name="beneTrustName"
                                className="sm:w-11/12 amount"
                                value={formik.values.beneTrustName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-describedby="username2-help"
                                placeholder="Full Legal Name of Trust"
                              />{" "}
                              {formik.errors.beneTrustName ? (
                                <small
                                  id="beneTrustee"
                                  className="p-error grid p-d-block"
                                >
                                  {formik.errors.beneTrustName}
                                </small>
                              ) : null}
                            </Container>
                          </Container>
                        </Grid>
                      ) : null}

                      {formik.values.benePartyType === "Person" ? (
                        <Grid className="grid-cols-3 gap-4 mt-5">
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="relative grid-rows-2">
                              <Label
                                htmlFor="beneGovtid"
                                className="text-black p-1 text-sm font-semibold"
                              >
                                Social Security Number
                              </Label>
                              <SecureMaskInput
                                id="beneGovtid"
                                name="beneGovtid"
                                value={formik.values.beneGovtid}
                                realvalue={formik.handleChange}
                                onBlur={formik.handleBlur}
                                mask={show2}
                                className="amount"
                              />

                              <span
                                className={`${
                                  show2 === false ? "inline-block" : "hidden"
                                } icon ml-16 sm:ml-0`}
                              >
                                <img
                                  onClick={() => setshow2(true)}
                                  className="icon-image inline cursor-pointer"
                                  src={IMAGE_PATHS.HIDE_EYE}
                                />
                              </span>

                              <span
                                className={`${
                                  show2 === true ? "inline-block" : "hidden"
                                } icon ml-16 sm:ml-0`}
                              >
                                <img
                                  onClick={() => setshow2(false)}
                                  className="icon-image inline cursor-pointer"
                                  src={IMAGE_PATHS.SHOW_EYE}
                                />
                              </span>
                            </Container>
                            {formik.errors.beneGovtid && (
                              <small
                                id="beneGovtid"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.beneGovtid}
                              </small>
                            )}
                          </Container>
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-2">
                              <Label
                                htmlFor="beneDob"
                                className="text-black p-2 text-sm font-semibold"
                              >
                                Birth Date
                              </Label>
                              <InputMask
                                id="beneDob"
                                name="beneDob"
                                value={formik.values.beneDob}
                                mask="99-99-9999"
                                slotChar="MM-DD-YYYY"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="amount"
                              />{" "}
                              {formik.errors.beneDob && (
                                <small
                                  id="beneDob"
                                  className="p-error grid  p-d-block"
                                >
                                  {formik.errors.beneDob}
                                </small>
                              )}
                            </Container>
                          </Container>
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-2">
                              <Label
                                htmlFor="beneGender"
                                className="text-black pr-8 text-sm font-semibold"
                              >
                                Gender assigned at birth
                              </Label>
                              <Dropdown
                                id="beneGender"
                                name="beneGender"
                                value={formik.values.beneGender}
                                options={gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                optionLabel="name"
                                placeholder="Select"
                                className="amount"
                              />{" "}
                              {formik.errors.beneGender && (
                                <small
                                  id="beneGender"
                                  className="p-error grid  p-d-block"
                                >
                                  {formik.errors.beneGender}
                                </small>
                              )}
                            </Container>
                          </Container>
                        </Grid>
                      ) : null}

                      {formik.values.benePartyType === "Trust" ? (
                        <Grid className="grid-cols-1 gap-4 mt-5">
                          <Container className="col-span-1 sm:col-span-2 w-4/6">
                            <Container className="grid-rows-2 pr-4">
                              <Label
                                htmlFor="beneTrustee"
                                className="text-black pr-10 text-sm font-semibold"
                              >
                                Trustee*
                              </Label>
                              <InputText
                                id="beneTrustee"
                                name="beneTrustee"
                                className="sm:w-11/12 amount"
                                value={formik.values.beneTrustee}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-describedby="trusteeName-help"
                                placeholder="Trustee"
                              />{" "}
                              {formik.errors.beneTrustee ? (
                                <small
                                  id="beneTrustee"
                                  className="p-error grid p-d-block"
                                >
                                  {formik.errors.beneTrustee}
                                </small>
                              ) : null}
                            </Container>
                          </Container>
                        </Grid>
                      ) : null}

                      {formik.values.benePartyType === "Trust" ? (
                        <div>
                          <Grid className=" grid  grid-cols-3 gap-4 mt-5">
                            <Container className="col-span-3 sm:col-span-1 w-10/12">
                              <Container className="relative grid-rows-2 ">
                                <Label
                                  htmlFor="trustGovtid"
                                  className="text-black pr-10 text-sm font-semibold"
                                >
                                  Tax ID of Trust
                                </Label>

                                {!show2 && (
                                  <div>
                                    <SecureMaskedInput
                                      id="beneGovtid"
                                      name="beneGovtid"
                                      mask={ssnMask}
                                      value={formik.values.beneGovtid}
                                      placeholder="XXX-XX-1234"
                                      className="amount"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      secure={{
                                        getValue: (detail, ssnValue) => {
                                          return formik.values.beneGovtid != ""
                                            ? "XXX-XX-" +
                                                formik.values.beneGovtid.substr(
                                                  -4
                                                )
                                            : null;
                                        }
                                      }}
                                    />

                                    <span className=" icon ml-16 sm:ml-0">
                                      <img
                                        onClick={() => setshow2(true)}
                                        className="icon-image inline cursor-pointer"
                                        src={IMAGE_PATHS.HIDE_EYE}
                                      />
                                    </span>
                                  </div>
                                )}

                                {show2 && (
                                  <div>
                                    <SecureMaskedInput
                                      id="beneGovtid"
                                      name="beneGovtid"
                                      mask={ssnMask}
                                      value={formik.values.beneGovtid}
                                      placeholder="XXX-XX-1234"
                                      className="amount"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      secure={{
                                        getValue: (detail, ssnValue) => {
                                          return formik.values.beneGovtid != ""
                                            ? formik.values.beneGovtid
                                            : null;
                                        }
                                      }}
                                    />
                                    <span className=" icon ml-16 sm:ml-0">
                                      <img
                                        onClick={() => setshow2(false)}
                                        className="icon-image inline cursor-pointer"
                                        src={IMAGE_PATHS.SHOW_EYE}
                                      />
                                    </span>
                                  </div>
                                )}
                              </Container>
                              {formik.errors.beneGovtid ? (
                                <small
                                  id="beneGovtid"
                                  className="p-error grid  p-d-block"
                                >
                                  {formik.errors.beneGovtid}
                                </small>
                              ) : null}
                            </Container>
                            <Container className="col-span-3 sm:col-span-1 w-11/12">
                              <Container className="grid-rows-2 flex flex-row">
                                <div>
                                  <Label
                                    htmlFor="beneSharingPercent"
                                    className="text-black p-1 text-sm font-semibold"
                                  >
                                    Percentage sharing*
                                  </Label>
                                  <InputText
                                    keyfilter="int"
                                    id="beneSharingPercent"
                                    name="beneSharingPercent"
                                    value={formik.values.beneSharingPercent}
                                    placeholder="%"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-describedby=""
                                    disabled={true}
                                    className="psamount"
                                  />

                                  {formik.errors.beneSharingPercent && (
                                    <small
                                      id="firstName"
                                      className="p-error grid  p-d-block"
                                    >
                                      {formik.errors.beneSharingPercent}
                                    </small>
                                  )}
                                </div>
                                <div>
                                  {show && (
                                    <PercentageSharingAppModal
                                      showsModal={show}
                                      benetype={benetype}
                                      edit={false}
                                      id={id}
                                      formik={formik}
                                      closeModal={closeModal}
                                    />
                                  )}

                                  <Button
                                    type="button"
                                    onClick={() => handleClick()}
                                    className="btn-cancel  h-10 text-blue-500 border-blue-500 font-bold text-13 sm:text-base py-2 px-2 sm:px-4 rounded-sm mr-0 sm:mr-80 us-btn-text us-btn-px w-36 sm:w-3/6 mt-2 sm:mt-5"
                                  >
                                    Update Sharing %
                                  </Button>
                                </div>

                                {/* Update Percentage Sharing --- TRUST*/}
                              </Container>
                            </Container>

                            {/* <Container className="col-span-3 sm:col-span-1 mt-0 sm:mt-5 w-11/12">
                            <Container className="grid-rows-2 ">
                              {show && (
                                <PercentageSharingAppModal
                                  showsModal={show}
                                  benetype={benetype}
                                  edit={false}
                                  id={id}
                                  formik={formik}
                                  closeModal={closeModal}
                                />
                              )}

                              <Button
                                type="button"
                                onClick={() => handleClick()}
                                className="btn-cancel  h-10 text-blue-500 border-blue-500 font-bold py-2 px-4 rounded-sm mr-80 w-4/6 sm:w-4/6"
                              >
                                Update Sharing %
                              </Button>
                            </Container>
                          </Container> */}
                          </Grid>
                          <Divider className="inline-block sm:hidden" />
                        </div>
                      ) : null}

                      <Grid className="grid-cols-3 gap-4 mt-5 pr-5">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="benePhone"
                              className="text-black p-1 text-sm font-semibold"
                            >
                              Phone Number
                            </Label>
                            <InputMask
                              id="benePhone"
                              name="benePhone"
                              className="amount"
                              mask="9999999999"
                              value={formik.values.benePhone}
                              placeholder="999999999"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />{" "}
                            {formik.errors.benePhone && (
                              <small
                                id="benePhone"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.benePhone}
                              </small>
                            )}
                          </Container>
                        </Container>
                        <Container className="col-span-3 sm:col-span-2">
                          <Container className="grid-rows-2 pr-0">
                            <Label
                              htmlFor="beneEmail"
                              className="text-black p-1 text-sm font-semibold"
                            >
                              Email ID
                            </Label>
                            <InputText
                              id="beneEmail"
                              name="beneEmail"
                              className="amount sm:w-11/12"
                              value={formik.values.beneEmail}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              aria-describedby="username2-help"
                              placeholder="email@gmail.com"
                            />{" "}
                            {formik.errors.beneEmail ? (
                              <small
                                id="beneEmail"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.beneEmail}
                              </small>
                            ) : null}
                          </Container>
                        </Container>
                      </Grid>
                      <Divider className="inline-block sm:hidden" />
                      {formik.values.benePartyType === "Person" ? (
                        <div>
                          <Grid className=" grid  grid-cols-3 gap-4 mt-0 sm:mt-5">
                            <Container className="col-span-3 sm:col-span-1 w-10/12">
                              <Container className="grid-rows-2 ">
                                <Label
                                  htmlFor="beneRelationOwner"
                                  className="text-black p-1 text-sm font-semibold"
                                >
                                  Relationship with Owner
                                  <Dropdown
                                    id="beneRelationOwner"
                                    name="beneRelationOwner"
                                    value={formik.values.beneRelationOwner}
                                    options={relation}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    optionLabel="name"
                                    placeholder="Select"
                                    className="amount"
                                  />
                                </Label>
                                {formik.errors.beneRelationOwner && (
                                  <small
                                    id="BeneficiaryFirstname"
                                    className="p-error grid  p-d-block"
                                  >
                                    {formik.errors.beneRelationOwner}
                                  </small>
                                )}
                              </Container>
                            </Container>
                            <Container className="col-span-3 sm:col-span-1 w-11/12">
                              <Container className="grid-rows-2 flex flex-row ">
                                <div>
                                  <Label
                                    htmlFor="beneSharingPercent"
                                    className="text-black p-1 text-sm font-semibold"
                                  >
                                    Percentage sharing*
                                  </Label>

                                  <InputText
                                    keyfilter="int"
                                    id="beneSharingPercent"
                                    name="beneSharingPercent"
                                    value={formik.values.beneSharingPercent}
                                    onChange={formik.handleChange}
                                    placeholder="%"
                                    aria-describedby=""
                                    disabled={true}
                                    className="psamount"
                                  />

                                  {formik.errors.beneSharingPercent && (
                                    <small
                                      id="firstName"
                                      className="p-error text-sm grid  p-d-block"
                                    >
                                      {formik.errors.beneSharingPercent}
                                    </small>
                                  )}
                                </div>
                                <div>
                                  {show && (
                                    <PercentageSharingAppModal
                                      showsModal={show}
                                      benetype={benetype}
                                      edit={false}
                                      id={id}
                                      formik={formik}
                                      closeModal={closeModal}
                                    />
                                  )}
                                  <Button
                                    onClick={() => handleClick()}
                                    className="btn-cancel  h-10 text-blue-500 border-blue-500 font-bold text-13 sm:text-base py-2 px-2 sm:px-4 rounded-sm mr-0 sm:mr-80 us-btn-text us-btn-px w-36 sm:w-3/6 mt-2 sm:mt-5"
                                  >
                                    Update Sharing %
                                  </Button>
                                </div>
                              </Container>
                            </Container>

                            {/* Update Percentage Sharing---PERSON */}
                          </Grid>
                          <Divider className="inline-block sm:hidden" />
                        </div>
                      ) : null}

                      <h2 className="p-1 mt-0 sm:mt-5 quotecolor font-bold sub-font-size">
                        Address
                      </h2>
                      <Grid className="grid-cols-4 gap-2 mt-4 pr-8 h-20">
                        <Container className="col-span-4 sm:col-span-2">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="beneAddressLine1"
                              className="text-black p-1 text-sm font-semibold"
                            >
                              Address Line 1
                            </Label>
                            <InputText
                              id="beneAddressLine1"
                              placeholder="Address"
                              name="beneAddressLine1"
                              value={formik.values.beneAddressLine1}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              aria-describedby=""
                              className="amount sm:w-11/12"
                            />{" "}
                            {formik.errors.beneAddressLine1 && (
                              <small
                                id="beneAddressLine1"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.beneAddressLine1}
                              </small>
                            )}
                          </Container>
                        </Container>

                        <Container className="col-span-4 sm:col-span-2">
                          <Container className="grid-rows-2 ">
                            <Label
                              htmlFor="beneAddressLine2"
                              className="text-black p-1 text-sm font-semibold"
                            >
                              Address Line 2
                            </Label>
                            <InputText
                              id="beneAddressLine2"
                              placeholder="Address"
                              name="beneAddressLine2"
                              value={formik.values.beneAddressLine2}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              aria-describedby=""
                              className="amount sm:w-11/12"
                            />
                          </Container>
                        </Container>
                      </Grid>
                      <Grid className="mt-16 sm:mt-0 pr-0 grid-cols-3 gap-4">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-2 w-3/4">
                            <Label
                              htmlFor="beneAddressCity"
                              className="text-black pr-14 text-sm font-semibold"
                            >
                              City
                            </Label>
                            <InputText
                              id="beneAddressCity"
                              placeholder="City"
                              name="beneAddressCity"
                              value={formik.values.beneAddressCity}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              aria-describedby=""
                              className="amount"
                            />{" "}
                            {formik.errors.beneAddressCity && (
                              <small
                                id="beneAddressCity"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.beneAddressCity}
                              </small>
                            )}
                          </Container>
                        </Container>
                        <Container className="col-span-3 sm:col-span-1 w-3/4">
                          <Container className="grid-rows-2 ">
                            <Label
                              htmlFor="beneAddressState"
                              className="text-black pr-14 text-sm font-semibold"
                            >
                              State
                            </Label>
                            <Dropdown
                              id="beneAddressState"
                              name="beneAddressState"
                              value={formik.values.beneAddressState}
                              options={allStateList}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              optionLabel="name"
                              placeholder="Select"
                              className="amount"
                              filter
                              filterMatchMode="startsWith"
                            />{" "}
                            {formik.errors.beneAddressState && (
                              <small
                                id="beneAddressState"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.beneAddressState}
                              </small>
                            )}
                          </Container>
                        </Container>
                        <Container className="col-span-3 sm:col-span-1 w-3/4">
                          <Container className="grid-rows-2 ">
                            <Label
                              htmlFor="beneAddressZip"
                              className="text-black pr-14 text-sm font-semibold"
                            >
                              Zip
                            </Label>
                            <InputMask
                              id="beneAddressZip"
                              name="beneAddressZip"
                              mask="99999"
                              className="amount"
                              value={formik.values.beneAddressZip}
                              placeholder="-----"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />{" "}
                            {formik.errors.beneAddressZip && (
                              <small
                                id="beneAddressZip"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.beneAddressZip}
                              </small>
                            )}
                          </Container>
                        </Container>
                      </Grid>

                      <Grid className="grid grid-cols-2 mt-2 pr-2">
                        <div className="col-span-2 sm:col-span-1 text-black pt-0 sm:pt-3 text-md px-0 sm:px-2 font-semibold">
                          <Label className="col-span-1 text-black p-1 text-sm font-semibold">
                            Is this designation irrevocable?
                          </Label>
                        </div>

                        <div className="col-span-2 sm:col-span-1 text-black p-1 text-md px-0 sm:px-2 font-semibold">
                          <Grid className="grid grid-cols-2 ml-0 sm:ml-16 sm:pr-1">
                            <div className=" col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 p-field-radiobutton radio-border h-11 ml-0 sm:ml-32  ">
                              {/* <div className=" col-span-1 w-4/12  p-field-radiobutton radio-border h-11 ml-0 sm:ml-72"> */}
                              <RadioButton
                                inputId="beneIrrevocable"
                                name="beneIrrevocable"
                                value="Yes"
                                checked={
                                  formik.values.beneIrrevocable === "Yes"
                                }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <label htmlFor="Yes" className="p-2 text-sm">
                                Yes
                              </label>
                            </div>
                            {/* <div className=" col-span-1 w-4/12  p-field-radiobutton ml-3 radio-border h-11 ml-0 sm:ml-36 "> */}
                            <div className="col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 p-field-radiobutton radio-border h-11 ml-0 sm:ml-12">
                              <RadioButton
                                inputId="beneIrrevocable"
                                name="beneIrrevocable"
                                value="No"
                                checked={formik.values.beneIrrevocable === "No"}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <label htmlFor="No" className="p-2 text-sm">
                                No
                              </label>
                            </div>

                            {formik.errors.beneIrrevocable && (
                              <small
                                id="beneIrrevocable"
                                className="p-error grid  p-d-block"
                              >
                                {formik.errors.beneIrrevocable}
                              </small>
                            )}
                          </Grid>
                        </div>
                      </Grid>
                    </div>
                  </Card>
                </div>
              </div>

              <Flex className="border1 flex-col-reverse md:flex-row ml-0 pl-0 sm:pl-55 items-center justify-center space-y-3 sm:justify-between border-gray-400 mt-10 sm:mt-5 mb-5 h-15 ml-0 sm:ml-3 pt-5 sm:pt-0">
                <NextLink
                  className="w-full sm:w-0"
                  href={`/dashboard/my-policies/changebeneficiary?id=${id}`}
                >
                  <Button
                    type="button"
                    className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 ml-7 sm:ml-0 rounded-sm  w-5/6 my-5 sm:w-52"
                  >
                    Cancel
                  </Button>
                </NextLink>

                <Button
                  type="button"
                  loading={formik.isSubmitting}
                  onClick={formik.submitForm}
                  disabled={!formik.isValid && formik.isSubmitting == true}
                  className="btncolor h-10 font-bold py-2 mr-3 ml-2 px-4 rounded-r w-5/6 sm:w-52"
                >
                  Add Beneficiary
                </Button>
              </Flex>

              {show1 && (
                <ModalPopUp
                  id={id}
                  showsModal={true}
                  title={title}
                  closeModal={closeModal1}
                />
              )}
            </form>
          </Panel>
        </Card>
      </div>{" "}
    </>
  );
};

export default withAuthentication(addbeneficiary);
