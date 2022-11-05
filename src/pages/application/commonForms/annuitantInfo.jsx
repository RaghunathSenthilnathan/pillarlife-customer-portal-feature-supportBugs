import { useEffect, useState, useCallback } from "react";
import {Label,SecureMaskInput} from "@components/forms";
import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { NextSeo } from "next-seo";
import { Flex, Container } from "@components/layout";
import { Grid } from "@components/layout";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { InputMask } from "primereact/inputmask";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "annuitantInfo";
const description =
  "Enables you to resend the registration activation link to your email address.";

const gender = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" }
];

const allStateList = [
  { name: "Alabama", value: "AL" },
  { name: "Alaska", value: "AK" },
  { name: "Arizona", value: "AZ" },
  { name: "Arkansas", value: "AR" },
  { name: "California", value: "CA" },
  { name: "Colorado", value: "CO" },
  { name: "Connecticut", value: "CT" },
  { name: "Delaware", value: "DE" },
  { name: "District of Columbia", value: "DC" },
  { name: "Florida", value: "FL" },
  { name: "Georgia", value: "GA" },
  { name: "Hawaii", value: "HI" },
  { name: "Idaho", value: "ID" },
  { name: "Illinois", value: "IL" },
  { name: "Indiana", value: "IN" },
  { name: "Iowa", value: "	IA" },
  { name: "Kansas", value: "KS" },
  { name: "Kentucky", value: "KY" },
  { name: "Louisiana", value: "LA" },
  { name: "Maine", value: "ME" },
  { name: "Maryland", value: "MD" },
  { name: "Massachusetts", value: "MA" },
  { name: "Michigan", value: "MI" },
  { name: "Minnesota", value: "	MN" },
  { name: "Mississippi", value: "MS" },
  { name: "Missouri", value: "MO" },
  { name: "Montana", value: "MT" },
  { name: "Nebraska", value: "NE" },
  { name: "Nevada", value: "NV" },
  { name: "New Hampshire", value: "NH" },
  { name: "New Jersey", value: "NJ" },
  { name: "New Mexico", value: "NM" },
  { name: "New York", value: "NY" },
  { name: "North Carolina", value: "NC" },
  { name: "North Dakota", value: "ND" },
  { name: "Ohio", value: "OH" },
  { name: "Oklahoma", value: "OK" },
  { name: "Oregon", value: "OR" },
  { name: "Pennsylvania", value: "PA" },
  { name: "Rhode Island", value: "RI" },
  { name: "South Carolina", value: "SC" },
  { name: "South Dakota", value: "SD" },
  { name: "Tennessee", value: "TN" },
  { name: "Texas", value: "TX" },
  { name: "Utah", value: "UT" },
  { name: "Vermont", value: "VT" },
  { name: "Virginia", value: "VA" },
  { name: "Washington", value: "WA" },
  { name: "West Virginia", value: "WV" },
  { name: "Wisconsin", value: "WI" },
  { name: "Wyoming", value: "WY" }
];

