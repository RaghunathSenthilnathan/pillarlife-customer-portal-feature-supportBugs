import { useEffect, useState } from "react";
import { useRef } from "react";
import { Label } from "@components/forms";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { NextSeo } from "next-seo";
import { Card } from "primereact/card";
import { Flex, Container } from "@components/layout";
import { Grid } from "@components/layout";
import {  ROUTE_PATHS } from "src/constants";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Address Information";
const description =
  "Enables you to resend the registration activation link to your email address.";

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
  { name: "Massachusetts", value: "	MA" },
  { name: "Michigan", value: "MI" },
  { name: "Minnesota", value: "	MN" },
  { name: "Mississippi", value: "MS" },
  { name: "Missouri", value: "MO" },
  { name: "Montana", value: "MT" },
  { name: "Nebraska", value: "NE" },
  { name: "Nevada", value: "	NV" },
  { name: "New Hampshire	", value: "NH" },
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

const addressInfo = ({ heading, icon, subheading, formik }) => {
  const quantityInputRef = useRef(null);

  useEffect(() => {
    const ignoreScroll = e => {
      e.preventDefault();
    };
    quantityInputRef.current &&
      quantityInputRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputRef]);

  const header = (
    <Flex className="card-header ml-7 sm:ml-0">
      {" "}
      <img className="icon-image" src={icon} />
      <h5 className="p-1 my-1 sub-font-size font-semibold">{heading}</h5>
    </Flex>
  );

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
          <Container className="ml-4 sm:ml-5">
            <Grid className="grid-cols-4 gap-2 pr-12 h-20 mb-16 sm:mb-0">
              <Container className="col-span-4 sm:col-span-2">
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="addressLine1"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Address Line 1*
                  </Label>
                  <InputText
                    id="addressLine1"
                    placeholder="Address"
                    name="addressInfo.primaryResidenceAddressLine1"
                    value={
                      formik.values.addressInfo.primaryResidenceAddressLine1
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby=""
                    className="sm:w-full pi-amount"
                  />
                  {formik.errors.addressInfo && (
                    <small id="firstName" className="p-error grid  p-d-block">
                      {formik.errors.addressInfo.primaryResidenceAddressLine1}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-4 sm:col-span-2">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="addressLine2"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Address Line 2
                  </Label>
                  <InputText
                    id="addressLine2"
                    placeholder="Address"
                    name="addressInfo.primaryResidenceAddressLine2"
                    value={
                      formik.values.addressInfo.primaryResidenceAddressLine2
                    }
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
                  .addressInfo &&
                  formik.errors.addressInfo.primaryResidenceAddressLine1 &&
                  "mt-4 sm:mt-0"}`}
              >
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="city"
                    className="text-black pr-14 text-sm font-semibold"
                  >
                    City*
                  </Label>
                  <InputText
                    id="city"
                    placeholder="City"
                    name="addressInfo.primaryResidenceAddressCity"
                    value={
                      formik.values.addressInfo.primaryResidenceAddressCity
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby=""
                    className="pi-amount"
                  />
                  {formik.errors.addressInfo && (
                    <small id="firstName" className="p-error grid p-d-block">
                      {formik.errors.addressInfo.primaryResidenceAddressCity}
                    </small>
                  )}
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="state"
                    className="text-black pr-14 text-sm font-semibold"
                  >
                    State*
                  </Label>
                  <Dropdown
                    id="state"
                    name="addressInfo.primaryResidenceAddressState"
                    value={
                      formik.values.addressInfo.primaryResidenceAddressState
                    }
                    options={allStateList}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    optionLabel="name"
                    placeholder="Select"
                    className="pi-amount"
                    openMenuOnClick={false}
                    filter
                    // showClear
                    //filterBy="name"
                    filterMatchMode="startsWith"
                  />
                  {formik.errors.addressInfo && (
                    <small id="firstName" className="p-error grid  p-d-block">
                      {formik.errors.addressInfo.primaryResidenceAddressState}
                    </small>
                  )}
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="zip"
                    className="text-black pr-14 text-sm ml-1 font-semibold"
                  >
                    Zip*
                  </Label>

                  <InputText
                    id="zip"
                    className="pi-amount"
                    name="addressInfo.primaryResidenceAddressZip"
                    mask="99999"
                    value={formik.values.addressInfo.primaryResidenceAddressZip}
                    placeholder="Enter 5-digit Zip code"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={quantityInputRef}
                  />

                  {formik.errors.addressInfo && (
                    <small id="firstName" className="p-error grid  p-d-block">
                      {formik.errors.addressInfo.primaryResidenceAddressZip}
                    </small>
                  )}
                </Container>
              </Container>
            </Grid>
          </Container>
          {/* <Grid>
        <pre>{JSON.stringify(formik.values.addressInfo, null, 2)}</pre>
        </Grid> */}
        </Card>
      )}
    </>
  );
};
export default addressInfo;
