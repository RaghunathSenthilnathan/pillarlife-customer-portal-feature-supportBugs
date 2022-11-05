import { useEffect, useState, useCallback } from "react";
import { Button, Label } from "@components/forms";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { NextSeo } from "next-seo";
import { Stepper } from "@components/stepper";
import { NextLink } from "@components/next-link";
import Link from "next/link";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Flex, Container, Grid } from "@components/layout";
import { ReviewModal } from "./reviewModal";
import { Modal } from "@components/modal";
import { Sider } from "@components/sidebar";
import { withAuthentication } from "@utils/route-hocs";
import { useRouter } from "next/router";
import moment from "moment";
import { IMAGE_PATHS, ROUTE_PATHS, MYGA } from "src/constants";
import { useMediaQuery } from "react-responsive";
import {
  Url,
  products,
  lambda
} from "../../../constants/apiconstant";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Review";
const description =
  "Enables you to resend the registration activation link to your email address.";

const review = () => {
  const [questions, setQuestions] = useState();
  const [value, setValue] = useState();
  const [riders, setRiders] = useState([]);
   const [showbene, setShowbene] = useState(false);
  const [loader, setLoader] = useState(false);
  const [ridersFromProducts, setRidersFromProducts] = useState();
  const [show, setshowModal] = useState(false);
  const [error, seterror] = useState(false);
  const closeModal = useCallback(() => {
    setshowModal(false);
    setLoader(true);
    setdisable(true);

    // policyUpdate();
  }, []);
  const closedModal = useCallback(() => setShowbene(false), []);

  let cancelModal = useCallback(() => {
    setshowModal(false);
  }, []);

  useEffect(() => {
    if (disable === true) {
      setshowModal(false);
    }
  }, []);
  const router = useRouter();
  const { query } = router;
  const [queryLocator, setQueryLocator] = useState(query.polLocator);
  const [ach, setAch] = useState();
  const [transfer, setTransfer] = useState();
  const [annuitant, setAnnuitant] = useState();
  const [benefi, setPrimBeneficiary] = useState();
  const [cont, setContBeneficiary] = useState();
  const [suit, setSuitablity] = useState();
  const [quoteData, setQuotedata] = useState();
  const [disable, setdisable] = useState();
  const [owner, setowner] = useState("");
  const [policydata, setpolicydata] = useState(null);
  const [exposures, setexposures] = useState(null);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });

  let disp;
  const [isMobile, setIsMobile] = useState(false);

  // async function policyUpdate() {

  // }

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 850) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const header = (titles, disable) => (
    <Flex className="flex justify-between p-2">
      <h5 className="p-1 text-md font-semibold">{titles}</h5>
      <div className="order-last mr-6 ml-6">
        {disable ? null : (
          <NextLink
            href={
              titles === "1. Owner Personal Information" &&
              value &&
              value.primaryOwnerFirstname &&
              !value.jointOwnerFirstname
                ? ROUTE_PATHS.YOUALONE
                : titles === "1. Owner Personal Information" &&
                  value &&
                  value.jointOwnerFirstname
                ? ROUTE_PATHS.JOINTOWNER
                : titles === "1. Owner Personal Information" &&
                  value &&
                  value.trustName
                ? ROUTE_PATHS.TRUST
                : titles === "2. Beneficiary Information"
                ? ROUTE_PATHS.BENEFICIARY
                : titles === "3. Product Details"
                ? ROUTE_PATHS.PRODUCT_DETAILS
                : titles === "4. Suitability Check"
                ? ROUTE_PATHS.SUITABILITY_CHECK
                : titles === "5. Premium"
                ? ROUTE_PATHS.PREMIUM
                : ""
            }
          >
            <Button className="w-18 h-8 btn-cancel font-semibold text-blue-500 border-blue-500 ">
              Edit
            </Button>
          </NextLink>
        )}
      </div>
    </Flex>
  );

  async function fetchPolicyDetails() {
    const pl = sessionStorage.getItem("policyLocator");

    const beneficiary = [];
    const contigent = [];
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
        setowner(data.characteristics[0].fieldValues.appType[0]);
        setpolicydata(data.characteristics[0].fieldValues);

        if (
          data.characteristics[0].fieldValues.esignatureStatus[0] !=
          "Not Started"
        ) {
          setdisable(true);
          localStorage.setItem("esignature_started", "true");
        } else {
          setdisable(false);
          localStorage.setItem("esignature_started", "false");
        }
        const RiderData = data.exposures && data.exposures[0].perils;
        setRiders(RiderData);

        data &&
          data.exposures.map(o => {
            if (
              o.name === "Beneficiary" &&
              o.characteristics[0].fieldValues.beneType[0] === "Primary"
            ) {
              beneficiary.push(o.characteristics[0].fieldValues);
            }
            if (
              o.name === "Beneficiary" &&
              o.characteristics[0].fieldValues.beneType[0] === "Contingent"
            ) {
              contigent.push(o.characteristics[0].fieldValues);
            }
            if (
              o.name === "Payment" &&
              o.characteristics[0].fieldValues.paymentType[0] === "ACH"
            ) {
              setAch(o.characteristics[0].fieldValues);
            }
            if (
              o.name === "Payment" &&
              o.characteristics[0].fieldValues.paymentType[0] === "1035"
            ) {
              setTransfer(o.characteristics[0].fieldValues);
            }
            if (o.name === "Annuitant") {
              setexposures(o.characteristics[0].fieldValues);
            }
          });
        setPrimBeneficiary(beneficiary);
        setContBeneficiary(contigent);
        setValue(data.characteristics && data.characteristics[0].fieldValues);
        // setTerm();
        // setPremium();
        setAnnuitant(
          data.exposures && data.exposures[0].characteristics[0].fieldValues
        );
        const suitablity = Object.values(
          data.characteristics[0].fieldGroupsByLocator
        )[0];
        setSuitablity(Object.entries(suitablity));

        let term =
          data.characteristics &&
          data.characteristics[0].fieldValues.guaranteedTerm[0];
        let premium =
          data.characteristics &&
          data.characteristics[0].fieldValues.amountInvesting[0];

        const body = {
          operation: "quoteAccount",
          payload: {
            guaranteedTerm: term,
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
            setQuotedata(data);
          })
          .catch(error => {
            console.log("Error:", error);
          });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  async function getQuestions() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

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
        data.map(o => {
          if (o.name === "MYGA") {
            const exposures = o.policyConfiguration.exposures;
            exposures.map(p => {
              if (p.displayName === "Annuitant") {
                setRidersFromProducts(p.perils);
              }
            });
            const resp = o.policyConfiguration.fields;
            const qstns = resp.filter(obj => {
              return obj.name === "suitabilityQuestions";
            });
            const check = x => x[0] === "suitabilityQuestion2";
            if (suit&&!suit.some(check)) {
              qstns[0].fields.splice(1, 1);
            }
            setQuestions(qstns[0].fields);
          }
        });
      })

      .catch(error => {
        console.log("Error:", error);
      });
  }

  const mapRiderNames = item => {
    ridersFromProducts?.map(obj => {
      if (item.name === obj.name) {
        disp = obj.displayName;
      }
    });
  };

  useEffect(() => {
    fetchPolicyDetails();
  }, []);
  useEffect(() => {
    getQuestions();
  }, [suit]);

  function ordinal(number, bene) {
    const english_ordinal_rules = new Intl.PluralRules("en", {
      type: "ordinal"
    });
    const suffixes = {
      one: "st",
      two: "nd",
      few: "rd",
      other: "th"
    };
    const suffix = suffixes[english_ordinal_rules.select(number)];
    return number + suffix;
  }