const annuitantInfo = ({ heading, icon, subheading, formik, name }) => {
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
    <Flex className="card-header ml-9 sm:ml-0">
      {" "}
      <img className="icon-image" src={icon} />
      <h5 className="p-1 my-1 sub-font-size font-semibold">{heading}</h5>
    </Flex>
  );

  const [show, setshow] = useState(false);

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
      <Container className="ml-4 sm:ml-5">
        <h2 className="p-1 font-bold quotecolor">Annuitant Primary Details </h2>
        <Grid className="grid-cols-3 gap-4">
          <Container className="col-span-3 sm:col-span-1">
            <Container className="grid-rows-2 pr-36">
              <Label
                htmlFor="annuitantFirstname"
                className="text-black p-1 text-sm font-semibold"
              >
                First Name*
              </Label>
              <InputText
                id="annuitantFirstname"
                name="annuitantInfo.annuitantFirstname"
                value={formik.values.annuitantInfo.annuitantFirstname}
                placeholder="First Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
               
                aria-describedby=""
                className="pi-amount"
              />
              {formik.errors.annuitantInfo && (
                <small
                  id="annuitantFirstname"
                  className="p-error grid  p-d-block"
                >
                  {formik.errors.annuitantInfo.annuitantFirstname}
                </small>
              )}
            </Container>
          </Container>
          <Container className="col-span-3 sm:col-span-1">
            <Container className="grid-rows-2">
              <Label
                htmlFor="annuitantMiddlename"
                className="text-black p-1 text-sm font-semibold"
              >
                Middle Name
              </Label>
              <InputText
                id="annuitantMiddlename"
                name="annuitantInfo.annuitantMiddlename"
                placeholder="Middle Name"
                value={formik.values.annuitantInfo.annuitantMiddlename}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                aria-describedby="username2-help"
                className="pi-amount"
              />
              {formik.errors.annuitantInfo && (
                <small
                  id="annuitantMiddlename"
                  className="p-error grid  p-d-block"
                >
                  {formik.errors.annuitantInfo.middleName}
                </small>
              )}
            </Container>
          </Container>
          <Container className="col-span-3 sm:col-span-1 ">
            <Container className="grid-rows-2 pr-36">
              <Label
                htmlFor="pi-amount"
                className="text-black p-1 text-sm font-semibold"
              >
                Last Name*
              </Label>
              <InputText
                id="annuitantLastname"
                name="annuitantInfo.annuitantLastname"
                placeholder="Last Name"
                value={formik.values.annuitantInfo.annuitantLastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-describedby="username2-help"
                className="pi-amount"
              />
              {formik.errors.annuitantInfo && (
                <small
                  id="annuitantLastname"
                  className="p-error grid  p-d-block"
                >
                  {formik.errors.annuitantInfo.annuitantLastname}
                </small>
              )}
            </Container>
          </Container>

          <Container className="col-span-3 sm:col-span-1">
            <Container className="relative grid-rows-2">
              <Label
                htmlFor="annuitantGovtid"
                className="text-black p-1 text-sm font-semibold"
              >
                Social Security Number*
              </Label>

              <SecureMaskInput
                id="annuitantGovtid"
                name="annuitantInfo.annuitantGovtid"
                value={formik.values.annuitantInfo.annuitantGovtid}
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
            {formik.errors.annuitantInfo && (
              <small id="annuitantGovtid" className="p-error grid  p-d-block">
                {formik.errors.annuitantInfo.annuitantGovtid}
              </small>
            )}
          </Container>

          <Container className="col-span-3 sm:col-span-1">
            <Container className="grid-rows-2">
              <Label
                htmlFor="annuitantDob"
                className="text-black p-2 text-sm font-semibold"
              >
                Birth Date*
              </Label>

              <InputMask
                id="annuitantDob"
                name="annuitantInfo.annuitantDob"
                value={formik.values.annuitantInfo.annuitantDob}
                mask="99/99/9999"
                placeholder="MM/DD/YYYY"
                slotChar="MM-DD-YYYY"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pi-amount"
              />
              {formik.errors.annuitantInfo && (
                <small id="annuitantDob" className="p-error grid  p-d-block">
                  {formik.errors.annuitantInfo.annuitantDob}
                </small>
              )}
            </Container>
          </Container>

          <Container className="col-span-3 sm:col-span-1">
            <Container className="grid-rows-2 ">
              <Label
                htmlFor="annuitantGender"
                className="text-black pr-8 text-sm font-semibold"
              >
                Gender assigned at birth*
              </Label>
              <Dropdown
                id="annuitantGender"
                name="annuitantInfo.annuitantGender"
                value={formik.values.annuitantInfo.annuitantGender}
                options={gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                optionLabel="name"
                placeholder="Select"
                className="pi-amount"
              />
              {formik.errors.annuitantInfo && (
                <small id="annuitantGender" className="p-error grid  p-d-block">
                  {formik.errors.annuitantInfo.annuitantGender}
                </small>
              )}
            </Container>
          </Container>

          <Container className="col-span-3 sm:col-span-1">
            <Container className="grid-rows-2 pr-2">
              <Label
                htmlFor="annuitantPhone"
                className="text-black p-1 text-sm font-semibold"
              >
                Phone Number*
              </Label>
               <InputMask
                  id="annuitantPhone"
                  name="annuitantInfo.annuitantPhone"
                mask="(999) 999-9999"
                placeholder="(999) 999-9999"
                  value={formik.values.annuitantInfo.annuitantPhone}
                  // slotChar="MM-DD-YYYY"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pi-amount"
                />
              {/* <InputText
                id="annuitantPhone"
                name="annuitantInfo.annuitantPhone"
                className="pi-amount"
                type="tel"
                value={formik.values.annuitantInfo.annuitantPhone}
                placeholder="Enter 10-digit phone no"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                ref={quantityInputPhoneRef}
              /> */}

              {formik.errors.annuitantInfo && (
                <small id="annuitantPhone" className="p-error grid  p-d-block">
                  {formik.errors.annuitantInfo.annuitantPhone}
                </small>
              )}
            </Container>
          </Container>

          <Container className="col-span-3 sm:col-span-2">
            <Container className="grid-rows-2 pr-4">
              <Label
                htmlFor="annuitantEmail"
                className="text-black p-1 text-sm font-semibold"
              >
                Email ID*
              </Label>
              <InputText
                id="annuitantEmail"
                name="annuitantInfo.annuitantEmail"
                className="sm:w-11/12 pi-amount"
                value={formik.values.annuitantInfo.annuitantEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-describedby="username2-help"
                placeholder="email@gmail.com"
              />
              {formik.errors.annuitantInfo ? (
                <small id="annuitantEmail" className="p-error grid  p-d-block">
                  {formik.errors.annuitantInfo.annuitantEmail}
                </small>
              ) : null}
            </Container>
          </Container>
        </Grid>
        <h2 className="p-1 font-bold quotecolor my-3"> Address </h2>
        <Grid className="grid-cols-4 gap-2 pr-12 h-20 mb-16 sm:mb-0">
          <Container className="col-span-4 sm:col-span-2">
            <Container className="grid-rows-2">
              <Label
                htmlFor="annuitantAddressLine1"
                className="text-black p-1 text-md font-semibold"
              >
                Address Line 1*
              </Label>
              <InputText
                id="annuitantAddressLine1"
                placeholder="Address"
                name="annuitantInfo.annuitantAddressLine1"
                value={formik.values.annuitantInfo.annuitantAddressLine1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-describedby=""
                className="sm:w-full pi-amount"
              />
              {formik.errors.annuitantInfo && (
                <small
                  id="annuitantAddressLine1"
                  className="p-error grid  p-d-block"
                >
                  {formik.errors.annuitantInfo.annuitantAddressLine1}
                </small>
              )}
            </Container>
          </Container>

          <Container className="col-span-4 sm:col-span-2">
            <Container className="grid-rows-2 ">
              <Label
                htmlFor="annuitantAddressLine2"
                className="text-black p-1 text-md font-semibold"
              >
                Address Line 2
              </Label>
              <InputText
                id="annuitantAddressLine2"
                placeholder="Address"
                name="annuitantInfo.annuitantAddressLine2"
                value={formik.values.annuitantInfo.annuitantAddressLine2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-describedby=""
                className="sm:w-11/12 pi-amount"
              />
            </Container>
          </Container>
        </Grid>
        <Grid className="grid-cols-3 gap-2">
          <Container
            className={`col-span-3 sm:col-span-1 ${formik.errors
              .annuitantInfo &&
              formik.errors.annuitantInfo.annuitantAddressLine1 &&
              "mt-4 sm:mt-0"}`}
          >
            <Container className="grid-rows-2">
              <Label
                htmlFor="annuitantAddressCity"
                className="text-black pr-14 text-sm font-semibold"
              >
                City*
              </Label>
              <InputText
                id="annuitantAddressCity"
                placeholder="City"
                name="annuitantInfo.annuitantAddressCity"
                value={formik.values.annuitantInfo.annuitantAddressCity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-describedby=""
                className="pi-amount"
              />
              {formik.errors.annuitantInfo && (
                <small
                  id="annuitantAddressCity"
                  className="p-error grid  p-d-block"
                >
                  {formik.errors.annuitantInfo.annuitantAddressCity}
                </small>
              )}
            </Container>
          </Container>
          <Container className="col-span-3 sm:col-span-1">
            <Container className="grid-rows-2 ">
              <Label
                htmlFor="annuitantAddressState"
                className="text-black pr-14 text-md font-semibold"
              >
                State*
              </Label>
              <Dropdown
                id="annuitantAddressState"
                name="annuitantInfo.annuitantAddressState"
                value={formik.values.annuitantInfo.annuitantAddressState}
                options={allStateList}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                optionLabel="name"
                placeholder="Select"
                className="pi-amount"
                filter
                filterMatchMode="startsWith"
              />
              {formik.errors.annuitantInfo && (
                <small
                  id="annuitantAddressState"
                  className="p-error grid  p-d-block"
                >
                  {formik.errors.annuitantInfo.annuitantAddressState}
                </small>
              )}
            </Container>
          </Container>
          <Container className="col-span-3 sm:col-span-1">
            <Container className="grid-rows-2 ">
              <Label
                htmlFor="annuitantAddressZip"
                className="text-black pr-14 text-md font-semibold"
              >
                Zip*
              </Label>
              <InputText
                id="annuitantAddressZip"
                className="pi-amount"
                name="annuitantInfo.annuitantAddressZip"
                mask="99999"
                value={formik.values.annuitantInfo.annuitantAddressZip}
                placeholder="Enter 5-digit Zip code"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                ref={quantityInputRef}
              />

              {formik.errors.annuitantInfo && (
                <small
                  id="annuitantAddressZip"
                  className="p-error grid  p-d-block"
                >
                  {formik.errors.annuitantInfo.annuitantAddressZip}
                </small>
              )}
            </Container>
          </Container>
        </Grid>
        {/* <Grid>
        <pre>{JSON.stringify(formik.values.annuitantInfo, null, 2)}</pre>
        </Grid> */}
      </Container>
    </>
  );
};
export default annuitantInfo;
