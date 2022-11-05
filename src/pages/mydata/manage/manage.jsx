import { useState, useCallback } from "react";
import { Button } from "@components/forms";
import { Sider } from "@components/sidebar";
import { Panel } from "primereact/panel";
import { NextSeo } from "next-seo";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Container } from "@components/layout";
import { withAuthentication } from "@utils/route-hocs";
 import { ManageModal } from "./confirmpwdModal";
import { useRouter } from "next/router";
import { ROUTE_PATHS } from "src/constants";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Manage Data";
const description =
  "Enables you to resend the registration activation link to your email address.";
export default withAuthentication(Manage);
function Manage() {
  const [val, setValue] = useState(false);
  const [show, setshowModal] = useState(false);
  const closeModal = useCallback(() => setshowModal(false), []);

  const router = useRouter();

  const handleClick = () => {
    router.push(ROUTE_PATHS.MY_POLICIES);
  };
  const footer = (
    // <Link href={ROUTE_PATHS.POLICYOWNER}>
      <Container className="sm:w-full flex mt-24 sm:mt-0 align-center justify-center sm:justify-end">
           <Button
          type="submit"
          onClick={handleClick}
          className=" btn-cancel h-10 text-blue-500 border-blue-500 font-bold mr-8 py-2 rounded-sm  w-5/6  sm:ml-0 sm:w-1/6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!val}
          onClick={()=>  setshowModal(true)}
          className=" btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
        >
          Delete
        </Button>
      </Container>
    // </Link>
  );
  const handleChange = (value) => {
    setValue(value.checked);
    
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
            <div className="pr-4 sm:ml-48 my-4">
            <p className="sm:mt-0 mb-2 sm:mb-0 sm:ml-2 h-policies font-bold text-lg md:text-lg">
              My Data
            </p>
          </div>
                <Panel header={"Manage Data"} className="review-header manage-card">


                  <Card footer={footer}>
                      <Checkbox
                      inputId="full account value"
                      name="full account value"
                      value="full account value"
                      checked={val}
                      onChange={e => handleChange(e)}
                    />
                      <label htmlFor="False" className="text-sm sm: sm:px-1">
                    Delink your Bank Account
                    </label>
                    {/* <Container>
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
                    </Grid> */}
                  </Card>
 </Panel>
                  {show && (
                    <ManageModal showsModal={true} closeModal={closeModal} />
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