async function presubmit(){
  if(benefi&&benefi.length>0){
  
    handleSubmit()
  }
else{
  setShowbene(true)
}
  
}
  async function handleSubmit() {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "AQ-API-KEY nzbj$jhwg:yktcpw:32=t+pie$rap^o+jrwm7dm?!x08t96+:wgr%:lrj$fa$hgl"
    );
  setShowbene(false)
    const checkOwner = () => {
      if (owner === "Individual") {
        return JSON.stringify({
          ContractReferenceNumber: "V7773349",
          SourceSystemCode: "L/70",
          Individuals: [
            {
              ClientReferenceNumber: null,
              ContractRelationshipCode: "owner",
              StatusCode: "1",
              FirstName:
                policydata && policydata.primaryOwnerFirstname
                  ? policydata.primaryOwnerFirstname[0]
                  : "",
              MiddleName:
                policydata && policydata.primaryOwnerMiddlename
                  ? policydata.primaryOwnerMiddlename[0]
                  : "",
              LastName:
                policydata && policydata.primaryOwnerLastname
                  ? policydata.primaryOwnerLastname[0]
                  : "",
              GenderCode:
                policydata && policydata.primaryOwnerGender
                  ? policydata.primaryOwnerGender[0]
                  : "",
              DateOfBirth:
                policydata && policydata.primaryOwnerDob
                  ? policydata.primaryOwnerDob[0]
                  : "",
              SurnameSuffix: "",
              SocialSecurityNumber:
                policydata && policydata.primaryOwnerGovtid
                  ? policydata.primaryOwnerGovtid[0]
                  : "",
              CountryOfBirthCode: "",
              Documents: [],
              Addresses: [
                {
                  AddressTypeCode: "residence",
                  AddressLine1:
                    policydata && policydata.primaryResidenceAddressLine1
                      ? policydata.primaryResidenceAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.primaryResidenceAddressLine2
                      ? policydata.primaryResidenceAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.primaryResidenceAddressCity
                      ? policydata.primaryResidenceAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.primaryResidenceAddressState
                      ? policydata.primaryResidenceAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.primaryResidenceAddressZip
                      ? policydata.primaryResidenceAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                },
                {
                  AddressTypeCode: "mailing",
                  AddressLine1:
                    policydata && policydata.primaryMailingAddressLine1
                      ? policydata.primaryMailingAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.primaryMailingAddressLine2
                      ? policydata.primaryMailingAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.primaryMailingAddressCity
                      ? policydata.primaryMailingAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.primaryMailingAddressState
                      ? policydata.primaryMailingAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.primaryMailingAddressZip
                      ? policydata.primaryMailingAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                }
              ]
            },
            {
              ClientReferenceNumber: null,
              ContractRelationshipCode: "insured",
              StatusCode: "1",
              FirstName:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerFirstname[0]
                  : exposures.annuitantFirstname[0],
              MiddleName:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerMiddlename[0]
                  : exposures.annuitantMiddlename[0],
              LastName:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerLastname[0]
                  : exposures.annuitantLastname[0],
              GenderCode:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerGender[0]
                  : exposures.annuitantGender[0],
              DateOfBirth:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerDob[0]
                  : exposures.annuitantDob[0],
              SurnameSuffix: "",
              SocialSecurityNumber:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerGovtid[0]
                  : exposures.annuitantGovtid[0],
              CountryOfBirthCode: "",
              Documents: [],
              Addresses: [
                {
                  AddressTypeCode: "residence",
                  AddressLine1:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressLine1[0]
                      : exposures.annuitantAddressLine1[0],
                  AddressLine2:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressLine2[0]
                      : exposures.annuitantAddressLine2[0],
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressCity[0]
                      : exposures.annuitantAddressCity[0],
                  StateCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressState[0]
                      : exposures.annuitantAddressState[0],
                  PostalCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressZip[0]
                      : exposures.annuitantAddressZip[0],
                  CountryCode: "us",
                  StatusCode: null
                },
                {
                  AddressTypeCode: "mailing",
                  AddressLine1:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressLine1[0]
                      : exposures.annuitantAddressLine1[0],
                  AddressLine2:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressLine2[0]
                      : exposures.annuitantAddressLine2[0],
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressCity[0]
                      : exposures.annuitantAddressCity[0],
                  StateCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressState[0]
                      : exposures.annuitantAddressState[0],
                  PostalCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressZip[0]
                      : exposures.annuitantAddressZip[0],
                  CountryCode: "us",
                  StatusCode: null
                }
              ]
            }
          ]
        });
      } else if (owner === "Joint") {
        return JSON.stringify({
          ContractReferenceNumber: "V7773349",
          SourceSystemCode: "L/70",
          Contract: {
            StatusCode: "A",
            ProductTypeReferenceNumber: "Variable Annuity",
            ProductSubtypeReferenceNumber: "SuperiorVision",
            PaymentModeCode: "0",
            ExitReasonCode: null,
            IssueStateCode: null,
            JointSurvivorIndicatorCode: null,
            CurrentValue: null
          },
          Individuals: [
            {
              ClientReferenceNumber: null,
              ContractRelationshipCode: "owner",
              StatusCode: "1",
              FirstName:
                policydata && policydata.primaryOwnerFirstname
                  ? policydata.primaryOwnerFirstname[0]
                  : "",
              MiddleName:
                policydata && policydata.primaryOwnerMiddlename
                  ? policydata.primaryOwnerMiddlename[0]
                  : "",
              LastName:
                policydata && policydata.primaryOwnerLastname
                  ? policydata.primaryOwnerLastname[0]
                  : "",
              GenderCode:
                policydata && policydata.primaryOwnerGender
                  ? policydata.primaryOwnerGender[0]
                  : "",
              DateOfBirth:
                policydata && policydata.primaryOwnerDob
                  ? policydata.primaryOwnerDob[0]
                  : "",
              SurnameSuffix: "",
              SocialSecurityNumber:
                policydata && policydata.primaryOwnerGovtid
                  ? policydata.primaryOwnerGovtid[0]
                  : "",
              CountryOfBirthCode: "",
              Documents: [],
              Addresses: [
                {
                  AddressTypeCode: "residence",
                  AddressLine1:
                    policydata && policydata.primaryResidenceAddressLine1
                      ? policydata.primaryResidenceAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.primaryResidenceAddressLine2
                      ? policydata.primaryResidenceAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.primaryResidenceAddressCity
                      ? policydata.primaryResidenceAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.primaryResidenceAddressState
                      ? policydata.primaryResidenceAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.primaryResidenceAddressZip
                      ? policydata.primaryResidenceAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                },
                {
                  AddressTypeCode: "mailing",
                  AddressLine1:
                    policydata && policydata.primaryMailingAddressLine1
                      ? policydata.primaryMailingAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.primaryMailingAddressLine2
                      ? policydata.primaryMailingAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.primaryMailingAddressCity
                      ? policydata.primaryMailingAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.primaryMailingAddressState
                      ? policydata.primaryMailingAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.primaryMailingAddressZip
                      ? policydata.primaryMailingAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                }
              ]
            },
            {
              ClientReferenceNumber: null,
              ContractRelationshipCode: "owner",
              StatusCode: "1",
              FirstName:
                policydata && policydata.jointOwnerFirstname
                  ? policydata.jointOwnerFirstname[0]
                  : "",
              MiddleName:
                policydata && policydata.jointOwnerMiddlename
                  ? policydata.jointOwnerMiddlename[0]
                  : "",
              LastName:
                policydata && policydata.jointOwnerLastname
                  ? policydata.jointOwnerLastname[0]
                  : "",
              GenderCode:
                policydata && policydata.jointOwnerGender
                  ? policydata.jointOwnerGender[0]
                  : "",
              DateOfBirth:
                policydata && policydata.jointOwnerDob
                  ? policydata.jointOwnerDob[0]
                  : "",
              SurnameSuffix: "",
              SocialSecurityNumber:
                policydata && policydata.jointOwnerGovtid
                  ? policydata.jointOwnerGovtid[0]
                  : "",
              CountryOfBirthCode: "",
              Documents: [],
              Addresses: [
                {
                  AddressTypeCode: "residence",
                  AddressLine1:
                    policydata && policydata.jointResidenceAddressLine1
                      ? policydata.jointResidenceAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.jointResidenceAddressLine2
                      ? policydata.jointResidenceAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.jointResidenceAddressCity
                      ? policydata.jointResidenceAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.jointResidenceAddressState
                      ? policydata.jointResidenceAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.jointResidenceAddressZip
                      ? policydata.jointResidenceAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                },
                {
                  AddressTypeCode: "mailing",
                  AddressLine1:
                    policydata && policydata.jointMailingAddressLine1
                      ? policydata.jointMailingAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.jointMailingAddressLine2
                      ? policydata.jointMailingAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.jointMailingAddressCity
                      ? policydata.jointMailingAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.jointMailingAddressState
                      ? policydata.jointMailingAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.jointMailingAddressZip
                      ? policydata.jointMailingAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                }
              ]
            },
            {
              ClientReferenceNumber: null,
              ContractRelationshipCode: "insured",
              StatusCode: "1",
              FirstName:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerFirstname[0]
                  : exposures.annuitantFirstname[0],
              MiddleName:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerMiddlename[0]
                  : exposures.annuitantMiddlename[0],
              LastName:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerLastname[0]
                  : exposures.annuitantLastname[0],
              GenderCode:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerGender[0]
                  : exposures.annuitantGender[0],
              DateOfBirth:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerDob[0]
                  : exposures.annuitantDob[0],
              SurnameSuffix: "",
              SocialSecurityNumber:
                policydata &&
                policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                  ? policydata.primaryOwnerGovtid[0]
                  : exposures.annuitantGovtid[0],
              CountryOfBirthCode: "",
              Documents: [],
              Addresses: [
                {
                  AddressTypeCode: "residence",
                  AddressLine1:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressLine1[0]
                      : exposures.annuitantAddressLine1[0],
                  AddressLine2:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressLine2[0]
                      : exposures.annuitantAddressLine2[0],
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressCity[0]
                      : exposures.annuitantAddressCity[0],
                  StateCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressState[0]
                      : exposures.annuitantAddressState[0],
                  PostalCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryResidenceAddressZip[0]
                      : exposures.annuitantAddressZip[0],
                  CountryCode: "us",
                  StatusCode: null
                },
                {
                  AddressTypeCode: "mailing",
                  AddressLine1:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressLine1[0]
                      : exposures.annuitantAddressLine1[0],
                  AddressLine2:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressLine2[0]
                      : exposures.annuitantAddressLine2[0],
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressCity[0]
                      : exposures.annuitantAddressCity[0],
                  StateCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressState[0]
                      : exposures.annuitantAddressState[0],
                  PostalCode:
                    policydata &&
                    policydata.isPrimaryOwnerSameAsAnnuitant[0] === "Yes"
                      ? policydata.primaryMailingAddressZip[0]
                      : exposures.annuitantAddressZip[0],
                  CountryCode: "us",
                  StatusCode: null
                }
              ]
            }
          ]
        });
      } else if (owner === "Trust") {
        return JSON.stringify({
          ContractReferenceNumber: "V7773349",
          SourceSystemCode: "L/70",
          Individuals: [
            {
              ClientReferenceNumber: null,
              ContractRelationshipCode: "owner",
              StatusCode: "1",
              FirstName:
                policydata && policydata.trusteeName
                  ? policydata.trusteeName[0]
                  : "",

              MiddleName: "",
              LastName:
                policydata && policydata.trustName
                  ? policydata.trustName[0]
                  : "",
              GenderCode: "",
              DateOfBirth:
                policydata && policydata.trustDate
                  ? policydata.trustDate[0]
                  : "",
              SurnameSuffix: "",
              SocialSecurityNumber:
                policydata && policydata.trustGovtid
                  ? policydata.trustGovtid[0]
                  : "",
              CountryOfBirthCode: "",
              Documents: [],
              Addresses: [
                {
                  AddressTypeCode: "residence",
                  AddressLine1:
                    policydata && policydata.trustAddressLine1
                      ? policydata.trustAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.trustAddressLine2
                      ? policydata.trustAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.trustAddressCity
                      ? policydata.trustAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.trustAddressState
                      ? policydata.trustAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.trustAddressZip
                      ? policydata.trustAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                },
                {
                  AddressTypeCode: "mailing",
                  AddressLine1:
                    policydata && policydata.trustAddressLine1
                      ? policydata.trustAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && policydata.trustAddressLine2
                      ? policydata.trustAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && policydata.trustAddressCity
                      ? policydata.trustAddressCity[0]
                      : "",
                  StateCode:
                    policydata && policydata.trustAddressState
                      ? policydata.trustAddressState[0]
                      : "",
                  PostalCode:
                    policydata && policydata.trustAddressZip
                      ? policydata.trustAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                }
              ]
            },
            {
              ClientReferenceNumber: null,
              ContractRelationshipCode: "insured",
              StatusCode: "1",
              FirstName:
                policydata && exposures.annuitantFirstname
                  ? exposures.annuitantFirstname[0]
                  : "",
              MiddleName:
                policydata && exposures.annuitantMiddlename
                  ? exposures.annuitantMiddlename[0]
                  : "",
              LastName:
                policydata && exposures.annuitantLastname
                  ? exposures.annuitantLastname[0]
                  : "",
              GenderCode:
                policydata && exposures.annuitantGender
                  ? exposures.annuitantGender[0]
                  : "",
              DateOfBirth:
                policydata && exposures.annuitantDob
                  ? exposures.annuitantDob[0]
                  : "",
              SurnameSuffix: "",
              SocialSecurityNumber:
                policydata && exposures.annuitantGovtid
                  ? exposures.annuitantGovtid[0]
                  : "",
              CountryOfBirthCode: "",
              Documents: [],
              Addresses: [
                {
                  AddressTypeCode: "residence",
                  AddressLine1:
                    policydata && exposures.annuitantAddressLine1
                      ? exposures.annuitantAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && exposures.annuitantAddressLine2
                      ? exposures.annuitantAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && exposures.annuitantAddressCity
                      ? exposures.annuitantAddressCity[0]
                      : "",
                  StateCode:
                    policydata && exposures.annuitantAddressState[0]
                      ? exposures.annuitantAddressState[0]
                      : "",
                  PostalCode:
                    policydata && exposures.annuitantAddressZip
                      ? exposures.annuitantAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                },
                {
                  AddressTypeCode: "mailing",
                  AddressLine1:
                    policydata && exposures.annuitantAddressLine1
                      ? exposures.annuitantAddressLine1[0]
                      : "",
                  AddressLine2:
                    policydata && exposures.annuitantAddressLine2
                      ? exposures.annuitantAddressLine2[0]
                      : "",
                  AddressLine3: "",
                  AddressLine4: "",
                  City:
                    policydata && exposures.annuitantAddressCity
                      ? exposures.annuitantAddressCity[0]
                      : "",
                  StateCode:
                    policydata && exposures.annuitantAddressState[0]
                      ? exposures.annuitantAddressState[0]
                      : "",
                  PostalCode:
                    policydata && exposures.annuitantAddressZip
                      ? exposures.annuitantAddressZip[0]
                      : "",
                  CountryCode: "us",
                  StatusCode: null
                }
              ]
            }
          ]
        });
      }
    };
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: checkOwner(),
      redirect: "follow"
    };
    await fetch("https://aq0-pillar.patriotmanager.com/aq0-pillar/api/v1/contracts/idverify",requestOptions)
      .then(response => response.text())
      .then(result => {
        if (result) {
          setshowModal(true);
        }
      })
      .catch(error => {
        seterror(true);
        console.log("error", error);
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
      <div>
        <Sider />
      </div>
      <Stepper percent={85} valid={disable} index={5} />
      {loader && (
        <div className="block fixed inset-0 z-30 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" />

          <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />
        </div>
      )}
      {showbene && (
                    <Modal
                                title={
                                  "You have not selected a beneficiary.  While it is not a requirement for you to name a beneficiary, we highly recommend it as the lack of a beneficiary may unnecessarily delay the distribution of the policy to your heirs. "
                                }
                                showsModal={true}
                                body={
                                    <Flex className="items-center mt-10 p-4 justify-end">
                                        <Button
                                          className="w-3/6 btn-cancel text-blue-500 font-bold border-blue-500"
                                          onClick={closedModal}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          className="w-3/6 btncolor font-bold ml-10"
                                          onClick={handleSubmit}
                                        >
                                          OK
                                        </Button>
                                   </Flex>
                                }
                              />
                  )}
      {show && (
        <ReviewModal
          showsModal={true}
          value={value}
          cancelModal={cancelModal}
          closeModal={closeModal}
        />
      )}
      <Modal
        showsModal={error}
        description={
          <Container className="text-center mt-3 text-neutral-900 font-muli font-bold">
            Identity Verification is not Valid
          </Container>
        }
        body={
          <Flex className="items-center mt-10 justify-center">
            <Button
              className=" w-2/6 sm:w-3/6 font-bold btncolor font-muli "
              onClick={() => seterror(false)}
            >
              OK
            </Button>
          </Flex>
        }
      />
      <div className=" pt-4 sm:pt-0 pb-2 sm:pb-2 pl-4 sm:pl-60">
        <h1 className="quotecolor font-bold text-lg md:text-xl ">
          Review Application
        </h1>
      </div>
      <div className="flex flex-col pl-0 md:mb-8 md:pl-60 review-top">
        <Container
          className="flex flex-col sm:flex-row sm:justify-between"
          style={{
            background: "#293889 0% 0% no-repeat padding-box",

            position: "relative"
          }}
        >
          <div>
            <img className=" relative ml-3" src={IMAGE_PATHS.LOGO} alt="grp" />
          </div>
          <br></br>
          <div className="order-last text-white mr-6 ml-6">
            <h2>Pillar Life Insurance Company</h2>

            <h4 className="text-md font-medium">
              711 SW D AVE #100 LAWTON
              <br />
             OK 73501
              <br /> 866-931-7542 | info@pillarlifeinsurance.com <br />
              http://www.pillarlife.com {" "}
            </h4>
          </div>
        </Container>
        <Container>
          <Panel>
            <h2 className="quotecolor font-semibold text-center p-2 sm:p-0">
              Individual Deferred Annuity Application
            </h2>
          </Panel>
        </Container>
      </div>
      <div className="flex flex-col">
        <Card
          header={header("1. Owner Personal Information", disable)}
          className="review-card"
        >
          {value && value.primaryOwnerFirstname ? (
            <Panel header="Primary Owner" className="review-panel">
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mt-4 sm:mt-0">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Full Name
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value &&
                        value.primaryOwnerFirstname[0] +
                          " " +
                          value.primaryOwnerMiddlename[0] +
                          " " +
                          value.primaryOwnerLastname[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Gender assigned at birth
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryOwnerGender[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Birth Date
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value &&
                        value.primaryOwnerDob &&
                        moment(value.primaryOwnerDob[0]).format("MM-DD-YYYY")}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Phone Number
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryOwnerPhone[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Social Security Number
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value &&
                        "XXX-XX-" + value.primaryOwnerGovtid[0].substr(-4)}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Email ID
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryOwnerEmail[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Address Line 1
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryResidenceAddressLine1[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Address Line 2
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryResidenceAddressLine2
                        ? value.primaryResidenceAddressLine2[0]
                        : ""}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      City
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryResidenceAddressCity[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      State
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryResidenceAddressState[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mb-4 sm:mb-0">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Zip
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.primaryResidenceAddressZip[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
            </Panel>
          ) : value && value.trustName ? (
            <Panel header="Trust" className="review-panel">
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0  ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Full Legal Name of Trust
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustName[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Trustee
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trusteeName[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Tax ID of Trust
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && "XXX-XX-" + value.trustGovtid[0].substr(-4)}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Date the Trust was formed
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && moment(value.trustDate[0]).format("MM-DD-YYYY")}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Phone Number
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustPhone[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Email ID
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustEmail[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Address Line 1
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustAddressLine1[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Address Line 2
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustAddressLine2
                        ? value.trustAddressLine2[0]
                        : ""}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      City
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustAddressCity[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-1">
                  <Container className="grid-rows-2 mb-5 sm:mb-0">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      State
                    </Label>
                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustAddressState[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mb-4 sm:mb-0">
                <Container className="col-span-3 sm:col-span-1">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black p-1 text-md font-semibold"
                    >
                      Zip
                    </Label>

                    <span className="ml-8 font-semibold text-blue-800">
                      {value && value.trustAddressZip[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
            </Panel>
          ) : (
            ""
          )}
          {value && value.jointOwnerFirstname && (
            <div>
              <Panel header="Joint Owner" className="review-panel">
                <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mt-4 sm:mt-0">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Full Name
                      </Label>

                      <span className="ml-8 font-semibold text-blue-800">
                        {value &&
                          value.jointOwnerFirstname[0] +
                            " " +
                            value.jointOwnerMiddlename[0] +
                            " " +
                            value.jointOwnerLastname[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mb-5 sm:mb-0">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Gender assigned at birth
                      </Label>
                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointOwnerGender[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                {!isTabletOrMobile && <Divider />}
                <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Birth Date
                      </Label>

                      <span className="ml-8 font-semibold text-blue-800">
                        {value &&
                          value.jointOwnerDob &&
                          moment(value.jointOwnerDob[0]).format("MM-DD-YYYY")}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mb-5 sm:mb-0">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Phone Number
                      </Label>
                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointOwnerPhone[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                {!isTabletOrMobile && <Divider />}
                <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Social Security Number
                      </Label>

                      <span className="ml-8 font-semibold text-blue-800">
                        {value &&
                          "XXX-XX-" + value.jointOwnerGovtid[0].substr(-4)}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mb-5 sm:mb-0">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Email ID
                      </Label>
                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointOwnerEmail[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                {!isTabletOrMobile && <Divider />}
                <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Address Line 1
                      </Label>
                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointResidenceAddressLine1[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mb-5 sm:mb-0">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Address Line 2
                      </Label>
                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointResidenceAddressLine2
                          ? value.jointResidenceAddressLine2[0]
                          : ""}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                {!isTabletOrMobile && <Divider />}
                <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        City
                      </Label>

                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointResidenceAddressCity[0]}
                      </span>
                    </Container>
                  </Container>
                  <Container className="col-span-6 sm:col-span-1">
                    <Container className="grid-rows-2 mb-5 sm:mb-0">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        State
                      </Label>
                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointResidenceAddressState[0]}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                {!isTabletOrMobile && <Divider />}
                <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mb-4 sm:mb-0">
                  <Container className="col-span-3 sm:col-span-1">
                    <Container className="grid-rows-3">
                      <Label
                        htmlFor="amount"
                        className="text-black p-1 text-md font-semibold"
                      >
                        Zip
                      </Label>

                      <span className="ml-8 font-semibold text-blue-800">
                        {value && value.jointResidenceAddressZip
                          ? value.jointResidenceAddressZip[0]
                          : ""}
                      </span>
                    </Container>
                  </Container>
                </Grid>
              </Panel>
            </div>
          )}
          <Panel header="Annuitant Details" className="review-panel">
            <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mt-4 sm:mt-0">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Full Name
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant &&
                      annuitant.annuitantFirstname[0] +
                        " " +
                        annuitant.annuitantMiddlename[0] +
                        " " +
                        annuitant.annuitantLastname[0]}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-1">
                <Container className="grid-rows-2 mb-5 sm:mb-0 ">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Gender assigned at birth
                  </Label>
                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant && annuitant.annuitantGender[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block" />
            <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0  mt-0 sm:mt-8">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Birth Date
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant &&
                      annuitant.annuitantDob &&
                      moment(annuitant.annuitantDob[0]).format("MM-DD-YYYY")}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-1">
                <Container className="grid-rows-2 mb-5 sm:mb-0 ">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Phone Number
                  </Label>
                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant && annuitant.annuitantPhone[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block  md:block lg:block " />
            <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0  mt-0 sm:mt-8">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Social Security Number
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant &&
                      "XXX-XX-" + annuitant.annuitantGovtid[0].substr(-4)}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-1">
                <Container className="grid-rows-2 mb-5 sm:mb-0 ">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Email ID
                  </Label>
                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant && annuitant.annuitantEmail[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block" />
            <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0  mt-0 sm:mt-8">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Address Line 1
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant && annuitant.annuitantAddressLine1[0]}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-1">
                <Container className="grid-rows-2 mb-5 sm:mb-0 ">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Address Line 2
                  </Label>
                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant && annuitant.annuitantAddressLine2
                      ? annuitant.annuitantAddressLine2[0]
                      : ""}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block  md:block lg:block " />
            <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0  mt-0 sm:mt-8">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    City
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant && annuitant.annuitantAddressCity[0]}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-1">
                <Container className="grid-rows-2 mb-5 sm:mb-0">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    State
                  </Label>
                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant &&
                      annuitant.annuitantAddressState &&
                      annuitant.annuitantAddressState[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block  md:block lg:block " />
            <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0  mt-0 sm:mt-8 mb-4 sm:mb-0">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="grid-rows-3">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Zip
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {annuitant &&
                      annuitant.annuitantAddressZip &&
                      annuitant.annuitantAddressZip[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
          </Panel>
        </Card>
        <Card
          header={header("2. Beneficiary Information", disable)}
          className="review-card"
        >
          {benefi &&
            benefi.map((bene, index) => {
              return (
                <div key={index}>
                  <Panel
                    header={ordinal(index + 1) + " " + " Primary Beneficiary"}
                    className="review-panel"
                  >
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mt-4 sm:mt-0">
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3">
                          {bene.benePartyType[0] === "Trust" ? (
                            <div>
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Trust Name
                              </Label>
                              <span className="ml-8 font-semibold text-blue-800">
                                {bene &&
                                  bene.beneTrustName &&
                                  bene.beneTrustName[0]}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Full Name
                              </Label>
                              <span className="ml-8 font-semibold text-blue-800">
                                {bene && bene.beneMiddlename
                                  ? bene.beneFirstname[0] +
                                    " " +
                                    bene.beneMiddlename[0] +
                                    " " +
                                    bene.beneLastname[0]
                                  : bene.beneFirstname[0] +
                                    " " +
                                    bene.beneLastname[0]}
                              </span>
                            </div>
                          )}
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-1">
                        <Container className="grid-rows-2 mb-5 sm:mb-0">
                          {bene.benePartyType[0] === "Trust" ? (
                            <div>
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Trustee Name
                              </Label>
                              <span className="ml-8 font-semibold text-blue-800">
                                {bene &&
                                  bene.beneTrustee &&
                                  bene.beneTrustee[0]}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Gender assigned at birth
                              </Label>
                              <span className="ml-8 font-semibold text-blue-800">
                                {bene && bene.beneGender && bene.beneGender[0]}
                              </span>
                            </div>
                          )}
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3">
                          {bene.benePartyType[0] === "Trust" ? (
                            <div>
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Tax ID of Trust
                              </Label>

                              <span className="ml-8 font-semibold text-blue-800">
                                {bene &&
                                  bene.beneGovtid &&
                                  "XXX-XX-" + bene.beneGovtid[0].substr(-4)}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Birth Date
                              </Label>

                              <span className="ml-8 font-semibold text-blue-800">
                                {bene &&
                                  bene.beneDob &&
                                  moment(bene.beneDob[0]).format("MM-DD-YYYY")}
                              </span>
                            </div>
                          )}
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-1">
                        <Container className="grid-rows-2 mb-5 sm:mb-0">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            Phone Number
                          </Label>
                          <span className="ml-8 font-semibold text-blue-800">
                            {bene && bene.benePhone && bene.benePhone[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                      {bene.benePartyType[0] === "Person" && (
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Social Security Number
                            </Label>

                            <span className="ml-8 font-semibold text-blue-800">
                              {bene &&
                                bene.beneGovtid &&
                                "XXX-XX-" + bene.beneGovtid[0].substr(-4)}
                            </span>
                          </Container>
                        </Container>
                      )}
                      <Container className="col-span-6 sm:col-span-1">
                        <Container className="grid-rows-2 mb-5 sm:mb-0">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            Email ID
                          </Label>
                          <span className="ml-8 font-semibold text-blue-800">
                            {bene && bene.beneEmail && bene.beneEmail[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            Address Line 1
                          </Label>

                          <span className="ml-8 font-semibold text-blue-800">
                            {bene &&
                              bene.beneAddressLine1 &&
                              bene.beneAddressLine1[0]}
                          </span>
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-1">
                        <Container className="grid-rows-2 mb-5 sm:mb-0">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            Address Line 2
                          </Label>
                          <span className="ml-8 font-semibold text-blue-800">
                            {bene && bene.beneAddressLine2
                              ? bene.beneAddressLine2[0]
                              : ""}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            City
                          </Label>

                          <span className="ml-8 font-semibold text-blue-800">
                            {bene &&
                              bene.beneAddressCity &&
                              bene.beneAddressCity[0]}
                          </span>
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-1">
                        <Container className="grid-rows-2 mb-5 sm:mb-0">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            State
                          </Label>
                          <span className="ml-8 font-semibold text-blue-800">
                            {bene &&
                              bene.beneAddressState &&
                              bene.beneAddressState[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            Zip
                          </Label>
                          <span className="ml-8 font-semibold text-blue-800">
                            {bene &&
                              bene.beneAddressZip &&
                              bene.beneAddressZip[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    <Divider />
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                      {bene.benePartyType[0] === "Person" && (
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Relationship with owner
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {bene &&
                                bene.beneRelationOwner &&
                                bene.beneRelationOwner[0]}
                            </span>
                          </Container>
                        </Container>
                      )}
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            Percentage Sharing (%)
                          </Label>
                          <span className="ml-8 font-semibold text-blue-800">
                            {bene &&
                              bene.beneSharingPercent &&
                              bene.beneSharingPercent[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    <Divider />
                    <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mb-4 sm:mb-0">
                      <Container className="col-span-3 sm:col-span-1">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black p-1 text-md font-semibold"
                          >
                            Is this designation irrevocable?
                          </Label>
                          <span className="ml-8 font-semibold text-blue-800">
                            {bene &&
                              bene.beneIrrevocable &&
                              bene.beneIrrevocable[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                  </Panel>
                </div>
              );
            })}

          {cont &&
            cont.map((item, index) => {
              return (
                item.beneSharingPercent && (
                  <div key={index}>
                    <Panel
                      header={
                        ordinal(index + 1) + " " + "Contigent Beneficiary"
                      }
                      className="review-panel"
                    >
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mt-4 sm:mt-0">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            {item.benePartyType[0] === "Trust" ? (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black p-1 text-md font-semibold"
                                >
                                  Trust Name
                                </Label>
                                <span className="ml-8 font-semibold text-blue-800">
                                  {item &&
                                    item.beneTrustName &&
                                    item.beneTrustName[0]}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black p-1 text-md font-semibold"
                                >
                                  Full Name
                                </Label>
                                <span className="ml-8 font-semibold text-blue-800">
                                  {item && item.beneMiddlename
                                    ? item.beneFirstname[0] +
                                      " " +
                                      item.beneMiddlename[0] +
                                      " " +
                                      item.beneLastname[0]
                                    : item && item.beneLastname
                                    ? item.beneFirstname[0] +
                                      " " +
                                      item.beneLastname[0]
                                    : item.beneFirstname[0]}
                                </span>
                              </div>
                            )}
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2"></Container>
                          <Container className="col-span-6 sm:col-span-1">
                            <Container className="grid-rows-2 mb-5 sm:mb-0">
                              {item.benePartyType[0] === "Trust" ? (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black p-1 text-md font-semibold"
                                  >
                                    Trustee Name
                                  </Label>
                                  <span className="ml-8 font-semibold text-blue-800">
                                    {item &&
                                      item.beneTrustee &&
                                      item.beneTrustee[0]}
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <Label
                                    htmlFor="amount"
                                    className="text-black p-1 text-md font-semibold"
                                  >
                                    Gender assigned at birth
                                  </Label>
                                  <span className="ml-8 font-semibold text-blue-800">
                                    {item &&
                                      item.beneGender &&
                                      item.beneGender[0]}
                                  </span>
                                </div>
                              )}
                            </Container>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            {item.benePartyType[0] === "Trust" ? (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black p-1 text-md font-semibold"
                                >
                                  Tax ID of Trust
                                </Label>

                                <span className="ml-8 font-semibold text-blue-800">
                                  {item &&
                                    item.beneGovtid &&
                                    "XXX-XX-" + item.beneGovtid[0].substr(-4)}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <Label
                                  htmlFor="amount"
                                  className="text-black p-1 text-md font-semibold"
                                >
                                  Birth Date
                                </Label>

                                <span className="ml-8 font-semibold text-blue-800">
                                  {item &&
                                    item.beneDob &&
                                    moment(item.beneDob[0]).format(
                                      "MM-DD-YYYY"
                                    )}
                                </span>
                              </div>
                            )}
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mb-5 sm:mb-0">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Phone Number
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item && item.benePhone && item.benePhone[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                        {item.benePartyType[0] === "Person" && (
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Social Security Number
                              </Label>

                              <span className="ml-8 font-semibold text-blue-800">
                                {item &&
                                  item.beneGovtid &&
                                  "XXX-XX-" + item.beneGovtid[0].substr(-4)}
                              </span>
                            </Container>
                          </Container>
                        )}
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mb-5 sm:mb-0">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Email ID
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item && item.beneEmail && item.beneEmail[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Address Line 1
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item &&
                                item.beneAddressLine1 &&
                                item.beneAddressLine1[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mb-5 sm:mb-0">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Address Line 2
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item && item.beneAddressLine2
                                ? item.beneAddressLine2[0]
                                : ""}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              City
                            </Label>

                            <span className="ml-8 font-semibold text-blue-800">
                              {item &&
                                item.beneAddressCity &&
                                item.beneAddressCity[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-1">
                          <Container className="grid-rows-2 mb-5 sm:mb-0">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              State
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item &&
                                item.beneAddressState &&
                                item.beneAddressState[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Zip
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item &&
                                item.beneAddressZip &&
                                item.beneAddressZip[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider />
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 ">
                        {item.benePartyType[0] === "Person" && (
                          <Container className="col-span-3 sm:col-span-1">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black p-1 text-md font-semibold"
                              >
                                Relationship with owner
                              </Label>
                              <span className="ml-8 font-semibold text-blue-800">
                                {item &&
                                  item.beneRelationOwner &&
                                  item.beneRelationOwner[0]}
                              </span>
                            </Container>
                          </Container>
                        )}
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Percentage Sharing (%)
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item &&
                                item.beneSharingPercent &&
                                item.beneSharingPercent[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      <Divider />
                      <Grid className="grid-cols-2 gap-4 border-bt ml-3 sm:ml-0 mb-4 sm:mb-0">
                        <Container className="col-span-3 sm:col-span-1">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black p-1 text-md font-semibold"
                            >
                              Is this designation irrevocable?
                            </Label>
                            <span className="ml-8 font-semibold text-blue-800">
                              {item &&
                                item.beneIrrevocable &&
                                item.beneIrrevocable[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                    </Panel>
                  </div>
                )
              );
            })}
        </Card>
        <Card
          header={header("3. Product Details", disable)}
          className="review-card"
        >
          <Panel className="panel-black" header="Amount you want to invest">
            <Grid className="grid-cols-1 gap-4 border-bt mt-4 sm:mt-0">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="ml-3 sm:ml-0 rev-width grid-rows-3 mb-5 sm:mb-0">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Amount Investing
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {value &&
                      value.amountInvesting &&
                      "$ " + value.amountInvesting[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block  md:block  lg:block " />
            <Grid className="grid-cols-1 gap-4 border-bt">
              <Container className="col-span-6 sm:col-span-1">
                <Container className="ml-3 sm:ml-0 rev-width grid-rows-2 mb-5 sm:mb-0 mt-0 sm:mt-5">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Term
                  </Label>
                  <span className="ml-8 font-semibold text-blue-800">
                    {value && value.guaranteedTerm && value.guaranteedTerm[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block  md:block  lg:block " />
            <Grid className="grid-cols-1 gap-4 border-bt mb-4 sm:mb-0">
              <Container className="col-span-6 sm:col-span-1">
                <Container className="ml-3 sm:ml-0 rev-width grid-rows-2 mt-0 sm:mt-5">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    State
                  </Label>
                  <span className="ml-8 font-semibold text-blue-800">
                    {value && value.issueState && value.issueState[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
          </Panel>
          <Panel className="panel-black" header="Selected Rider(s)">
            <div className="mt-4 sm:mt-0"></div>
            {riders?.map((item, index) => {
              mapRiderNames(item);

              return (
                <div key={index}>
                  <Grid className="grid-cols-1 gap-4 border-bt ">
                    <Container className="col-span-3 sm:col-span-1">
                      <Container className="ml-3 sm:ml-0 rev-width grid-rows-3 mb-5 sm:mb-0">
                        <Label
                          htmlFor="amount"
                          className="text-black p-1 text-md font-semibold"
                        >
                          {disp}
                        </Label>
                        <span className="ml-8 font-semibold text-blue-800">
                          {""}
                        </span>
                      </Container>
                    </Container>
                  </Grid>
                  {!isTabletOrMobile && <Divider />}
                </div>
              );
            })}
          </Panel>
          <Panel className="panel-black" header="Your Guaranteed Growth">
            <Grid className="grid-cols-1 gap-4 border-bt mt-4 sm:mt-0">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="ml-3 sm:ml-0 rev-width grid-rows-3 mb-3 sm:mb-0">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Guaranteed Interest Rate
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {value && value.guaranteedRate && value.guaranteedRate[0] + "%"}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block  md:block  lg:block " />
            <Grid className="grid-cols-1 gap-4 border-bt mb-4 sm:mb-0">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="ml-3 sm:ml-0 rev-width grid-rows-3 mt-0 sm:mt-4">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    Guaranteed Amount Value
                  </Label>

                  <span className="ml-8 font-semibold text-blue-800">
                    {quoteData && "$" + quoteData.payload.projectedValue}
                  </span>
                </Container>
              </Container>
            </Grid>
          </Panel>
        </Card>
        <Card
          header={header("4. Suitability Check", disable)}
          className="review-card"
        >
          {questions?.map((o, i) => {
            return (
              <div key={i}>
                <Grid className="grid-cols-2 gap-4 p-4">
                  <Container className="w-full col-span-3 sm:col-span-1">
                    <Container className="grid-rows-1">
                      <Label
                        htmlFor="amount"
                        className="text-black  text-md font-semibold"
                      >
                        {o.title}
                      </Label>
                    </Container>
                  </Container>
                  <Container className="w-1/4 col-span-3 sm:col-span-1">
                    <Container className="grid-rows-2">
                      <span className="ml-72 font-semibold text-blue-800">
                        {suit?.map((x, u) => {
                          return o.name === x[0] && x[1][0];
                        })}
                      </span>
                    </Container>
                  </Container>
                </Grid>
                <Divider />
              </div>
            );
          })}
        </Card>
        <Card header={header("5. Premium", disable)} className="review-card">
          <Panel className="panel-black" header="Amount you are investing">
            <Grid className="grid-cols-1 gap-4 border-bt mt-4 sm:mt-0">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="ml-3 sm:ml-0 rev-width grid-rows-3 mb-5 sm:mb-0">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    From Bank
                  </Label>

                  <span className="pl-7  ml-8 font-semibold text-blue-800">
                    {value && "$" + value.achAmount[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Divider className="hidden sm:block  md:block  lg:block " />
            <Grid className="grid-cols-1 gap-4 border-bt mb-4 sm:mb-0">
              <Container className="col-span-3 sm:col-span-1">
                <Container className="ml-3 sm:ml-0 rev-width grid-rows-3 mt-0 sm:mt-4">
                  <Label
                    htmlFor="amount"
                    className="text-black p-1 text-md font-semibold"
                  >
                    1035 Exchange
                  </Label>

                  <span className="ml-7 font-semibold text-blue-800">
                    {value && "$" + value["1035Amount"][0]}
                  </span>
                </Container>
              </Container>
            </Grid>
          </Panel>
        </Card>
      </div>
      <Flex
        className={`${
          disable ? "hidden" : "inline-block"
        } border1 flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-between mt-5 mb-5 h-15 pt-5 sm:pt-0 ml-0 sm:ml-0`}
      >
        <Link className="w-1/3" href={ROUTE_PATHS.PREMIUM}>
          <Button
            type="submit"
            className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm sm:ml-60  w-5/6 my-5 sm:ml-0  sm:w-44"
          >
            Back
          </Button>
        </Link>

        <Button
          type="submit"
           
          onClick={presubmit}
          className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-44"
        >
          Save & Continue
        </Button>
      </Flex>
      <Flex
        className={`${
          disable ? "inline-block" : "hidden"
        } border1 flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-end mt-5 mb-5 h-15 pt-5 sm:pt-0 ml-0 sm:ml-0`}
      >
        <Link className="w-1/3" href={ROUTE_PATHS.SIGN}>
          <Button
            type="button"
            className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
          >
            Continue to sign
          </Button>
        </Link>
      </Flex>
    </>
  );
};

export default withAuthentication(review);
