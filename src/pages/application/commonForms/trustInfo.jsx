import {  useState } from "react";
import {Label,SecureMaskInput} from "@components/forms";
import { InputText } from "primereact/inputtext";
import { NextSeo } from "next-seo";
import { Card } from "primereact/card";
import { Flex, Container, Grid } from "@components/layout";
import { ROUTE_PATHS, IMAGE_PATHS } from "src/constants";
import { InputMask } from "primereact/inputmask";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Trust";
const description =
  "Enables you to resend the registration activation link to your email address.";

const gender = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" }
];

const trustInfo = ({ heading, icon, subheading, formik }) => {
  const header = (
    // <Container className="boxes-mobile-border sm:0">
    <Flex className="ml-6 sm:ml-0">
      {" "}
      <img className="icon-image" src={icon} />
      <h5 className="p-1 my-1 sub-font-size font-semibold">{heading}</h5>
    </Flex>
    // </Container>
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
      <Card header={header} className="card-layout">
        <Container className="ml-4 sm:ml-5">
          <Grid className="gap-4">
            <Grid className="grid-cols-1 gap-4">
              <Container className="col-span-1 sm:col-span-1 ">
                <Container className="grid-rows-2 pr-4">
                  <Label
                    htmlFor="trustName"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Full Legal Name of Trust*
                  </Label>
                  <InputText
                    id="trustName"
                    name="trustInfo.trustName"
                    className="sm:w-11/12 amount"
                    value={formik.values.trustInfo.trustName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby="username2-help"
                    placeholder="Full Legal Name of Trust"
                  />
                  {formik.errors.trustInfo ? (
                    <small id="trustName" className="p-error grid p-d-block">
                      {formik.errors.trustInfo.trustName}
                    </small>
                  ) : null}
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-1 gap-4">
              <Container className="col-span-1 sm:col-span-2">
                <Container className="grid-rows-2 pr-4">
                  <Label
                    htmlFor="trusteeName"
                    className="text-black pr-10 text-sm font-semibold"
                  >
                    Trustee*
                  </Label>
                  <InputText
                    id="trusteeName"
                    name="trustInfo.trusteeName"
                    className="sm:w-11/12 amount"
                    value={formik.values.trustInfo.trusteeName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby="trusteeName-help"
                    placeholder="Trustee"
                  />
                  {formik.errors.trustInfo ? (
                    <small id="trusteeName" className="p-error grid p-d-block">
                      {formik.errors.trustInfo.trusteeName}
                    </small>
                  ) : null}
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-4 gap-4">
              <Container className="col-span-4 sm:col-span-2">
                <Container className="relative grid-rows-2 pr-36">
                  <Label
                    htmlFor="trustGovtid"
                    className="text-black pr-10 text-sm font-semibold"
                  >
                    Tax ID of Trust*
                  </Label>

                  <SecureMaskInput
                    id="trustGovtid"
                    name="trustInfo.trustGovtid"
                    value={formik.values.trustInfo.trustGovtid}
                    realvalue={formik.handleChange}
                    onBlur={formik.handleBlur}
                    mask={show}
                    className="amount"
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
                {formik.errors.trustInfo ? (
                  <small id="trustGovtid" className="p-error grid  p-d-block">
                    {formik.errors.trustInfo.trustGovtid}
                  </small>
                ) : null}
              </Container>
              <Container className="col-span-4 sm:col-span-2">
                <Container className="grid-rows-2 pr-16">
                  <Label
                    htmlFor="trustDate"
                    className="text-black pr-10 text-sm font-semibold"
                  >
                    Date the Trust was formed*
                  </Label>
                  <InputMask
                    id="trustDate"
                    name="trustInfo.trustDate"
                    mask="99/99/9999"
                    placeholder="MM/DD/YYYY"
                    value={formik.values.trustInfo.trustDate}
                    slotChar="MM-DD-YYYY"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="amount"
                  />
                  {formik.errors.trustInfo ? (
                    <small id="trustDate" className="p-error grid p-d-block">
                      {formik.errors.trustInfo.trustDate}
                    </small>
                  ) : null}
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-4 gap-4">
              <Container className="col-span-4 sm:col-span-2">
                <Container className="grid-rows-2 pr-36">
                  <Label
                    htmlFor="trustPhone"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Phone Number*
                  </Label>
                   <InputMask
                  id="trustPhone"
                  name="trustInfo.trustPhone"
                mask="(999) 999-9999"
                placeholder="(999) 999-9999"
                  value={formik.values.trustInfo.trustPhone}
                  // slotChar="MM-DD-YYYY"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pi-amount"
                />
                  {/* <InputText
                    id="trustPhone"
                    className="amount"
                    type="tel"
                    name="trustInfo.trustPhone"
                    value={formik.values.trustInfo.trustPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter 10-digit phone no"
                  /> */}

                  {formik.errors.trustInfo && (
                    <small id="lastName" className="p-error grid  p-d-block">
                      {formik.errors.trustInfo.trustPhone}
                    </small>
                  )}
                </Container>
              </Container>

              <Container className="col-span-4 sm:col-span-2">
                <Container className="grid-rows-2 pr-16">
                  <Label
                    htmlFor="trustEmail"
                    className="text-black p-1 text-sm font-semibold"
                  >
                    Email ID*
                  </Label>
                  <InputText
                    id="trustEmail"
                    name="trustInfo.trustEmail"
                    className="sm:w-11/12 amount"
                    value={formik.values.trustInfo.trustEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-describedby="username2-help"
                    placeholder="email@gmail.com"
                  />
                  {formik.errors.trustInfo ? (
                    <small id="trustEmail" className="p-error grid p-d-block">
                      {formik.errors.trustInfo.trustEmail}
                    </small>
                  ) : null}
                </Container>
              </Container>
            </Grid>
          </Grid>
        </Container>
      </Card>
    </>
  );
};
export default trustInfo;
