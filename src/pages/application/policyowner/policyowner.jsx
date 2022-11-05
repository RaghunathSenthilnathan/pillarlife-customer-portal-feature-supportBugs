import { useState } from "react";
import { Button } from "@components/forms";
import { Sider } from "@components/sidebar";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Flex, Container } from "@components/layout";
import { Grid } from "../../../components/layout/grid";
import { withAuthentication } from "@utils/route-hocs";
import { ROUTE_PATHS } from "src/constants";
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Policy Owner";
const description =
  "Enables you to resend the registration activation link to your email address.";
export default withAuthentication(Policyowner);
function Policyowner() {
  const [val, setValue] = useState(false);
  const footer = (
    <Flex className="flex flex-col-reverse mt-24 sm:my-4 md:flex-row md:space-x-96 sm:ml-0">
      <div className="m-2">
        <Link href={ROUTE_PATHS.FUNDS}>
          <Button className="p-2 btn-cancel text-blue-500 border-blue-500 font-bold rounded-sm w-full sm:w-48">
            Back
          </Button>
        </Link>
      </div>
      <div className="m-2">
        <Link
          href={
            val === "you alone"
              ? "policyowner/youAlone"
              : val === "you and another"
              ? "policyowner/jointOwner"
              : val === "trust"
              ? "policyowner/trust"
              : "policyowner"
          }
          className=" relative text-gray-900 title-font md:mb-0"
          aria-label="home"
        >
          <Button
            type="submit"
            disabled={
              val === "you alone" ||
              val === "you and another" ||
              val === "trust"
                ? false
                : true
            }
            className=" btncolor h-10 font-bold py-2 px-4 sm:ml-48 rounded-r w-full sm:w-48"
          >
            Next
          </Button>
        </Link>
      </div>
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
          description,
        }}
      />
      <div className="flex flex-col  sm:px-6 lg:px-8">
        <div className="lg:flex">
          <div className="lg:flex-1">
            <div className="mt-6 sm:w-2/4">
              <div className="p-2 text-left">
                <div>
                  <Sider />
                  <Card className={"qstn-card question-card"} footer={footer}>
                    <Container>
                      <h2 className="text-blue-clr pl-2">
                        Will this policy be owned by
                      </h2>
                    </Container>
                    <Grid className="grid-cols-10 p-2 mt-5 mb-10">
                      <Grid
                        onClick={() => setValue("you alone")}
                        className="col-start-1 col-span-8 mt-5 sm:col-span-2  radio-border"
                      >
                        <div className="p-field-radiobutton">
                          <RadioButton
                            inputId="you alone"
                            name="you alone"
                            value="you alone"
                            onChange={(e) => setValue(e.value)}
                            checked={val === "you alone"}
                          />
                          <label
                            htmlFor="you alone"
                            className="px-2 font-semibold"
                          >
                            You Alone
                          </label>
                        </div>
                      </Grid>
                      <Grid
                        onClick={() => setValue("you and another")}
                        className="col-start-1 col-span-8 mt-5 sm:col-span-3 sm:ml-4 radio-border "
                      >
                        <div className="p-field-radiobutton">
                          <RadioButton
                            inputId="you and another"
                            name="you and another"
                            value="you and another"
                            onChange={(e) => setValue(e.value)}
                            checked={val === "you and another"}
                          />
                          <label
                            htmlFor="you and another"
                            className="px-2 font-semibold"
                          >
                            You and Another Person
                          </label>
                        </div>
                      </Grid>
                      <Grid
                        onClick={() => setValue("trust")}
                        className="col-start-1 col-span-8 mt-5 sm:col-span-2 sm:ml-4 radio-border "
                      >
                        <div className="p-field-radiobutton">
                          <RadioButton
                            inputId="trust"
                            name="trust"
                            value="trust"
                            onChange={(e) => setValue(e.value)}
                            checked={val === "trust"}
                          />
                          <label htmlFor="trust" className="px-2 font-semibold">
                            A Trust
                          </label>
                        </div>
                      </Grid>
                    </Grid>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
