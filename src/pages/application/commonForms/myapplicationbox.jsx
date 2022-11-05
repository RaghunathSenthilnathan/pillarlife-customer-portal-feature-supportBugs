import { useEffect, useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Button } from 'primereact/button';
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import moment from "moment";
import { Tag } from "primereact/tag";
import { DeleteAppModal } from "../../dashboard/my-applications/deleteAppModal";
import {
  Url,
  auxDataUrl,
  discard,
  lambda
} from "../../../constants/apiconstant";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "myapplicationbox";
const description =
  "Enables you to resend the registration activation link to your email address.";

const myapplicationbox = value => {
  const [val, setValue] = useState();
  const [show, setshowModal] = useState(false);
  const [deleteDraft, setDeleteDraft] = useState(false);
  const [data, setData] = useState();
  const [id, setId] = useState();
  const [deleteLocator, setDeleteLocator] = useState();
  const [confirm, setConfirm] = useState();
  const [quotedata, setQuotedata] = useState();
  const [check, setCheck] = useState(true);
  const closeModal = useCallback(() => {
    setshowModal(false);
    setConfirm(false);
  }, []);
  const setModal = useCallback(() => {
    setshowModal(false);
    setConfirm(true);
  }, []);

  const router = useRouter();
  let sortedData = [];
  useEffect( () => {
    console.log(value.result,"success")
    setValue(value.result);
    value &&
      value.result?.map(o => {
        postDataDisplay(o);
      });
  }, [value]);

  useEffect(() => {
    dataSort();
    setData(sortedData);
  }, [val]);

  useEffect(() => {
    hideCard();
  }, [confirm]);

  const dataSort = () => {
    sortedData = val?.sort(function(a, b) {
      return (
        new Date(b.characteristics[b.characteristics.length-1].fieldValues.polEffDate) -
        new Date(a.characteristics[a.characteristics.length-1].fieldValues.polEffDate)
      );
    });
  };

  const setClickData = (obj, index) => {
    setDeleteDraft(true);
    setId(index);
    setDeleteLocator(obj.locator);
    setshowModal(true);
  };

  const hideCard = () => {
    if (confirm === true) {
      discardPolicy(deleteLocator);
      let newData = [...data];
      newData.splice(id, 1);
      setData(newData);
      setConfirm(false);
    }
  };

  async function discardPolicy(locator) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const remove = await fetch(Url + "/policy/" + locator + discard, {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }


  async function postDataDisplay(pol) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    const body = {
      operation: "accountBalance",
      payload: {
        locator: pol.locator
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
        data = { ...data, For, premium };
        setQuotedata(data);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  async function handleRedirect(item) {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    let polLocator = item?.characteristics[0].policyLocator;
    await fetch(Url + auxDataUrl + polLocator + "/applicationForm", {
      method: "GET",

      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(datas => {
        sessionStorage.setItem("docId", datas.value);
      })
      .catch(error => {
        console.log("Error:", error);
      });
    const locator = { polLocator, check };
    if (item.characteristics[0].fieldValues.polStatus[0] === "Draft") {
      if (
        item.characteristics[0].fieldValues.appType[0] === "Individual" &&
        item.characteristics[0].fieldValues.esignatureStatus[0] ===
          "Not Started"
      ) {
        sessionStorage.setItem("policyLocator", item.locator);
        sessionStorage.setItem(
          "AL",
          item.exposures[0].characteristics[0].exposureLocator
        );
        router.push(
          { pathname: "/application/policyowner/youAlone", query: locator },
          "/application/policyowner/youAlone"
        );
      } else if (
        item.characteristics[0].fieldValues.appType[0] === "Individual" &&
        item.characteristics[0].fieldValues.esignatureStatus[0] != "Not Started"
      ) {
        sessionStorage.setItem("policyLocator", item.locator);
        sessionStorage.setItem(
          "AL",
          item.exposures[0].characteristics[0].exposureLocator
        );
        router.push(
          { pathname: "/application/review", query: locator },
          "/application/review"
        );
      } else if (
        item.characteristics[0].fieldValues.appType[0] === "Joint" &&
        item.characteristics[0].fieldValues.esignatureStatus[0] ===
          "Not Started"
      ) {
        sessionStorage.setItem("policyLocator", item.locator);
        sessionStorage.setItem(
          "AL",
          item.exposures[0].characteristics[0].exposureLocator
        );
        router.push(
          { pathname: "/application/policyowner/jointOwner", query: locator },
          "/application/policyowner/jointOwner"
        );
      } else if (
        item.characteristics[0].fieldValues.appType[0] === "Joint" &&
        item.characteristics[0].fieldValues.esignatureStatus[0] != "Not Started"
      ) {
        sessionStorage.setItem("policyLocator", item.locator);
        sessionStorage.setItem(
          "AL",
          item.exposures[0].characteristics[0].exposureLocator
        );
        router.push(
          { pathname: "/application/review", query: locator },
          "/application/review"
        );
      } else if (
        item.characteristics[0].fieldValues.appType[0] === "Trust" &&
        item.characteristics[0].fieldValues.esignatureStatus[0] ===
          "Not Started"
      ) {
        sessionStorage.setItem("policyLocator", item.locator);
        sessionStorage.setItem(
          "AL",
          item.exposures[0].characteristics[0].exposureLocator
        );
        router.push(
          { pathname: "/application/policyowner/trust", query: locator },
          "/application/policyowner/trust"
        );
      } else if (
        item.characteristics[0].fieldValues.appType[0] === "Trust" &&
        item.characteristics[0].fieldValues.esignatureStatus[0] != "Not Started"
      ) {
        sessionStorage.setItem("policyLocator", item.locator);
        sessionStorage.setItem(
          "AL",
          item.exposures[0].characteristics[0].exposureLocator
        );
        router.push(
          { pathname: "/application/review", query: locator },
          "/application/review"
        );
      }
    } else if (
      item.characteristics[0].fieldValues.polStatus[0] === "In Review" ||
      item.characteristics[0].fieldValues.polStatus[0] === "Declined" ||
      item.characteristics[0].fieldValues.polStatus[0] === "Approved"
    ) {
      router.push(
        {
          pathname: "/dashboard/my-applications/viewapplication",
          query: locator
        },
        "/dashboard/my-applications/viewapplication"
      );
    }
  }
  const handlePay=(item)=>{
sessionStorage.setItem("policyLocator", item.policyLocator);
 router.push({  pathname: "/application/payment",})
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
      {value.image == false && data && data.length < 1 && (
        <div className="flex flex-col justify-center items-center mt-40">
          <img
            className="flex w-10 items-center"
            src={IMAGE_PATHS.APPLICATION}
          />
          <span className="flex items-center mt-3 text-gray-500 text-sm">
            You have no submitted application
          </span>
        </div>
      )}
      {value.image == true && data && data.length < 1 && (
        <div className="flex flex-col justify-center items-center mt-40">
          <img
            className="flex w-10 items-center"
            src={IMAGE_PATHS.APPLICATION}
          />
          <span className="flex items-center mt-3 text-gray-500 text-sm">
            You have no incomplete application
          </span>
        </div>
      )}
      {data?.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col policy-display text-xs font-semibold text-black border-gray-200 rounded-md mb-4"
          >
            <div className="card p-4">
              <div className="flex flex-row space-x-5 divide-x-2 divide-transparent sm:divide-gray-300">
                <div className="flex flex-col space-y-2 sm:space-y-5 md:p-2 md: w-5/6   ">
                  <div className="flex flex-col">
                    <label className="pb-2">
                      Reference No.{" "}
                      <span className="font-bold text-sm text-blue-800">
                        {item.characteristics[0].policyLocator}
                      </span>
                    </label>

                    <label>Multi-Year Guaranteed Annuity</label>
                  </div>

                  <div className="flex flex-col ">
                    <div className="hidden sm:inline-block">
                      <label
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                            "In Review" ||
                          item.characteristics[0].fieldValues.polStatus[0] ===
                            "Declined"
                            ||
                             item.characteristics[0].fieldValues.polStatus[0] ===
                            "Approved"
                            ? "visible"
                            : "hidden"
                        } text-black md:text-gray-400`}
                      >
                        Submitted date{" "}
                        <span className="font-bold text-blue-800 ">
                          {moment(
                            item.characteristics[0].fieldValues.polEffDate[0]
                          ).format("MM-DD-YYYY")}
                        </span>
                      </label>
                    </div>
                    <div className="flex inline-block md:hidden flex-col">
                      <span
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                            "In Review" ||
                          item.characteristics[0].fieldValues.polStatus[0] ===
                            "Declined" ||
                             item.characteristics[0].fieldValues.polStatus[0] ===
                            "Approved"
                            ? "visible"
                            : "hidden"
                        } font-bold text-blue-800 `}
                      >
                        {moment(
                          item.characteristics[0].fieldValues.polEffDate[0]
                        ).format("MM-DD-YYYY")}
                      </span>
                      <label
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                            "In Review" ||
                          item.characteristics[0].fieldValues.polStatus[0] ===
                            "Declined"||
                            item.characteristics[0].fieldValues.polStatus[0] ===
                            "Approved"
                            ? "visible"
                            : "hidden"
                        } text-black md:text-gray-400`}
                      >
                        Submitted date{" "}
                      </label>
                    </div>
                    {item.characteristics[0].fieldValues.polStatus[0] !=
                      "Draft" && (
                      <div className="hidden sm:inline-block">
                        {/* <label className="text-black md:text-gray-400">
                          Created Date{" "}
                          <span className="font-bold text-blue-800 ">
                            {moment(
                              item.characteristics[0].fieldValues.polEffDate[0]
                            ).format("MM-DD-YYYY")}
                          </span>
                        </label> */}
                      </div>
                    )}
                    <div className="hidden sm:inline-block">
                      <label
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                          "Draft"
                            ? "visible"
                            : "hidden"
                        } text-black md:text-gray-400`}
                      >
                        Created Date{" "}
                        <span className="font-bold text-blue-800 ">
                          {moment(
                            item.characteristics[0].fieldValues.polEffDate[0]
                          ).format("MM-DD-YYYY")}
                        </span>
                      </label>
                    </div>
                    <div className="flex inline-block md:hidden flex-col">
                      <span
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                          "Draft"
                            ? "visible"
                            : "hidden"
                        } font-bold text-blue-800 `}
                      >
                        {moment(
                          item.characteristics[0].fieldValues.polEffDate[0]
                        ).format("MM-DD-YYYY")}
                      </span>
                      <label
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                          "Draft"
                            ? "visible"
                            : "hidden"
                        } text-black md:text-gray-400`}
                      >
                        Created Date{" "}
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col inline-block md:hidden">
                    <div className="text-12 font-bold text-blue-800">
                      {"$" +
                        item.characteristics[0].fieldValues.amountInvesting}
                    </div>
                    <label className="text-12">Amount Investing</label>
                  </div>

                  {/* <div className="flex flex-col inline-block md:hidden text-sm">
                    <div className="font-bold text-blue-800 ">
                      {" "}
                      {item.payload.interestRate + "%"}
                    </div>
                    <label className="">Interest</label>
                  </div> */}
                  <div className="flex flex-col inline-block md:hidden text-sm">
                    <div className="font-bold text-blue-800 ">
                      <div
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                          "Draft"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        {/* <img src={IMAGE_PATHS.AWAIT_PAYMENT} /> */}
                        <Tag severity={"warning"} value={"Draft"} rounded></Tag>
                      </div>
                      <div
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                          "Declined"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <Tag
                          severity={"danger"}
                          value={"Declined"}
                          rounded
                        ></Tag>
                      </div>
                      <div
                        className={`${
                          item?.characteristics[0].fieldValues.polStatus[0] ===
                          "In Review"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <Tag
                          severity={"info"}
                          value={"Under Review"}
                          rounded
                        ></Tag>
                      </div>
                      <div
                        className={`${
                          item?.characteristics[0].fieldValues.polStatus[0] ===
                          "Approved"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <Tag
                          severity={"info"}
                          value={"Approved"}
                          rounded
                        ></Tag>
                      </div>
                    </div>
                    {/* <label className="">Status</label> */}
                  </div>
                </div>

                <div className="flex flex-col hidden sm:inline-block md: space-y-7 md: w-2/4 md:text-center md:pl-2 md:pt-2  ">
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {"$" +
                        item.characteristics[0].fieldValues.amountInvesting}
                    </div>
                    <label className="pb-2">Amount Investing</label>
                  </div>
                </div>

                <div className="flex flex-col hidden sm:inline-block md: space-y-7 md: w-1/3 md:text-center md:pl-3 md:pt-2 ">
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {" "}
                      {item.characteristics[item.characteristics.length-1].fieldValues.guaranteedRate + "%"}
                    </div>
                    <label className="pb-2">Interest</label>
                  </div>
                </div>

                <div className="flex flex-col hidden sm:inline-block md: space-y-7 md: w-2/4 md:text-center md:pl-3 md:pt-2 ">
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      <div
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                          "Draft"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        {/* <img src={IMAGE_PATHS.AWAIT_PAYMENT} /> */}
                        <Tag severity={"warning"} value={"Draft"} rounded></Tag>
                      </div>
                      <div
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                          "Declined"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <Tag
                          severity={"danger"}
                          value={"Declined"}
                          rounded
                        ></Tag>
                      </div>
                      <div
                        className={`${
                          item?.characteristics[0].fieldValues.polStatus[0] ===
                          "In Review"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <Tag
                          severity={"info"}
                          value={"Under Review"}
                          rounded
                        ></Tag>
                      </div>
                      <div
                        className={`${
                          item?.characteristics[0].fieldValues.polStatus[0] ===
                          "Approved"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <Tag
                          severity={"info"}
                          value={"Approved"}
                          rounded
                        ></Tag>
                      </div>
                    </div>
                    <label className="pb-2">Status</label>
                      {}
                        {
                        (item?.characteristics[0].fieldValues.polStatus[0] ===
                          "Approved"||item?.characteristics[0].fieldValues.polStatus[0] ===
                          "In Review")&&item.token&&
                          <label classname="mt-4 text-red-200">Payment is in progress</label>}
                         {(item?.characteristics[0].fieldValues.polStatus[0] ===
                          "Approved"||item?.characteristics[0].fieldValues.polStatus[0] ===
                          "In Review")&&!item.token&&
                          <label classname="mt-4 text-red-200">awaiting Payment</label>
                        }
                  </div>
                </div>
                {/* <pre  style={{ marginLeft: "7.7em"}}>{JSON.stringify(`${item.characteristics[0].fieldValues.polStatus}`,null,4)}</pre> */}

                <div className="flex flex-col inline-block  text-sm">
                  <div className="flex ml-4">
                    {/* <NextLink href={`/dashboard/my-applications/viewapplication?id=${item?.characteristics[0].policyLocator}`}> */}

                    <div
                      className="cursor-pointer self-center w-20 h-20 ml-1"
                      onClick={() => handleRedirect(item)}
                    >
                      <img src={IMAGE_PATHS.EDIT} />
                      </div>
                    {/* </NextLink> */}
                  </div>
                  <div className="flex mt-1 ml-5">
                    <div className="inline-block">
                       {(item?.characteristics[0].fieldValues.polStatus[0] ===
                          "Approved"||item?.characteristics[0].fieldValues.polStatus[0] ===
                          "In Review")&&!item?.token&&item?.characteristics[0].fieldValues.achAmount[0]>0&&
                          <div>
                            <Button label="Pay" onClick={() => handlePay(item?.characteristics[0])} className="p-button-outlined pay-button "  />
                            </div>
                            }
                      <div
                        onClick={() => setClickData(item, index)}
                        className={`${
                          item.characteristics[0].fieldValues.polStatus[0] ===
                            "Draft" &&
                          item.characteristics[0].fieldValues
                            .esignatureStatus[0] === "Not Started"
                            ? "visible"
                            : "invisible"
                        }`}
                      >
                        <img
                          src={IMAGE_PATHS.DELETE}
                          className="inline w-3 h-3 mb-1"
                          title="Delete"
                        />
                        <label className="cursor-pointer pl-1 text-blue-500">
                          Delete
                        </label>
                      </div>
                    </div>
                    <div>
                      {deleteDraft && show && (
                        <DeleteAppModal
                          key={id}
                          data={data}
                          setModal={setModal}
                          showsModal={true}
                          closeModal={closeModal}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                item.characteristics[0].fieldValues.polStatus[0] === "Draft" &&
                item.characteristics[0].fieldValues.esignatureStatus[0] ===
                  "Not Started"
                  ? "visible"
                  : "invisible"
              }`}
            >
              <div className="flex flex-row mt-2 p-2 bordertopgray justify-end sm:hidden">
                <div className="flex mt-1 mr-10">
                  <div className="mr-5 border-2 border-l-gray-500"></div>
                  <div onClick={() => setClickData(item, index)}>
                    <img
                      src={IMAGE_PATHS.DELETE}
                      className="inline w-4 sm:w-3 h-4 sm:h-3  mb-1"
                      title="Delete"
                    />
                    <label className="cursor-pointer pl-2 mt-2 text-sm sm:text-lg text-blue-500">
                      Delete
                    </label>
                  </div>

                  <div>
                    {deleteDraft && show && (
                      <DeleteAppModal
                        key={id}
                        data={data}
                        setModal={setModal}
                        showsModal={true}
                        closeModal={closeModal}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default myapplicationbox;
