import { useEffect, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { withAuthentication } from "@utils/route-hocs";
import { TabView, TabPanel } from "primereact/tabview";
import { Sider } from "@components/sidebar";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import {
  Url,
  authUrl,
  authOptions,
  auxDataUrl,
  policies,
  lambda,
} from "../../../constants/apiconstant";

import PolicyCard from "./policyCard";
import PolicyCardForTrust from "./policyCardForTrust";
import InActivePolicyCard from "./inactivepolicyCard";
import InActivepolicyCardForTrust from "./inactivepolicyCardForTrust";
import NeedHelp from "../../application/commonForms/needHelp";
import { IncompleteAppModal } from "./incompleteAppModal";
import {connect,useSelector} from 'react-redux';

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";


const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "My Policies";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const mypolicies = () => {
 
  const router = useRouter();
  const { query } = router;
  const [activeIndex, setActiveIndex] = useState(query.index);

  var policyindorjoint = useSelector(state => state.policyDetails.primaryorjointpolicies)
  var trustactive = useSelector(state => state.policyDetails.trustdata)
  var inactiveindorjoint=useSelector(state => state.policyDetails.inactiveprimaryorjointdata)
  var inactivetrust=useSelector(state => state.policyDetails.inactivetrustdata)
  var inactivepolicystatus = useSelector(state => state.policyDetails.inactivepolicypersist)
  var activepolicystatus=useSelector(state => state.policyDetails.activepolicypersist)
  var incompletepolicystatus =useSelector(state => state.policyDetails.incompletepolicypersist)
  const [trustData, setTrustData] = useState(trustactive);
  const [primaryOrJointData, setPrimaryOrJointData] = useState(policyindorjoint);
  const [inactivetrustData, setInactiveTrustData] = useState(inactivetrust);
  const [inactiveprimaryOrJointData, setInactivePolicyData] = useState(inactiveindorjoint);

  const [incompleteApp, setIncompleteApp] = useState(incompletepolicystatus);
  const [activePolicy, setActivePolicy] = useState(activepolicystatus);
  const [inactivePolicy, setinactivePolicy] = useState(inactivepolicystatus);
  const [show, setshowModal] = useState(true);

  const closeModal = useCallback(() => setshowModal(false), []);
  let closeModal1 = useCallback(() => {
    setshowModal(false);
    setActiveIndex(1);
  }, []);

  useEffect(() => {

    setPrimaryOrJointData(policyindorjoint);
    setTrustData(trustactive);
    setInactivePolicyData(inactiveindorjoint);
    setInactiveTrustData(inactivetrust);
    setActiveIndex(query.index && parseInt(query.index));

  }, [policyindorjoint,trustactive,inactivetrust,inactiveindorjoint,query.index]);

const modalFlag=sessionStorage.getItem("modalFlag")
 
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
        {/* <Suspense fallback={<ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />}> */}
      <div className="flex md:flex-row md:space-x-2">
        <div className="sm:w-1/6">
          <Sider />
        </div>

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
              <TabPanel header="Active policies">
                <PolicyCard result={primaryOrJointData} />

                {/* Trust */}
                <PolicyCardForTrust result={trustData} />

                {primaryOrJointData.length == 0 && trustData.length == 0 ? (
                  <div className="flex flex-col justify-center items-center mt-40">
                    <img
                      className="flex w-8 items-center"
                      src={IMAGE_PATHS.ACTIVEPOL}
                    />
                    <span className="flex items-center mt-3 text-gray-500 text-sm">
                      You have no active policy
                    </span>
                  </div>
                ) : null}
              </TabPanel>
              <TabPanel header="Inactive policies">
                <InActivePolicyCard result={inactiveprimaryOrJointData} />

                {/* Trust */}

                <InActivepolicyCardForTrust result={inactivetrustData} />

                {inactiveprimaryOrJointData.length == 0 &&
                inactivetrustData.length == 0 ? (
                  <div className="flex flex-col justify-center items-center mt-40">
                    <img
                      className="flex w-8 items-center"
                      src={IMAGE_PATHS.ACTIVEPOL}
                    />
                    <span className="flex items-center mt-3 text-gray-500 text-sm">
                      You have no inactive policy
                    </span>
                  </div>
                ) : null}
              </TabPanel>
            </TabView>
            
          </div>
        </div>

        <div className="sm:w-1/5 mt-4">
          {activePolicy && incompleteApp && modalFlag&&show && (
            <IncompleteAppModal showsModal={true} closeModal={closeModal} />
          )}
          {inactivePolicy && incompleteApp &&modalFlag&& !activePolicy && show && (
            <IncompleteAppModal showsModal={true} closeModal={closeModal1} />
          )}
          <NeedHelp />
        </div>
      </div>
      {/* </Suspense> */}
    </>
  );
};
export default withAuthentication(connect(null)(mypolicies));
