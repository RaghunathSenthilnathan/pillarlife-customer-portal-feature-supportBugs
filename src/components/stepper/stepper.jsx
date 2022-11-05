import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Input, Label, RadioInput } from "@components/forms";
import { Divider } from "primereact/divider";
import { Flex, Container } from "@components/layout";
import { useRouter } from "next/router";
import { Menu } from "primereact/menu";
import {
  Url,
  products,
  authUrl,
  auxDataUrl,
  authOptions,
  lambda
} from "../../constants/apiconstant";
import { Grid } from "../../components/layout/grid";
import addressInfo from "@pages/application/commonForms/addressInfo";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

export const Stepper = ({ index, percent, question, valid=false }) => {
  const [ activeIndex, setActiveIndex ] = useState(index);
  const [ appData, setAppData ] = useState();
  const router = useRouter();
  const [ personalinfoyoualone, setpersonlinfoyoualone ] = useState(false);
  const [ personalinfoyouandanother, setpersonalinfoyouandanother ] = useState(
    false
  );
  const [ personalinfotrust, setpersonalinfotrust ] = useState(false);
  const [ beneficiary, setbeneficiary ] = useState(false);
  const [ productdetails, setproductdetails ] = useState(false);
  const [ suitabilitycheck, setsuitabilitycheck ] = useState(false);
  const [ premium, setpremium ] = useState(false);
  const [ review, setreview ] = useState(false);

  const [ status, setstatus ] = useState(0);

  async function fetchPolicyDetails() {
    const pl = sessionStorage.getItem("policyLocator");

    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + "/policy/" + pl, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        data.message ? setAppData(false) : setAppData(data);
      })
      .catch(error => {
        console.log("Error:", error);
      });

    var pageinfo = [];
    pageinfo = [
      "PersonalInfoYouAlone",
      "PersonalInfoYouAndAnother",
      "PersonalInfoTrust",
      "Beneficiary",
      "Product",
      "SuitabilityCheck",
      "Premium",
      "Review",
     
    ];

    // pageinfo.map(e => {
    //   getpageinfo(auth, e);
    // });

    // async function getpageinfo(auth, e) {

      // const pl = sessionStorage.getItem("policyLocator");
        await fetch(Url + auxDataUrl + pl + "/" + "stepper", {
        method: "GET",
        headers: {
          Authorization: auth.authorizationToken,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          let step=data.value.split(",")
          if (step[0]==="true") {
              setpersonlinfoyoualone(true);
              setstatus(1);
          }
           if (step[1]==="true") {
           
              setpersonalinfoyouandanother(true);
              setstatus(1);
          } 
           if (step[2]==="true") {
              setpersonalinfotrust(true);
              setstatus(1);
          } 
          if (step[3]==="true") {
            
              setbeneficiary(true);
              setstatus(2);
            }
            if (step[4]=='true') {
              setproductdetails(true);
              setstatus(3);
          } 
          if (step[5]=='true') {
          
              setsuitabilitycheck(true);
              setstatus(4);
          
          } 
          if (step[6]=='true') {
              setpremium(true);
              setstatus(5);
            
          } 
           if (step[7]=='true') {
          
              setreview(true);
         
          }
        })
        .catch(error => {
  
          console.clear();   
             });
      }
    
  useEffect(() => {
    const pl = sessionStorage.getItem("policyLocator");
    if (pl !==  null) {
      fetchPolicyDetails();
    }
  }, []);

  const handleClick = () => {
    router.push(ROUTE_PATHS.FUNDS);
  };

  const handleRedirect = () => {
    if (appData) {
      if (appData.characteristics[ 0 ].fieldValues.appType[ 0 ] === "Individual") {
        router.push(ROUTE_PATHS.YOUALONE);
      } else if (
        appData.characteristics[ 0 ].fieldValues.appType[ 0 ] === "Joint"
      ) {
        router.push(ROUTE_PATHS.JOINTOWNER);
      } else if (
        appData.characteristics[ 0 ].fieldValues.appType[ 0 ] === "Trust"
      ) {
        router.push(ROUTE_PATHS.TRUST);
      }
    } else {
      router.push(ROUTE_PATHS.YOUALONE);
    }
  };
  const app = router.pathname.includes("/application");

 
  const linkto = e => {
    if (e === 0) {
      !valid &&
        (personalinfoyoualone || personalinfoyouandanother || personalinfotrust)
        ? handleRedirect()
        : "";
    } else if (e === 1) {
      !valid && beneficiary
        ? (window.location.href = "/application/beneficiary")
        : "";
    } else if (e === 2) {
      !valid && productdetails
        ? (window.location.href = "/application/product-details")
        : "";
    } else if (e === 3) {
      !valid && suitabilitycheck
        ? (window.location.href = "/application/suitability-check")
        : "";
    } else if (e === 4) {
      !question && !valid && suitabilitycheck && premium
        ? (window.location.href = "/application/premium")
        : "";
    } else if (e === 5) {
      !question && suitabilitycheck && review
        ? (window.location.href = "/application/review")
        : "";
    } else if (e === 6) {
      valid && suitabilitycheck
        ? (window.location.href = "/application/sign")
        : "";
    }
  };

  return (
    <div className="steps-demo hidden sm:inline-block lg:block md:block">
      <div className="card static flex flex-col pl-60 pr-14 mr-14 pt-10 mt-14  ">
        <ProgressBar percent={percent}>
          <Step>
            {({ accomplished, index, status }) => (
              <>
                <div
                  className={`indexedStep cursor-pointer ${ accomplished ? "accomplished" : null
                    }`}
                  onClick={() => linkto(index)}
                ></div>
                <div className={"stepbox "}>
                  <span className="">0{index + 1}</span> Personal Information
                </div>
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep cursor-pointer ${ accomplished ? "accomplished" : null
                    }`}
                  onClick={() => linkto(index)}
                ></div>
                <div className={"stepbox mr-12"}>
                  <span className="">0{index + 1}</span> Beneficiary
                </div>
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep cursor-pointer ${ accomplished ? "accomplished" : null
                    }`}
                  onClick={() => linkto(index)}
                ></div>
                <div className={"stepbox mr-7"}>
                  <span className="">0{index + 1}</span> Product Details
                </div>
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep cursor-pointer ${ accomplished ? "accomplished" : null
                    }`}
                  onClick={() => linkto(index)}
                ></div>
                <div className={"stepbox mr-4"}>
                  <span className="">0{index + 1}</span> Suitability Check
                </div>
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep cursor-pointer ${ accomplished ? "accomplished" : null
                    }`}
                  onClick={() => linkto(index)}
                ></div>
                <div className={"stepbox stepbox mr-16"}>
                  <span className="">0{index + 1}</span> Premium
                </div>
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep cursor-pointer ${ accomplished ? "accomplished" : null
                    }`}
                  onClick={() => linkto(index)}
                ></div>
                <div className={"stepbox mr-16 pr-3"}>
                  <span className="">0{index + 1}</span> Review
                </div>
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep cursor-pointer ${ accomplished ? "accomplished" : null
                    }`}
                  onClick={() => linkto(index)}
                ></div>
                <div className={"stepbox mr-8"}>
                  <span className="">0{index + 1}</span> Sign & Submit
                </div>
              </>
            )}
          </Step>
        </ProgressBar>
      </div>
      <div className="m-10"></div>
    </div>
  );
};
