import  { Label} from "@components/forms";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Sider } from "@components/sidebar";
import { NextSeo } from "next-seo";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Flex, Container, Grid } from "@components/layout";
import {  ROUTE_PATHS } from "src/constants";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.BENEFICIARY}`;
const title = "Beneficiary Information";
const description =
  "Enables you to resend the registration activation link to your email address.";

const relation = [
  { name: "Spouse", value: "SP" },
  { name: "Child", value: "CD" },
  { name: "Parent", value: "PR" },
  { name: "Sibling", value: "SB" },
  { name: "Grand Child", value: "GC" }
];

const gender = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" }
];
const allStateList = [
  { name: "Alabama", value: "AL" },
  { name: "Alaska", value: "AK" },
  { name: "Arizona", value: "AZ" },
  { name: " Arkansas", value: "AR" },
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
  { name: " Kansas", value: "KS" },
  { name: "Kentucky", value: "KY" },
  { name: "Louisiana", value: "LA" },
  { name: "Maine", value: "ME" },
  { name: " Maryland", value: "MD" },
  { name: " Massachusetts", value: "	MA" },
  { name: "Michigan", value: "MI" },
  { name: "Minnesota", value: "	MN" },
  { name: " Mississippi	", value: "MS" },
  { name: " Missouri", value: "MO" },
  { name: "Montana", value: "MT" },
  { name: "Nebraska", value: "NE" },
  { name: " Nevada", value: "	NV" },
  { name: " New Hampshire	", value: "NH" },
  { name: " New Jersey", value: "NJ" },
  { name: " New Mexico", value: "NM" },
  { name: " New York", value: "NY" },
  { name: " North Carolina", value: "NC" },
  { name: "North Dakota", value: "ND" },
  { name: " Ohio", value: "OH" },
  { name: " Oklahoma", value: "OK" },
  { name: " Oregon", value: "OR" },
  { name: " Pennsylvania", value: "PA" },
  { name: " Rhode Island", value: "RI" },
  { name: " South Carolina", value: "SC" },
  { name: " South Dakota", value: "SD" },
  { name: " Tennessee", value: "TN" },
  { name: " Texas", value: "TX" },
  { name: " Utah", value: "UT" },
  { name: " Vermont", value: "VT" },
  { name: " Virginia", value: "VA" },
  { name: " Washington", value: "WA" },
  { name: " West Virginia", value: "WV" },
  { name: "  Wisconsin", value: "WI" },
  { name: " Wyoming", value: "WY" }
];

const BeneficiaryInfo = ({ heading, icon, subheading, formik, name }) => {
  // const header =<Flex className="card-header"> <img className="icon-image" src={icon}/><h5 className="p-1 text-md font-semibold">{heading}</h5></Flex>;

  // const header=<><i className="pi pi-calendar"></i><span>{heading}</span></>;

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

      <Sider />

      <Accordion
        header="1st Beneficiary"
        className="font-bold quotecolor mt-1"
        activeIndex={0}
      >
        <AccordionTab>
          <Card className="">
            <Flex className="col-span-2">
              {/* <Label className="text-black p-1 text-sm  px-2 font-semibold">
                  <h5 className="text-xl">Beneficiary Type</h5>
                    Who is the primary beneficiary in the policy?
                  </Label> */}
              <Label className="p-1  px-2 ">
                <h5 className="text-sm text-grey-700 font-bold">
                  Beneficiary Type
                </h5>
                <div className=" text-black  text-sm  font-semibold">
                  Who is the primary beneficiary on the policy?
                </div>
              </Label>

              <div className="p-field-radiobutton ml-3 radio-border h-11 w-2/12">
                <RadioButton />
                <label htmlFor="yes" className="p-2">
                  Person
                </label>
              </div>
              <div className="p-field-radiobutton ml-5 radio-border h-11 w-2/12 ">
                <RadioButton />
                <label htmlFor="no" className="p-2 ">
                  Trust
                </label>
              </div>
            </Flex>
          </Card>
          <Card className="prim-beneficiary border-transparent">
            <h2 className="p-1 quotecolor text-md"> Primary Details </h2>
            <Grid className="grid-cols-3 gap-4">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="BeneficiaryFirstname"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    First Name*
                  </Label>
                  <InputText
                    id="BeneficiaryFirstname"
                    name="BeneficiaryInfo.BeneficiaryFirstname"
                    value={formik.values.BeneficiaryInfo.BeneficiaryFirstname}
                    placeholder="First Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby=""
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryFirstname"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryFirstname}
                    </small>
                  )}
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="BeneficiaryMiddlename"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Middle Name
                  </Label>
                  <InputText
                    id="BeneficiaryMiddlename"
                    name="BeneficiaryInfo.BeneficiaryMiddlename"
                    placeholder="Middle Name"
                    value={formik.values.BeneficiaryInfo.BeneficiaryMiddlename}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    aria-describedby="username2-help"
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryMiddlename"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.middleName}
                    </small>
                  )}
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-1 ">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Last Name*
                  </Label>
                  <InputText
                    id="BeneficiaryLastname"
                    name="BeneficiaryInfo.BeneficiaryLastname"
                    placeholder="Last Name"
                    value={formik.values.BeneficiaryInfo.BeneficiaryLastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby="username2-help"
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryLastname"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryLastname}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="BeneficiaryGovtid"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Social Security Number*
                  </Label>

                  <InputMask
                    id="BeneficiaryGovtid"
                    name="BeneficiaryInfo.BeneficiaryGovtid"
                    mask="999999999"
                    className="amount"
                    value={formik.values.BeneficiaryInfo.BeneficiaryGovtid}
                    placeholder="XXX-XX-1234"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryGovtid"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryGovtid}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="BeneficiaryDob"
                    className="text-black p-2 text-sm font-semibold"
                  >
                    Birth Date*
                  </Label>

                  <InputMask
                    id="BeneficiaryDob"
                    name="BeneficiaryInfo.BeneficiaryDob"
                    value={formik.values.BeneficiaryInfo.BeneficiaryDob}
                    mask="99-99-9999"
                    slotChar="MM-DD-YYYY"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryDob"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryDob}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="BeneficiaryGender"
                    className="text-black pr-8 text-sm font-semibold"
                  >
                    Gender assigned at birth*
                  </Label>
                  <Dropdown
                    id="BeneficiaryGender"
                    name="BeneficiaryInfo.BeneficiaryGender"
                    value={formik.values.BeneficiaryInfo.BeneficiaryGender}
                    options={gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    optionLabel="name"
                    placeholder="Select"
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryGender"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryGender}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2 pr-2">
                  <Label
                    htmlFor="BeneficiaryPhone"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Phone Number*
                  </Label>
                  <InputMask
                    id="BeneficiaryPhone"
                    name="BeneficiaryInfo.BeneficiaryPhone"
                    className="amount"
                    mask="9999999999"
                    value={formik.values.BeneficiaryInfo.BeneficiaryPhone}
                    placeholder="999999999"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryPhone"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryPhone}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-3 sm:col-span-2">
                <Container className="grid-rows-2 pr-4">
                  <Label
                    htmlFor="BeneficiaryEmail"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Email ID*
                  </Label>
                  <InputText
                    id="BeneficiaryEmail"
                    name="BeneficiaryInfo.BeneficiaryEmail"
                    className="w-11/12"
                    value={formik.values.BeneficiaryInfo.BeneficiaryEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby="username2-help"
                    placeholder="email@gmail.com"
                  />
                  {formik.errors.BeneficiaryInfo ? (
                    <small
                      id="BeneficiaryEmail"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryEmail}
                    </small>
                  ) : null}
                </Container>
              </Container>
            </Grid>

            <Grid className="gird-cols-3 gap-4 mt-4 ">
              <Container className=" col-span-3 sm:col-span-1 w-1/4">
                <Container className="row-span-2 ">
                  <Label
                    htmlFor="BeneficiaryFirstname"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Relationship with Owner*
                  </Label>
                  <Dropdown
                    id="BeneficiaryRelationshipWithOwner"
                    name="BeneficiaryInfo.BeneficiaryRelationshipWithOwner"
                    value={
                      formik.values.BeneficiaryInfo
                        .BeneficiaryRelationshipWithOwner
                    }
                    options={relation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    optionLabel="name"
                    placeholder="Select"
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryFirstname"
                      className="p-error grid  p-d-block"
                    >
                      {
                        formik.errors.BeneficiaryInfo
                          .BeneficiaryRelationshipWithOwner
                      }
                    </small>
                  )}
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-1 w-1/4">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="BeneficiaryFirstname"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Percentage sharing (%)
                  </Label>
                  <InputText
                    id="BeneficiaryPercentageSharing"
                    name="BeneficiaryInfo.BeneficiaryPercentageSharing"
                    value={
                      formik.values.BeneficiaryInfo.BeneficiaryPercentageSharing
                    }
                    placeholder="%"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
               
                    aria-describedby=""
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryFirstname"
                      className="p-error grid  p-d-block"
                    >
                      {
                        formik.errors.BeneficiaryInfo
                          .BeneficiaryPercentageSharing
                      }
                    </small>
                  )}
                </Container>
              </Container>
            </Grid>

            <h2 className="p-1 quotecolor text-md"> Address </h2>
            <Grid className="grid-cols-4 gap-2 pr-8 h-20">
              <Container className="col-span-4 sm:col-span-2">
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="BeneficiaryAddressLine1"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Address Line 1*
                  </Label>
                  <InputText
                    id="BeneficiaryAddressLine1"
                    placeholder="Address"
                    name="BeneficiaryInfo.BeneficiaryAddressLine1"
                    value={
                      formik.values.BeneficiaryInfo.BeneficiaryAddressLine1
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby=""
                    className="w-full"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryAddressLine1"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryAddressLine1}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-4 sm:col-span-2">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="BeneficiaryAddressLine2"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Address Line 2
                  </Label>
                  <InputText
                    id="BeneficiaryAddressLine2"
                    placeholder="Address"
                    name="BeneficiaryInfo.BeneficiaryAddressLine2"
                    value={
                      formik.values.BeneficiaryInfo.BeneficiaryAddressLine2
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby=""
                    className="w-11/12"
                  />
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-3 gap-2">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2">
                  <Label
                    htmlFor="BeneficiaryAddressCity"
                    className="text-black pr-14 text-sm font-semibold"
                  >
                    City*
                  </Label>
                  <InputText
                    id="BeneficiaryAddressCity"
                    placeholder="City"
                    name="BeneficiaryInfo.BeneficiaryAddressCity"
                    value={formik.values.BeneficiaryInfo.BeneficiaryAddressCity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby=""
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryAddressCity"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryAddressCity}
                    </small>
                  )}
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="BeneficiaryAddressState"
                    className="text-black pr-14 text-md font-semibold"
                  >
                    State*
                  </Label>
                  <Dropdown
                    id="BeneficiaryAddressState"
                    name="BeneficiaryInfo.BeneficiaryAddressState"
                    value={
                      formik.values.BeneficiaryInfo.BeneficiaryAddressState
                    }
                    options={allStateList}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    optionLabel="name"
                    placeholder="Select"
                    className="amount"
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryAddressState"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryAddressState}
                    </small>
                  )}
                </Container>
              </Container>
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-2 ">
                  <Label
                    htmlFor="BeneficiaryAddressZip"
                    className="text-black pr-14 text-md font-semibold"
                  >
                    Zip*
                  </Label>
                  <InputMask
                    id="BeneficiaryAddressZip"
                    name="BeneficiaryInfo.BeneficiaryAddressZip"
                    mask="99999"
                    className="amount"
                    value={formik.values.BeneficiaryInfo.BeneficiaryAddressZip}
                    placeholder="-----"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.BeneficiaryInfo && (
                    <small
                      id="BeneficiaryAddressZip"
                      className="p-error grid  p-d-block"
                    >
                      {formik.errors.BeneficiaryInfo.BeneficiaryAddressZip}
                    </small>
                  )}
                </Container>
              </Container>
            </Grid>
            <Grid>
              <pre>
                {JSON.stringify(formik.values.BeneficiaryInfo, null, 2)}
              </pre>
            </Grid>
          </Card>
        </AccordionTab>
      </Accordion>
    </>
  );
};

export default BeneficiaryInfo;
