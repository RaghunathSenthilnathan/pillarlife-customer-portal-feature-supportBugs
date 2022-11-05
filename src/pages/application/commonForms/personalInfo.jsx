import { useEffect, useState, useRef, useCallback } from "react";
import {Label,SecureMaskInput} from "@components/forms";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { NextSeo } from "next-seo";
import { Card } from "primereact/card";
import { Flex, Container, Grid } from "@components/layout";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { InputMask } from "primereact/inputmask";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Personal Information";
const description =
  "Enables you to resend the registration activation link to your email address.";

const gender = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" }
];

const personalInfo = ({ heading, icon, subheading, formik, ssn }) => {
  const quantityInputRef = useRef(null);

  useEffect(() => {
    const ignoreScroll = e => {
      e.preventDefault();
    };

    quantityInputRef.current &&
      quantityInputRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputRef]);

  const quantityInputPhoneRef = useRef(null);

  useEffect(() => {
    const ignoreScroll = e => {
      e.preventDefault();
    };

    quantityInputPhoneRef.current &&
      quantityInputPhoneRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputPhoneRef]);

  const header = (
    // <div className="boxes-mobile-border sm:">
    <Flex className="card-header ml-7 sm:ml-0 ">
      {" "}
      <img className="icon-image" src={icon} />
      <h5 className="p-1 my-1 sub-font-size font-semibold">{heading}</h5>
    </Flex>
    // </div>
  );

  const [show, setshow] = useState(false);

  // console.log(
  //   "Formik value onSubmit---",
  //   formik.values.personalInfo.primaryOwnerGovtid
  // );

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
      {heading && (
        <Card header={header} className="card-layout">
          <Grid className="grid-cols-3 gap-4 ml-4 sm:ml-5">
            <Container className="col-span-3 sm:col-span-1">
              <Container className="grid-rows-2">
                <Label
                  htmlFor="pi-amount"
                  className="text-black p-1 text-sm font-semibold"
                >
                  First Name*
                </Label>
                <InputText
                  id="firstName"
                  name="personalInfo.primaryOwnerFirstname"
                  value={formik.values.personalInfo.primaryOwnerFirstname}
                  placeholder="First Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                
                  aria-describedby=""
                  className="pi-amount"
                />
                {formik.errors.personalInfo && (
                  <small id="firstName" className="p-error grid  p-d-block">
                    {formik.errors.personalInfo.primaryOwnerFirstname}
                  </small>
                )}
              </Container>
            </Container>
            <Container className="col-span-3 sm:col-span-1">
              <Container className="grid-rows-2">
                <Label
                  htmlFor="pi-amount"
                  className="text-black p-1 text-sm font-semibold"
                >
                  Middle Name
                </Label>
                <InputText
                  id="middleName"
                  name="personalInfo.primaryOwnerMiddlename"
                  placeholder="Middle Name"
                  value={formik.values.personalInfo.primaryOwnerMiddlename}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  aria-describedby="username2-help"
                  className="pi-amount"
                />
                {formik.errors.personalInfo && (
                  <small id="middleName" className="p-error grid  p-d-block">
                    {formik.errors.personalInfo.primaryOwnerMiddlename}
                  </small>
                )}
              </Container>
            </Container>
            <Container className="col-span-3 sm:col-span-1 ">
              <Container className="grid-rows-2 pr-36">
                <Label
                  htmlFor="primaryOwnerLastname"
                  className="text-black p-1 text-sm font-semibold"
                >
                  Last Name*
                </Label>
                <InputText
                  id="primaryOwnerLastname"
                  name="personalInfo.primaryOwnerLastname"
                  placeholder="Last Name"
                  value={formik.values.personalInfo.primaryOwnerLastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-describedby="username2-help"
                  className="pi-amount"
                />
                {formik.errors.personalInfo && (
                  <small id="lastName" className="p-error grid  p-d-block">
                    {formik.errors.personalInfo.primaryOwnerLastname}
                  </small>
                )}
              </Container>
            </Container>

            <Container className="  col-span-3 sm:col-span-1">
              <Container className="relative grid-rows-2">
                <Label
                  htmlFor="primaryOwnerGovtid"
                  className="text-black p-1 text-sm font-semibold"
                >
                  Social Security Number*
                </Label>

                <SecureMaskInput
                  id="primaryOwnerGovtid"
                  name="personalInfo.primaryOwnerGovtid"
                  value={formik.values.personalInfo.primaryOwnerGovtid}
                  realvalue={formik.handleChange}
                  onBlur={formik.handleBlur}
                  mask={show}
                  className="pi-amount"
                />

                <span
                  className={`${
                    show === false ? "inline-block" : "hidden"
                  } icon ml-12 sm:ml-0`}
                >
                  <img
                    onClick={() => setshow(true)}
                    className="icon-image inline cursor-pointer"
                    src={IMAGE_PATHS.HIDE_EYE}
                  />
                </span>

                <span
                  className={`${
                    show === true ? "inline-block" : "hidden"
                  } icon ml-12 sm:ml-0`}
                >
                  <img
                    onClick={() => setshow(false)}
                    className="icon-image inline cursor-pointer"
                    src={IMAGE_PATHS.SHOW_EYE}
                  />
                </span>
              </Container>
              {formik.errors.personalInfo && (
                <small id="lastName" className="p-error grid  p-d-block">
                  {formik.errors.personalInfo.primaryOwnerGovtid}
                </small>
              )}
            </Container>

            <Container className="col-span-3 sm:col-span-1">
              <Container className="grid-rows-2">
                <Label
                  htmlFor="birthDate"
                  className="text-black p-2 text-sm font-semibold"
                >
                  Birth Date*
                </Label>

                <InputMask
                  id="birthDate"
                  name="personalInfo.primaryOwnerDob"
                  mask="99/99/9999"
                  placeholder="MM/DD/YYYY"
                  value={formik.values.personalInfo.primaryOwnerDob}
                  slotChar="MM-DD-YYYY"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pi-amount"
                />
                {formik.errors.personalInfo && (
                  <small id="lastName" className="p-error grid  p-d-block">
                    {formik.errors.personalInfo.primaryOwnerDob}
                  </small>
                )}
              </Container>
            </Container>

            <Container className="col-span-3 sm:col-span-1">
              <Container className="grid-rows-2 ">
                <Label
                  htmlFor="username2"
                  className="text-black pr-8 text-sm font-semibold"
                >
                  Gender assigned at birth*
                </Label>
                <Dropdown
                  id="gender"
                  name="personalInfo.primaryOwnerGender"
                  value={formik.values.personalInfo.primaryOwnerGender}
                  options={gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  optionLabel="name"
                  placeholder="Select"
                  className="pi-amount"
                />
                {formik.errors.personalInfo && (
                  <small id="lastName" className="p-error grid  p-d-block">
                    {formik.errors.personalInfo.primaryOwnerGender}
                  </small>
                )}
              </Container>
            </Container>

            <Container className="col-span-3 sm:col-span-1">
              <Container className="grid-rows-2 pr-36">
                <Label
                  htmlFor="username2"
                  className="text-black p-1 text-sm font-semibold"
                >
                  Phone Number*
                </Label>
                <InputMask
                  id="primaryOwnerPhone"
                  name="personalInfo.primaryOwnerPhone"
                mask="(999) 999-9999"
                placeholder="(999) 999-9999"
                  value={formik.values.personalInfo.primaryOwnerPhone}
                  // slotChar="MM-DD-YYYY"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pi-amount"
                />
                {/* <InputText
                  id="primaryOwnerPhone"
                  className="pi-amount"
                  ref={quantityInputRef}
                  type="tel"
                  name="personalInfo.primaryOwnerPhone"
                  value={formik.values.personalInfo.primaryOwnerPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter 10-digit phone no"
                /> */}

                {formik.errors.personalInfo && (
                  <small id="lastName" className="p-error grid  p-d-block">
                    {formik.errors.personalInfo.primaryOwnerPhone}
                  </small>
                )}
              </Container>
            </Container>

            <Container className="col-span-3 sm:col-span-2">
              <Container className="grid-rows-2 pr-4">
                <Label
                  htmlFor="username2"
                  className="text-black p-1 text-sm font-semibold"
                >
                  Email ID*
                </Label>
                <InputText
                  id="emailId"
                  name="personalInfo.primaryOwnerEmail"
                  className="sm:w-11/12 pi-amount"
                  value={formik.values.personalInfo.primaryOwnerEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-describedby="username2-help"
                  placeholder="email@gmail.com"
                />
                {formik.errors.personalInfo ? (
                  <small id="lastName" className="p-error grid  p-d-block">
                    {formik.errors.personalInfo.primaryOwnerEmail}
                  </small>
                ) : null}
              </Container>
            </Container>
          </Grid>
          {/* <Grid>
        <pre>{JSON.stringify(formik.values.personalInfo, null, 2)}</pre>
        </Grid> */}
        </Card>
      )}
    </>
  );
};
export default personalInfo;
