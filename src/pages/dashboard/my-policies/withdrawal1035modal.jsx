import { Modal } from "@components/modal";
import { useEffect, useState, Fragment } from "react";
import { Button } from "@components/forms";
import { Label } from "@components/forms";
import { Card } from "primereact/card";
import { Container, Grid } from "@components/layout";
import { Flex } from "@components/layout";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/router";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import {
  Url,
  authUrl,
  authOptions,
  updatePolicy,
  update,
  auxDataUrl
} from "../../../constants/apiconstant";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import * as Yup from "yup";
import { NotificationType, useNotification } from "@context/notification";
import { NextLink } from "@components/next-link/next-link";

export function Withdrawal1035modal({ showsModal, closeModal }) {
  const { addNotification } = useNotification();
  const router = useRouter();
  const [close, setClose] = useState(false);

  async function handleDownload() {
       const send = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    await fetch(Url + auxDataUrl + "staticDocumentLocation/1035Form", {
      method: "GET",

      headers: {
        Authorization: send.authorizationToken,
        "Content-Type": "application/json",
        // "Content-Disposition": "attachment",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        window.open(data.value, "_blank");
        // download(data.value, "1035Form");
      })
      .catch(error => {
        console.log("Error:", error);
      });

    // await fetch(Url + auxDataUrl + "staticDocumentLocation/1035Instructions", {
    //   method: "GET",

    //   headers: {
    //     Authorization: send.authorizationToken,
    //     "Content-Type": "application/json",
    //     // "Content-Disposition": "attachment",
    //     Accept: "application/json"
    //   }
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     // download(data.value, "1035Instructions");
    //     window.open(data.value, "_blank");
    //   })
    //   .catch(error => {
    //     console.log("Error:", error);
    //   });
  }

  function download(fileUrl, fileName) {
    var a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.click();
  }

  const title = (
    <h2 className="p-1 quotecolor bg-blue-900 text-white p-7 font-bold sub-font-size sm:text-xl">
      1035 Transfer
    </h2>
  );

  return (
    <>
      <Modal
        title={title}
        showsModal={showsModal}
        percent={true}
        body={
          <Flex className=" flex-col x-12 mt-5 w-full ">
            <label className="  text-sm mb-5 mx-6 text-left text-gray-800">
              The values are for informational purpose only. To process
              withdrawal, please download 1035 Instructions and form and send it
              to your carrier.
            </label>

            <div className="flex flex-col">
              <label
                className=" text-sm font-semibold download"
                onClick={() => handleDownload()}
              >
                Download 1035 Instructions and Form here
              </label>
            </div>
            <Flex className=" ps-modal">
              <Container className="w-full flex justify-center">
                <Button
                  className="w-32 sm:w-32  btn-cancel text-blue-500 border-blue-500"
                  type="button"
                  onClick={closeModal}
                >
                  OK
                </Button>
              </Container>
            </Flex>
          </Flex>
        }
      />
    </>
  );
}
