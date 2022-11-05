
import { Sider } from "@components/sidebar";
import { withAuthentication } from "@utils/route-hocs";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { TabView, TabPanel } from "primereact/tabview";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import {
  Url,
  auxDataUrl,
  policies,
  lambda,

} from "../../constants/apiconstant.js";
import ScaleLoader from "react-spinners/ScaleLoader";
import { connect, useDispatch } from 'react-redux';
const url = `${ process.env.FRONTEND_BASE_URL }${ ROUTE_PATHS.RESEND_REGISTRATION_LINK }`;
const title = "Dashboard";
const description =
  "Enables you to resend the registration activation link to your email address.";


function Dashboard() {

  const [ policystatus, setStatus ] = useState([]);
  const [ trustData, setTrustData ] = useState([]);
  const [ primaryOrJointData, setPrimaryOrJointData ] = useState([]);
  const [ inactivetrustData, setInactiveTrustData ] = useState([]);
  const [ inactiveprimaryOrJointData, setInactivePolicyData ] = useState([]);
  const [ incompleteApp, setIncompleteApp ] = useState(false);
  const [ activePolicy, setActivePolicy ] = useState(false);
  const [ inactivePolicy, setinactivePolicy ] = useState(false);
  const dispatch = useDispatch();



  const router = useRouter();
  var locators = [];
  var status = [];
  const userinfo = "";

  var locators = [];
  var activePolicyDetails = [];
  var inActivePolicyDetails = [];



  useEffect(() => {
    const userinfo = jwt.decode(localStorage.getItem("cognito_id_token"));
    if (userinfo) {
      const userId = userinfo.sub;
      sessionStorage.setItem("userName", userinfo.sub);
      getToken(userId);

    }
  }, []);

  useEffect(() => {
    routeUsers(policystatus);

  }, [ policystatus ]);

  async function getToken(userId) {
    const body = {
      "role": "public-user"
    };
    const jwt_key = sessionStorage.getItem("userName");

    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
      process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
      "." +
      jwt_key +
      ".accessToken"
    );

    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
      "/api/v1/auth/authenticate/user",
      {
        method: "POST",
        body: JSON.stringify(body),

        headers: {
          Authorization: `Bearer ${ token }`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "gzip" | "compress" | "deflate" | "br" | "identity" | "*"
        }
      }
    )
      .then(response => response.json())
      .then((data) => {
        localStorage.setItem("Auth_Token_Soc", JSON.stringify(data));
      })
      .catch(error => {
        console.log("Error:", error);
      });
    getPolicy(userId);
  }



  async function setPolicy(userId, user) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + auxDataUrl + userId, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip" | "compress" | "deflate" | "br" | "identity" | "*"
      },
    })
      // .then((response) => response.json())
      .then(getPolicy(userId));
  }

  async function getPolicy(userId) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + auxDataUrl + userId + policies, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip" | "compress" | "deflate" | "br" | "identity" | "*"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        locators.push(data.value);



        if (data.value === "") {
          router.push("/application/qualifiedfunds");
        } else {
          displayPolicy(...locators);

        }
      })
      .catch((error) => {
        console.log("Error:", error);
        const user = {
          auxData: {
            key: "policies",
            value: "",
          },
        };
        setPolicy(userId, user);
      });
  }

  const trustDetails = [];
  const indOrJoint = [];
  const inactiveTrustDetails = [];
  const inactiveindOrJoint = [];

  const [ arraylocators, setArrayLocators ] = useState([]);
  const [ activeIndex, setActiveIndex ] = useState(0);
  async function displayPolicy(locators) {

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
  
    let arrLocators = locators.split(",");

    dispatch({ type: 'SAVE_ALL_POLICY_LOCATOR', payload: arrLocators });
  


    setArrayLocators(arrLocators);
    await arrLocators.map(async (item) => {
      await fetch(Url + "/policy/" + item, {
        method: "GET",
        headers: {
          Authorization: auth.authorizationToken,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "gzip" | "compress" | "deflate" | "br" | "identity" | "*"
        },
      })
        .then((response) => response.json())
        .then((data) => {
        
           if(data.httpStatus == "404" || data.httpStatus ){
            status.push("no_policy"); 
           }

        else if (data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] === "Active") {
            status.push("Active");
          } else if (
            data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] === "Cancelled" ||
            data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] === "Declined"
          ) {
            status.push("Cancelled");
          } else if (
            data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] === "In Review" ||
            data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] === "Approved"
          ) {
            status.push("In Review");
          } else if (
            data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] === "Draft"
          ) {
            status.push("Draft");
          }

          const body = {
            operation: "accountBalance",
            payload: {
              locator: data.locator,
            },
          };
          const quoteBody = {
            operation: "quoteAccount",
            payload: {
              premium: data.characteristics && data.characteristics[ data.characteristics.length - 1 ].fieldValues.amountInvesting ? data.characteristics[ data.characteristics.length - 1 ].fieldValues.amountInvesting[ 0 ] : "0",
              guaranteedTerm:
              data.characteristics && data.characteristics[ data.characteristics.length - 1 ].fieldValues.guaranteedTerm ? data.characteristics[ data.characteristics.length - 1 ].fieldValues.guaranteedTerm[ 0 ] : "0",
              riders: {},
            },
          };
          fetch(Url + lambda, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              Authorization: auth.authorizationToken,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
            .then((response) => response.json())
            .then(async (datas) => {
              var obj1 = {};
              var obj2 = {};
              await fetch(Url + lambda, {
                method: "POST",
                body: JSON.stringify(quoteBody),
                headers: {
                  Authorization: `Bearer ${ auth.authorizationToken }`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  "Accept-Encoding": "gzip" | "compress" | "deflate" | "br" | "identity" | "*"
                },
              })
                .then((response) => response.json())
                .then((res) => {


                  if (
                    data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] ===
                    "Active"
                  ) {
                    setActivePolicy(true);
                    dispatch({ type: 'ACTIVE_POLICY_PERSIST', payload: "true" });
                    activePolicyDetails.push(data);

                    if (
                      data.characteristics[ data.characteristics.length - 1 ].fieldValues.appType[ 0 ] === "Trust"
                    ) {
                      obj1 = { ...res.payload };
                      var new_obj1 = Object.assign(
                        {},
                        data,
                        obj1,
                        datas.payload
                      );
                      trustDetails.push(new_obj1);
                    } else if (
                      data.characteristics[ data.characteristics.length - 1 ].fieldValues.appType[ 0 ] ===
                      "Individual" ||
                      data.characteristics[ data.characteristics.length - 1 ].fieldValues.appType[ 0 ] === "Joint"
                    ) {
                      obj2 = { ...res.payload };
                      var new_obj2 = Object.assign(
                        {},
                        data,
                        obj2,
                        data.payload,
                        datas.payload
                      );

                      indOrJoint.push(new_obj2);

                    }
                  } else if (
                    data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] ===
                    "Cancelled"
                  ) {
                    setinactivePolicy(true);
                    dispatch({ type: 'INCOMPLETE_POLICY_PERSIST', payload: "true" });
                  
                    inActivePolicyDetails.push(data);
                    if (
                      data.characteristics[ data.characteristics.length - 1 ].fieldValues.appType[ 0 ] === "Trust"
                    ) {
                      var new_obj3 = Object.assign({}, data, obj1);
                      inactiveTrustDetails.push(new_obj3);
                    } else if (
                      data.characteristics[ data.characteristics.length - 1 ].fieldValues.appType[ 0 ] ===
                      "Individual" ||
                      data.characteristics[ data.characteristics.length - 1 ].fieldValues.appType[ 0 ] === "Joint"
                    ) {
                      var new_obj4 = Object.assign({}, data, obj2);
                      inactiveindOrJoint.push(new_obj4);
                    }
                  } else if (
                    data.characteristics[ data.characteristics.length - 1 ].fieldValues.polStatus[ 0 ] === "Draft"
                  ) {
                    setIncompleteApp(true);
                    dispatch({ type: 'INACTIVE_POLICY_PERSIST', payload: "true" });
                  }



                })
                .catch((error) => {
                  console.log("Error:", error);
                });


              // console.log("Data---",inactiveTrustDetails)
              dispatch({ type: 'PRIMARY_OR_JOINT_POLICY_DATA', payload: indOrJoint });
              dispatch({ type: 'TRUST_POLICY_DATA', payload: trustDetails });
              dispatch({ type: 'INACTIVE_PRIMARY_OR_JOINT_POLICY_DATA', payload: inactiveindOrJoint });
              dispatch({ type: 'INACTIVE_TRUST_POLICY_DATA', payload: inactiveTrustDetails });

            })
            .catch((error) => {
              console.log("Error:", error);
            });

        })
        .catch((error) => {
          status.push("Failed");
          console.log("Error:", error);
        });


      if (status.length === arrLocators.length) {
        setStatus(status);
        localStorage.setItem("All_Policy_Status", JSON.stringify(status));

      }
    });



  }


  const routeUsers = (value) => {
    if (value.find((item) => item.includes("Active"))) {
      router.push(
        { pathname: "/dashboard/my-policies", query: { index: 0 } },
        "/dashboard/my-policies"
      );
    } else if (value.find((item) => item.includes("Cancelled"))) {
      router.push(
        { pathname: "/dashboard/my-policies", query: { index: 1 } },
        "/dashboard/my-policies"
      );
    } else if (value.find((item) => item.includes("In Review"))) {
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 0 } },
        "/dashboard/my-applications"
      );
    } else if (value.find((item) => item.includes("Draft"))) {
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 1 } },
        "/dashboard/my-applications"
      );
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
      <div className="flex md:flex-row md:space-x-2">
        <div className="sm:w-1/6"></div>
        <Sider />

        <div className="Flex flex-col mt-4 w-full md:w-8/12">
          <div className="px-4">
            {/* <pre style={{ marginLeft:  "10em"} }>{JSON.stringify(primaryOrJointData, null, 2)}</pre> */}
            <p className="h-policies font-bold text-lg md:text-xl pb-2">
              My Policies
            </p>
          </div>

          <div className="my-policies z-0">
            <TabView
              className=""
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
            >

              <TabPanel header="All policies">

                {arraylocators.length == 0 && <ScaleLoader height={55} radius={10} color="#293889" />}

                {arraylocators.length > 1 && arraylocators.map((item, index) => {
                  return (<>
                    <div key={index} className="flex flex-col policy-display text-xs font-semibold text-black border-gray-200 rounded-md col-space-y-4 mb-4">
                      <div className="card p-4">
                        <div className="flex flex-row space-x-10 sm:divide-x-2 divide-gray-300">
                          <div className="flex flex-col space-y-5 sm:space-y-14  md:p-2 md:w-1/3">
                            <div className="flex flex-col">
                              <label className="pb-2">
                                Policy{" "}
                                <span className="font-bold text-blue-800">
                                  {item}
                                </span>
                              </label>
                              <label>Multi-Year Guaranteed Annuity</label>
                            </div>
                            <div className="flex flex-col ">
                              <label className="pb-2 hidden sm:inline-block">
                                Policy Start Date{" "}

                                <ScaleLoader height={20} color="#293889" />

                              </label>
                              <div className="hidden sm:inline-block">
                                <label>
                                  Current Guarantee End Date{" "}
                                  <ScaleLoader height={20} color="#293889" />
                                </label>
                              </div>
                              <div className="inline-block sm:hidden">
                                <label>
                                  <div>
                                    <ScaleLoader height={20} color="#293889" />
                                  </div>
                                  Current Guarantee End Date
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col  inline-block sm:hidden">
                              <div className="font-bold text-blue-800 pb-1">
                                <ScaleLoader height={20} color="#293889" /> {"$"}
                              </div>

                              <label className="pb-2">Current Account Value</label>
                            </div>
                          </div>

                          <div className="flex flex-col hidden sm:inline-block md: space-y-7 md:p-2 w-1/4">
                            <div className="flex flex-col">
                              <div className="font-bold text-blue-800 pb-1">

                              </div>
                              <label className="pb-2">Primary Owner</label>

                              <div
                                className=""
                              >
                                <div className="font-bold text-blue-800 pb-1">
                                  <ScaleLoader height={20} color="#293889" />
                                </div>
                                <label>Joint Owner</label>
                              </div>
                            </div>

                            <div className="flex flex-col">
                              <div className="font-bold text-blue-800 pb-1">
                                <ScaleLoader height={20} color="#293889" />
                              </div>
                              <label>Annuitant</label>
                            </div>
                          </div>

                          <div className="flex flex-col hidden sm:inline-block md: space-y-7 md:p-2 md:w-1/3">
                            <div className="flex flex-col">
                              <div className="font-bold text-blue-800 pb-1">
                                <ScaleLoader height={20} color="#293889" /> {"$"}
                              </div>

                              <label className="pb-2">Current Account Value</label>
                              <div className="font-bold text-blue-800 pb-1">
                                <ScaleLoader height={20} color="#293889" /> {"$"}
                              </div>
                              <label>Invested Amount</label>
                            </div>
                            <div className="flex flex-col">
                              <div className="font-bold text-blue-800 pb-1">
                                <ScaleLoader height={20} color="#293889" /> {"%"}
                              </div>
                              <label>Interest Rate</label>
                            </div>
                          </div>

                          <div className="flex p-0 sm:p-4 place-items-center">

                            <div>
                              <img src={IMAGE_PATHS.EDIT} />
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                  </>
                  )
                })
                }



              </TabPanel>

            </TabView>

          </div>
        </div>
      </div>

    </>
  );
}

export default withAuthentication(connect(null, null)(Dashboard));