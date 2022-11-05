import { Modal } from "@components/modal";
import { useEffect, useState, Fragment, useCallback } from "react";
import { Button } from "@components/forms";
import { Container } from "@components/layout";
import { Flex } from "@components/layout";
import { useRouter } from "next/router";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { ModalPopUp } from "./modalpopup";
import { useMediaQuery } from "react-responsive";

export function DeletePercentSharing({
  showsModal,
  closeModal,
  id,
  benelocator,
  benetype,
  deletelast
}) {
  const router = useRouter();
  const [benefi, setPrimBeneficiary] = useState();
  const [appData, setAppData] = useState();
  const [showsave, setShowSave] = useState(true);
  const [length, setLength] = useState();
  const [close, setClose] = useState(false);
  const [hideerror, setHideError] = useState(false);

  const [deleteopen, setDeleteOpen] = useState(false);
  const confirmclose = useCallback(() => setDeleteOpen(false));

  useEffect(() => {
    fetchPolicyDetails(id);
  }, []);

  function fetchPolicyDetails(locator) {
    const pl = locator;
    const beneficiary = [];

    const allstoredbeneficiary = JSON.parse(sessionStorage.getItem(locator));

    allstoredbeneficiary &&
      allstoredbeneficiary.map(o => {
        if (o.beneType[0] === `${benetype ? "Primary" : "Contingent"}`) {
          if (
            (o.id != benelocator && o.locator == undefined) ||
            (o.locator != benelocator && o.id == undefined)
          ) {
            beneficiary.push({ ...o });
            console.log(
              "Inside If statement locator Check---",
              o.id,
              o.locator,
              "Params Passed---",
              benelocator,
              benetype,
              "Data Pushed by Condition---",
              beneficiary
            );
          }
        }
      });

    setPrimBeneficiary(beneficiary);
    setLength(beneficiary.length);
  }

  const initialValues = {
    BeneficiaryInfo: []
  };

  benefi &&
    benefi.length > 0 &&
    benefi.map(o => {
      initialValues.BeneficiaryInfo.push({
        benePartyType: o.benePartyType[0] === "Trust" ? "Trust" : "Person",
        beneTrustee: o.beneTrustee ? o.beneTrustee[0] : " ",
        beneFirstname: o.beneFirstname ? o.beneFirstname[0] : "",
        beneMiddlename: o.beneMiddlename ? o.beneMiddlename[0] : "",
        beneLastname: o.beneLastname ? o.beneLastname[0] : "",
        beneSharingPercent: o.beneSharingPercent ? o.beneSharingPercent[0] : "",
        locator: o.locator ? o.locator : o.id,
        beneIrrevocable: o.beneIrrevocable ? o.beneIrrevocable[0] : ""
      });
    });

  const validation = Yup.object({
    BeneficiaryInfo: Yup.array()
      .of(
        Yup.object().shape({
          beneSharingPercent: Yup.number()
            .required("Percentage sharing is required")
            .min(1, "Minimum 1 percent is required")
            .max(100, "Maximum 100 percent is allowed")
        })
      )
      .test("total", "Total Sum is 100%", (BeneficiaryInfo = []) => {
        const sum = BeneficiaryInfo.reduce((acc, current) => {
          return acc + (current.beneSharingPercent || 0);
        }, 0);

        if (sum !== 100) {
          setShowSave(true);
          return new Yup.ValidationError(
            `The sum of percentages should be 100%`,
            undefined,
            "BeneficiaryInfo"
          );
        } else if (sum === 100) {
          setShowSave(false);
        }

        return sum == 100;
      })
  });

  function postdata(val) {
    // console.log("Data in Params---", val);

    const data = val.BeneficiaryInfo;

    let locator = id.toString();
    const allstoredbeneficiary = JSON.parse(sessionStorage.getItem(locator));
    // console.log(
    //   "Percent Sharing Data Before Update---",
    //   allstoredbeneficiary,
    //   allstoredbeneficiary.length
    // );

    data &&
      data.map(o => {
        for (let i = 0; i < allstoredbeneficiary.length; i++) {
          if (
            (allstoredbeneficiary[i].locator === o.locator &&
              allstoredbeneficiary[i].id === undefined) ||
            (allstoredbeneficiary[i].id === o.locator &&
              allstoredbeneficiary[i].locator === undefined)
          ) {
            allstoredbeneficiary[i].beneSharingPercent[0] =
              o.beneSharingPercent;

            console.log(
              "Inside Percent Update If statement ---",
              "Locator---",
              o.locator,
              allstoredbeneficiary[i].locator,
              "ID---",
              allstoredbeneficiary[i].id
            );
          }
        }
      });

    // console.log("Percent Updated Data ---", allstoredbeneficiary);

    allstoredbeneficiary.map((item, index) => {
      if (item.locator === benelocator || item.id === benelocator) {
        allstoredbeneficiary.splice(index, 1);
        console.log(
          "Inside remove function---",
          item,
          index,
          allstoredbeneficiary,
          "Conditon check Values---",
          "Item.Locator--",
          item.locator,
          "Item.ID--",
          item.id,
          "BeneLocator---",
          benelocator,
          "deletebeneficiarylocator---",
          deletebeneficiarylocator,
          typeof deletebeneficiarylocator
        );

        const deletebeneficiarylocator = JSON.parse(
          sessionStorage.getItem("DeletedBeneLocator")
        );

        if (deletebeneficiarylocator == undefined) {
          if (item.id) {
            var locator = [item.id];
            sessionStorage.setItem(
              "DeletedBeneLocator",
              JSON.stringify(locator)
            );
          } else if (item.locator) {
            var locator = [item.locator];
            sessionStorage.setItem(
              "DeletedBeneLocator",
              JSON.stringify(locator)
            );
          }
        } else {
          if (item.locator) {
            deletebeneficiarylocator.push(item.locator);
            sessionStorage.setItem(
              "DeletedBeneLocator",
              JSON.stringify(deletebeneficiarylocator)
            );
          } else if (item.id) {
            deletebeneficiarylocator.push(item.id);
            sessionStorage.setItem(
              "DeletedBeneLocator",
              JSON.stringify(deletebeneficiarylocator)
            );
          }
        }
      }
    });

    sessionStorage.setItem(
      locator.toString(),
      JSON.stringify(allstoredbeneficiary)
    );
    // console.log("Updated Beneficiary Data ---", allstoredbeneficiary);

    setDeleteOpen(true);
    setClose(true);
    setHideError(true);
  }

  function handleCancel() {
    closeModal();
  }

  const title = (
    <h2 className="p-1 quotecolor sm:text-left bg-blue-900 text-white p-7 font-bold sub-font-size sm:text-xl">
      Redistribute the Percentage Sharing
    </h2>
  );

  const titleconfirm = (
    <Container className="font-bold">
      Beneficiary has been deleted successfully.
    </Container>
  );
  const isMobile = useMediaQuery({ query: "(max-width: 850px)" });

  return (
    <>
      <Modal
        title={title}
        changePwd={true}
        percent={true}
        sharing={true}
        showsModal={showsModal}
        body={
          <Flex className=" flex-col x-12 mt-5 w-full ">
            <Formik
              initialValues={initialValues}
              validationSchema={validation}
              validateOnChange={true}
              validateOnBlur={true}
              enableReinitialize={true}
              onSubmit={(values, errors) => {
                postdata(values);
              }}
            >
              {({
                isSubmitting,
                submitForm,
                isValid,
                dirty,
                errors,
                values
              }) => (
                <Form>
                  {/* <pre >
                    {JSON.stringify({ values, errors }, null, 4)}
                  </pre> */}

                  <FieldArray name="BeneficiaryInfo">
                    {({ remove, push }) => (
                      <Flex
                        // className="flex-col items-center justify-items-center sm:flex-row justify-items-stretch p-3
                        //    flex-wrap"
                        className="flex-col items-center justify-items-center sm:justify-items-start  sm:flex-row justify-items-stretch p-3
                           flex-wrap ml-2 sm:ml-0 space-y-8 sm:space-y-0 sm:space-x-3"
                      >
                        {values.BeneficiaryInfo &&
                          values.BeneficiaryInfo.length > 0 &&
                          values.BeneficiaryInfo.map((item, index) => (
                            <Fragment key={`${item}~${index}`}>
                              <div className="flex-1">
                                <Container
                                  // className=" mt-2
                                  //    sm:w-3/12 p-3"
                                  className=" mt-2 
                                   flex justify-center w-full sm:w-full "
                                >
                                  <Flex className="flex-row sm:flex-col ">
                                    <Container className="h-16 sm:h-20 w-24 sm:w-full grid justify-items-center sm:justify-items-start pl-0 sm:pl-3">
                                      <h3 className="text-light ml-0 sm:ml-0 ps-width p-1 text-sm text-gray-500 font-semibold">
                                        Beneficiary {index + 1}{" "}
                                      </h3>
                                      <label
                                        htmlFor={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                        className="h-0 sm:h-12 text-left  p-1 text-sm font-semibold text-gray-700 mb-4 text-blue-900"
                                      >
                                        {values.BeneficiaryInfo &&
                                        values.BeneficiaryInfo[index]
                                          .benePartyType === "Person"
                                          ? item.beneMiddlename
                                            ? item.beneFirstname +
                                              " " +
                                              item.beneMiddlename +
                                              " " +
                                              item.beneLastname
                                            : item.beneFirstname +
                                              " " +
                                              item.beneLastname
                                          : null}
                                        {values.BeneficiaryInfo &&
                                        values.BeneficiaryInfo[index]
                                          .benePartyType === "Trust"
                                          ? item.beneTrustee
                                          : null}
                                      </label>
                                    </Container>
                                    <Container>
                                      <div className="mt-0 sm:mt-1">
                                        <div className="ml-5 sm:ml-0 pt-2 sm:pt-0 sm:mb-3">
                                          <Field
                                            name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                            // disabled={item.beneIrrevocable === "Yes"}
                                            placeholder="%"
                                            type="number"
                                            //className="w-8/12  sm:w-10/12 text-center amount"
                                            className="ml-4 sm:ml-0 w-5/12  sm:w-10/12 text-center ps-bg amount"
                                          />
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                            component="div"
                                            className="p-error grid  p-d-block"
                                          />
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.locator`}
                                            className="text-black p-1 text-sm font-semibold hidden"
                                          ></label>
                                          <Field
                                            name={`BeneficiaryInfo.${index}.locator`}
                                            placeholder="%"
                                            type="number"
                                            //className="w-10/12 amount hidden"
                                            className="ml-4 sm:ml-0 w-6/12 sm:w-10/12 ps-bg amount hidden"
                                          />
                                        </div>
                                      </div>
                                    </Container>
                                  </Flex>
                                </Container>
                              </div>
                            </Fragment>
                          ))}
                      </Flex>
                    )}
                  </FieldArray>

                  {typeof errors.BeneficiaryInfo === "string" ? (
                    <span
                      className={`${
                        hideerror ? "hidden" : "inline-block"
                      } p-error grid text-sm p-3 p-d-block`}
                    >
                      {errors.BeneficiaryInfo}
                    </span>
                  ) : null}

                  {/* <Card className=" border-transparent"> */}
                  <Container className="ps-modal flex justify-center w-full flex space-x-10">
                    <Button
                      style={{ marginLeft: `${isMobile ? "" : "0rem"}` }}
                      className="w-40 sm:ml-8 btn-cancel text-blue-500 border-blue-500 font-semibold"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>

                    <Button
                      style={{ marginLeft: `${isMobile ? "5rem" : "12rem"}` }}
                      disabled={
                        !deletelast
                          ? false
                          : showsave || !dirty || !isValid || isSubmitting
                      }
                      onClick={submitForm}
                      className="w-40 btncolor font-semibold"
                      type="submit"
                      loading={isSubmitting}
                    >
                      Save
                    </Button>
                  </Container>
                  {/* </Card> */}
                </Form>
              )}
            </Formik>
          </Flex>
        }
      />

      {deleteopen && (
        <ModalPopUp
          showsModal={true}
          id={id}
          title={titleconfirm}
          closeModal={confirmclose}
        />
      )}
    </>
  );
}
