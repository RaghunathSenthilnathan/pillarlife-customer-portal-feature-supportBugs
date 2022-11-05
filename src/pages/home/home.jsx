import { useEffect, useState } from "react";
import { Button, Label, SelectMenu } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { NextLink } from "@components/next-link";
import { InputNumber } from "primereact/inputnumber";
import { ROUTE_PATHS } from "src/constants";
import { NextSeo } from "next-seo";
import {withAnonymous} from "@utils/route-hocs";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/router";
import {Url,products,} from "../../constants/apiconstant";
import {
  IMAGE_PATHS,
  ELIGIBLE_STATES,
  GUARANTEED_TERM,
  AMOUNT_INVESTING
  
} from "src/constants";
import TagManager from "react-gtm-module";
import { Grid } from "../../components/layout/grid";
import { Footer } from "../../components/footer/footer";
import { analytics } from "@pages/analytics";

const url = process.env.FRONTEND_BASE_URL;
const title = "Pillar Life Insurance";
const description = "Implementing Cognito Auth in Next.js using CDK for infra";

const Home = () => {
  const [premium, setPremium] = useState();
  const [For, setTerm] = useState();
  const [token, settoken] = useState();
  
  const [stateList, setStateList] = useState();
  const [termList, setTermList] = useState();
  const [validation, setValidate] = useState(false);
  const [max, setmax] = useState();
  const [min, setmin] = useState();
  const [state, setStates] = useState();
  const [show, setShow] = useState(false);

 
  const router = useRouter();

  const postDataDisplay = () => {
    const data = { For, premium, state };
    router.push({ pathname: "/quote", query: data }, "/quote");
  };
  const validate = e => {
    setPremium(e);

    if (e >= min && e <= max) {
      setValidate(false);
    } else {
      setValidate(true);
    }
  };

  async function getStatesData() {
    var auth = JSON.parse(localStorage.getItem("Anonymous_Token"));

    await fetch(Url + products, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        "Accept": "application/json"
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
        setStateList(State);
      }
      if (o.name === AMOUNT_INVESTING) {
        setmax(o.maximum);
        setmin(o.minimum);
      }
    });
  };
  useEffect(() => {
    analytics(window, document, 'script', 'dataLayer', 'GTM-PCZZK57');
  })
  
  useEffect(() => {
    fetchTokenAanonymous();
   settoken(JSON.parse(localStorage.getItem("Anonymous_Token")))
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
  async function fetchTokenAanonymous() {
    const role = {
  "role": "anonymous"
}
;

    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
        "/api/v1/auth/authenticate/anonymous_user",
      {
        method: "POST",
        body: JSON.stringify(role),

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
        
      }
    )
      .then(response => response.json())
      .then((data) =>{
        localStorage.setItem("Anonymous_Token", JSON.stringify(data));
         getStatesData();
      } )
      .catch(error => {
        console.log("Error:", error);
      });
  }

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

      <>
         
          <main className={`${show ? 'inline-block' : 'invisible'} flex flex-wrap justify-between w-full bg-white`}>
            <Flex className="   hidden sm:flex justify-center w-/12">
              <Container className=" vl mt-36">
                <h1 className="text-200 font-styling mx-4 px-3">
                  Annuity Policy
                </h1>
                <h1 className="content-style mx-4  p-3">
                  Give a boost to <br></br>your long-range<br></br> financial
                  goals
                </h1>
              </Container>
            </Flex>

            <Flex className=" w-screen sm:w-auto justify-end">
              <Container className=" space-y-4 outliner ">
                <Container>
                  <h2 className="earn-style ">
                    Let's see how much you can earn
                  </h2>
                  <div className="hl mt-2 md:mr-20"></div>
                </Container>
                <Grid className="grid-cols-10 ">
                  <Grid className="col-start-1 col-span-10 sm:col-span-5 ">
                    <Label
                      className="text-black p-1 text-md font-semibold"
                      htmlFor="Amount"
                    >
                      Amount you want to invest
                    </Label>

                    <InputNumber
                      inputClassName={validation ? "home" : "homeamount"}
                      value={premium}
                      maxFracionDigits={2}
                      required
                      onChange={e => validate(e.value)}
                      mode="currency"
                      currency="USD"
                      locale="en-US"
                    />
                    {min && max && (
                      <span className="text-gray-600 text-900 font-medium text-sm">
                        {"$" + min + "-" + "$" + max}{" "}
                        {validation && (
                          <span className="text-red-400 text-900 font-base text-md">
                            Enter a valid amount
                          </span>
                        )}
                      </span>
                    )}
                  </Grid>

                  <Grid className="col-start-1 col-span-10 sm:col-span-5">
                    <Label
                      className=" text-black p-1 text-md font-semibold"
                      htmlFor="country"
                    >
                      Term (In Years)
                    </Label>

                    <Container className="pb-0 sm:pb-6">
                      <SelectMenu
                        className="homeamount "
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
                </Grid>
                <Grid className="  grid-cols-10 gap-6">
                  <Grid className="col-start-1 col-span-10 sm:col-span-5 ">
                    <Flex className="flex-col lg:flex-row lg:justify-between">
                      <Label
                        className=" text-black p-1 text-md font-semibold"
                        htmlFor="country"
                      >
                        State*
                      </Label>
                    </Flex>
                    <SelectMenu
                      id="country"
                      className="homeamount"
                      name="state"
                      value={state}
                      onChange={e => setStates(e.target.value)}
                    >
                      {stateList &&
                        stateList.map(value => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                    </SelectMenu>
                  </Grid>
                </Grid>
                <Grid className=" grid-cols-6 gap-2">
                  <Container className="col-span-6 mt-1 text-xs w-full sm:col-span-5 text-gray-800 text-xs pr-15 font-semibold w-5/6">
                    *Products offered through the Pillar Life platform are
                    currently available in 2 states with more being added all
                    the time.
                  </Container>
                </Grid>
                <Grid className=" grid-cols-2 ">
                  <Grid className="col-span-2 sm:col-span-1 text-base font-bold mt-12 md:mt-0">
                    <NextLink href={ROUTE_PATHS.QUOTE}>
                      <Button
                        className="btns font-bold"
                        type="submit"
                        disabled={
                          validation ||
                          !premium ||
                          !For ||
                          !state ||
                          For === "Select" ||
                          state === "Select"
                        }
                        onClick={postDataDisplay}
                      >
                        Submit
                      </Button>
                    </NextLink>
                  </Grid>
                </Grid>
              </Container>
            </Flex>
          </main>
             
          <ProgressSpinner className={`${show === false ? 'inline-block' : 'hidden' } fixed top-1/2 right-0  left-0 sm: object-fill`} />
  
       <Footer className="w-screen mt-5 sm:mt-0 flex flex-col justify-end align-item-center md:hidden lg:hidden">
          <Flex className="flex flex-row align-end border-t-2 border-gray-200 mb-4 sm:mb-0   ">
            <Container className="w-3/12 ml-10 pl-10 mt-2 ">
              <img className=" bg-blue-900 " src={IMAGE_PATHS.CHAT} alt="grp" />
            </Container>
            <span className=" mt-2  w-10/12 text-blue-900 text-sm font-bold">
              Question? 847 283 284
            </span>
          </Flex>
        </Footer>
      </>
    </>
  );
};
export default withAnonymous(Home);
