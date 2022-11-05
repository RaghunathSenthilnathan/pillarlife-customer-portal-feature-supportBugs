import { Modal } from "@components/modal";
import { useEffect, useState, Fragment } from "react";
import { Button } from "@components/forms";
import { Label } from "@components/forms";
import { Container } from "@components/layout";
import { Flex } from "@components/layout";
import { InputText } from "primereact/inputtext";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

export function PercentageSharingAppModal({
  showsModal,
  closeModal,
  id,
  formik,
  benetype,
  edit,
  benelocator,
  redistribute
}) {
  const [benefi, setPrimBeneficiary] = useState();
  const [appData, setAppData] = useState();
  const [inputFields, setInputFields] = useState([]);
  const [showsave, setShowSave] = useState();
  const [length, setLength] = useState();
  const [close, setClose] = useState(false);

  useEffect(() => {
    fetchPolicyDetails(id);
  }, [id]);

  async function fetchPolicyDetails(locator) {
    const pl = locator;
    const beneficiary = [];
    const allstoredbeneficiary = JSON.parse(sessionStorage.getItem(locator));

    allstoredbeneficiary &&
      allstoredbeneficiary.map(o => {
        if (edit == true) {
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
        } else if (o.beneType[0] === `${benetype ? "Primary" : "Contingent"}`) {
          console.log("Inside Add mode---");
          beneficiary.push({
            ...o
          });
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
        beneType: benetype ? "Primary" : "Contingent",
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
    BeneficiaryInfo: Yup.array().of(
      Yup.object().shape({
        beneSharingPercent: Yup.number()
          .required("Percentage sharing is required")
          .min(1, "Minimum 1 percent is required")
          .max(100, "Maximum 100 percent is allowed")
      })
    )
  });

  const checkpercent = data => {
    var addpercent = formik.values.beneSharingPercent;
    var percent = parseInt(addpercent);
    const sum = data.reduce((acc, current) => {
      return acc + (parseInt(current.beneSharingPercent) || 0);
    }, percent);

    if (sum != 100) {
      setShowSave(true);
    } else {
      setShowSave(false);
    }
    return sum;
  };

  function postdata(val) {
    var data = val.BeneficiaryInfo;
    const sum = checkpercent(data);

    localStorage.setItem("percentage", JSON.stringify(data));
    sum === 100 && data && closeModal();
  }

  function handleCancel() {
    closeModal();
    formik.values.beneSharingPercent = "";
  }

  const title = (
    <h2 className="p-1 quotecolor sm:text-left bg-blue-900 text-white p-7 font-bold sub-font-size sm:text-xl">
      Redistribute the Percentage Sharing
    </h2>
  );

  return (
    <>
      <Modal
        title={title}
        changePwd={true}
        percent={true}
        sharing={true}
        redistribute={true}
        //payheight={false}
        showsModal={showsModal}
        body={
          <Flex className=" flex-col x-12 mt-5 ">
            <Formik
              initialValues={initialValues}
              validationSchema={validation}
              validateOnChange={true}
              validateOnBlur={true}
              enableReinitialize={true}
              onSubmit={values => {
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
                        className="flex-col items-center justify-items-center sm:justify-items-start  sm:flex-row justify-items-stretch p-3
                          flex-wrap ml-2 sm:ml-0 space-y-8 sm:space-y-0 sm:space-x-3"
                      >
                        {values.BeneficiaryInfo &&
                          values.BeneficiaryInfo.length > 0 &&
                          values.BeneficiaryInfo.map((item, index) => (
                            <Fragment key={`${item}~${index}`}>
                              <div className="flex-1">
                                <div
                                  className=" mt-2 
                                  flex justify-center w-full sm:w-full "
                                >
                                  <Flex className="flex-row sm:flex-col ">
                                    <div>
                                      <div className="h-16 sm:h-20 w-24 sm:w-full grid justify-items-center sm:justify-items-start pl-0 sm:pl-3">
                                        <h3 className="text-light ml-0 sm:ml-0 sm:mb-1 ps-width p-1 text-sm text-gray-500 font-semibold">
                                          Beneficiary {index + 1}{" "}
                                        </h3>
                                        <label
                                          htmlFor={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                          className=" h-0 sm:h-16 text-left text-black p-1 text-sm font-semibold text-gray-700 mb-4"
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
                                      </div>
                                    </div>
                                    <div className="mt-0 sm:mt-1">
                                      <div className="ml-5 sm:ml-0 pt-2 sm:pt-0 sm:mb-3">
                                        <Field
                                          name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                          // disabled={item.beneIrrevocable === "Yes"}
                                          placeholder="%"
                                          type="number"
                                          className="ml-4 sm:ml-0 w-5/12  sm:w-10/12 text-center ps-bg amount"
                                        />
                                        <ErrorMessage
                                          name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                          component="div"
                                          className="p-error text-sm grid  p-d-block"
                                        />
                                        <label
                                          htmlFor={`BeneficiaryInfo.${index}.locator`}
                                          className="text-black p-1 text-sm font-semibold hidden"
                                        ></label>
                                        <Field
                                          name={`BeneficiaryInfo.${index}.locator`}
                                          placeholder="%"
                                          type="number"
                                          className="ml-4 sm:ml-0 w-6/12 sm:w-10/12 ps-bg amount hidden"
                                        />
                                      </div>
                                    </div>
                                  </Flex>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        <div className="flex-1">
                          <Container className=" mt-2 flex justify-center w-full sm:w-full">
                            <Flex className="ml-0 sm:ml-0 flex-row sm:flex-col ">
                              <div className="w-5/12 sm:w-full">
                                <div className="h-16 sm:h-20 mr-2 sm:mr-0  grid justify-items-center sm:justify-items-start  pl-0 sm:pl-3 mt-0 sm:mt-0 w-24 sm:w-full">
                                  <h3 className="ml-0 sm:ml-0 sm:mb-1 text-light ps-width p-1  text-sm  font-semibold">
                                    {" "}
                                    Beneficiary{" "}
                                    {values.BeneficiaryInfo &&
                                      values.BeneficiaryInfo.length + 1}{" "}
                                  </h3>
                                  <Label
                                    htmlFor="beneSharingPercent"
                                    className="h-0 sm:h-16 text-left text-black p-1 text-sm font-semibold text-indigo-900 mb-4 sm:mb-6 "
                                  >
                                    {formik.values &&
                                    formik.values.benePartyType === "Person"
                                      ? formik.values.beneFirstname +
                                        " " +
                                        formik.values.beneMiddlename +
                                        " " +
                                        formik.values.beneLastname
                                      : formik.values.beneTrustee}
                                  </Label>
                                </div>
                              </div>
                              <div>
                                <div className=" pt-2 sm:pt-0 mt-0 sm:mt-0 sm:mb-3 ">
                                  <InputText
                                    id="beneSharingPercent"
                                    name="beneSharingPercent"
                                    keyfilter="int"
                                    value={formik.values.beneSharingPercent}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="%"
                                    aria-describedby=""
                                    className="w-5/12  sm:w-10/12 mtop text-center ps-bg amount ml-8 sm:ml-0"
                                  />
                                </div>
                              </div>
                            </Flex>
                          </Container>
                        </div>
                      </Flex>
                    )}
                  </FieldArray>

                  {showsave ? (
                    <span className="p-error text-sm text-sm grid mt-4 p-d-block">
                      The sum of percentages should be 100%
                    </span>
                  ) : null}

                  <Flex className=" ps-modal">
                    <Container className="flex justify-center w-full flex space-x-10">
                      <Button
                        // style={{ marginLeft: "5rem" }}
                        className="w-32 sm:w-32 font-bold btn-cancel text-blue-500 border-blue-500"
                        type="button"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        // style={{ marginLeft: "12rem" }}
                        disabled={!isValid && isSubmitting == false}
                        onClick={submitForm}
                        className="w-32 sm:w-32 font-bold ml-7 sm:ml-0 btncolor"
                        type="button"
                        loading={isSubmitting}
                      >
                        Save
                      </Button>
                    </Container>
                  </Flex>
                </Form>
              )}
            </Formik>
          </Flex>
        }
      />
    </>
  );
}
