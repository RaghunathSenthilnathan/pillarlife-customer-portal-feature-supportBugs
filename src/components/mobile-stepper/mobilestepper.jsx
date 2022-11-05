import { Container } from "@components/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Url,
  auxDataUrl,
 
} from "../../constants/apiconstant";
import { NextLink } from "@components/next-link";
import { ROUTE_PATHS} from "src/constants";

export const MobileStepper = ({close}) => {
  const router = useRouter();
  const [personalinfoyoualone, setpersonlinfoyoualone] = useState(false);
  const [personalinfoyouandanother, setpersonalinfoyouandanother] =
    useState(false);
  const [personalinfotrust, setpersonalinfotrust] = useState(false);
  const [beneficiary, setbeneficiary] = useState(false);
  const [productdetails, setproductdetails] = useState(false);
  const [suitabilitycheck, setsuitabilitycheck] = useState(false);
  const [premium, setpremium] = useState(false);
  const [review, setreview] = useState(false);
  const [page1, setpage1] = useState(false);
  const [page2, setpage2] = useState(false);
  const [page3, setpage3] = useState(false);
  const [page4, setpage4] = useState(false);
  const [page5, setpage5] = useState(false);
  const [page6, setpage6] = useState(false);
  const [page7, setpage7] = useState(false);
  const [appData, setappData] = useState();
  const [suitability, setsuitability] = useState(false);
  const [esigncheck, setesigncheck] = useState(false);

  async function fetchPolicyDetails() {
    const pl = sessionStorage.getItem("policyLocator");
   
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + "/policy/" + pl, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.message ? setAppData(false) : setappData(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    var pageinfo = [
      "PersonalInfoYouAlone",
      "PersonalInfoYouAndAnother",
      "PersonalInfoTrust",
      "Beneficiary",
      "Product",
      "SuitabilityCheck",
      "Premium",
      "Review",
    
    ];

    // pageinfo.map((e) => {
     
    //   getpageinfo(auth, e);
    // });

    

  // async function getpageinfo(auth, e) {
    

  //   const pl = sessionStorage.getItem("policyLocator");
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

  function currentPageCheck() {
    if (router.pathname.includes("/application/policyowner/youAlone")) {
      setpage1(true);
  
    } else if (
      router.pathname.includes("/application/policyowner/jointOwner")
    ) {
      setpage1(true);
     
    } else if (router.pathname.includes("/application/policyowner/trust")) {
      setpage1(true);
     
    } else if (router.pathname.includes("/application/beneficiary")) {
      setpage2(true);
     
    } else if (router.pathname.includes("/application/product-details")) {
      setpage3(true);
     
    } else if (router.pathname.includes("/application/suitability-check")) {
     
      setpage4(true);
    } else if (router.pathname.includes("/application/premium")) {
      setpage5(true);
     
    } else if (router.pathname.includes("/application/review")) {
      setpage6(true);
     
    } else if (router.pathname.includes("/application/sign")) {
      setpage7(true);
     
    }
  }

  const showsuitability = localStorage.getItem("suitability_show") || " ";
  const esignature_started = localStorage.getItem("esignature_started") || " ";

  useEffect(() => {
    const pl = sessionStorage.getItem("policyLocator");
    var num = parseInt(pl);

  
    const object = {};

    if (typeof num === "number" && typeof pl === "string") {
     
      if (router.pathname.includes("/application")) {
        fetchPolicyDetails();
      }
    }

 
    currentPageCheck();
  }, []);

  useEffect(() => {
    if (showsuitability === "true") {
      setsuitability(true);
    } else {
      setsuitability(false);
    }

    if (esignature_started === "true") {
      setesigncheck(true);
    } else {
      setesigncheck(false);
    }
  }, [showsuitability, esignature_started]);



  const handleRedirect = () => {
    close();
    if (appData.characteristics[0].fieldValues.appType[0] === "Individual") {
      router.push(ROUTE_PATHS.YOUALONE);
    } else if (appData.characteristics[0].fieldValues.appType[0] === "Joint") {
      router.push(ROUTE_PATHS.JOINTOWNER);
    } else if (appData.characteristics[0].fieldValues.appType[0] === "Trust") {
      router.push(ROUTE_PATHS.TRUST);
    }
  };

  return (
    <Container className="wrapper">
      <ul className="StepProgress">
        <li
          className={`StepProgress-item  ${
            (personalinfoyoualone ||
              personalinfoyouandanother ||
              personalinfotrust) &&
            page1
              ? "current font-extrabold"
              : personalinfoyoualone ||
                personalinfoyouandanother ||
                personalinfotrust
              ? "is-done text-indigo-900"
              : page1
              ? "current font-extrabold"
              : ""
          } `}
        >
          {((personalinfoyoualone ||
                personalinfoyouandanother ||
                personalinfotrust) && (!esigncheck)) ? (
            <strong className="cursor-pointer" onClick={handleRedirect}>Personal Information</strong>
          ) : (
            <strong>Personal Information</strong>
          )}
        </li>
        <li
          className={`StepProgress-item ${
            beneficiary && page2
              ? "current font-extrabold"
              : beneficiary
              ? "is-done text-indigo-900"
              : page2
              ? "current font-extrabold"
              : ""
          } `}
        >
          {beneficiary && (!esigncheck) ? (
            <NextLink className="cursor-pointer" onClick={close} href={ROUTE_PATHS.BENEFICIARY}>
              <strong>Beneficiary</strong>
            </NextLink>
          ) : (
            <strong>Beneficiary</strong>
          )}
        </li>
        <li
          className={`StepProgress-item ${
            productdetails && page3
              ? "current font-extrabold"
              : productdetails
              ? "is-done text-indigo-900"
              : page3
              ? "current font-extrabold"
              : ""
          } `}
        >
          {productdetails && (!esigncheck) ? (
            <NextLink
            onClick={close}
              className="cursor-pointer"
              href={ROUTE_PATHS.PRODUCT_DETAILS}
            >
              <strong>Product Details</strong>
            </NextLink>
          ) : (
            <strong>Product Details</strong>
          )}
        </li>
        <li
          className={`StepProgress-item ${
            suitabilitycheck && page4
              ? "current font-extrabold"
              : suitabilitycheck
              ? "is-done text-indigo-900"
              : page4
              ? "current font-extrabold"
              : ""
          } `}
        >
          {suitabilitycheck && !suitability && (!esigncheck) ? (
            <NextLink
            onClick={close}
              className="cursor-pointer"
              href={ROUTE_PATHS.SUITABILITY_CHECK}
            >
              <strong>Suitability Check</strong>
            </NextLink>
          ) : (
            <strong>Suitability Check</strong>
          )}
        </li>
        <li
          className={`StepProgress-item ${
            premium && page5
              ? "current font-extrabold"
              : premium
              ? "is-done text-indigo-900"
              : page5
              ? "current font-extrabold"
              : ""
          } `}
        >
          {premium && !suitability && (!esigncheck) ? (
            <NextLink className="cursor-pointer"  onClick={close} href={ROUTE_PATHS.PREMIUM}>
              <strong>Premium</strong>
            </NextLink>
          ) : (
            <strong>Premium</strong>
          )}
        </li>
        <li
          className={`StepProgress-item ${
            review && page6
              ? "current font-extrabold"
              : review
              ? "is-done  text-indigo-900"
              : page6
              ? "current font-extrabold"
              : ""
          }`}
        >
          {review && !suitability  ? (
            <NextLink className="cursor-pointer"  onClick={close} href={ROUTE_PATHS.REVIEW}>
              <strong> Review</strong>
            </NextLink>
          ) : (
            <strong> Review</strong>
          )}
        </li>
        <li
          className={`StepProgress-item ${
            review && page7 ? "current text-indigo-900 font-extrabold" : ""
          } `}
        >
          {review && !suitability && esigncheck ? (
            <NextLink className="cursor-pointer"  onClick={close} href={ROUTE_PATHS.SIGN}>
              <strong> Sign & Submit</strong>
            </NextLink>
          ) : (
            <strong> Sign & Submit</strong>
          )}
        </li>
      </ul>
    </Container>
  );
};
