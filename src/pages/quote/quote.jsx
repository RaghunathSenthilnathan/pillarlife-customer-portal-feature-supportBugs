import react, { useEffect, useState } from "react";
import { Button, Input, Label, SelectMenu } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { NextLink } from "@components/next-link";
import { InputNumber } from "primereact/inputnumber";
import {withAnonymous,withAuthentication} from "@utils/route-hocs";
import {
  ROUTE_PATHS,
  MYGA,
  ELIGIBLE_STATES,
  GUARANTEED_TERM,
  AMOUNT_INVESTING
} from "src/constants";
import Link from "next/link";
import { NextSeo } from "next-seo";
import TagManager from "react-gtm-module";
import { useRouter } from "next/router";
import { Footer } from "../../components/footer/footer";
import { IMAGE_PATHS } from "src/constants";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  lambda,
  Url,
  products
} from "../../constants/apiconstant";
import { Grid } from "./../../components/layout/grid";
const url = process.env.FRONTEND_BASE_URL;
const title = "Quote Page";

const Quote = () => {
  const router = useRouter();
  const { query } = router;
  const [quoteData, setQuotedata] = useState(query);
  const [termList, setTermList] = useState();
  const [premium, setPremium] = useState(query.premium);
  const [For, setTerm] = useState(query.For);
  const [validation, setValidate] = useState(false);
  const [max, setmax] = useState(query.max);
  const [min, setmin] = useState(query.min);
  const [show, setShow] = useState(false);

  async function getStatesData() {
    var auth = JSON.parse(localStorage.getItem("Anonymous_Token"));
    await fetch(Url + products, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        data.map(item => {
          if (item.name === "MYGA") {
            getProducts(item);
          }
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  const getProducts = item => {
    const fields = item.policyConfiguration.fields;
    fields.map(o => {
      if (o.name === GUARANTEED_TERM) {
        const Term = o.values;
        Term.unshift("Select");
        setTermList(Term);
      }
      if (o.name === ELIGIBLE_STATES) {
        const State = o.values;
        State.unshift("Select");
        // setStateList(State);
      }
      if (o.name === AMOUNT_INVESTING) {
        setmax(o.maximum);
        setmin(o.minimum);
      }
    });
  };
  useEffect(() => {
    getStatesData();
    postDataDisplay();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
    useEffect(() => {
    const tagManagerArgs = {
  gtmId: "GTM-PCZZK57",
  dataLayer: {
    userId: "001",
    userProject: "Pillar-Life",
  },
};
      TagManager.initialize(tagManagerArgs);
  }, []);

  async function postDataDisplay() {
    var auth = JSON.parse(localStorage.getItem("Anonymous_Token"));

    const body = {
      operation: "quoteAccount",
      payload: {
        guaranteedTerm: For,
        premium: premium,
        riders: {}
      }
    };

    fetch(Url + lambda, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.authorizationToken}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        data = { ...data, For, premium };

        setQuotedata(data);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }
  const validate = e => {
    setPremium(e);
    if (e >= min && e <= max) {
      setValidate(false);
    } else {
      setValidate(true);
    }
  };

  return (
    <>
      <NextSeo
        title={title}
        canonical={url}
        openGraph={{
          url,
          title
        }}
      />

      <>
        {" "}
        {show ? (
          <main className=" flex flex-wrap justify-between w-full bg-white">
            <Flex className="w-3/12 justify-start hidden sm:flex">
              <Container className=" vl mx-4 mt-36">
                <h1 className="text-200 font-styling mx-4 px-3">
                  Annuity Policy
                </h1>
                <h1 className="content-style mx-4  p-3">
                  Give a boost to <br></br>your long-range<br></br> financial
                  goals
                </h1>
              </Container>
            </Flex>

            <Flex className=" w-screen  sm:w-9/12 justify-end">
              <Container className="outliner-quote">
                <Container>
                  <h2 className="earn-style mb-2 sm:mb-0  ">
                    Here's your guaranteed growth
                  </h2>
                  <hr className="hl w-11/12 sm:w-9/12   "></hr>
                </Container>

                <Grid className=" grid-cols-10 gap-4 ">
                  <Grid className="grid col-span-10 w-full sm: col-span-7 text-sm w-5/6 font-semibold md:pr-12 pr-3 sm:p-0  ">
                    Here’s your Multi-Year Guaranteed Annuity (MYGA) offer. If
                    you would like to see other savings scenarios, you can
                    change your investment amount and term in the fields below.
                    Rates are subject to change.
                  </Grid>
                </Grid>

                <Grid className=" w-full grid-cols-12 mt-5 gap-0 sm:gap-2 ">
                  <Grid className=" col-span-10 sm:col-span-5  ">
                    <Label className=" text-md font-semibold" htmlFor="Amount">
                      Amount you want to invest
                    </Label>
                    <Container className="mb-1 sm:mb-4">
                      <InputNumber
                        inputClassName={"quoteamount"}
                        value={premium}
                        maxFracionDigits={2}
                        onChange={e => validate(e.value)}
                        mode="currency"
                        currency="USD"
                        locale="en-US"
                        // style={{
                        //   width: "316px"
                        // }}
                      />
                      {min && max && (
                        <span className="text-gray-600 text-900 font-normal text-xs">
                          {"$" + min + "-" + "$" + max}{" "}
                          {validation && (
                            <span className="inline-block text-red-400 font-semibold text-sm">
                              Enter a valid amount
                            </span>
                          )}
                        </span>
                      )}
                    </Container>
                  </Grid>
                  <Grid className="grid col-span-7 sm:col-span-5  ">
                    <Label
                      className="text-100 text-md font-semibold"
                      htmlFor="country"
                    >
                      Term (In Years)
                    </Label>

                    <Container className="mb-10">
                      <SelectMenu
                        className="w-11/12 sm: amount"
                        id="For"
                        name="For"
                        value={For}
                        onChange={e => setTerm(e.target.value)}
                      >
                        {termList &&
                          termList.map(value => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                      </SelectMenu>
                    </Container>
                  </Grid>

                  <Grid className="grid mb-1 pt-1 col-span-5 sm:col-span-2 mr-4 pt-3 w-full sm:w-3/6 pr-5 sm:pr-0 mr-5 sm:mr-0   ">
                    {/* <Container> */}
                    <Button
                      className="recalc p-4 mt-3 sm:mt-3 font-bold h-10 w-full sm:w-5/6"
                      disabled={
                        validation || !For || !premium || For === "Select"
                      }
                      onClick={postDataDisplay}
                    >
                      Recalculate
                    </Button>
                    {/* </Container> */}
                  </Grid>
                </Grid>

                <Grid className="grid grid-cols-10 gap-4 sm:gap-6">
                  <Grid className="col-span-6 sm:col-span-4">
                    <Flex className="flex-col lg:flex-row lg:justify-between">
                      <Label
                        className="text-100 text-md font-semibold"
                        htmlFor="phoneNumber"
                      >
                        Projected Account Value
                      </Label>
                    </Flex>
                    <span className=" interestRate text-lg  pl-0 font-bold ">
                      ${" "}
                      {quoteData.payload.projectedValue
                        ? quoteData.payload.projectedValue
                        : ""}
                    </span>
                  </Grid>

                  <Grid className="col-span-6 sm:col-start-5 col-span-5 ">
                    <Flex className="flex-col pl-0 lg:flex-row lg:justify-between sm:pl-2">
                      <Label
                        className="text-100 text-md font-semibold"
                        htmlFor="country"
                      >
                        Guaranteed Interest Rate
                      </Label>
                    </Flex>
                    <span
                      className=" font-semibold text-lg  pl-0 interestRate ml-0 sm:ml-2"
                      style={{ border: "none" }}
                    >
                      {quoteData.payload.interestRate
                        ? quoteData.payload.interestRate
                        : ""}
                      %{/* disabled
                      suffix="%" */}
                    </span>
                  </Grid>
                </Grid>
                <Grid className=" grid-cols-10 gap-6">
                  <Grid className=" col-span-10 mt-2 sm:mt-0">
                    <Flex className="flex-col lg:flex-row lg:justify-between">
                      <Label
                        className="text-100 text-xl sm:text-lg font-bold mt-2"
                        htmlFor="country"
                      >
                        Ready to Invest?
                      </Label>
                    </Flex>
                    <Container className=" col-span-10 sm:text-sm font-bold ">
                      Create a Pillar Life account to invest
                    </Container>
                  </Grid>
                </Grid>

                <Grid className="grid grid-cols-10 gap-6 mt-8 md:mt-4">
                  <Grid className="col-span-6 sm:col-span-18 ml-4 md:ml-0">
                    <NextLink href={ROUTE_PATHS.REGISTER}>
                      <Button className="btns font-bold" type="submit">
                        Create an account
                      </Button>
                    </NextLink>
                  </Grid>
                </Grid>
                <Flex className=" mt-3 mb-3 justify-center sm:justify-start ">
                  <Container className=" ml-1 w-9/12">
                    <span className=" font-normal text-sm ">
                      Already have an account?
                    </span>
                    <NextLink
                      href={ROUTE_PATHS.LOGIN}
                      className=" text-md pl-2 font-bold text-indigo-600 hover:text-indigo-500 linkcolor"
                    >
                      Log In
                    </NextLink>
                  </Container>
                </Flex>
              </Container>
            </Flex>
            <Footer className="w-screen  flex flex-col justify-end align-item-center md:hidden lg:hidden">
          <Flex className="flex flex-row align-end border-t-2 border-gray-200 mb-4 sm:mb-0   ">
            <Container className="w-3/12 ml-10 pl-10 mt-2 ">
              <img className=" bg-blue-900 " src={IMAGE_PATHS.CHAT} alt="grp" />
            </Container>
            <span className=" mt-2  w-10/12 text-blue-900 text-sm font-bold">
              Question? 847 283 284
            </span>
          </Flex>
        </Footer>
          </main>
          
        ) : (
          <ProgressSpinner  className="fixed top-1/2 right-0  left-0 sm: object-fill" />
        )}
       
      </>
    </>
  );
};
export default withAnonymous(Quote);
