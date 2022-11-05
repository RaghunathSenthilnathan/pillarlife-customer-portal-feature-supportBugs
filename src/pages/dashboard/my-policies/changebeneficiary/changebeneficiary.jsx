import { useEffect, useState, useCallback } from "react";
import { Label } from "@components/forms";
import { BreadCrumb } from "primereact/breadcrumb";
import { Panel } from "primereact/panel";
import { NextSeo } from "next-seo";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/router";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import {  withAuthentication } from "@utils/route-hocs";
import { Column } from "primereact/column";
import { Flex } from "@components/layout";
import { Button } from "@components/forms";
import { Sider } from "@components/sidebar";
import { Container } from "@components/layout";
import { ModalPopUp } from "../modalpopup";
import { DeletePercentSharing } from "../deletepercentsharing";
import { ConfirmDeletePercentSharing } from "../confirmdeletepercentsharing";
import { ConfirmContingentDelete } from "../confirmcontingentdelete";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { v4 as uuidv4 } from "uuid";
import RowMobile from "../rowMobile";

import {
  Url,
  pandaDoc,
  SendDoc,
  policies,
  endorsements
} from "../../../../constants/apiconstant";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Grid } from "@components/layout/grid";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.CHANGE_BENEFICIARY}`;
const title = "Change Beneficiary";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const changebeneficiary = () => {
  const router = useRouter();
  const { query } = router;
  const [primary1, setPrimary1] = useState(null);
    const [loader, setLoader] = useState(false);
  const [contingent1, setContingent1] = useState(null);
  const [polValue, setPolValue] = useState(null);
  const [benefi, setBeneficiary] = useState([]);
  const [cont, setcontBeneficiary] = useState([]);
  const [show, setShowModal] = useState(false);
  const closeModal1 = useCallback(() => setShowModal(false), []);
  const [id, setID] = useState();
  const [showdelete, setShowDelete] = useState(false);
  const [showdelete1, setShowDelete1] = useState(false);
  const [showpercent, setShowPercent] = useState(false);
  const closeDelete = useCallback(() => setShowDelete(false));
  const closeDelete1 = useCallback(() => setShowDelete1(false));
  const [primaryname, setPrimaryName] = useState("");
  const [deletelast, setDeleteLast] = useState(true);
  const [contingentname, setContingentName] = useState("");
  const closePercent = useCallback(() => setShowPercent(false));
  const openPercent = useCallback(() => setShowPercent(true));
  const [benetype, setBeneType] = useState(false);
  const [benelocator, setBeneLocator] = useState("");
  const [warn, setWarn] = useState(false);
  const warnclose = useCallback(() => setWarn(false));
  const [deleteopen, setDeleteOpen] = useState(false);
  const confirmclose = useCallback(() => setDeleteOpen(false));
  const confirmopen = useCallback(() => setDeleteOpen(true));
  const [addopen, setAddOpen] = useState(false);
  const addclose = useCallback(() => setAddOpen(false));
  const [showdelete2, setShowDelete2] = useState(false);
  const closeDelete2 = useCallback(() => setShowDelete2(false));
  const confirmopen1 = useCallback(() => deletelastcontingent(benelocator));
  const [cancel, setcancel] = useState(false);
  const closecancel = useCallback(() => setcancel(false));
  const [primLocator, setPrimLocator] = useState([]);
  const [contiLocator, setContiLocator] = useState([]);

  const items = [
    {
      label: "My Policies",
      icon: "pi pi-home",
      url: "/dashboard/my-policies"
    },
    {
      label: "Active Policies",
      url: "/dashboard/my-policies?index=0"
    },
    {
      label: `Policy No. ${query.id}`,
      url: `/dashboard/my-policies/updatebeneficiary?id=${id}`
    },
    {
      label: "Change beneficiary"
    }
  ];

  const postDataPrimary = () => {
    if (primary1.beneIrrevocable != "Yes") {
      var locator = primary1.id ? primary1.id : primary1.locator;
      const data = { locator, id };
      router.push(
        { pathname: "/dashboard/my-policies/editbeneficiary", query: data },
        "/dashboard/my-policies/editbeneficiary"
      );
    } else {
      setShowModal(true);
    }
  };

  const postDataContingent = () => {
    if (contingent1.beneIrrevocable != "Yes") {
      var locator = contingent1.id ? contingent1.id : contingent1.locator;
      const data = { locator, id };
      router.push(
        {
          pathname: "/dashboard/my-policies/editcontingentbeneficiary",
          query: data
        },
        "/dashboard/my-policies/editcontingentbeneficiary"
      );
    } else {
      setShowModal(true);
    }
  };

  function deletePrimary() {
    setBeneType(true);
    if (benefi.length <= 1) {
      if (primary1.beneIrrevocable[0] === "No") {
        var fullname = primary1.beneFullName[0];
        var locator = primary1.locator
          ? primary1.locator
          : primary1.id;
        setPrimaryName(fullname);
        setBeneLocator(locator);
        setShowDelete2(true);
        setDeleteLast(false);
      } else {
        setShowDelete(true);
      }
    } else {
      if (primary1.beneIrrevocable[0] === "No") {
        var fullname = primary1.beneFullName[0];
        var locator = primary1.locator ? primary1.locator : primary1.id;
        setPrimaryName(fullname);
        setBeneLocator(locator);
        setShowDelete1(true);
      } else {
        setShowDelete(true);
      }
    }
  }
  function deleteContigent() {
    setBeneType(false);
    if (cont.length <= 1) {
      if (contingent1.beneIrrevocable[0] === "No") {
        var fullname = contingent1.beneFullName[0];
        var locator = contingent1.locator
          ? contingent1.locator
          : contingent1.id;
        setContingentName(fullname);
        setBeneLocator(locator);
        setShowDelete2(true);
        setDeleteLast(false);
      } else {
        setShowDelete(true);
      }
    } else {
      if (contingent1.beneIrrevocable[0] === "No") {
        var fullname = contingent1.beneFullName[0];
        var locator = contingent1.locator
          ? contingent1.locator
          : contingent1.id;
        setContingentName(fullname);
        setBeneLocator(locator);
        setShowDelete1(true);
        setDeleteLast(true);
      } else {
        setShowDelete(true);
      }
    }
  }
  function deletelastprimary(benelocator) {
    let locator = id.toString();
    const allstoredbeneficiary = JSON.parse(sessionStorage.getItem(locator));
    allstoredbeneficiary.map((item, index) => {
      if (item.locator === benelocator || item.id === benelocator) {
        allstoredbeneficiary.splice(index, 1);

        const deletebeneficiarylocator = JSON.parse(
          sessionStorage.getItem("DeletedBeneLocator")
        );
        if (item.locator && deletebeneficiarylocator === null) {
          var locator = [item.locator];
          sessionStorage.setItem("DeletedBeneLocator", JSON.stringify(locator));
        } else {
          deletebeneficiarylocator.push(item.locator);
          sessionStorage.setItem(
            "DeletedBeneLocator",
            JSON.stringify(deletebeneficiarylocator)
          );
        }
      }
    });
  }
  function deletelastcontingent(benelocator) {
    console.log("here",benelocator)
    let locator = id.toString();
    const allstoredbeneficiary = JSON.parse(sessionStorage.getItem(locator));
    allstoredbeneficiary.map((item, index) => {
      if (item.locator === benelocator || item.id === benelocator) {
        allstoredbeneficiary.splice(index, 1);

        const deletebeneficiarylocator = JSON.parse(
          sessionStorage.getItem("DeletedBeneLocator")
        );
        if (item.locator && deletebeneficiarylocator === null) {
          var locator = [item.locator];
          sessionStorage.setItem("DeletedBeneLocator", JSON.stringify(locator));
        } else {
          deletebeneficiarylocator.push(item.locator);
          sessionStorage.setItem(
            "DeletedBeneLocator",
            JSON.stringify(deletebeneficiarylocator)
          );
        }
      }
    });

    sessionStorage.setItem(
      locator.toString(),
      JSON.stringify(allstoredbeneficiary)
    );

    setDeleteOpen(true);
  }

  function addPrimary() {
    if (benefi.length >= 5) {
      setAddOpen(true);
    } else {
      window.location.href = `/dashboard/my-policies/addbeneficiary?id=${id}`;
    }
  }

  function addContingent() {
    if (cont.length >= 5) {
      setAddOpen(true);
    } else {
      window.location.href = `/dashboard/my-policies/addcontingentbeneficiary?id=${id}`;
    }
  }

  const header = (
    <>
      {" "}
      <div className="flex justify-between p-4">
        {" "}
        <div>
          <h2 className="sm:ml-4  font-bold text-blue-800">
            Policy No. {query.id}
          </h2>
          <h2 className="sm:ml-4 font-bold text-gray-900">
            Multi-Year Guaranteed Annuity
          </h2>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    const pl = query && parseInt(query.id);
    if (pl) {
      fetchPolicyDetails(pl);
      setID(pl);
    }
  }, [query]);

  var primaryLocator = [];
  var contingentLocator = [];

  async function endorsement() {
    var locator = id.toString();
 setLoader(true);
 var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const sessiondata = JSON.parse(sessionStorage.getItem(locator));

    const deletebeneficiarylocator = JSON.parse(
      sessionStorage.getItem("DeletedBeneLocator")
    );

    let addbeneficiary = [];
    let updatedbeneficiary = [];
    let removebeneficiary = [];

    sessiondata &&
      sessiondata.map((item, index) => {
        if (item.locator) {
          updatedbeneficiary.push(item);
        } else if (item.id) {
          addbeneficiary.push(item);
          let removeid = [];

          addbeneficiary.map(o => {
            delete o.id;
            removeid.push(o);
          });

          let updatebeneficiary = removeid;
        }
      });

    if (deletebeneficiarylocator != null) {
      removebeneficiary = deletebeneficiarylocator;
    }

    var adddata = [];

    addbeneficiary.map(e => {
      var exposure = {
        exposureName: "Beneficiary"
      };

      adddata.push(
        Object.assign({}, exposure, {
          fieldValues: e,
          perils: [
            {
              name: "ignoreMe"
            }
          ]
        })
      );
    });

    var updatedata = [];

     updatedbeneficiary.map(e => {
      var exposure = {
        exposureLocator: e.locator
      };

      delete e.locator;

      updatedata.push(
        Object.assign({}, exposure, {
          fieldValues: e
        })
      );
    });

    var removedata = [];
    let redata = removebeneficiary;
    //  let removedata=[]

    //  removebeneficiary.map(o=>{
    //   updatedata.push({exposureLocator:o,
    //   fieldValues:{
    //     beneStatus:"Inactive"
    //   }})

    //   })
      
     removebeneficiary.map(o=>{
      removedata.push(o)
      })
   
    var endorsementlocator = "";

    if (
      adddata.length != 0 &&
      updatedata.length == 0 &&
      removedata.length == 0
    ) {
      let policybody = {
        endorsementName: "changeBeneficiary",
        addExposures: adddata,
          //"conflictHandling": "invalidate"

      };

      await fetch(Url + policies + "/" + id + endorsements, {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then( data => {
          getAllEndorsemnet(data.policyLocator,auth)
        })
        .catch(error => {
          console.log("Error:", error);
        });
    } else if (
      adddata.length != 0 &&
      updatedata.length != 0 &&
      removedata.length == 0
    ) {
      let policybody = {
        endorsementName: "changeBeneficiary",
        addExposures: adddata,
       updateExposures: updatedata
           //"conflictHandling": "invalidate"
      };

      await fetch(Url + policies + "/" + id + endorsements, {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
       
          .then( data => {
          
           getAllEndorsemnet(data.policyLocator,auth)
        })
        .catch(error => {
          console.log("Error:", error);
        });
    } else if (
      adddata.length != 0 &&
      updatedata.length != 0 &&
      removedata.length != 0
    ) {
      let policybody = {
        endorsementName: "changeBeneficiary",
        addExposures: adddata,
        updateExposures: updatedata,
        endExposures: removedata
           //"conflictHandling": "invalidate"
        // endExposures: removedata
      };

      await fetch(Url + policies + "/" + id + endorsements, {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then( data => {
          getAllEndorsemnet(data.policyLocator,auth)
        })
        .catch(error => {
          console.log("Error:", error);
        });
    } else if (
      adddata.length == 0 &&
      updatedata.length != 0 &&
      removedata.length != 0
    ) {
      let policybody = {
        endorsementName: "changeBeneficiary",
       updateExposures: updatedata,
        endExposures: removedata
           //"conflictHandling": "invalidate"
        // endExposures: removedata
      };

      await fetch(Url + policies + "/" + id + endorsements, {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then( data => {
          
           getAllEndorsemnet(data.policyLocator,auth)
        })
        .catch(error => {
          console.log("Error:", error);
        });
    } else if (
      adddata.length == 0 &&
      updatedata.length != 0 &&
      removedata.length == 0
    ) {
      let policybody = {
        endorsementName: "changeBeneficiary",
       updateExposures: updatedata
           //"conflictHandling": "invalidate"
      };

      await fetch(Url + policies + "/" + id + endorsements, {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
         .then( data => {
          
         getAllEndorsemnet(data.policyLocator,auth)
        })
        .catch(error => {
          console.log("Error:", error);
        });
    } else if (
      adddata.length == 0 &&
      updatedata.length == 0 &&
      removedata.length >= 1
    ) {
      let policybody = {
        endorsementName: "changeBeneficiary",
         endExposures: removedata
           //"conflictHandling": "invalidate"
      };

      await fetch(Url + policies + "/" + id + endorsements, {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then( data => {
          
       getAllEndorsemnet(data.policyLocator,auth)
        })
        .catch(error => {
          console.log("Error:", error);
        });
    } else if (
      adddata.length != 0 &&
      updatedata.length == 0 &&
      removedata.length != 0
    ) {
      let policybody = {
        endorsementName: "changeBeneficiary",
        addExposures: adddata,
         endExposures: removedata
           //"conflictHandling": "invalidate"
        // endExposures: removedata
      };

      await fetch(Url + policies + "/" + id + endorsements, {
        method: "POST",
        body: JSON.stringify(policybody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
         .then(async data => {
          
         getAllEndorsemnet(data.policyLocator,auth)
        })
        .catch(error => {
          console.log("Error:", error);
        });
    }

    // Endorsement Locator API

    
  }
  async function getAllEndorsemnet(id,auth){
      await fetch(Url + policies + "/"+ id + endorsements, {
        method: "GET",

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then( async data => {
          let endorsementlocator=data[data.length-1].locator
          // for(let i=data.length-2;i>=0;i--){
          //   if(data[i].state==="issued"){
          //   endorsementlocator = data[i].locator;
          //   break;
          //   }
          // }
          
            sessionStorage.setItem("endorsementlocator", data[data.length-1].locator)
    //       const bd = {
    //   action: "invalidate"
    // };
       const bd1 = {
      action: "quote"
    };
 await fetch(Url + endorsements + "/" + endorsementlocator, {
      method: "PATCH",
      body: JSON.stringify(bd1),

      headers: {
        Authorization: auth.authorizationToken,

        "Content-Type": "application/json",

        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
         urlDetails(data.documents[0].url);
      })
      .catch(error => {
        console.log("Error:", error);
      })
    
        })
        .catch(error => {
          console.log("Error:", error);
        });
  }
  async function urlDetails(url) {
    const uuid = uuidv4();
    const pl = sessionStorage.getItem("policyLocator");
      const endorsementlocator=  sessionStorage.getItem("endorsementlocator")
    const body = {
      name: "application form",
      url: url,
      recipients: [],
      fields: {},
      metadata: {
        locator_id: pl,
        app_Id: process.env.NEXT_PUBLIC_APP_ID,
        tran_type_cd: "EN",
        tran_cd: uuid,
          endorsementlocator:endorsementlocator,
          endorsementName: "changeBeneficiary"
      },
      tags: ["created_via_api", "test_document"],
      parse_form_fields: false
    };
    const trusteemid= polValue && polValue.characteristics[0].fieldValues.trusteeName
              &&polValue.characteristics[0].fieldValues.trusteeName[0].split(" ")
              var trustmiddleName=[]
       if(trusteemid){

             for (let i=1;i<trusteemid.length;i++){
trustmiddleName.push(trusteemid[i])
     
                  }
                     }
                     if(trustmiddleName.length>0){
                    trustmiddleName=  trustmiddleName.join(" ")
                     }
    polValue &&
      polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerEmail &&
      polValue &&
      !polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerEmail &&
      body.recipients.push({
        email:
          polValue &&
          polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerEmail[0],
        first_name:
          polValue &&
          polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerFirstname[0],
        last_name:
          polValue &&
          polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerLastname[0],
        role: "primaryOwner"
      });
   
    polValue &&
      polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerEmail &&
      body.recipients.push(
        {
          email:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerEmail[0],
          first_name:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerFirstname[0],
          last_name:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerLastname[0],
          role: "primaryOwner"
        },
        {
          email:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerEmail[0],
          first_name:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerFirstname[0],
          last_name:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerLastname[0],
          role: "jointOwner"
        }
      );
   
    polValue &&
      polValue.characteristics[polValue.characteristics.length-1].fieldValues.trustEmail &&
      body.recipients.push(
        {
          email:
            polValue && polValue.characteristics[polValue.characteristics.length-1].fieldValues.trustEmail[0],
          first_name:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.trusteeName[0].split(
              " "
            )[0],
          last_name:trustmiddleName,
          role: "trustee"
        }
        
      );
    await fetch(pandaDoc, {
      method: "POST",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        // "Content-Disposition": "form-data", "name":"data",
        "Content-Type": "application/JSON"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem("changeBeneId", data.uuid);
        setTimeout(() => documentStatus(data.uuid, uuid), 8000);
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
  }
  async function documentStatus(docId, uuid) {
    const jwt_key = sessionStorage.getItem("userName");
    const pl = sessionStorage.getItem("policyLocator");
    const endorsementlocator=  sessionStorage.getItem("endorsementlocator")
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );
    const trusteemid= polValue && polValue.characteristics[0].fieldValues.trusteeName
              &&polValue.characteristics[0].fieldValues.trusteeName[0].split(" ")
              var trustmiddleName=[]
       if(trusteemid){

             for (let i=1;i<trusteemid.length;i++){
trustmiddleName.push(trusteemid[i])
     
                  }
                     }
                     if(trustmiddleName.length>0){
                    trustmiddleName=  trustmiddleName.join(" ")
                     }
    const sentMail = [];
    polValue &&
      polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerEmail &&
      polValue &&
      !polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerEmail &&
      sentMail.push({
      app_id:  process.env.NEXT_PUBLIC_APP_ID,
        notification_type_cd: "E",
        email_id:
          polValue &&
          polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerEmail[0],
        first_nm:
          polValue &&
          polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerFirstname[0],
        last_nm:
          polValue &&
          polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerLastname[0],
        phone_num:
          polValue &&
          polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerPhone[0],
        locator_id: pl,
        send_order: 1,
        metadata: {
          docId: docId,
            locator_id: pl,
          role: "Primary owner",
          tran_type_cd: "EN",
          tran_cd: uuid,
          endorsementlocator:endorsementlocator,
          endorsementName: "changeBeneficiary"

        },
        tran_cd: uuid,
        end_locator_id:endorsementlocator,
        tran_type_cd: "EN",
        send_status_cd: "N",
        sign_status_cd: "N",
        send_retry_count: 1
      });
   
    polValue &&
      polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerEmail &&
      sentMail.push(
        {
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerEmail[0],
          first_nm:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerFirstname[0],
          last_nm:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerLastname[0],
          phone_num:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerPhone[0],
          locator_id: pl,
          send_order: 1,
          metadata: {
            docId: docId,
            role: "Primary owner",
              locator_id: pl,
            tran_type_cd: "EN",
            tran_cd: uuid,
             endorsementlocator:endorsementlocator,
          endorsementName: "changeBeneficiary"
          },
          tran_type_cd: "EN",
          end_locator_id:endorsementlocator,
          tran_cd: uuid,
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1
        },
        {
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerEmail[0],
          first_nm:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerFirstname[0],
          last_nm:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerLastname[0],
          phone_num:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.jointOwnerPhone[0],
          locator_id: pl,
          send_order: 2,
          metadata: {
            docId: docId,
            role: "Joint owner",
              locator_id: pl,
            tran_type_cd: "EN",
            tran_cd: uuid,
             endorsementlocator:endorsementlocator,
          endorsementName: "changeBeneficiary"
          },
          tran_type_cd: "EN",
          tran_cd: uuid,
          end_locator_id:endorsementlocator,
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1
        }
      );
   
    polValue &&
      polValue.characteristics[polValue.characteristics.length-1].fieldValues.trustEmail &&
      sentMail.push(
        {
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            polValue && polValue.characteristics[polValue.characteristics.length-1].fieldValues.trustEmail[0],
          first_nm:
            polValue &&
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.trusteeName[0].split(
              " "
            )[0],
          last_nm:trustmiddleName,
          phone_num:
            polValue && polValue.characteristics[polValue.characteristics.length-1].fieldValues.trustPhone[0],
          locator_id: pl,
          send_order: 1,
          metadata: {
            docId: docId,
              locator_id: pl,
            role: "Trustee",
            tran_type_cd: "EN",
            tran_cd: uuid,
             endorsementlocator:endorsementlocator,
          endorsementName: "changeBeneficiary"
          },
          tran_type_cd: "EN",
          tran_cd: uuid,
          end_locator_id:endorsementlocator,
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1
        }
       
      );
    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
        "/esign/api/v1/communication/create",
      {
        method: "POST",
        body: JSON.stringify(sentMail),

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        data.map(o => {
          if (
            o.email_id ===
            polValue.characteristics[polValue.characteristics.length-1].fieldValues.primaryOwnerEmail[0]
          ) {
            sessionStorage.setItem("sentId", o.notification_id);
          }
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });
    await fetch(SendDoc + docId, {
      method: "GET",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        "Content-Type": "application/JSON"
      }
     
    })
      .then(response => response.json())
      .then(data => {
        setTimeout(() =>Docstatus(data.id), 3000);
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
  }
   async function Docstatus(docId) {
    await fetch(SendDoc + docId, {
      method: "GET",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        "Content-Type": "application/JSON"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "document.draft") {
          sendDocument(data.id);
        } else {
           setTimeout(() => Docstatus(docId), 45000);
        }
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
  }
  async function sendDocument(docId) {
    const body = {
      message: "Hello! This document was sent from the PandaDoc API.",
      silent: true
    };

    await fetch(SendDoc + docId + "/send", {
      method: "POST",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        "Content-Type": "application/JSON"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        router.push(`changebeneficiary/esign`);
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
  }

  async function fetchPolicyDetails(pl) {
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
        setPolValue(data);
        const exposures = JSON.parse(sessionStorage.getItem("exposures"));
        console.log("Exposures---",data.exposures)
        if (exposures === null) {
          sessionStorage.setItem("exposures", JSON.stringify(data.exposures));
          const exposures = JSON.parse(sessionStorage.getItem("exposures"));

          exposures &&
            exposures.map(o => {
              if (
                o.name === "Beneficiary" &&
                o.characteristics[ o.characteristics.length-1].fieldValues.beneType[0] === "Primary"&&
                 !Object.keys(o.characteristics[o.characteristics.length - 1].fieldValues).includes("beneStatus")
              ) {
                beneficiary.push({
                  ...o.characteristics[o.characteristics.length-1].fieldValues,
                  ...{ locator: o.locator }
                });
                console.log("Beneficiary Push--",{
                  ...o.characteristics[o.characteristics.length-1].fieldValues,
                  ...{ locator: o.locator }
                })
              }
            });
          exposures &&
            exposures.map(o => {
              if (
                o.name === "Beneficiary" &&
                o.characteristics[o.characteristics.length-1].fieldValues.beneType[0] === "Contingent"&&
                 !Object.keys(o.characteristics[o.characteristics.length - 1].fieldValues).includes("beneStatus")
              ) {
                contigent.push({
                  ...o.characteristics[o.characteristics.length-1].fieldValues,
                  ...{ locator: o.locator }
                });
              }
            });
          sessionStorage.setItem(
            data.locator,
            JSON.stringify([...beneficiary, ...contigent])
          );
          const allstoredbeneficiary = JSON.parse(
            sessionStorage.getItem(data.locator)
          );
          convertdata(beneficiary, contigent);
        } else {
          var locator = pl.toString();
          const allstoredbeneficiary = JSON.parse(
            sessionStorage.getItem(locator)
          );

          var primary1 = [];
          var contingent1 = [];
          allstoredbeneficiary &&
            allstoredbeneficiary.map(o => {
              if (o.beneType[0] === "Primary") {
                primary1.push({
                  ...o
                });
              }
            });
          allstoredbeneficiary &&
            allstoredbeneficiary.map(o => {
              if (o.beneType[0] === "Contingent") {
                contingent1.push({
                  ...o
                });
              }
            });
          convertdata(primary1, contingent1);
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  function convertdata(bene, conti) {
    var primaryPerson = [];
    var primaryTrust = [];
    var primary = [];
    var contingent = [];
    var contingentPerson = [];
    var contingentTrust = [];

    bene.map(e => {
      if (e.benePartyType[0] === "Person" && e.benePartyType[0] !== "Trust") {
        if (e.beneMiddlename) {
          var fullname = [];
          fullname.push(
            e.beneFirstname[0] +
              " " +
              e.beneMiddlename[0] +
              " " +
              e.beneLastname[0]
          );

          e.beneFullName = fullname;
        } else {
          var fullname = [];
          fullname.push(e.beneFirstname[0] + " " + e.beneLastname[0]);

          e.beneFullName = fullname;
        }

        primaryPerson.push(Object.assign({}, e));
      } else if (
        e.benePartyType[0] === "Trust" &&
        e.benePartyType[0] !== "Person"
      ) {
        var fullname = [];
        fullname.push(e.beneTrustee[0]);

        e.beneFullName = fullname;

        primaryTrust.push(Object.assign({}, e));
      }
    });

    conti.map(e => {
      if (e.benePartyType[0] === "Person" && e.benePartyType[0] !== "Trust") {
        if (e.beneMiddlename) {
          var fullname = [];
          fullname.push(
            e.beneFirstname[0] +
              " " +
              e.beneMiddlename[0] +
              " " +
              e.beneLastname[0]
          );

          e.beneFullName = fullname;
        } else {
          var fullname = [];
          fullname.push(e.beneFirstname[0] + " " + e.beneLastname[0]);

          e.beneFullName = fullname;
        }

        contingentPerson.push(Object.assign({}, e));
      } else if (
        e.benePartyType[0] === "Trust" &&
        e.benePartyType[0] !== "Person"
      ) {
        var fullname = [];
        fullname.push(e.beneTrustee[0]);
        e.beneFullName = fullname;

        contingentTrust.push(Object.assign({}, e));
      }
    });

    primary = [...primaryPerson, ...primaryTrust];
    contingent = [...contingentPerson, ...contingentTrust];
    setBeneficiary(primary);
    setcontBeneficiary(contingent);
  }

  const title = (
    <Container className="font-bold">
      A beneficiary designated as 'irrevocable' cannot be edited.
    </Container>
  );
  const titledelete = (
    <Container className="font-bold">
      A beneficiary designated as 'irrevocable' cannot be deleted.
    </Container>
  );
  const titlewarn = (
    <Container className="font-bold">
      At least one primary beneficiary is mandatory.
    </Container>
  );
  const titleconfirm = (
    <Container className="font-bold">
      Beneficiary has been deleted successfully.
    </Container>
  );
  const titleadd = (
    <Container className="font-bold">
      Only five beneficiaries are allowed.
    </Container>
  );

  const redirect = () => {
    setcancel(true);
  };

  return (
    <>
      {" "}
      <NextSeo
        title={"Change Beneficiary"}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description
        }}
      />
        {loader && (
        <div className={"block fixed inset-0 z-30 transition-opacity"}>
          <div className="absolute inset-0 bg-gray-500 opacity-75" />

          <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />
        </div>
      )}
      <div className="flex md:flex-row md:space-x-1">
        <div className="hidden sm:w-3/12 h-10 md:block  ">
          <Sider />{" "}
        </div>
        <div className="flex w-11/12 flex-col">
          <BreadCrumb
            className={"bread-crumb pl-4 sm:pl-0 ml-5 text-sm"}
            model={items}
          />
          <div className="px-4 sm:px-2">
            <p className=" sm:mt-0 mb-2 sm:mb-0 sm:ml-0 h-policies font-bold text-lg md:text-lg">
              Change Beneficiary
            </p>
          </div>
        </div>
        <div className=" w-0 sm:w-2/6 flex flex-col justify-end mt-0">
          <div className="hidden sm:flex self-end mt-4  ">
            <img
              onClick={redirect}
              className=" cursor-pointer inline mb-5 ml-5 "
              src={IMAGE_PATHS.BACK_ARROW}
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <Card header={header} className="change-ben-card space-y-0 sm:p-0">
          <Panel className="bene-panel">
            <div className="flex flex-col justify-start ml-2 sm:ml-0 p-2 sm:p-0">
              <div className="font-normal text-sm text-orange">
                After making all the changes to the beneficiaries, you need to
                sign below to save changes to the policy.
              </div>
            </div>
            <div className="flex flex-row justify-between sm:space-x-35 p-3 sm:p-0 sm:mt-3">
              <div className="font-bold ml-0 sm:ml-0 text-sm sm:text-md text-blue-800">
                Primary Beneficiary
              </div>
              <div className="flex flex-row justify-end w-3/3 sm:w-1/3">
                <div onClick={postDataPrimary} className="cursor-pointer ">
                  <img
                    className="inline h-5 pr-3 sm:pr-5 mt-1 cursor-pointer"
                    src={IMAGE_PATHS.EDIT_PENCIL_ICON}
                  />
                </div>
                <div onClick={deletePrimary} className="cursor-pointer ">
                  <img
                    className="inline h-5 pr-3 sm:pr-5 cursor-pointer"
                    src={IMAGE_PATHS.DELETE_BIG}
                  />
                </div>
                <div onClick={addPrimary} className="cursor-pointer borderleft">
                  <img
                    className="inline h-5 pl-2 sm:pl-8 pr-1 sm:pr-0"
                    src={IMAGE_PATHS.ADD_ICON}
                  />
                  <Label className="cursor-pointer text-sm sm:text-md font-bold text-blue-800 p-1">
                    Add New
                  </Label>
                </div>
              </div>
            </div>

            <div className="hidden sm:block">
              <DataTable
                value={benefi}
                className="
              mt-2 "
                selection={primary1}
                showGridlines
                onSelectionChange={e => setPrimary1(e.value)}
                responsiveLayout="scroll"
              >
                <Column
                  selectionMode="single"
                  className="font-bold text-align-centre text-sm sm:text-md w-1/12 sm:"
                  header="Select"
                ></Column>

                <Column
                  field="beneFullName"
                  className=" font-bold text-sm text-left sm:text-md w-3/12 sm:"
                  header="Full Name"
                ></Column>

                <Column
                  field="beneRelationOwner"
                  className="font-bold text-sm text-align-centre sm:text-md w-3/12 sm: "
                  header="Relationship"
                ></Column>

                <Column
                  field="beneSharingPercent"
                  className="font-bold text-sm text-align-centre sm:text-md "
                  header="Percentage"
                ></Column>

                <Column
                  field="beneIrrevocable"
                  className="font-bold text-align-centre text-sm sm:text-md "
                  header="Irrevocable"
                  hidden={header === "Yes" ? true : false}
                ></Column>
              </DataTable>
            </div>

            <div className="block sm:hidden">
              <RowMobile
                value={benefi}
                setSelected={e => setPrimary1(e.value)}
              />
            </div>

            
          </Panel>
          <Panel className="bene-panel">
            <div className="flex flex-row justify-between sm:space-x-35 p-3 sm:p-0 mt-3">
              <div className="font-bold ml-0 sm:ml-0 text-sm sm:text-md text-blue-800">
                Contingent Beneficiary
              </div>
              <div>
                <div className="flex flex-row justify-end pr-1 sm:pr-0  w-3/3   ">
                  <div onClick={postDataContingent} className="cursor-pointer ">
                    <img
                      className="inline h-5 pr-3 sm:pr-5 mt-1 cursor-pointer "
                      src={IMAGE_PATHS.EDIT_PENCIL_ICON}
                    />
                  </div>
                  <div onClick={deleteContigent} className="cursor-pointer ">
                    <img
                      className="inline h-5 pr-3 sm:pr-5 cursor-pointer"
                      src={IMAGE_PATHS.DELETE_BIG}
                    />
                  </div>
                  <div
                    onClick={addContingent}
                    className="cursor-pointer borderleft"
                  >
                    <img
                      className="inline h-5 pl-2 sm:pl-8 pr-1 sm:pr-0"
                      src={IMAGE_PATHS.ADD_ICON}
                    />
                    <Label className="cursor-pointer text-sm sm:text-md font-bold text-blue-800 p-0 sm:p-1">
                      Add New
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block">
              <DataTable
                value={cont}
                className="mt-2 "
               

                selection={contingent1}
                showGridlines
                onSelectionChange={e => setContingent1(e.value)}
              
                responsiveLayout="scroll"
              >
                <Column
                  selectionMode="single"
                  header="Select"
                  className="font-bold text-sm sm:text-md text-align-centre  w-1/12 sm:"
                  
                ></Column>

                <Column
                  field="beneFullName"
                  className=" font-bold text-sm sm:text-md w-3/12 sm:"
                  header="Full Name"
                ></Column>

                <Column
                  field="beneRelationOwner"
                  className="font-bold text-sm sm:text-md text-align-centre w-3/12 sm:"
                  header="Relationship"
                ></Column>

                <Column
                  field="beneSharingPercent"
                  className="font-bold text-sm text-align-centre sm:text-md "
                  header="Percentage"
                ></Column>

                <Column
                  field="beneIrrevocable"
                  className="font-bold text-sm text-align-centre sm:text-md "
                  header="Irrevocable"
                ></Column>
              </DataTable>
            </div>

            <div className="block sm:hidden">
              <RowMobile
                value={cont}
                setSelected={e => setContingent1(e.value)}
              />
            </div>
          </Panel>
        </Card>
      </div>
      {show && (
        <ModalPopUp showsModal={true} title={title} closeModal={closeModal1} />
      )}
      {showdelete && (
        <ModalPopUp
          showsModal={true}
          title={titledelete}
          closeModal={closeDelete}
        />
      )}
      {showdelete1 && (
        <ConfirmDeletePercentSharing
          showsModal={true}
          id={id}
          logout={true}
          action={false}
          primaryname={primaryname}
          contingentname={contingentname}
          openPercent={openPercent}
          closeModal={closeDelete1}
        />
      )}
      {cancel && (
        <ConfirmDeletePercentSharing
          showsModal={true}
          action={true}
          id={id}
          logout={true}
          closeModal={closecancel}
        />
      )}
      {showpercent && (
        <DeletePercentSharing
          showsModal={true}
          deletePercent={true}
          confirmopen={confirmopen}
          benetype={benetype}
          deletelast={deletelast}
          benelocator={benelocator}
          id={id}
          closeModal={closePercent}
        />
      )}
      {/* {warn && (
        <ModalPopUp
          showsModal={true}
          title={titlewarn}
          closeModal={warnclose}
        />
      )} */}
      {addopen && (
        <ModalPopUp showsModal={true} title={titleadd} closeModal={addclose} />
      )}
      {showdelete2 && (
        <ConfirmContingentDelete
          showsModal={true}
          logout={true}
          primaryname={primaryname}
          contingentname={contingentname}
          openPopUp={confirmopen1}
          closeModal={closeDelete2}
        />
      )}
      {deleteopen && (
        <ModalPopUp
          showsModal={true}
          id={id}
          title={titleconfirm}
          closeModal={confirmclose}
        />
      )}
      <Flex className="bottom borderTop flex-col-reverse md:flex-row items-center justify-center space-y-3 sm:justify-between   pl-0 sm:pl-55   mt-5 mb-5 h-15 pt-5 sm:pt-0">
        <Button
          type="button"
          onClick={redirect}
          className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm  w-5/6 my-5 mt-5 sm:mt-8 ml-0 sm:ml-0 sm:w-1/6"
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={endorsement}
          className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
        >
          Continue to E-Sign
        </Button>
      </Flex>
    </>
  );
};

export default withAuthentication(changebeneficiary);
