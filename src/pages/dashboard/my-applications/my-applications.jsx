import { useEffect, useState, useRef } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { TabView, TabPanel } from "primereact/tabview";
import { Sider } from "@components/sidebar";
import jwt from "jsonwebtoken";
import {withAuthentication} from "@utils/route-hocs";
import { ROUTE_PATHS } from "src/constants";
import {
  Url,
  lambda,
  authUrl,
  authOptions,
  auxDataUrl,
  policies
} from "../../../constants/apiconstant";
import MyApplicationBox from "../../application/commonForms/myapplicationbox";
import NeedHelp from "../../application/commonForms/needHelp";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${ process.env.FRONTEND_BASE_URL }${ ROUTE_PATHS.RESEND_REGISTRATION_LINK }`;
const title = "My Applications";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const myapplications = () => {
  const router = useRouter();
  const { query } = router;
  const [ activeIndex, setActiveIndex ] = useState(query.index);



  const [ draftApp, setDraftApp ] = useState([]);
  const [ reviewApp, setReviewApp ] = useState([]);


  var locators = [];


  useEffect(() => {
    const userinfo = jwt.decode(localStorage.getItem("cognito_id_token"));
    setActiveIndex(query.index && parseInt(query.index));
    if (userinfo) {
      const userId = userinfo.sub;
      sessionStorage.setItem("userName", userinfo.sub);
      getPolicy(userId);

    }
  }, []);

  async function getPolicy(userId) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + auxDataUrl + userId + policies, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip" | "compress" | "deflate" | "br"| "identity"| "*"
      }
    })
      .then(response => response.json())
      .then(data => {
        locators.push(data.value);
        displayPolicy(...locators);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  function displayPolicy(locators) {
    let arrLocators = locators.split(",");
   

    arrLocators.map(item => {
      fetchPolicyDetails(item);
    });
  }

  async function fetchPolicyDetails(item) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const fetchPolicy = await fetch(Url + "/policy/" + item, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip" | "compress" | "deflate" | "br"| "identity"| "*"
      }
    })
      .then(response => response.json())
      .then(async data => {
        let For = data.characteristics[ 0 ].fieldValues.guaranteedTerm;
        let premium = data.characteristics[ 0 ].fieldValues.amountInvesting;
        let obj1 = {};
        let ptok={}

        const body = {
          operation: "quoteAccount",
          payload: {
            guaranteedTerm: For,
            premium: premium,
            riders: {}
          }
        };

        await fetch(Url + lambda, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ auth.authorizationToken }`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(async res => {
            res = { ...res, For, premium };
            obj1 = { ...res };
            console.log(item,"item")
          await fetch(Url + auxDataUrl +  "/processorToken/"+item, {
      method: "GET",

      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(datas => {
        ptok.token=datas.value
      })
      .catch(error => {
        console.log("Error:", error);
      });
       
            if (
              data.characteristics[data.characteristics.length -1 ].fieldValues.polStatus[ 0 ] ===
              "In Review" ||
              data.characteristics[data.characteristics.length -1 ].fieldValues.polStatus[ 0 ] === "Declined" 
              ||  data.characteristics[data.characteristics.length -1 ].fieldValues.polStatus[ 0 ] === "Approved" 
            ) {
              var new_obj1 = Object.assign({}, data, obj1,ptok);
              setReviewApp(reviewApp => [ ...reviewApp, new_obj1 ]);
            } else if (
              data.characteristics[data.characteristics.length -1 ].fieldValues.polStatus[ 0 ] === "Draft"
            ) {
              var new_obj2 = Object.assign({}, data, obj1);

              setDraftApp(draftApp => [ ...draftApp, new_obj2 ]);
            }
          })
          .catch(error => {
            console.log("Error:", error);
          });
      })

      .catch(error => {
        console.log("Error:", error);
      });
 
  }

  const innerRef = useRef(null);

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

      <div className="flex md:flex-row md:space-x-2">
        <div className="sm:w-1/6">
          <Sider />
        </div>
        <div className="Flex flex-col mt-4 w-full md:w-8/12 ">
          <div className="px-4">
            <p className="h-policies font-bold text-lg md:text-xl pb-2">
              My Applications
            </p>
          </div>
          <div className="my-policies z-0">
            <TabView
              activeIndex={activeIndex}
              ref={innerRef}
              renderActiveOnly={true}
              onTabChange={e => setActiveIndex(e.index)}
            >
              <TabPanel header="Submitted Applications">
                {/* <pre  style={{ marginLeft: "7.7em"}}>{JSON.stringify(reviewApp,null,4)}</pre> */}
                {reviewApp && (
                  <MyApplicationBox result={reviewApp} image={false} />
                )}
              </TabPanel>
              <TabPanel header="Incomplete Applications">
                {/* <pre  style={{ marginLeft: "7.7em"}}>{JSON.stringify({draftApp},null,4)}</pre> */}
                <MyApplicationBox result={draftApp} image={true} />
              </TabPanel>
            </TabView>
          </div>
        </div>
        <div className="sm:w-1/5 sm:mt-4">
          <NeedHelp />
        </div>
      </div>
    </>
  );
};
export default withAuthentication(myapplications);
