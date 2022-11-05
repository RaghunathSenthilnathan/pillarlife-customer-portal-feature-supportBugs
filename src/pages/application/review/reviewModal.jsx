import { useState } from "react";
import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { ProgressSpinner } from "primereact/progressspinner";
import router from "next/router";
import { v4 as uuidv4 } from "uuid";
import {
  pandaDoc,
  SendDoc,
  Url,
  policies,
  auxDataUrl,
  updatePolicy,
  quotes,
  update,
} from "../../../constants/apiconstant";
export function ReviewModal({ showsModal, closeModal, cancelModal, value }) {
  const [loader, setLoader] = useState(false);
  async function handleClick() {
    closeModal();
    setLoader(true);
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const pl = sessionStorage.getItem("policyLocator");
    var updateData = {
      fieldValues: {
        esignatureStatus: "Started"
      }
    };
    await fetch(Url + updatePolicy + pl + update, {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(updateData)
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("esignature_started", "true");
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
    await fetch(Url + policies + "/" + pl + quotes, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem("ql", data[0].locator);
        quotePrice(data[0].locator);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  async function quotePrice(ql) {
    const pl = sessionStorage.getItem("policyLocator");
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + quotes + "/" + ql + "/quote", {
      method: "PATCH",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {})
      .catch(error => {
        console.log("Error:", error);
      });

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
        createDocument(data);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  async function createDocument(values) {
    let url = values.documents[0].url;
    const pl = sessionStorage.getItem("policyLocator");
    const uuid = uuidv4();
     const trusteemid= values && values.characteristics[0].fieldValues.trusteeName
              &&values.characteristics[0].fieldValues.trusteeName[0].split(" ")
              var trustmiddleName=[]
       if(trusteemid){

             for (let i=1;i<trusteemid.length;i++){
trustmiddleName.push(trusteemid[i])
     
                  }
                     }
                     if(trustmiddleName.length>0){
                    trustmiddleName=  trustmiddleName.join(" ")
                     }
    const body = {
      name: "application form",
      url: url,
      recipients: [],
      fields: {},
      metadata: {
        locator_id: pl,
         app_id:  process.env.NEXT_PUBLIC_APP_ID,
        tran_type_cd: "NB",
        tran_cd: uuid
      },
      tags: ["Application Annuity", "Document Signing"],
      parse_form_fields: false
    };
    values &&
      values.characteristics[0].fieldValues.primaryOwnerEmail &&
      values &&
      !values.characteristics[0].fieldValues.jointOwnerEmail &&
      body.recipients.push({
        email:
          values && values.characteristics[0].fieldValues.primaryOwnerEmail[0],
        first_name:
          values &&
          values.characteristics[0].fieldValues.primaryOwnerFirstname[0],
        last_name:
          values &&
          values.characteristics[0].fieldValues.primaryOwnerLastname[0],
        role: "primaryOwner"
      });
    values &&
      values.characteristics[0].fieldValues.primaryOwnerEmail &&
      values &&
      !values.characteristics[0].fieldValues.jointOwnerEmail &&
      values &&
      values.exposures &&
      values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0] !==
        values.characteristics[0].fieldValues.primaryOwnerEmail[0] &&
      body.recipients.push({
        email:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0],
        first_name:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantFirstname[0],
        last_name:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantLastname[0],
        role: "annuitant"
      });
    values &&
      values.characteristics[0].fieldValues.jointOwnerEmail &&
      body.recipients.push(
        {
          email:
            values &&
            values.characteristics[0].fieldValues.primaryOwnerEmail[0],
          first_name:
            values &&
            values.characteristics[0].fieldValues.primaryOwnerFirstname[0],
          last_name:
            values &&
            values.characteristics[0].fieldValues.primaryOwnerLastname[0],
          role: "primaryOwner"
        },
        {
          email:
            values && values.characteristics[0].fieldValues.jointOwnerEmail[0],
          first_name:
            values &&
            values.characteristics[0].fieldValues.jointOwnerFirstname[0],
          last_name:
            values &&
            values.characteristics[0].fieldValues.jointOwnerLastname[0],
          role: "jointOwner"
        }
      );
    values &&
      values.characteristics[0].fieldValues.jointOwnerEmail &&
      values &&
      values.exposures &&
      values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0] !==
        values.characteristics[0].fieldValues.primaryOwnerEmail[0] &&
      values &&
      values.exposures &&
      values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0] !==
        values.characteristics[0].fieldValues.jointOwnerEmail[0] &&
      body.recipients.push({
        email:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0],
        first_name:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantFirstname[0],
        last_name:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantLastname[0],
        role: "annuitant"
      });
    values &&
      values.characteristics[0].fieldValues.trustEmail &&
      body.recipients.push(
        {
          email: values && values.characteristics[0].fieldValues.trustEmail[0],
          first_name:
            values &&
            values.characteristics[0].fieldValues.trusteeName[0].split(" ")[0],
          last_name:trustmiddleName,
          role: "trustee"
        },
        {
          email:
            values &&
            values.exposures &&
            values.exposures[0].characteristics[0].fieldValues
              .annuitantEmail[0],
          first_name:
            values &&
            values.exposures &&
            values.exposures[0].characteristics[0].fieldValues
              .annuitantFirstname[0],
          last_name:
            values &&
            values.exposures &&
            values.exposures[0].characteristics[0].fieldValues
              .annuitantLastname[0],
          role: "annuitant"
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
        sessionStorage.setItem("docId", data.uuid);
        setTimeout(() => documentStatus(data.uuid, values, uuid), 8000);
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
  }
  async function documentStatus(docId, values, uuid) {
    const pl = sessionStorage.getItem("policyLocator");
    const jwt_key = sessionStorage.getItem("userName");
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );
    const sentMail = [];
       const trusteemid= values && values.characteristics[0].fieldValues.trusteeName
              &&values.characteristics[0].fieldValues.trusteeName[0].split(" ")
              var trustmiddleName=[]
       if(trusteemid){

             for (let i=1;i<trusteemid.length;i++){
trustmiddleName.push(trusteemid[i])
     
                  }
                     }
                     if(trustmiddleName.length>0){
                    trustmiddleName=  trustmiddleName.join(" ")
                     }
    values &&
      values.characteristics[0].fieldValues.primaryOwnerEmail &&
      values &&
      !values.characteristics[0].fieldValues.jointOwnerEmail &&
      sentMail.push({
      app_id:  process.env.NEXT_PUBLIC_APP_ID,
        notification_type_cd: "E",
        email_id:
          values && values.characteristics[0].fieldValues.primaryOwnerEmail[0],
        first_nm:
          values &&
          values.characteristics[0].fieldValues.primaryOwnerFirstname[0],
        last_nm:
          values &&
          values.characteristics[0].fieldValues.primaryOwnerLastname[0],
        phone_num:
          values && values.characteristics[0].fieldValues.primaryOwnerPhone[0],
        locator_id: pl,
        send_order: 1,
        metadata: {
          docId: docId,
          role: "Primary owner",
          tran_type_cd: "NB",
          tran_cd: uuid,
           end_locator_id:"0",
        },
        end_locator_id:"0",
        tran_cd: uuid,
        tran_type_cd: "NB",
        send_status_cd: "N",
        sign_status_cd: "N",
        send_retry_count: 1
      });
    values &&
      values.characteristics[0].fieldValues.primaryOwnerEmail &&
      values &&
      !values.characteristics[0].fieldValues.jointOwnerEmail &&
      values &&
      values.exposures &&
      values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0] !==
        values.characteristics[0].fieldValues.primaryOwnerEmail[0] &&
      sentMail.push({
      app_id:  process.env.NEXT_PUBLIC_APP_ID,
        notification_type_cd: "E",
        email_id:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0],
        first_nm:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantFirstname[0],
        last_nm:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantLastname[0],
        phone_num:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues.annuitantPhone[0],
        locator_id: pl,
        send_order: 2,
        metadata: {
          docId: docId,
          role: "Annuitant",
          tran_type_cd: "NB",
          tran_cd: uuid,
           end_locator_id:"0",
        },
        tran_cd: uuid,
        end_locator_id:"0",
        tran_type_cd: "NB",
        send_status_cd: "N",
        sign_status_cd: "N",
        send_retry_count: 1
      });
    values &&
      values.characteristics[0].fieldValues.jointOwnerEmail &&
      sentMail.push(
        {
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            values &&
            values.characteristics[0].fieldValues.primaryOwnerEmail[0],
          first_nm:
            values &&
            values.characteristics[0].fieldValues.primaryOwnerFirstname[0],
          last_nm:
            values &&
            values.characteristics[0].fieldValues.primaryOwnerLastname[0],
          phone_num:
            values &&
            values.characteristics[0].fieldValues.primaryOwnerPhone[0],
          locator_id: pl,
          send_order: 1,
          metadata: {
            docId: docId,
            role: "Primary owner",
            tran_type_cd: "NB",
            tran_cd: uuid,
             end_locator_id:"0",
          },
          tran_cd: uuid,
          end_locator_id:"0",
          tran_type_cd: "NB",
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1
        },
        {
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            values && values.characteristics[0].fieldValues.jointOwnerEmail[0],
          first_nm:
            values &&
            values.characteristics[0].fieldValues.jointOwnerFirstname[0],
          last_nm:
            values &&
            values.characteristics[0].fieldValues.jointOwnerLastname[0],
          phone_num:
            values && values.characteristics[0].fieldValues.jointOwnerPhone[0],
          locator_id: pl,
          send_order: 2,
          metadata: {
            docId: docId,
            role: "Joint owner",
            tran_type_cd: "NB",
            tran_cd: uuid,
             end_locator_id:"0",
          },
          tran_cd: uuid,
          end_locator_id:"0",
          tran_type_cd: "NB",
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1
        }
      );
    values &&
      values.characteristics[0].fieldValues.jointOwnerEmail &&
      values &&
      values.exposures &&
      values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0] !==
        values.characteristics[0].fieldValues.primaryOwnerEmail[0] &&
      values &&
      values.exposures &&
      values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0] !==
        values.characteristics[0].fieldValues.jointOwnerEmail[0] &&
      sentMail.push({
      app_id:  process.env.NEXT_PUBLIC_APP_ID,
        notification_type_cd: "E",
        email_id:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues.annuitantEmail[0],
        first_nm:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantFirstname[0],
        last_nm:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues
            .annuitantLastname[0],
        phone_num:
          values &&
          values.exposures &&
          values.exposures[0].characteristics[0].fieldValues.annuitantPhone[0],
        locator_id: pl,
        send_order: 3,
        metadata: {
          docId: docId,
          role: "Annuitant",
          tran_type_cd: "NB",
          tran_cd: uuid,
           end_locator_id:"0",
        },
        tran_cd: uuid,
        end_locator_id:"0",
        tran_type_cd: "NB",
        send_status_cd: "N",
        sign_status_cd: "N",
        send_retry_count: 1
      });
    values &&
      values.characteristics[0].fieldValues.trustEmail &&
      sentMail.push(
        {
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            values && values.characteristics[0].fieldValues.trustEmail[0],
          first_nm:
            values &&
            values.characteristics[0].fieldValues.trusteeName[0].split(" ")[0],
          last_nm:trustmiddleName,
          phone_num:
            values && values.characteristics[0].fieldValues.trustPhone[0],
          locator_id: pl,
          send_order: 1,
          metadata: {
            docId: docId,
            role: "Trustee",
            tran_type_cd: "NB",
            tran_cd: uuid,
            end_locator_id:"0",
          },
          tran_cd: uuid,
          end_locator_id:"0",
          tran_type_cd: "NB",
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1
        },
        {
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            values &&
            values.exposures &&
            values.exposures[0].characteristics[0].fieldValues
              .annuitantEmail[0],
          first_nm:
            values &&
            values.exposures &&
            values.exposures[0].characteristics[0].fieldValues
              .annuitantFirstname[0],
          last_nm:
            values &&
            values.exposures &&
            values.exposures[0].characteristics[0].fieldValues
              .annuitantLastname[0],
          phone_num:
            values &&
            values.exposures &&
            values.exposures[0].characteristics[0].fieldValues
              .annuitantPhone[0],
          locator_id: pl,
          send_order: 2,
          metadata: {
            docId: docId,
            role: "Annuitant",
            tran_type_cd: "NB",
            tran_cd: uuid,
            end_locator_id:"0",
          },
          tran_cd: uuid,
          end_locator_id:"0",
          tran_type_cd: "NB",
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
            values.characteristics[0].fieldValues.primaryOwnerEmail[0]
          ) {
            sessionStorage.setItem("sentId", o.notification_id);
          }
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });

      var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    const status = {
      auxData: {
        key: "applicationForm",
        value: docId
      }
    };

    await fetch(Url + auxDataUrl + pl, {
      method: "PUT",
      body: JSON.stringify(status),

      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(data => {
        setTimeout(() => Docstatus(docId), 3000);
      })
      .catch(error => {
        console.log("Error:", error);
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
        newQuote();
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
  }
  async function newQuote() {
    const ql = sessionStorage.getItem("ql");
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + quotes + "/" + ql + "/createNew", {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        discard();
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
    await fetch(Url + quotes + "/" + ql + "/discard", {
      method: "PATCH",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        router.push("/application/sign");
      })
      .catch(errors => {
        console.log("Error:", errors);
      });
  }
  const title = (
    <Container className="text-left text-blue-900  text-lg font-bold">
      Are you sure you want to continue to sign?
    </Container>
  );
  return (
    <div>
      {loader && (
        <div className={"block fixed inset-0 z-30 transition-opacity"}>
          <div className="absolute inset-0 bg-gray-500 opacity-75" />

          <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />
        </div>
      )}
      <Modal
        title={title}
        // description={

        // }
        logout={true}
        showsModal={showsModal}
        body={
          <div>
            <div className="text-left mt-3 mx-0 text-gray-500 font-bold">
              You will not be able to make any further changes to the
              application
            </div>
            <Flex className="items-center mt-10 justify-end">
              <Button
                className="w-3/6 btn-cancel text-blue-500 border-blue-500 font-bold"
                onClick={cancelModal}
              >
                No
              </Button>
              <Button
                className="w-3/6 btncolor ml-10 font-bold"
                onClick={handleClick}
              >
                Yes
              </Button>
            </Flex>
          </div>
        }
      />
    </div>
  );
}
