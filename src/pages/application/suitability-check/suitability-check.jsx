import { useEffect, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { Stepper } from "@components/stepper";
import { Sider } from "@components/sidebar";
import { ValidateModal } from "./validateModal";
import { ROUTE_PATHS } from "src/constants";
import "primereact/resources/themes/saga-blue/theme.css";
import { withAuthentication } from "@utils/route-hocs";
import "primereact/resources/primereact.min.css";
import {
  Url,
  products,
} from "../../../constants/apiconstant";
import QuestionBox from "../commonForms/questionBox";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.SUITABILITY_CHECK}`;
const title = "Suitability Check";
const description =
  "Enables you to resend the registration activation link to your email address.";
const suitabilityCheck = () => {
  const [questions, setQuestions] = useState();
  const [validateModal, setModal] = useState(false);
  const closeModal = useCallback(() => {
    setModal(false);
    setShow(true);
  }, []);
  const [show, setShow] = useState(false);

  async function getQuestions() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + products, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const resp = data[1].policyConfiguration.fields;

        const qstns = resp.filter((obj) => {
          return obj.name === "suitabilityQuestions";
        });
       

        setQuestions(qstns[0].fields);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getQuestions();
  }, [show]);

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

      <div>
        <Sider />
        <Stepper percent={49} question={show} index={3} />
      </div>

      <div className="Flex flex-col md:ml-56">
        <div className="Flex justify-items-start m-4 ml-4 sm:ml-0">
          <p className="h-suitability font-bold text-lg md:text-xl">
            Suitability Check
          </p>
        </div>
        <div className="Flex flex-col justify-items-start bg-gray-100 md:bg-white md:pb-4">
          <div className="m-4 ml-4 sm:ml-0 font-bold ">
            <p className="text-sm md:text-lg">
              Before we can ask you how you are paying we need to ask a few
              compliance questions :
            </p>
          </div>
          <div className="mr-4 sm:mr-0 ml-4 sm:ml-0 pb-2 font-light">
            <p className="text-xs md:text-base ">
              The signatories of this application represent that all statements
              and information contained herein are true and complete to the best
              of their belief and knowledge. This signatories of this
              application also declare that this application was signed by the
              applicant after all answers and information were recorded herein.
              Additionally, the signatories of this application declare and
              certify the following.
            </p>
          </div>
        </div>

        {validateModal && (
          <ValidateModal showsModal={true} closeModal={closeModal} />
        )}
        <QuestionBox result={questions} setModal={setModal} />
      </div>
    </>
  );
};
export default withAuthentication(suitabilityCheck);
