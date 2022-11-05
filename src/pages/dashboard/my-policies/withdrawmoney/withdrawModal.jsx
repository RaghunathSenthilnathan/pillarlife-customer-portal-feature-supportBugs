import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { useRouter } from "next/router";
import { useNotification } from "@context/notification";
import { pandaDoc, SendDoc } from "../../../../constants/apiconstant";
import { v4 as uuidv4 } from "uuid";
export function WithdrawModal({
  value,
  showsModal,
  closeModal,
  polValue,
  link,
}) {
  const router = useRouter();
  const { query } = router;
  const { addNotification } = useNotification();
  async function handleClick() {
    const pl = sessionStorage.getItem("policyLocator");
      const withDrawlocator=  sessionStorage.getItem("withDrawlocator")
    closeModal();
    let url = link;
    const uuid = uuidv4();
    const body = {
      name: "application form",
      url: url,
      recipients: [],
      fields: {},
      metadata: {
        locator_id: pl,
        app_Id:  process.env.NEXT_PUBLIC_APP_ID,
        tran_type_cd: "WD",
        tran_cd: uuid,
        endorsementlocator:withDrawlocator,
          endorsementName: "Withdrawal"

      },
      tags: ["created_via_api", "test_document"],
      parse_form_fields: false,
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
      polValue.characteristics[0].fieldValues.primaryOwnerEmail &&
      polValue &&
      !polValue.characteristics[0].fieldValues.jointOwnerEmail &&
      body.recipients.push({
        email:
          polValue &&
          polValue.characteristics[0].fieldValues.primaryOwnerEmail[0],
        first_name:
          polValue &&
          polValue.characteristics[0].fieldValues.primaryOwnerFirstname[0],
        last_name:
          polValue &&
          polValue.characteristics[0].fieldValues.primaryOwnerLastname[0],
        role: "primaryOwner",
      });
    polValue &&
      polValue.characteristics[0].fieldValues.jointOwnerEmail &&
      body.recipients.push(
        {
          email:
            polValue &&
            polValue.characteristics[0].fieldValues.primaryOwnerEmail[0],
          first_name:
            polValue &&
            polValue.characteristics[0].fieldValues.primaryOwnerFirstname[0],
          last_name:
            polValue &&
            polValue.characteristics[0].fieldValues.primaryOwnerLastname[0],
          role: "primaryOwner",
        },
        {
          email:
            polValue &&
            polValue.characteristics[0].fieldValues.jointOwnerEmail[0],
          first_name:
            polValue &&
            polValue.characteristics[0].fieldValues.jointOwnerFirstname[0],
          last_name:
            polValue &&
            polValue.characteristics[0].fieldValues.jointOwnerLastname[0],
          role: "jointOwner",
        }
      );
    polValue &&
      polValue.characteristics[0].fieldValues.trustEmail &&
      body.recipients.push(
        {
          email:
            polValue && polValue.characteristics[0].fieldValues.trustEmail[0],
          first_name:
            polValue &&
            polValue.characteristics[0].fieldValues.trusteeName[0].split(
              " "
            )[0],
          last_name:trustmiddleName,
          role: "trustee",
        }
        // {
        //   email:
        //     polValue &&
        //     polValue.exposures &&
        //     polValue.exposures[0].characteristics[0].fieldValues
        //       .annuitantEmail[0],
        //   first_name:
        //     polValue &&
        //     polValue.exposures &&
        //     polValue.exposures[0].characteristics[0].fieldValues
        //       .annuitantFirstname[0],
        //   last_name:
        //     polValue &&
        //     polValue.exposures &&
        //     polValue.exposures[0].characteristics[0].fieldValues
        //       .annuitantLastname[0],
        //   role: "annuitant"
        // }
      );
    await fetch(pandaDoc, {
      method: "POST",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        // "Content-Disposition": "form-data", "name":"data",
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem("withdrawId", data.uuid);
        setTimeout(() => documentStatus(data.uuid, uuid), 3000);
      })
      .catch((errors) => {
        console.log("Error:", errors);
      });
  }
  async function documentStatus(docId, uuid) {
    const pl = sessionStorage.getItem("policyLocator");
    const jwt_key = sessionStorage.getItem("userName");
        const withDrawlocator=  sessionStorage.getItem("withDrawlocator")
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );

    const sentMail = [];
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
      polValue.characteristics[0].fieldValues.primaryOwnerEmail &&
      polValue &&
      !polValue.characteristics[0].fieldValues.jointOwnerEmail &&
      sentMail.push({
        app_id:  process.env.NEXT_PUBLIC_APP_ID,
        notification_type_cd: "E",
        email_id:
          polValue &&
          polValue.characteristics[0].fieldValues.primaryOwnerEmail[0],
        first_nm:
          polValue &&
          polValue.characteristics[0].fieldValues.primaryOwnerFirstname[0],
        last_nm:
          polValue &&
          polValue.characteristics[0].fieldValues.primaryOwnerLastname[0],
        phone_num:
          polValue &&
          polValue.characteristics[0].fieldValues.primaryOwnerPhone[0],
        locator_id: pl,
        send_order: 1,
        metadata: {
          docId: docId,
          role: "Primary owner",
            locator_id: pl,
          tran_type_cd: "WD",
          tran_cd: uuid,
           endorsementlocator:withDrawlocator,
          endorsementName: "Withdrawal"
        },
        tran_type_cd: "WD",
        tran_cd: uuid,
        end_locator_id:withDrawlocator,
        send_status_cd: "N",
        sign_status_cd: "N",
        send_retry_count: 1,
      });
    
    polValue &&
      polValue.characteristics[0].fieldValues.jointOwnerEmail &&
      sentMail.push(
        {
          app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            polValue &&
            polValue.characteristics[0].fieldValues.primaryOwnerEmail[0],
          first_nm:
            polValue &&
            polValue.characteristics[0].fieldValues.primaryOwnerFirstname[0],
          last_nm:
            polValue &&
            polValue.characteristics[0].fieldValues.primaryOwnerLastname[0],
          phone_num:
            polValue &&
            polValue.characteristics[0].fieldValues.primaryOwnerPhone[0],
          locator_id: pl,
          send_order: 1,
          metadata: {
            docId: docId,
            role: "Primary owner",
            tran_type_cd: "WD",
              locator_id: pl,
            tran_cd: uuid,
             endorsementlocator:withDrawlocator,
          endorsementName: "Withdrawal"

          },
          tran_type_cd: "WD",
          tran_cd: uuid,
            end_locator_id:withDrawlocator,
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1,
        },
        {
          app_id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            polValue &&
            polValue.characteristics[0].fieldValues.jointOwnerEmail[0],
          first_nm:
            polValue &&
            polValue.characteristics[0].fieldValues.jointOwnerFirstname[0],
          last_nm:
            polValue &&
            polValue.characteristics[0].fieldValues.jointOwnerLastname[0],
          phone_num:
            polValue &&
            polValue.characteristics[0].fieldValues.jointOwnerPhone[0],
          locator_id: pl,
          send_order: 2,
          metadata: {
            docId: docId,
            role: "Joint owner",
            tran_type_cd: "WD",
            tran_cd: uuid,
              locator_id: pl,
             endorsementlocator:withDrawlocator,
          endorsementName: "Withdrawal"
          },
          tran_type_cd: "WD",
          tran_cd: uuid,
            end_locator_id:withDrawlocator,
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1,
        }
      );
    
    polValue &&
      polValue.characteristics[0].fieldValues.trustEmail &&
      sentMail.push(
        {
        app_Id:  process.env.NEXT_PUBLIC_APP_ID,
          notification_type_cd: "E",
          email_id:
            polValue && polValue.characteristics[0].fieldValues.trustEmail[0],
          first_nm:
            polValue &&
            polValue.characteristics[0].fieldValues.trusteeName[0].split(
              " "
            )[0],
          last_nm:trustmiddleName,
          phone_num:
            polValue && polValue.characteristics[0].fieldValues.trustPhone[0],
          locator_id: pl,
          send_order: 1,
          metadata: {
            docId: docId,
            role: "Trustee",
            tran_type_cd: "WD",
            tran_cd: uuid,
              locator_id: pl,
             endorsementlocator:withDrawlocator,
          endorsementName: "Withdrawal"
          },
          tran_type_cd: "WD",
          tran_cd: uuid,
            end_locator_id:withDrawlocator,
          send_status_cd: "N",
          sign_status_cd: "N",
          send_retry_count: 1,
        }
        // {
        //   "app_id": "1",
        //   "notification_type_cd":"E",
        //   "email_id":polValue && polValue.exposures&&polValue.exposures[0].characteristics[0].fieldValues.annuitantEmail[0],
        //   "first_nm": polValue && polValue.exposures&&polValue.exposures[0].characteristics[0].fieldValues.annuitantFirstname[0],
        //   "last_nm": polValue && polValue.exposures&&polValue.exposures[0].characteristics[0].fieldValues.annuitantLastname[0],
        //    "phone_num":polValue && polValue.exposures&&polValue.exposures[0].characteristics[0].fieldValues.annuitantPhone[0],
        //    "locator_id": pl,
        //   "send_order": 2,
        //   "metadata": {
        //     "docId":docId,
        //     "role":"Annuitant"
        //   },

        //   "send_status_cd": "N",
        //   "sign_status_cd": "N",
        //   "send_retry_count": 1

        // }
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
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data.map((o) => {
          if (
            o.email_id ===
            polValue.characteristics[0].fieldValues.primaryOwnerEmail[0]
          ) {
            sessionStorage.setItem("sentId", o.notification_id);
          }
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    await fetch(SendDoc + docId, {
      method: "GET",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        "Content-Type": "application/JSON",
      },
      // body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem("docId", data.id);
         setTimeout(() =>Docstatus(data.id), 3000);
      })
      .catch((errors) => {
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
      silent: true,
    };

    await fetch(SendDoc + docId + "/send", {
      method: "POST",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PANDADOC_API,
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        router.push(`withdrawmoney/esign`);
      })
      .catch((errors) => {
        console.log("Error:", errors);
      });
  }

  function handleCancelbtn() {
    closeModal();
  }
  return (
    <Modal
      title={
        value === "ACH"
          ? "Are you sure you want to navigate to Esign?"
          : value === "Check"
          ? "Are you sure you want to navigate to Esign?"
          : ""
      }
      showsModal={showsModal}
      body={
        <Flex className=" ps-modal">
          <Container className="w-full flex">
            <Button
              className="w-32 sm:w-40  btn-cancel text-blue-500 border-blue-500"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className="w-32 sm:w-40 ml-7 sm:ml-32 btncolor"
              type="button"
              onClick={handleClick}
            >
              OK
            </Button>
          </Container>
        </Flex>
      }
    />
  );
}
