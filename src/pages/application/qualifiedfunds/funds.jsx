import { useState, useCallback } from "react";
import { Button } from "@components/forms";
import { Sider } from "@components/sidebar";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Container } from "@components/layout";
import { withAuthentication } from "@utils/route-hocs";
import { FundModal } from "./fundModal";
import { useRouter } from "next/router";
import { Grid } from "../../../components/layout/grid";
import { ROUTE_PATHS } from "src/constants";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Qualified Funds";
const description =
  "Enables you to resend the registration activation link to your email address.";
export default withAuthentication(Policyowner);
function Policyowner() {
  const [val, setValue] = useState(false);
  const [show, setshowModal] = useState(false);
  const closeModal = useCallback(() => setshowModal(false), []);

  const router = useRouter();

  const handleClick = () => {
    router.push(ROUTE_PATHS.POLICYOWNER);
  };
  const footer = (
      <Container className="sm:w-full flex mt-24 sm:mt-0 align-center justify-center sm:justify-end">
        <Button
          type="submit"
          onClick={handleClick}
          disabled={val === "no" ? false : true}
          className=" btncolor text-left h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
        >
          Next
        </Button>
      </Container>
  );
  const handleChange = (value) => {
    setValue(value);
    if (value === "yes") {
      setshowModal(true);
    }
  };
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
      <div className="flex flex-col  sm:px-6 lg:px-8">
        <div className="lg:flex">
          <div className="lg:flex-1">
            <div className="mt-6 sm:w-2/4 ">
              <div className="p-2 text-left">
                <div>
                  <Sider />
                  {/* <h1 className="text-3xl font-bold leading-9 tracking-tight text-gray-800 sm:text-4xl sm:leading-10">Sprint 4 Coming Soon..</h1> */}

                  <Card className={"qstn-card question-card"} footer={footer}>
                    <Container>
                      <h1 className={"text-blue-clr"}>
                        Do you plan to fund this annuity with qualified funds?
                      </h1>
                    </Container>
                    <Container className="pt-2" style={{ color: "#293889" }}>
                      <h6>
                        These are usually funds from an IRA, 401(k), 403(b), or
                        other retirement plans.
                      </h6>
                    </Container>
                    <Grid className="grid-cols-10 p-0 mt-5">
                      <Container
                        onClick={() => handleChange("yes")}
                        className="col-start-1 col-span-4 sm:col-span-2  radio-border"
                      >
                        <div className="p-field-radiobutton">
                          <RadioButton
                            inputId="yes"
                            name="val"
                            value="yes"
                            onChange={(e) => handleChange(e)}
                            checked={val === "yes"}
                          />
                          <label htmlFor="yes" className="px-2 font-semibold">
                            Yes
                          </label>
                        </div>
                      </Container>
                      <Container
                        onClick={() => handleChange("no")}
                        className="col-start-6 col-span-4 sm:col-span-2 sm:ml-4 radio-border"
                      >
                        <div className="p-field-radiobutton">
                          <RadioButton
                            inputId="no"
                            name="val"
                            value="no"
                            onChange={(e) => handleChange(e)}
                            checked={val === "no"}
                          />
                          <label htmlFor="no" className="px-2 font-semibold">
                            No
                          </label>
                        </div>
                      </Container>
                    </Grid>
                  </Card>

                  {show && (
                    <FundModal showsModal={true} closeModal={closeModal} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
