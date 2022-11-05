import { useState, useEffect, useCallback } from "react";
import { Button, Label, SecureMaskInput } from "@components/forms";
import { RadioButton } from "primereact/radiobutton";
import { NextSeo } from "next-seo";
import { Stepper } from "@components/stepper";
import { Card } from "primereact/card";
import { Flex, Container, Grid } from "@components/layout";
import { withAuthentication } from "@utils/route-hocs";
import { useRouter } from "next/router";
import { Sider } from "@components/sidebar";
import { InputMask } from "primereact/inputmask";
import Link from "next/link";
import moment from "moment";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { Accordion, AccordionTab } from "primereact/accordion";
import * as Yup from "yup";
import { ModalPopUp } from "../commonForms/modalpopup";
import { Modal } from "@components/modal";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { Divider } from "primereact/divider";
import {
  Url,
  updatePolicy,
  update,
  auxDataUrl,
} from "../../../constants/apiconstant";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.BENEFICIARY}`;
const title = "Beneficiary";
const description = "Beneficiary Page in the application flow";

const beneficiaryForm = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [benefic, setPrimBeneficiary] = useState();
  const [showbene, setShowbene] = useState(false);
  const [cont, setContBeneficiary] = useState();
  const [error, setError] = useState(false);
  const [appData, setAppData] = useState();
  const [primLocator, setPrimLocator] = useState([]);
  const [contiLocator, setContiLocator] = useState([]);
  const [check, setCheck] = useState(false);
  const [primaryerrorpopup, setprimaryerrorpopup] = useState();
  const [percentcheck, setpercentcheck] = useState(false);

  const [warnperson, setWarnPerson] = useState(false);
  const [warntrust, setWarnTrust] = useState(false);
  const closeModal = useCallback(() => setShowbene(false), []);
  const warncloseperson = useCallback(() => setWarnPerson(false));
  const warnclosetrust = useCallback(() => setWarnTrust(false));

  const addwarnperson = () => {
    setWarnPerson(true);
  };

  const addwarntrust = () => {
    setWarnTrust(true);
  };

  const ssnMask = [
    /^[0-9]*$/,
    /^[0-9]*$/,
    /^[0-9]*$/,
    "-",
    /^[0-9]*$/,
    /^[0-9]*$/,
    "-",
    /^[0-9]*$/,
    /^[0-9]*$/,
    /^[0-9]*$/,
    /^[0-9]*$/,
  ];
  const titlewarn = (
    <Container className="font-bold">
      This action is not possible. If you want to change the beneficiary type,
      remove this beneficiary and add a new one.
    </Container>
  );

  const deletewarn = (
    <Container className="font-bold">
      Are you sure you want to delete beneficiary?
    </Container>
  );

  // const warnprimary = (
  //   <Container className="font-bold">
  //     At least one primary beneficiary is mandatory
  //   </Container>
  // );

  useEffect(() => {
    fetchPolicyDetails();
  }, []);

  var primaryLocator = [];
  var contingentLocator = [];
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
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAppData(data);
        data &&
          data.exposures.map((o) => {
            if (
              o.name === "Beneficiary" &&
              o.characteristics[0].fieldValues.beneType[0] === "Primary"
            ) {
              beneficiary.push(o.characteristics[0].fieldValues);
              primaryLocator.push(o.locator);
            }
          });
        data &&
          data.exposures.map((o) => {
            if (
              o.name === "Beneficiary" &&
              o.characteristics[0].fieldValues.beneType[0] === "Contingent"
            ) {
              contigent.push(o.characteristics[0].fieldValues);
              contingentLocator.push(o.locator);
            }
          });

        setPrimBeneficiary(beneficiary);
        setContBeneficiary(contigent);

        if (contigent && contigent[0] && contigent[0].beneSharingPercent[0]) {
          setShow(true);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    setPrimLocator(primaryLocator);
    setContiLocator(contingentLocator);
  }

  const initialValues = {
    BeneficiaryInfo: [],
    contingentBeneficiary: [],
  };

  benefic && benefic.length > 0
    ? benefic.map((benefi) => {
        initialValues.BeneficiaryInfo.push({
          beneType: "Primary",
          benePartyType:
            benefi.benePartyType && benefi.benePartyType[0] === "Trust"
              ? "Trust"
              : "Person",
          beneTrustee: benefi.beneTrustee ? benefi.beneTrustee[0] : "",
          beneTrustName: benefi.beneTrustName ? benefi.beneTrustName[0] : "",
          beneFirstname: benefi.beneFirstname ? benefi.beneFirstname[0] : "",
          beneMiddlename: benefi.beneMiddlename ? benefi.beneMiddlename[0] : "",
          beneLastname: benefi.beneLastname ? benefi.beneLastname[0] : "",
          beneGovtidtype: "SSN",
          beneGovtid: benefi.beneGovtid ? benefi.beneGovtid[0] : "",
          beneDob: benefi.beneDob ? benefi.beneDob[0] : "",
          beneGender: benefi.beneGender ? benefi.beneGender[0] : "",
          benePhone: benefi.benePhone ? benefi.benePhone[0] : "",
          beneEmail: benefi.beneEmail ? benefi.beneEmail[0] : "",
          beneRelationOwner: benefi.beneRelationOwner
            ? benefi.beneRelationOwner[0]
            : "",
          beneSharingPercent: benefi.beneSharingPercent
            ? benefi.beneSharingPercent[0]
            : "",
          beneAddressLine1: benefi.beneAddressLine1
            ? benefi.beneAddressLine1[0]
            : "",
          beneAddressLine2: benefi.beneAddressLine2
            ? benefi.beneAddressLine2[0]
            : "",
          beneAddressCity: benefi.beneAddressCity
            ? benefi.beneAddressCity[0]
            : "",
          beneAddressState: benefi.beneAddressState
            ? benefi.beneAddressState[0]
            : "",
          beneAddressZip: benefi.beneAddressZip ? benefi.beneAddressZip[0] : "",
          beneAddressCountry: "USA",
          beneIrrevocable: benefi.beneIrrevocable
            ? benefi.beneIrrevocable[0]
            : "",
        });
      })
    : initialValues.BeneficiaryInfo.push({
        beneType: "Primary",
        benePartyType: "Person",
        beneTrustee: "",
        beneTrustName: "",
        beneFirstname: "",
        beneMiddlename: "",
        beneLastname: "",
        beneGovtidtype: "SSN",
        beneGovtid: "",
        beneDob: "",
        beneGender: "",
        benePhone: "",
        beneEmail: "",
        beneRelationOwner: "",
        beneSharingPercent: "",
        beneAddressLine1: "",
        beneAddressLine2: "",
        beneAddressCity: "",
        beneAddressState: "",
        beneAddressZip: "",
        beneAddressCountry: "USA",
        beneIrrevocable: "No",
      });
  cont && cont.length > 0
    ? cont.map((benefi) => {
        initialValues.contingentBeneficiary.push({
          beneType: "Contingent",
          benePartyType:
            benefi.benePartyType && benefi.benePartyType[0] === "Trust"
              ? "Trust"
              : "Person",
          beneTrustee: benefi.beneTrustee ? benefi.beneTrustee[0] : "",
          beneTrustName: benefi.beneTrustName ? benefi.beneTrustName[0] : "",
          beneFirstname: benefi.beneFirstname ? benefi.beneFirstname[0] : "",
          beneMiddlename: benefi.beneMiddlename ? benefi.beneMiddlename[0] : "",
          beneLastname: benefi.beneLastname ? benefi.beneLastname[0] : "",
          beneGovtidtype: "SSN",
          beneGovtid: benefi.beneGovtid ? benefi.beneGovtid[0] : "",
          beneDob: benefi.beneDob ? benefi.beneDob[0] : "",
          beneGender: benefi.beneGender ? benefi.beneGender[0] : "",
          benePhone: benefi.benePhone ? benefi.benePhone[0] : "",
          beneEmail: benefi.beneEmail ? benefi.beneEmail[0] : "",
          beneRelationOwner: benefi.beneRelationOwner
            ? benefi.beneRelationOwner[0]
            : "",
          beneSharingPercent: benefi.beneSharingPercent
            ? benefi.beneSharingPercent[0]
            : "",
          beneAddressLine1: benefi.beneAddressLine1
            ? benefi.beneAddressLine1[0]
            : "",
          beneAddressLine2: benefi.beneAddressLine2
            ? benefi.beneAddressLine2[0]
            : "",
          beneAddressCity: benefi.beneAddressCity
            ? benefi.beneAddressCity[0]
            : "",
          beneAddressState: benefi.beneAddressState
            ? benefi.beneAddressState[0]
            : "",
          beneAddressZip: benefi.beneAddressZip ? benefi.beneAddressZip[0] : "",
          beneAddressCountry: "USA",
          beneIrrevocable: benefi.beneIrrevocable
            ? benefi.beneIrrevocable[0]
            : "",
        });
      })
    : initialValues.contingentBeneficiary.push({
        beneType: "Contingent",
        benePartyType: "Person",
        beneTrustee: "",
        beneTrustName: "",
        beneFirstname: "",
        beneMiddlename: "",
        beneLastname: "",
        beneGovtidtype: "SSN",
        beneGovtid: "",
        beneDob: "",
        beneGender: "",
        benePhone: "",
        beneEmail: "",
        beneRelationOwner: "",
        beneSharingPercent: "",
        beneAddressLine1: "",
        beneAddressLine2: "",
        beneAddressCity: "",
        beneAddressState: "",
        beneAddressZip: "",
        beneAddressCountry: "USA",
        beneIrrevocable: "No",
      });

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "-" + dd + "-" + yyyy;

  const digitsOnly = (value) => {
    if (value != undefined) {
      return /^\d+$/.test(value);
    } else {
      return true;
    }
  };

  const validation = Yup.object({
    BeneficiaryInfo: Yup.array().of(
      Yup.object().shape({
        benePartyType: Yup.string(),
        beneFirstname: Yup.string()
          .when("benePartyType", {
            is: (benePartyType) => {
              if (benePartyType === "Trust") {
                return true;
              }
            },
            then: Yup.string(),
            otherwise: Yup.string().when("beneMiddlename", {
              is: (beneMiddlename) => {
                if (beneMiddlename != undefined) {
                  return true;
                }
              },
              then: Yup.string().required("First Name is required"),
              otherwise: Yup.string().when("beneLastname", {
                is: (beneLastname) => {
                  if (beneLastname != undefined) {
                    return true;
                  }
                },
                then: Yup.string().required("First Name is required"),
                otherwise: Yup.string().when("beneGovtid", {
                  is: (beneGovtid) => {
                    if (beneGovtid != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("First Name is required"),
                  otherwise: Yup.string().when("beneDob", {
                    is: (beneDob) => {
                      if (beneDob != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("First Name is required"),
                    otherwise: Yup.string().when("benePhone", {
                      is: (benePhone) => {
                        if (benePhone != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("First Name is required"),
                      otherwise: Yup.string().when("beneEmail", {
                        is: (beneEmail) => {
                          if (beneEmail != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("First Name is required"),
                        otherwise: Yup.string().when("beneSharingPercent", {
                          is: (beneSharingPercent) => {
                            if (beneSharingPercent != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required("First Name is required"),
                          otherwise: Yup.string().when("beneAddressLine1", {
                            is: (beneAddressLine1) => {
                              if (beneAddressLine1 != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "First Name is required"
                            ),
                            otherwise: Yup.string().when("beneGender", {
                              is: (beneGender) => {
                                if (beneGender != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "First Name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressLine2", {
                                is: (beneAddressLine2) => {
                                  if (beneAddressLine2 != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "First Name is required"
                                ),
                                otherwise: Yup.string().when(
                                  "beneAddressCity",
                                  {
                                    is: (beneAddressCity) => {
                                      if (beneAddressCity != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.string().required(
                                      "First Name is required"
                                    ),
                                    otherwise: Yup.string().when(
                                      "beneAddressState",
                                      {
                                        is: (beneAddressState) => {
                                          if (beneAddressState != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.string().required(
                                          "First Name is required"
                                        ),
                                        otherwise: Yup.string().when(
                                          "beneAddressZip",
                                          {
                                            is: (beneAddressZip) => {
                                              if (beneAddressZip != undefined) {
                                                return true;
                                              }
                                            },
                                            then: Yup.string().required(
                                              "First Name is required"
                                            ),
                                            otherwise: Yup.string().when(
                                              "beneRelationOwner",
                                              {
                                                is: (beneRelationOwner) => {
                                                  if (
                                                    beneRelationOwner !=
                                                    undefined
                                                  ) {
                                                    return true;
                                                  }
                                                },
                                                then: Yup.string().required(
                                                  "First Name is required"
                                                ),
                                                otherwise: Yup.string(),
                                              }
                                            ),
                                          }
                                        ),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          })

          .min(3, "At least 03 characters")
          .max(25, "Maximum 25 characters are allowed"),
        beneMiddlename: Yup.string(),
        beneLastname: Yup.string()
          .when("benePartyType", {
            is: (benePartyType) => {
              if (benePartyType === "Trust") {
                return true;
              }
            },
            then: Yup.string(),
            otherwise: Yup.string().when("beneMiddlename", {
              is: (beneMiddlename) => {
                if (beneMiddlename != undefined) {
                  return true;
                }
              },
              then: Yup.string().required("Last Name is required"),
              otherwise: Yup.string().when("beneFirstname", {
                is: (beneFirstname) => {
                  if (beneFirstname != undefined) {
                    return true;
                  }
                },
                then: Yup.string().required("Last Name is required"),
                otherwise: Yup.string().when("beneGovtid", {
                  is: (beneGovtid) => {
                    if (beneGovtid != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("Last Name is required"),
                  otherwise: Yup.string().when("beneDob", {
                    is: (beneDob) => {
                      if (beneDob != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("Last Name is required"),
                    otherwise: Yup.string().when("benePhone", {
                      is: (benePhone) => {
                        if (benePhone != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("Last Name is required"),
                      otherwise: Yup.string().when("beneEmail", {
                        is: (beneEmail) => {
                          if (beneEmail != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("Last Name is required"),
                        otherwise: Yup.string().when("beneSharingPercent", {
                          is: (beneSharingPercent) => {
                            if (beneSharingPercent != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required("Last Name is required"),
                          otherwise: Yup.string().when("beneAddressLine1", {
                            is: (beneAddressLine1) => {
                              if (beneAddressLine1 != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "Last Name is required"
                            ),
                            otherwise: Yup.string().when("beneGender", {
                              is: (beneGender) => {
                                if (beneGender != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "Last Name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressLine2", {
                                is: (beneAddressLine2) => {
                                  if (beneAddressLine2 != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "Last Name is required"
                                ),
                                otherwise: Yup.string().when(
                                  "beneAddressCity",
                                  {
                                    is: (beneAddressCity) => {
                                      if (beneAddressCity != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.string().required(
                                      "Last Name is required"
                                    ),
                                    otherwise: Yup.string().when(
                                      "beneAddressState",
                                      {
                                        is: (beneAddressState) => {
                                          if (beneAddressState != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.string().required(
                                          "Last Name is required"
                                        ),
                                        otherwise: Yup.string().when(
                                          "beneAddressZip",
                                          {
                                            is: (beneAddressZip) => {
                                              if (beneAddressZip != undefined) {
                                                return true;
                                              }
                                            },
                                            then: Yup.string().required(
                                              "Last Name is required"
                                            ),
                                            otherwise: Yup.string().when(
                                              "beneRelationOwner",
                                              {
                                                is: (beneRelationOwner) => {
                                                  if (
                                                    beneRelationOwner !=
                                                    undefined
                                                  ) {
                                                    return true;
                                                  }
                                                },
                                                then: Yup.string().required(
                                                  "Last Name is required"
                                                ),
                                                otherwise: Yup.string(),
                                              }
                                            ),
                                          }
                                        ),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          })

          .min(3, "At least 03 characters")
          .max(25, "Maximum 25 characters are allowed"),
        beneTrustName: Yup.string()
          .when("benePartyType", {
            is: (benePartyType) => {
              if (benePartyType === "Person") {
                return true;
              }
            },
            then: Yup.string(),
            otherwise: Yup.string().when("beneTrustee", {
              is: (beneTrustee) => {
                if (beneTrustee != undefined) {
                  return true;
                }
              },
              then: Yup.string().required("Trust name is required"),
              otherwise: Yup.string().when("beneGovtid", {
                is: (beneGovtid) => {
                  if (beneGovtid != undefined) {
                    return true;
                  }
                },
                then: Yup.string().required("Trust name is required"),
                otherwise: Yup.string().when("beneSharingPercent", {
                  is: (beneSharingPercent) => {
                    if (beneSharingPercent != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("Trust name is required"),
                  otherwise: Yup.string().when("beneEmail", {
                    is: (beneEmail) => {
                      if (beneEmail != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("Trust name is required"),
                    otherwise: Yup.string().when("benePhone", {
                      is: (benePhone) => {
                        if (benePhone != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("Trust name is required"),
                      otherwise: Yup.string().when("beneAddressLine1", {
                        is: (beneAddressLine1) => {
                          if (beneAddressLine1 != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("Trust name is required"),
                        otherwise: Yup.string().when("beneAddressLine2", {
                          is: (beneAddressLine2) => {
                            if (beneAddressLine2 != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required(
                            "Trustee Name is required"
                          ),
                          otherwise: Yup.string().when("beneAddressCity", {
                            is: (beneAddressCity) => {
                              if (beneAddressCity != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "Trust name is required"
                            ),
                            otherwise: Yup.string().when("beneAddressState", {
                              is: (beneAddressState) => {
                                if (beneAddressState != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "Trust name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressZip", {
                                is: (beneAddressZip) => {
                                  if (beneAddressZip != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "Trust name is required"
                                ),
                                otherwise: Yup.string(),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          })
          .min(3, "At least 03 characters")
          .max(50, "Maximum 25 characters are allowed"),

        beneTrustee: Yup.string()
          .when("benePartyType", {
            is: (benePartyType) => {
              if (benePartyType === "Person") {
                return true;
              }
            },
            then: Yup.string(),
            otherwise: Yup.string().when("beneTrustName", {
              is: (beneTrustName) => {
                if (beneTrustName != undefined) {
                  return true;
                }
              },
              then: Yup.string().required("Trustee name is required"),
              otherwise: Yup.string().when("beneGovtid", {
                is: (beneGovtid) => {
                  if (beneGovtid != undefined) {
                    return true;
                  }
                },
                then: Yup.string().required("Trustee name is required"),
                otherwise: Yup.string().when("beneSharingPercent", {
                  is: (beneSharingPercent) => {
                    if (beneSharingPercent != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("Trustee name is required"),
                  otherwise: Yup.string().when("beneEmail", {
                    is: (beneEmail) => {
                      if (beneEmail != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("Trustee name is required"),
                    otherwise: Yup.string().when("benePhone", {
                      is: (benePhone) => {
                        if (benePhone != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("Trustee name is required"),
                      otherwise: Yup.string().when("beneAddressLine1", {
                        is: (beneAddressLine1) => {
                          if (beneAddressLine1 != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("Trustee name is required"),
                        otherwise: Yup.string().when("beneAddressLine2", {
                          is: (beneAddressLine2) => {
                            if (beneAddressLine2 != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required(
                            "Trustee Name is required"
                          ),
                          otherwise: Yup.string().when("beneAddressCity", {
                            is: (beneAddressCity) => {
                              if (beneAddressCity != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "Trustee name is required"
                            ),
                            otherwise: Yup.string().when("beneAddressState", {
                              is: (beneAddressState) => {
                                if (beneAddressState != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "Trustee name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressZip", {
                                is: (beneAddressZip) => {
                                  if (beneAddressZip != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "Trustee name is required"
                                ),
                                otherwise: Yup.string(),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          })
          .min(3, "At least 03 characters")
          .max(25, "Maximum 25 characters are allowed"),
        beneGovtid: Yup.string()

          .typeError("You must specify a number")
          .min(11, "Minimum 9 characters are allowed")
          .matches(/^[0-9-+()]*$/, "Must be only digits"),
        beneDob: Yup.string()
          .nullable()
          .notRequired()
          .length(10, "Date format is invalid")
          .test("DOB", "The entered date cannot be in the future.", (value) => {
            if (value != undefined) {
              return moment().diff(moment(value), moment(today)) > 1;
            } else {
              return true;
            }
          }),

        // benePhone: Yup.string()
        //   .nullable()
        //   .notRequired()
        //   .test("Digits only", "Only numbers are allowed", digitsOnly)
        //   .length(10, "10 characters are allowed"),
        beneEmail: Yup.string().email(" Invalid email address").max(255),

        beneSharingPercent: Yup.number()
          .when("benePartyType", {
            is: (benePartyType) => {
              if (benePartyType === "Trust") {
                return true;
              }
            },
            then: Yup.number().when("benePartyType", {
              is: (benePartyType) => {
                if (benePartyType === "Person") {
                  return true;
                }
              },
              then: Yup.number(),
              otherwise: Yup.number().when("beneTrustName", {
                is: (beneTrustName) => {
                  if (beneTrustName != undefined) {
                    return true;
                  }
                },
                then: Yup.number().required("Percentage Sharing is required"),
                otherwise: Yup.number().when("beneTrustee", {
                  is: (beneTrustee) => {
                    if (beneTrustee != undefined) {
                      return true;
                    }
                  },
                  then: Yup.number().required("Percentage Sharing is required"),
                  otherwise: Yup.number().required(
                    "Percentage Sharing is required"
                  ),
                  otherwise: Yup.number().when("beneGovtid", {
                    is: (beneGovtid) => {
                      if (beneGovtid != undefined) {
                        return true;
                      }
                    },
                    then: Yup.number().required(
                      "Percentage Sharing is required"
                    ),
                    otherwise: Yup.number().when("beneSharingPercent", {
                      is: (beneSharingPercent) => {
                        if (beneSharingPercent != undefined) {
                          return true;
                        }
                      },
                      then: Yup.number().required(
                        "Percentage Sharing is required"
                      ),
                      otherwise: Yup.number().when("beneEmail", {
                        is: (beneEmail) => {
                          if (beneEmail != undefined) {
                            return true;
                          }
                        },
                        then: Yup.number().required(
                          "Percentage Sharing is required"
                        ),
                        otherwise: Yup.number().when("benePhone", {
                          is: (benePhone) => {
                            if (benePhone != undefined) {
                              return true;
                            }
                          },
                          then: Yup.number().required(
                            "Percentage Sharing is required"
                          ),
                          otherwise: Yup.number().when("beneAddressLine1", {
                            is: (beneAddressLine1) => {
                              if (beneAddressLine1 != undefined) {
                                return true;
                              }
                            },
                            then: Yup.number().required(
                              "Percentage Sharing is required"
                            ),
                            otherwise: Yup.number().when("beneAddressLine2", {
                              is: (beneAddressLine2) => {
                                if (beneAddressLine2 != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.number().required(
                                "Trustee Name is required"
                              ),
                              otherwise: Yup.number().when("beneAddressCity", {
                                is: (beneAddressCity) => {
                                  if (beneAddressCity != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.number().required(
                                  "Percentage Sharing is required"
                                ),
                                otherwise: Yup.number().when(
                                  "beneAddressState",
                                  {
                                    is: (beneAddressState) => {
                                      if (beneAddressState != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.number().required(
                                      "Percentage Sharing is required"
                                    ),
                                    otherwise: Yup.number().when(
                                      "beneAddressZip",
                                      {
                                        is: (beneAddressZip) => {
                                          if (beneAddressZip != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.number().required(
                                          "Percentage Sharing is required"
                                        ),
                                        otherwise: Yup.number(),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
            otherwise: Yup.number().when("beneFirstname", {
              is: (beneFirstname) => {
                if (beneFirstname != undefined) {
                  return true;
                }
              },
              then: Yup.number().required("Percentage Sharing is required"),
              otherwise: Yup.number().when("beneLastname", {
                is: (beneLastname) => {
                  if (beneLastname != undefined) {
                    return true;
                  }
                },
                then: Yup.number().required("Percentage Sharing is required"),
                otherwise: Yup.number().when("beneMiddlename", {
                  is: (beneMiddlename) => {
                    if (beneMiddlename != undefined) {
                      return true;
                    }
                  },
                  then: Yup.number().required("Percentage Sharing is required"),
                  otherwise: Yup.number().when("beneDob", {
                    is: (beneDob) => {
                      if (beneDob != undefined) {
                        return true;
                      }
                    },
                    then: Yup.number().required(
                      "Percentage Sharing is required"
                    ),
                    otherwise: Yup.number().when("benePhone", {
                      is: (benePhone) => {
                        if (benePhone != undefined) {
                          return true;
                        }
                      },
                      then: Yup.number().required(
                        "Percentage Sharing is required"
                      ),
                      otherwise: Yup.number().when("beneEmail", {
                        is: (beneEmail) => {
                          if (beneEmail != undefined) {
                            return true;
                          }
                        },
                        then: Yup.number().required(
                          "Percentage Sharing is required"
                        ),
                        otherwise: Yup.number().when("beneAddressLine1", {
                          is: (beneAddressLine1) => {
                            if (beneAddressLine1 != undefined) {
                              return true;
                            }
                          },
                          then: Yup.number().required(
                            "Percentage Sharing is required"
                          ),
                          otherwise: Yup.number().when("beneGender", {
                            is: (beneGender) => {
                              if (beneGender != undefined) {
                                return true;
                              }
                            },
                            then: Yup.number().required(
                              "Percentage Sharing is required"
                            ),
                            otherwise: Yup.number().when("beneAddressLine2", {
                              is: (beneAddressLine2) => {
                                if (beneAddressLine2 != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.number().required(
                                "Percentage Sharing is required"
                              ),
                              otherwise: Yup.number().when("beneAddressCity", {
                                is: (beneAddressCity) => {
                                  if (beneAddressCity != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.number().required(
                                  "Percentage Sharing is required"
                                ),
                                otherwise: Yup.number().when(
                                  "beneAddressState",
                                  {
                                    is: (beneAddressState) => {
                                      if (beneAddressState != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.number().required(
                                      "Percentage Sharing is required"
                                    ),
                                    otherwise: Yup.number().when(
                                      "beneAddressZip",
                                      {
                                        is: (beneAddressZip) => {
                                          if (beneAddressZip != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.number().required(
                                          "Percentage Sharing is required"
                                        ),
                                        otherwise: Yup.number().when(
                                          "beneRelationOwner",
                                          {
                                            is: (beneRelationOwner) => {
                                              if (
                                                beneRelationOwner != undefined
                                              ) {
                                                return true;
                                              }
                                            },
                                            then: Yup.number().required(
                                              "Percentage Sharing is required"
                                            ),
                                            otherwise: Yup.number().when(
                                              "beneGovtid",
                                              {
                                                is: (beneGovtid) => {
                                                  if (beneGovtid != undefined) {
                                                    return true;
                                                  }
                                                },
                                                then: Yup.number().required(
                                                  "Percentage Sharing is required"
                                                ),
                                                otherwise: Yup.number(),
                                              }
                                            ),
                                          }
                                        ),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          })

          .min(1, "Minimum 1 percent is required")
          .max(100, "Maximum 100 percent is allowed"),
        beneAddressLine1: Yup.string().max(
          50,
          "Maximum 50 characters are allowed"
        ),

        beneAddressZip: Yup.string()
          .nullable()
          .notRequired()
          .test("Digits only", "Only numbers are allowed", digitsOnly)
          .length(5, "5 characters are allowed"),
      })
    ),
    contingentBeneficiary: show
      ? Yup.array().of(
          Yup.object().shape({
            benePartyType: Yup.string(),
            beneFirstname: Yup.string()
              .when("benePartyType", {
                is: (benePartyType) => {
                  if (benePartyType === "Trust") {
                    return true;
                  }
                },
                then: Yup.string(),
                otherwise: Yup.string().when("beneMiddlename", {
                  is: (beneMiddlename) => {
                    if (beneMiddlename != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("First Name is required"),
                  otherwise: Yup.string().when("beneLastname", {
                    is: (beneLastname) => {
                      if (beneLastname != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("First Name is required"),
                    otherwise: Yup.string().when("beneGovtid", {
                      is: (beneGovtid) => {
                        if (beneGovtid != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("First Name is required"),
                      otherwise: Yup.string().when("beneDob", {
                        is: (beneDob) => {
                          if (beneDob != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("First Name is required"),
                        otherwise: Yup.string().when("benePhone", {
                          is: (benePhone) => {
                            if (benePhone != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required("First Name is required"),
                          otherwise: Yup.string().when("beneEmail", {
                            is: (beneEmail) => {
                              if (beneEmail != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "First Name is required"
                            ),
                            otherwise: Yup.string().when("beneSharingPercent", {
                              is: (beneSharingPercent) => {
                                if (beneSharingPercent != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "First Name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressLine1", {
                                is: (beneAddressLine1) => {
                                  if (beneAddressLine1 != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "First Name is required"
                                ),
                                otherwise: Yup.string().when("beneGender", {
                                  is: (beneGender) => {
                                    if (beneGender != undefined) {
                                      return true;
                                    }
                                  },
                                  then: Yup.string().required(
                                    "First Name is required"
                                  ),
                                  otherwise: Yup.string().when(
                                    "beneAddressLine2",
                                    {
                                      is: (beneAddressLine2) => {
                                        if (beneAddressLine2 != undefined) {
                                          return true;
                                        }
                                      },
                                      then: Yup.string().required(
                                        "First Name is required"
                                      ),
                                      otherwise: Yup.string().when(
                                        "beneAddressCity",
                                        {
                                          is: (beneAddressCity) => {
                                            if (beneAddressCity != undefined) {
                                              return true;
                                            }
                                          },
                                          then: Yup.string().required(
                                            "First Name is required"
                                          ),
                                          otherwise: Yup.string().when(
                                            "beneAddressState",
                                            {
                                              is: (beneAddressState) => {
                                                if (
                                                  beneAddressState != undefined
                                                ) {
                                                  return true;
                                                }
                                              },
                                              then: Yup.string().required(
                                                "First Name is required"
                                              ),
                                              otherwise: Yup.string().when(
                                                "beneAddressZip",
                                                {
                                                  is: (beneAddressZip) => {
                                                    if (
                                                      beneAddressZip !=
                                                      undefined
                                                    ) {
                                                      return true;
                                                    }
                                                  },
                                                  then: Yup.string().required(
                                                    "First Name is required"
                                                  ),
                                                  otherwise: Yup.string().when(
                                                    "beneRelationOwner",
                                                    {
                                                      is: (
                                                        beneRelationOwner
                                                      ) => {
                                                        if (
                                                          beneRelationOwner !=
                                                          undefined
                                                        ) {
                                                          return true;
                                                        }
                                                      },
                                                      then: Yup.string().required(
                                                        "First Name is required"
                                                      ),
                                                      otherwise: Yup.string(),
                                                    }
                                                  ),
                                                }
                                              ),
                                            }
                                          ),
                                        }
                                      ),
                                    }
                                  ),
                                }),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              })

              .min(3, "At least 03 characters")
              .max(25, "Maximum 25 characters are allowed"),
            beneLastname: Yup.string()
              .min(3, "At least 03 characters")
              .max(25, "Maximum 25 characters are allowed")

              .when("benePartyType", {
                is: (benePartyType) => {
                  if (benePartyType === "Trust") {
                    return true;
                  }
                },
                then: Yup.string(),
                otherwise: Yup.string().when("beneMiddlename", {
                  is: (beneMiddlename) => {
                    if (beneMiddlename != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("Last Name is required"),
                  otherwise: Yup.string().when("beneFirstname", {
                    is: (beneFirstname) => {
                      if (beneFirstname != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("Last Name is required"),
                    otherwise: Yup.string().when("beneGovtid", {
                      is: (beneGovtid) => {
                        if (beneGovtid != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("Last Name is required"),
                      otherwise: Yup.string().when("beneDob", {
                        is: (beneDob) => {
                          if (beneDob != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("Last Name is required"),
                        otherwise: Yup.string().when("benePhone", {
                          is: (benePhone) => {
                            if (benePhone != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required("Last Name is required"),
                          otherwise: Yup.string().when("beneEmail", {
                            is: (beneEmail) => {
                              if (beneEmail != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "Last Name is required"
                            ),
                            otherwise: Yup.string().when("beneSharingPercent", {
                              is: (beneSharingPercent) => {
                                if (beneSharingPercent != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "Last Name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressLine1", {
                                is: (beneAddressLine1) => {
                                  if (beneAddressLine1 != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "Last Name is required"
                                ),
                                otherwise: Yup.string().when("beneGender", {
                                  is: (beneGender) => {
                                    if (beneGender != undefined) {
                                      return true;
                                    }
                                  },
                                  then: Yup.string().required(
                                    "Last Name is required"
                                  ),
                                  otherwise: Yup.string().when(
                                    "beneAddressLine2",
                                    {
                                      is: (beneAddressLine2) => {
                                        if (beneAddressLine2 != undefined) {
                                          return true;
                                        }
                                      },
                                      then: Yup.string().required(
                                        "Last Name is required"
                                      ),
                                      otherwise: Yup.string().when(
                                        "beneAddressCity",
                                        {
                                          is: (beneAddressCity) => {
                                            if (beneAddressCity != undefined) {
                                              return true;
                                            }
                                          },
                                          then: Yup.string().required(
                                            "Last Name is required"
                                          ),
                                          otherwise: Yup.string().when(
                                            "beneAddressState",
                                            {
                                              is: (beneAddressState) => {
                                                if (
                                                  beneAddressState != undefined
                                                ) {
                                                  return true;
                                                }
                                              },
                                              then: Yup.string().required(
                                                "Last Name is required"
                                              ),
                                              otherwise: Yup.string().when(
                                                "beneAddressZip",
                                                {
                                                  is: (beneAddressZip) => {
                                                    if (
                                                      beneAddressZip !=
                                                      undefined
                                                    ) {
                                                      return true;
                                                    }
                                                  },
                                                  then: Yup.string().required(
                                                    "Last Name is required"
                                                  ),
                                                  otherwise: Yup.string().when(
                                                    "beneRelationOwner",
                                                    {
                                                      is: (
                                                        beneRelationOwner
                                                      ) => {
                                                        if (
                                                          beneRelationOwner !=
                                                          undefined
                                                        ) {
                                                          return true;
                                                        }
                                                      },
                                                      then: Yup.string().required(
                                                        "Last Name is required"
                                                      ),
                                                      otherwise: Yup.string(),
                                                    }
                                                  ),
                                                }
                                              ),
                                            }
                                          ),
                                        }
                                      ),
                                    }
                                  ),
                                }),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            beneTrustName: Yup.string()
              .when("benePartyType", {
                is: (benePartyType) => {
                  if (benePartyType == "Person") {
                    return true;
                  }
                },
                then: Yup.string(),
                otherwise: Yup.string().when(" beneTrustee", {
                  is: (beneTrustee) => {
                    if (beneTrustee != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("Trust Name is required"),
                  otherwise: Yup.string().when("beneGovtid", {
                    is: (beneGovtid) => {
                      if (beneGovtid != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("Trust Name is required"),
                    otherwise: Yup.string().when("beneSharingPercent", {
                      is: (beneSharingPercent) => {
                        if (beneSharingPercent != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("Trust Name is required"),
                      otherwise: Yup.string().when("beneEmail", {
                        is: (beneEmail) => {
                          if (beneEmail != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("Trust Name is required"),
                        otherwise: Yup.string().when("benePhone", {
                          is: (benePhone) => {
                            if (benePhone != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required("Trust Name is required"),
                          otherwise: Yup.string().when("beneAddressLine1", {
                            is: (beneAddressLine1) => {
                              if (beneAddressLine1 != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "Trust Name is required"
                            ),
                            otherwise: Yup.string().when("beneAddressLine2", {
                              is: (beneAddressLine2) => {
                                if (beneAddressLine2 != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "Trust Name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressCity", {
                                is: (beneAddressCity) => {
                                  if (beneAddressCity != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "Trust Name is required"
                                ),
                                otherwise: Yup.string().when(
                                  "beneAddressState",
                                  {
                                    is: (beneAddressState) => {
                                      if (beneAddressState != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.string().required(
                                      "Trust Name is required"
                                    ),
                                    otherwise: Yup.string().when(
                                      "beneAddressZip",
                                      {
                                        is: (beneAddressZip) => {
                                          if (beneAddressZip != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.string().required(
                                          "Trust Name is required"
                                        ),
                                        otherwise: Yup.string(),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              })
              .min(3, "At least 03 characters")
              .max(50, "Maximum 25 characters are allowed"),
            beneTrustee: Yup.string()
              .when("benePartyType", {
                is: (benePartyType) => {
                  if (benePartyType === "Person") {
                    return true;
                  }
                },
                then: Yup.string(),
                otherwise: Yup.string().when("beneTrustName", {
                  is: (beneTrustName) => {
                    if (beneTrustName != undefined) {
                      return true;
                    }
                  },
                  then: Yup.string().required("Trustee name is required"),
                  otherwise: Yup.string().when("beneGovtid", {
                    is: (beneGovtid) => {
                      if (beneGovtid != undefined) {
                        return true;
                      }
                    },
                    then: Yup.string().required("Trustee name is required"),
                    otherwise: Yup.string().when("beneSharingPercent", {
                      is: (beneSharingPercent) => {
                        if (beneSharingPercent != undefined) {
                          return true;
                        }
                      },
                      then: Yup.string().required("Trustee name is required"),
                      otherwise: Yup.string().when("beneEmail", {
                        is: (beneEmail) => {
                          if (beneEmail != undefined) {
                            return true;
                          }
                        },
                        then: Yup.string().required("Trustee name is required"),
                        otherwise: Yup.string().when("benePhone", {
                          is: (benePhone) => {
                            if (benePhone != undefined) {
                              return true;
                            }
                          },
                          then: Yup.string().required(
                            "Trustee name is required"
                          ),
                          otherwise: Yup.string().when("beneAddressLine1", {
                            is: (beneAddressLine1) => {
                              if (beneAddressLine1 != undefined) {
                                return true;
                              }
                            },
                            then: Yup.string().required(
                              "Trustee name is required"
                            ),
                            otherwise: Yup.string().when("beneAddressLine2", {
                              is: (beneAddressLine2) => {
                                if (beneAddressLine2 != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.string().required(
                                "Trustee Name is required"
                              ),
                              otherwise: Yup.string().when("beneAddressCity", {
                                is: (beneAddressCity) => {
                                  if (beneAddressCity != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.string().required(
                                  "Trustee name is required"
                                ),
                                otherwise: Yup.string().when(
                                  "beneAddressState",
                                  {
                                    is: (beneAddressState) => {
                                      if (beneAddressState != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.string().required(
                                      "Trustee name is required"
                                    ),
                                    otherwise: Yup.string().when(
                                      "beneAddressZip",
                                      {
                                        is: (beneAddressZip) => {
                                          if (beneAddressZip != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.string().required(
                                          "Trustee name is required"
                                        ),
                                        otherwise: Yup.string(),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              })
              .min(3, "At least 03 characters")
              .max(25, "Maximum 25 characters are allowed"),
            beneDob: Yup.string()
              .nullable()
              .notRequired()
              .length(10, "Date format is invalid")
              .test(
                "DOB",
                "The entered date cannot be in the future.",
                (value) => {
                  if (value != undefined) {
                    return moment().diff(moment(value), moment(today)) > 1;
                  } else {
                    return true;
                  }
                }
              ),
            beneGovtid: Yup.string()

              .typeError("You must specify a number")
              .min(11, "Minimum 9 characters are allowed")
              .matches(/^[0-9-+()]*$/, "Must be only digits"),
            beneSharingPercent: Yup.number()
              .when("benePartyType", {
                is: (benePartyType) => {
                  if (benePartyType === "Trust") {
                    return true;
                  }
                },
                then: Yup.number().when("benePartyType", {
                  is: (benePartyType) => {
                    if (benePartyType === "Person") {
                      return true;
                    }
                  },
                  then: Yup.number(),
                  otherwise: Yup.number().when("beneTrustName", {
                    is: (beneTrustName) => {
                      if (beneTrustName != undefined) {
                        return true;
                      }
                    },
                    then: Yup.number().required(
                      "Percentage Sharing is required"
                    ),
                    otherwise: Yup.number().when("beneTrustee", {
                      is: (beneTrustee) => {
                        if (beneTrustee != undefined) {
                          return true;
                        }
                      },
                      then: Yup.number().required(
                        "Percentage Sharing is required"
                      ),
                      otherwise: Yup.number().required(
                        "Percentage Sharing is required"
                      ),
                      otherwise: Yup.number().when("beneGovtid", {
                        is: (beneGovtid) => {
                          if (beneGovtid != undefined) {
                            return true;
                          }
                        },
                        then: Yup.number().required(
                          "Percentage Sharing is required"
                        ),
                        otherwise: Yup.number().when("beneSharingPercent", {
                          is: (beneSharingPercent) => {
                            if (beneSharingPercent != undefined) {
                              return true;
                            }
                          },
                          then: Yup.number().required(
                            "Percentage Sharing is required"
                          ),
                          otherwise: Yup.number().when("beneEmail", {
                            is: (beneEmail) => {
                              if (beneEmail != undefined) {
                                return true;
                              }
                            },
                            then: Yup.number().required(
                              "Percentage Sharing is required"
                            ),
                            otherwise: Yup.number().when("benePhone", {
                              is: (benePhone) => {
                                if (benePhone != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.number().required(
                                "Percentage Sharing is required"
                              ),
                              otherwise: Yup.number().when("beneAddressLine1", {
                                is: (beneAddressLine1) => {
                                  if (beneAddressLine1 != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.number().required(
                                  "Percentage Sharing is required"
                                ),
                                otherwise: Yup.number().when(
                                  "beneAddressLine2",
                                  {
                                    is: (beneAddressLine2) => {
                                      if (beneAddressLine2 != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.number().required(
                                      "Trustee Name is required"
                                    ),
                                    otherwise: Yup.number().when(
                                      "beneAddressCity",
                                      {
                                        is: (beneAddressCity) => {
                                          if (beneAddressCity != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.number().required(
                                          "Percentage Sharing is required"
                                        ),
                                        otherwise: Yup.number().when(
                                          "beneAddressState",
                                          {
                                            is: (beneAddressState) => {
                                              if (
                                                beneAddressState != undefined
                                              ) {
                                                return true;
                                              }
                                            },
                                            then: Yup.number().required(
                                              "Percentage Sharing is required"
                                            ),
                                            otherwise: Yup.number().when(
                                              "beneAddressZip",
                                              {
                                                is: (beneAddressZip) => {
                                                  if (
                                                    beneAddressZip != undefined
                                                  ) {
                                                    return true;
                                                  }
                                                },
                                                then: Yup.number().required(
                                                  "Percentage Sharing is required"
                                                ),
                                                otherwise: Yup.number(),
                                              }
                                            ),
                                          }
                                        ),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
                otherwise: Yup.number().when("beneMiddlename", {
                  is: (beneMiddlename) => {
                    if (beneMiddlename != undefined) {
                      return true;
                    }
                  },
                  then: Yup.number().required("Percentage Sharing is required"),
                  otherwise: Yup.number().when("beneLastname", {
                    is: (beneLastname) => {
                      if (beneLastname != undefined) {
                        return true;
                      }
                    },
                    then: Yup.number().required(
                      "Percentage Sharing is required"
                    ),
                    otherwise: Yup.number().when("beneFirstname", {
                      is: (beneFirstname) => {
                        if (beneFirstname != undefined) {
                          return true;
                        }
                      },
                      then: Yup.number().required(
                        "Percentage Sharing is required"
                      ),
                      otherwise: Yup.number().when("beneDob", {
                        is: (beneDob) => {
                          if (beneDob != undefined) {
                            return true;
                          }
                        },
                        then: Yup.number().required(
                          "Percentage Sharing is required"
                        ),
                        otherwise: Yup.number().when("benePhone", {
                          is: (benePhone) => {
                            if (benePhone != undefined) {
                              return true;
                            }
                          },
                          then: Yup.number().required(
                            "Percentage Sharing is required"
                          ),
                          otherwise: Yup.number().when("beneEmail", {
                            is: (beneEmail) => {
                              if (beneEmail != undefined) {
                                return true;
                              }
                            },
                            then: Yup.number().required(
                              "Percentage Sharing is required"
                            ),
                            otherwise: Yup.number().when("beneAddressLine1", {
                              is: (beneAddressLine1) => {
                                if (beneAddressLine1 != undefined) {
                                  return true;
                                }
                              },
                              then: Yup.number().required(
                                "Percentage Sharing is required"
                              ),
                              otherwise: Yup.number().when("beneGender", {
                                is: (beneGender) => {
                                  if (beneGender != undefined) {
                                    return true;
                                  }
                                },
                                then: Yup.number().required(
                                  "Percentage Sharing is required"
                                ),
                                otherwise: Yup.number().when(
                                  "beneAddressLine2",
                                  {
                                    is: (beneAddressLine2) => {
                                      if (beneAddressLine2 != undefined) {
                                        return true;
                                      }
                                    },
                                    then: Yup.number().required(
                                      "Percentage Sharing is required"
                                    ),
                                    otherwise: Yup.number().when(
                                      "beneAddressCity",
                                      {
                                        is: (beneAddressCity) => {
                                          if (beneAddressCity != undefined) {
                                            return true;
                                          }
                                        },
                                        then: Yup.number().required(
                                          "Percentage Sharing is required"
                                        ),
                                        otherwise: Yup.number().when(
                                          "beneAddressState",
                                          {
                                            is: (beneAddressState) => {
                                              if (
                                                beneAddressState != undefined
                                              ) {
                                                return true;
                                              }
                                            },
                                            then: Yup.number().required(
                                              "Percentage Sharing is required"
                                            ),
                                            otherwise: Yup.number().when(
                                              "beneAddressZip",
                                              {
                                                is: (beneAddressZip) => {
                                                  if (
                                                    beneAddressZip != undefined
                                                  ) {
                                                    return true;
                                                  }
                                                },
                                                then: Yup.number().required(
                                                  "Percentage Sharing is required"
                                                ),
                                                otherwise: Yup.number().when(
                                                  "beneRelationOwner",
                                                  {
                                                    is: (beneRelationOwner) => {
                                                      if (
                                                        beneRelationOwner !=
                                                        undefined
                                                      ) {
                                                        return true;
                                                      }
                                                    },
                                                    then: Yup.number().required(
                                                      "Percentage Sharing is required"
                                                    ),
                                                    otherwise:
                                                      Yup.number().when(
                                                        "beneGovtid",
                                                        {
                                                          is: (beneGovtid) => {
                                                            if (
                                                              beneGovtid !=
                                                              undefined
                                                            ) {
                                                              return true;
                                                            }
                                                          },
                                                          then: Yup.number().required(
                                                            "Percentage Sharing is required"
                                                          ),
                                                          otherwise:
                                                            Yup.number(),
                                                        }
                                                      ),
                                                  }
                                                ),
                                              }
                                            ),
                                          }
                                        ),
                                      }
                                    ),
                                  }
                                ),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              })

              .min(1, "Minimum 1 percent is required")
              .max(100, "Maximum 100 percent is allowed"),
            // benePhone: Yup.string()
            //   .nullable()
            //   .notRequired()
            //   .test("Digits only", "Only numbers are allowed", digitsOnly)
            //   .length(10, "10 characters are allowed"),
            beneEmail: Yup.string().email(" Invalid email address").max(255),

            beneAddressLine1: Yup.string().max(
              50,
              "Maximum 50 characters are allowed"
            ),

            beneAddressZip: Yup.string()
              .nullable()
              .notRequired()
              .test("Digits only", "Only numbers are allowed", digitsOnly)
              .length(5, "5 characters are allowed"),
          })
        )
      : null,
  });

  const handleRedirect = () => {
    if (appData.characteristics[0].fieldValues.appType[0] === "Individual") {
      router.push(ROUTE_PATHS.YOUALONE);
    } else if (appData.characteristics[0].fieldValues.appType[0] === "Joint") {
      router.push(ROUTE_PATHS.JOINTOWNER);
    } else if (appData.characteristics[0].fieldValues.appType[0] === "Trust") {
      router.push(ROUTE_PATHS.TRUST);
    }
  };

  async function removeLocator() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
    var sumBeneLocator = [];

    let locator = sessionStorage.getItem("policyLocator");
    if (primLocator.length > 0 && contiLocator.length > 0) {
      var sumBeneLocator = [...primLocator, ...contiLocator];

      var removebody = {
        removeExposures: sumBeneLocator,
      };
    } else if (primLocator.length > 0 && contiLocator.length == 0) {
      var removebody = {
        removeExposures: primLocator,
      };
    }
    if (primLocator || contiLocator) {
      await fetch(Url + updatePolicy + locator + update, {
        method: "POST",
        body: JSON.stringify(removebody),

        headers: {
          Authorization: auth.authorizationToken,

          "Content-Type": "application/json",

          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }

  async function postdata(item) {
    let locator = sessionStorage.getItem("policyLocator");

    if (
      (item.BeneficiaryInfo.length < 1 && item.contingentBeneficiary < 1) ||
      (item.BeneficiaryInfo[0].benePartyType == "Person" &&
        item.BeneficiaryInfo[0].beneFirstname.length == 0) ||
      (item.BeneficiaryInfo[0].benePartyType == "Trust" &&
        item.BeneficiaryInfo[0].beneTrustName.length == 0)
    ) {
      setShowbene(true);
      // window.location.href = "/application/product-details";
    } else {
      setpercentcheck(true);
      var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));
      var exposure = { exposureName: "Beneficiary" };

      var PrimaryBeneficiaryData = [];
      var finalPrimaryBeneficiaryData = [];
      var contingentBenficiaryData = [];
      var finalcontingentBenficiaryData = [];

      var policyArray1 = item.BeneficiaryInfo;
      var PrimaryBeneficiaryData = policyArray1.filter(function (obj) {
        return obj.beneFirstname !== "" || obj.beneTrustee !== "";
      });
      var finalPrimaryBeneficiaryData = PrimaryBeneficiaryData.map((el) => {
        return Object.keys(el).reduce((newObj, key) => {
          const value = el[key];
          if (value !== "") {
            newObj[key] = value;
          }
          return newObj;
        }, {});
      });

      const primarysum = 0;
      const contingentsum = 0;

      primarysum = finalPrimaryBeneficiaryData.reduce((sum, current) => {
        return sum + (parseInt(current.beneSharingPercent) || 0);
      }, 0);

      var policyArray2 = item.contingentBeneficiary;
      var contingentBenficiaryData = policyArray2.filter(function (obj) {
        return obj.beneFirstname !== "" || obj.beneTrustee !== "";
      });

      var finalcontingentBenficiaryData = contingentBenficiaryData.map((el) => {
        return Object.keys(el).reduce((newObj, key) => {
          const value = el[key];
          if (value !== "") {
            newObj[key] = value;
          }
          return newObj;
        }, {});
      });

      contingentsum = finalcontingentBenficiaryData.reduce((sum, current) => {
        return sum + (parseInt(current.beneSharingPercent) || 0);
      }, 0);

      var data1 = [];
      var data2 = [];
      var finaldata = [];

      if (
        finalPrimaryBeneficiaryData.length > 0 &&
        finalcontingentBenficiaryData.length == 0
      ) {
        for (var i = 0; i < finalPrimaryBeneficiaryData.length; ++i) {
          data1[i] = Object.assign({}, exposure, {
            fieldValues: finalPrimaryBeneficiaryData[i],
            perils: [
              {
                name: "ignoreMe",
              },
            ],
          });
        }

        finaldata = [...data1];

        if (primarysum != 100) {
          setprimaryerrorpopup(true);
          setpercentcheck(true);
        } else {
          const policy = finaldata;

          removeLocator();

          const policybody = {
            addExposures: policy,
          };

          await fetch(Url + updatePolicy + locator + update, {
            method: "POST",
            body: JSON.stringify(policybody),

            headers: {
              Authorization: auth.authorizationToken,

              "Content-Type": "application/json",

              Accept: "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              sessionStorage.setItem(
                "AL",
                data.exposures[0].characteristics[0].exposureLocator
              );

              window.location.href = "/application/product-details";
            })
            .catch((error) => {
              console.log("Error:", error);
            });
        }
      } else if (
        finalPrimaryBeneficiaryData.length == 0 &&
        finalcontingentBenficiaryData.length > 0
      ) {
        for (var j = 0; j < finalcontingentBenficiaryData.length; ++j) {
          data2[j] = Object.assign({}, exposure, {
            fieldValues: finalcontingentBenficiaryData[j],
            perils: [
              {
                name: "ignoreMe",
              },
            ],
          });
        }

        finaldata = [...data2];
        if (contingentsum != 100) {
          setprimaryerrorpopup(true);
          setpercentcheck(true);
        } else {
          const policy = finaldata;

          removeLocator();

          const policybody = {
            addExposures: policy,
          };

          await fetch(Url + updatePolicy + locator + update, {
            method: "POST",
            body: JSON.stringify(policybody),

            headers: {
              Authorization: auth.authorizationToken,

              "Content-Type": "application/json",

              Accept: "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              sessionStorage.setItem(
                "AL",
                data.exposures[0].characteristics[0].exposureLocator
              );

              window.location.href = "/application/product-details";
            })
            .catch((error) => {
              console.log("Error:", error);
            });
        }
      } else if (
        finalPrimaryBeneficiaryData.length >= 1 &&
        finalcontingentBenficiaryData.length >= 1
      ) {
        for (var i = 0; i < finalPrimaryBeneficiaryData.length; ++i) {
          data1[i] = Object.assign({}, exposure, {
            fieldValues: finalPrimaryBeneficiaryData[i],
          });
        }
        for (var j = 0; j < finalcontingentBenficiaryData.length; ++j) {
          data2[j] = Object.assign({}, exposure, {
            fieldValues: finalcontingentBenficiaryData[j],
          });
        }
        finaldata = [...data1, ...data2];

        if (primarysum != 100 || contingentsum != 100) {
          setprimaryerrorpopup(true);
          setpercentcheck(true);
        } else {
          const policy = finaldata;
          // console.log("Final Values---",policy);

          removeLocator();

          const policybody = {
            addExposures: policy,
          };

          await fetch(Url + updatePolicy + locator + update, {
            method: "POST",
            body: JSON.stringify(policybody),

            headers: {
              Authorization: auth.authorizationToken,

              "Content-Type": "application/json",

              Accept: "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              sessionStorage.setItem(
                "AL",
                data.exposures[0].characteristics[0].exposureLocator
              );

              window.location.href = "/application/product-details";
            })
            .catch((error) => {
              console.log("Error:", error);
            });
        }
      }
    }
  }

  // -----Setting Page status AUX Data Function -----

  async function pagestatus(auth, locator) {
    const pl = sessionStorage.getItem("policyLocator");

    const status = {
      auxData: {
        key: "Beneficiary",
        value: "Complete",
      },
    };

    await fetch(Url + auxDataUrl + locator, {
      method: "PUT",
      body: JSON.stringify(status),

      headers: {
        Authorization: auth.authorizationToken,

        "Content-Type": "application/json",

        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  function ordinal(number) {
    const english_ordinal_rules = new Intl.PluralRules("en", {
      type: "ordinal",
    });
    const suffixes = {
      one: "st",
      two: "nd",
      few: "rd",
      other: "th",
    };
    const suffix = suffixes[english_ordinal_rules.select(number)];
    return number + suffix;
  }

  const [showpriary, setshowpriary] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [showcontingent, setshowcontingent] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const ssnshow = (e, condition) => {
    var show = [false, false, false, false, false];
    const newTodos = [...show];
    newTodos[e] = condition;
    setshowpriary(newTodos);
  };

  const ssnshow1 = (e, condition) => {
    var show = [false, false, false, false, false];
    const newTodos = [...show];
    newTodos[e] = condition;
    setshowcontingent(newTodos);
  };
  const [deletepopup, setdeletepopup] = useState(false);
  const [deletepopup1, setdeletepopup1] = useState(false);

  const closedeletemodal = useCallback(() => {
    setdeletepopup(false);
    setdeletepopup1(false);
  }, []);

  const delete1 = () => {
    setdeletepopup(true);
  };

  const delete2 = () => {
    setdeletepopup1(true);
  };

  const handleClick = () => {
    setprimaryerrorpopup(false);
    setpercentcheck(false);
  };

  // console.log("Button Disabled---", percentcheck);

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

      <Sider />

      <Stepper check={check} vertical={true} percent={16} index={1} />
      <main className="flex flex-col gap-6 bene-pl">
        <Container className="flex-1">
          <h5 className="quotecolor text-lg sm:text-xl ml-5 sm:ml-2 mt-4 sm:mt-0 mb-0 sm:mb-5   ">
            Beneficiary
          </h5>

          <Flex className="flex h-12 mt-2 sm:pl-55 card-header blue-bg">
            <img
              className="icon-image hidden sm:visible"
              src={IMAGE_PATHS.ANNUITANT}
            />
            <h4 className="mt-3 ml-5 sm:ml-10 sub-font-size">
              Primary Beneficiary
            </h4>
          </Flex>

          <Formik
            initialValues={initialValues}
            validationSchema={validation}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}
            onSubmit={(values, errors) => {
              if (values.BeneficiaryInfo.length === 0) {
                setwarnprimary(true);
              }
              if (errors) {
                // console.log("Values---", values);

                postdata(values);
              }
            }}
          >
            {({
              values,
              errors,
              handleChange,
              isSubmitting,
              submitForm,
              isValid,
              dirty,
            }) => (
              <Form>
                {/* <pre style={{ marginLeft: "0em" }}>
                  {JSON.stringify(values.BeneficiaryInfo, null, 2)}
                </pre>
                <pre style={{ marginLeft: "0em" }}>
                  {JSON.stringify(errors.BeneficiaryInfo, null, 2)}
                </pre> */}
                {/* <pre style={{ marginLeft: "0em" }}>
                  {JSON.stringify(isSubmitting,isValid, null, 2)}
                  </pre>
                  <pre style={{ marginLeft: "0em" }}>
                  {JSON.stringify(isSubmitting,isValid, null, 2)}
                </pre> */}
                <FieldArray name="BeneficiaryInfo">
                  {({ remove, push }) => (
                    <div>
                      {values.BeneficiaryInfo.length < 6 &&
                        values.BeneficiaryInfo.map((item, index) => (
                          <div key={index}>
                            {deletepopup && (
                              <ModalPopUp
                                showsModal={true}
                                title={deletewarn}
                                confirmdelete={true}
                                index={index}
                                remove={() => remove(index)}
                                closeModal={closedeletemodal}
                              />
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
                                      onClick={closeModal}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="w-3/6 btncolor font-bold ml-10"
                                      onClick={() =>
                                        (window.location.href =
                                          "/application/product-details")
                                      }
                                    >
                                      OK
                                    </Button>
                                  </Flex>
                                }
                              />
                            )}
                            {primaryerrorpopup && (
                              <Modal
                                title={
                                  "Sum of all beneficiary percentages must be 100"
                                }
                                showsModal={true}
                                body={
                                  <Flex className="items-center justify-center">
                                    <Button
                                      className="w-2/6 bg-linkcolor"
                                      onClick={handleClick}
                                    >
                                      OK
                                    </Button>
                                  </Flex>
                                }
                              />
                            )}
                            <Accordion
                              activeIndex={0}
                              className="font-bold quotecolor mt-0 p-0  "
                            >
                              <AccordionTab
                                header={
                                  <Flex className="flex flex-row justify-between acc-width">
                                    <div className="flex items-center mt-0 sm:mt-0 w-64 sm:w-72">
                                      {" "}
                                      {ordinal(index + 1) +
                                        " " +
                                        " Primary Beneficiary Details"}
                                    </div>

                                    <Flex className=" flex justify-end ">
                                      <div className="hidden sm:inline-block">
                                        <Button className="accordion-btn">
                                          <img
                                            src={IMAGE_PATHS.DELETE}
                                            className="inline deleteicon"
                                            title="Delete"
                                            onClick={delete1}
                                          />
                                          <label
                                            className="cursor-pointer pl-1 font-semibold text-blue-500"
                                            onClick={delete1}
                                          >
                                            Delete
                                          </label>
                                        </Button>
                                      </div>
                                      <Flex className="inline-block sm:hidden justify-end">
                                        <img
                                          className="inline h-5 pr-0 ml-9 cursor-pointer"
                                          src={IMAGE_PATHS.DELETE_BIG}
                                          onClick={delete1}
                                        />
                                      </Flex>
                                    </Flex>
                                  </Flex>
                                }
                                className="p-0 acc-font"
                              >
                                <Card className=" ">
                                  <Grid className="grid grid-cols-2 ml-0 sm:ml-5 mt-2 pr-2">
                                    <div className="col-span-2 sm:col-span-1 ">
                                      <Label className="col-span-1 sm: col-span-3 ">
                                        <h5 className="sub-font-size font-bold text-gray-700">
                                          Beneficiary Type
                                        </h5>
                                        <div className="text-sm text-black font-semibold">
                                          Who is the primary beneficiary on the
                                          policy?
                                        </div>
                                      </Label>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-black p-1 text-md px-0 sm:px-2 font-semibold">
                                      {benefic && benefic.length > 0 ? (
                                        item && item.addForm == "" ? (
                                          <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                                            <div className=" w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-0 sm:ml-32 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                              <Field
                                                type="radio"
                                                name={`BeneficiaryInfo.${index}.benePartyType`}
                                                value="Person"
                                                checked={
                                                  values.BeneficiaryInfo[index]
                                                    .benePartyType === "Person"
                                                }
                                              />
                                              <label
                                                htmlFor={`BeneficiaryInfo.${index}.benePartyType`}
                                                className="pl-2 text-sm"
                                              >
                                                Person
                                              </label>
                                            </div>

                                            <div className="w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-1 sm:ml-12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                              <Field
                                                type="radio"
                                                name={`BeneficiaryInfo.${index}.benePartyType`}
                                                value="Trust"
                                                checked={
                                                  values.BeneficiaryInfo[index]
                                                    .benePartyType === "Trust"
                                                }
                                              />
                                              <label
                                                htmlFor={`BeneficiaryInfo.${index}.benePartyType`}
                                                className="pl-2 text-sm"
                                              >
                                                Trust
                                              </label>
                                            </div>
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.benePartyType`}
                                              component="div"
                                              className="p-error grid  text-sm p-d-block"
                                            />
                                          </Grid>
                                        ) : (
                                          <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                                            <div
                                              className=" cursor-pointer w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-0 sm:ml-32 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11"
                                              onClick={addwarnperson}
                                            >
                                              <Field
                                                type="radio"
                                                name={`BeneficiaryInfo.${index}.benePartyType`}
                                                value="Person"
                                                disabled={
                                                  values.BeneficiaryInfo[index]
                                                    .benePartyType === "Trust"
                                                    ? true
                                                    : false
                                                }
                                                checked={
                                                  values.BeneficiaryInfo[index]
                                                    .benePartyType === "Person"
                                                }
                                              />
                                              <label
                                                htmlFor={`BeneficiaryInfo.${index}.benePartyType`}
                                                className="pl-2 text-sm"
                                              >
                                                Person
                                              </label>
                                            </div>

                                            <div
                                              className="cursor-pointer w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-1 sm:ml-12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11"
                                              onClick={addwarntrust}
                                            >
                                              <Field
                                                type="radio"
                                                name={`BeneficiaryInfo.${index}.benePartyType`}
                                                value="Trust"
                                                disabled={
                                                  values.BeneficiaryInfo[index]
                                                    .benePartyType === "Person"
                                                    ? true
                                                    : false
                                                }
                                                checked={
                                                  values.BeneficiaryInfo[index]
                                                    .benePartyType === "Trust"
                                                }
                                              />
                                              <label
                                                htmlFor={`BeneficiaryInfo.${index}.benePartyType`}
                                                className="pl-2 text-sm"
                                              >
                                                Trust
                                              </label>
                                            </div>
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.benePartyType`}
                                              component="div"
                                              className="p-error grid text-sm  p-d-block"
                                            />
                                          </Grid>
                                        )
                                      ) : (
                                        <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                                          <div className=" w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-0 sm:ml-32 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                            <Field
                                              type="radio"
                                              name={`BeneficiaryInfo.${index}.benePartyType`}
                                              value="Person"
                                              checked={
                                                values.BeneficiaryInfo[index]
                                                  .benePartyType === "Person"
                                              }
                                            />
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.benePartyType`}
                                              className="pl-2 text-sm"
                                            >
                                              Person
                                            </label>
                                          </div>

                                          <div className="w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-1 sm:ml-12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                            <Field
                                              type="radio"
                                              name={`BeneficiaryInfo.${index}.benePartyType`}
                                              value="Trust"
                                              checked={
                                                values.BeneficiaryInfo[index]
                                                  .benePartyType === "Trust"
                                              }
                                            />
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.benePartyType`}
                                              className="pl-2 text-sm"
                                            >
                                              Trust
                                            </label>
                                          </div>
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.benePartyType`}
                                            component="div"
                                            className="p-error grid text-sm  p-d-block"
                                          />
                                        </Grid>
                                      )}
                                    </div>
                                  </Grid>
                                </Card>
                                <Card className="prim-beneficiary1 border-transparent">
                                  <div className="ml-1 sm:ml-5">
                                    <h2 className="ml-1 h-5 sm:h-0 font-bold sub-font-size">
                                      Primary Details
                                    </h2>

                                    {values.BeneficiaryInfo[index]
                                      .benePartyType === "Person" ? (
                                      <Grid className="grid-cols-3 gap-4 mt-4 sm:mt-10">
                                        <Container className="col-span-3 sm:col-span-1 w-3/4">
                                          <Container className="grid-rows-2">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneFirstname`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              First Name*
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneFirstname`}
                                              placeholder="First Name"
                                              type="text"
                                              className="amount"
                                            />
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneFirstname`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                        <Container className="col-span-3 sm:col-span-1">
                                          <Container className="grid-rows-2">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneMiddlename`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Middle Name
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneMiddlename`}
                                              placeholder="Middle Name"
                                              type="text"
                                              className="amount"
                                            />
                                          </Container>
                                        </Container>
                                        <Container className="col-span-3 sm:col-span-1">
                                          <Container className="grid-rows-2">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneLastname`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Last Name*
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneLastname`}
                                              placeholder="Last Name"
                                              type="text"
                                              className="amount"
                                            />
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneLastname`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>
                                    ) : null}

                                    {values.BeneficiaryInfo[index]
                                      .benePartyType === "Trust" ? (
                                      <Grid className="grid-cols-1  gap-4 mt-1 sm:mt-7">
                                        <Container className=" col-span-1 sm:col-span-1 w-full sm:w-4/6  ">
                                          <Container className=" p-0 sm:grid-rows-2 ">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneTrustName`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Full Legal Name of Trust*
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneTrustName`}
                                              placeholder="Full Legal Name of Trust"
                                              type="text"
                                              className="sm:w-11/12 amount"
                                            />
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneTrustName`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>
                                    ) : null}

                                    {values.BeneficiaryInfo[index]
                                      .benePartyType === "Person" ? (
                                      <Grid className="grid-cols-3 gap-4 mt-5">
                                        <Container className="col-span-3 sm:col-span-1">
                                          <Container className="relative grid-rows-2">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneGovtid`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Social Security Number
                                            </label>

                                            <SecureMaskInput
                                              name={`BeneficiaryInfo.${index}.beneGovtid`}
                                              value={item.beneGovtid}
                                              realvalue={handleChange}
                                              className="amount"
                                              mask={showpriary[index]}
                                            />

                                            <span
                                              className={`${
                                                showpriary[index] === false
                                                  ? "inline-block"
                                                  : "hidden"
                                              } icon ml-16 sm:ml-0`}
                                            >
                                              <img
                                                onClick={() =>
                                                  ssnshow(index, true)
                                                }
                                                className="icon-image inline cursor-pointer"
                                                src={IMAGE_PATHS.HIDE_EYE}
                                              />
                                            </span>

                                            <span
                                              className={`${
                                                showpriary[index] === true
                                                  ? "inline-block"
                                                  : "hidden"
                                              } icon ml-16 sm:ml-0`}
                                            >
                                              <img
                                                onClick={() =>
                                                  ssnshow(index, false)
                                                }
                                                className="icon-image inline cursor-pointer"
                                                src={IMAGE_PATHS.SHOW_EYE}
                                              />
                                            </span>
                                          </Container>

                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneGovtid`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                        <Container className="col-span-3 sm:col-span-1">
                                          <Container className="grid-rows-2 w-3/4">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneDob`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Birth Date
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneDob`}
                                              placeholder="MM-DD-YYYY"
                                              type="date"
                                              className="amount"
                                            />
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneDob`}
                                              component="div"
                                              className="p-error grid text-sm  p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                        <Container className="col-span-3 sm:col-span-1">
                                          <Container className="grid-rows-2">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneGender`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Gender assigned at birth
                                            </label>

                                            <Field
                                              as="select"
                                              className="amount"
                                              name={`BeneficiaryInfo.${index}.beneGender`}
                                            >
                                              <option value="">Select</option>
                                              <option value="Male">Male</option>
                                              <option value="Female">
                                                Female
                                              </option>
                                            </Field>
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneGender`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>
                                    ) : null}

                                    {values.BeneficiaryInfo[index]
                                      .benePartyType === "Trust" ? (
                                      <Grid className="grid-cols-1 gap-4 mt-5">
                                        <Container className="col-span-1 sm:col-span-1 w-full sm:w-4/6">
                                          <Container className="grid-rows-2 ">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneTrustee`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Trustee*
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneTrustee`}
                                              placeholder="Trustee"
                                              type="text"
                                              className="sm:w-11/12 amount"
                                            />
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneTrustee`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>
                                    ) : null}

                                    {values.BeneficiaryInfo[index]
                                      .benePartyType === "Trust" ? (
                                      <Grid className=" grid  grid-cols-3 gap-4 mt-5">
                                        <Container className="container col-span-3 w-full pr-0 sm:pr-4 sm:col-span-1 ">
                                          <Container className="relative grid-rows-2 ">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneGovtid`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Tax ID of Trust
                                            </label>

                                            <SecureMaskInput
                                              name={`BeneficiaryInfo.${index}.beneGovtid`}
                                              value={item.beneGovtid}
                                              realvalue={handleChange}
                                              className="amount"
                                              mask={showpriary[index]}
                                            />

                                            <span
                                              className={`${
                                                showpriary[index] === false
                                                  ? "inline-block"
                                                  : "hidden"
                                              } icon ml-16 sm:ml-0`}
                                            >
                                              <img
                                                onClick={() =>
                                                  ssnshow(index, true)
                                                }
                                                className="icon-image inline cursor-pointer"
                                                src={IMAGE_PATHS.HIDE_EYE}
                                              />
                                            </span>

                                            <span
                                              className={`${
                                                showpriary[index] === true
                                                  ? "inline-block"
                                                  : "hidden"
                                              } icon ml-16 sm:ml-0`}
                                            >
                                              <img
                                                onClick={() =>
                                                  ssnshow(index, false)
                                                }
                                                className="icon-image inline cursor-pointer"
                                                src={IMAGE_PATHS.SHOW_EYE}
                                              />
                                            </span>
                                          </Container>
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneGovtid`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                        <Container className="container col-span-3 w-full pr-0 sm:pr-7  sm:col-span-1">
                                          <Container className="grid-rows-2 ">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Percentage sharing* (%)
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                              placeholder="%"
                                              type="tel"
                                              className="sm:w-11/12 amount"
                                            />

                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />

                                            {/* {typeof errors.BeneficiaryInfo ===
                                            "string" ? (
                                              <span className="p-error grid text-sm p-d-block">
                                                {errors.BeneficiaryInfo}
                                              </span>
                                            ) : null} */}
                                          </Container>
                                        </Container>
                                      </Grid>
                                    ) : null}

                                    <Grid className="grid-cols-3 gap-4 mt-5 pr-3">
                                      <Container className="col-span-3 sm:col-span-1">
                                        <Container
                                          className={`${
                                            values.BeneficiaryInfo[index]
                                              .benePartyType === "Person"
                                              ? "pr-1 sm:pr-12"
                                              : "pr-7 sm:pr-0"
                                          } grid-rows-2 `}
                                        >
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.benePhone`}
                                            className="text-black p-1 text-sm font-semibold"
                                          >
                                            Phone Number
                                          </label>
                                          <InputMask
                                            id="primaryOwnerPhone"
                                            name={`BeneficiaryInfo.${index}.benePhone`}
                                            mask="(999) 999-9999"
                                            placeholder="(999) 999-9999"
                                            value={item.benePhone}
                                            onChange={handleChange}
                                            className="pi-amount"
                                          />
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.benePhone`}
                                            component="div"
                                            className="p-error grid text-sm  p-d-block"
                                          />
                                        </Container>
                                      </Container>
                                      <Container
                                        className={`col-span-3 sm:col-span-2 ${
                                          values.BeneficiaryInfo[index]
                                            .benePartyType === "Person"
                                            ? "pr-1 sm: pr-0"
                                            : "pr-7 sm:pr-0"
                                        } `}
                                      >
                                        <Container className=" pr-0 sm:pr-1 grid-rows-2  ">
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.beneEmail`}
                                            className="text-black p-1 text-sm font-semibold"
                                          >
                                            Email ID
                                          </label>
                                          <Field
                                            name={`BeneficiaryInfo.${index}.beneEmail`}
                                            placeholder="email@gmail.com"
                                            type="email"
                                            className="amount sm:w-11/12"
                                          />
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneEmail`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                      </Container>
                                    </Grid>

                                    {values.BeneficiaryInfo[index]
                                      .benePartyType === "Person" ? (
                                      <Grid className="grid-cols-3 gap-4 mt-5 ">
                                        <Container className=" col-span-3 sm:col-span-1 ">
                                          <Container className="grid-rows-2">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneRelationOwner`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Relationship with Owner
                                            </label>

                                            <Field
                                              as="select"
                                              className="amount"
                                              name={`BeneficiaryInfo.${index}.beneRelationOwner`}
                                            >
                                              <option value="">Select</option>
                                              <option value="Spouse">
                                                Spouse
                                              </option>
                                              <option value="Son">Son</option>
                                              <option value="Daughter">
                                                Daughter
                                              </option>
                                              <option value="Father">
                                                Father
                                              </option>
                                              <option value="Mother">
                                                Mother
                                              </option>
                                              <option value="Friend">
                                                Friend
                                              </option>
                                              <option value="Others">
                                                Others
                                              </option>
                                            </Field>
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneRelationOwner`}
                                              component="div"
                                              className="p-error grid text-sm  p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                        <Container className="col-span-3 sm:col-span-1 ">
                                          <Container className="grid-rows-2 ">
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Percentage sharing* (%)
                                            </label>
                                            <Field
                                              name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                              placeholder="%"
                                              type="tel"
                                              className="amount"
                                            />
                                            <ErrorMessage
                                              name={`BeneficiaryInfo.${index}.beneSharingPercent`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>
                                    ) : null}
                                    <Divider className="inline-block sm:hidden" />

                                    <Container className="mt-0 sm:mt-5  quotecolor font-bold  sub-font-size">
                                      <h2 className="">Address</h2>
                                    </Container>
                                    <Grid className="grid-cols-4 gap-2 mt-4 pr-5 sm:pr-8 ">
                                      <Container className="col-span-4 sm:col-span-2">
                                        <Container className="grid-rows-2">
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.beneAddressLine1`}
                                            className="text-black pr-14 text-sm font-semibold"
                                          >
                                            Address Line 1
                                          </label>
                                          <Field
                                            name={`BeneficiaryInfo.${index}.beneAddressLine1`}
                                            placeholder="Address"
                                            type="text"
                                            className="sm:w-11/12 amount"
                                          />
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneAddressLine1`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                      </Container>

                                      <Container className="col-span-4 sm:col-span-2">
                                        <Container className="grid-rows-2 ">
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.beneAddressLine2`}
                                            className="text-black pr-14 text-sm font-semibold"
                                          >
                                            Address Line 2
                                          </label>
                                          <Field
                                            name={`BeneficiaryInfo.${index}.beneAddressLine2`}
                                            placeholder="Address"
                                            type="text"
                                            className="sm:w-11/12 amount"
                                          />
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneAddressLine2`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                      </Container>
                                    </Grid>
                                    <Grid className="mt-4 grid-cols-3 gap-4">
                                      <Container className="col-span-3 sm:col-span-1">
                                        <Container className="grid-rows-2 w-3/4">
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.beneAddressCity`}
                                            className="text-black pr-14 text-sm font-semibold"
                                          >
                                            City
                                          </label>
                                          <Field
                                            name={`BeneficiaryInfo.${index}.beneAddressCity`}
                                            placeholder="Address"
                                            type="text"
                                            className="amount"
                                          />
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneAddressCity`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                      </Container>
                                      <Container className="col-span-3 sm:col-span-1 w-3/4">
                                        <Container className="grid-rows-2 ">
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.beneAddressState`}
                                            className="text-black p-1 text-sm font-semibold"
                                          >
                                            State
                                          </label>

                                          <Field
                                            as="select"
                                            className="amount"
                                            name={`BeneficiaryInfo.${index}.beneAddressState`}
                                          >
                                            <option value="">Select</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="CA">
                                              California
                                            </option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">
                                              Connecticut
                                            </option>
                                            <option value="DE">Delaware</option>
                                            <option value="DC">
                                              District of Columbia
                                            </option>
                                            <option value="FLv">Florida</option>
                                            <option value="GA">Georgia</option>
                                            <option value="HI">Hawaii</option>
                                            <option value="ID">Idaho</option>
                                            <option value="IL">Illinois</option>
                                            <option value="IN">Indiana</option>
                                            <option value="KY">Kentucky</option>
                                            <option value="LA">
                                              Louisiana
                                            </option>
                                            <option value="ME">Maine</option>
                                            <option value="MD">Maryland</option>
                                            <option value="MA">
                                              Massachusetts
                                            </option>
                                            <option value="MA">Michigan</option>
                                            <option value="MA">
                                              Massachusetts
                                            </option>
                                            <option value="MI">Michigan</option>
                                            <option value="MN">
                                              Minnesota
                                            </option>
                                            <option value="MA">
                                              Mississippi
                                            </option>
                                            <option value="MO">Missouri</option>
                                            <option value="MT">Montana</option>
                                            <option value="NE">Nebraska</option>
                                            <option value="NV">Nevada</option>
                                            <option value="NH">
                                              New Hampshire
                                            </option>
                                            <option value="NJ">
                                              New Jersey
                                            </option>
                                            <option value="NM">
                                              New Mexico
                                            </option>
                                            <option value="NY">New York</option>
                                            <option value="NC">
                                              North Carolina
                                            </option>
                                            <option value="ND">
                                              North Dakota
                                            </option>
                                            <option value="OH">Ohio</option>
                                            <option value="OK">Oklahoma</option>
                                            <option value="OR">Oregon</option>
                                            <option value="PA">
                                              Pennsylvania
                                            </option>
                                            <option value="RI">
                                              Rhode Island
                                            </option>
                                            <option value="SC">
                                              South Carolina
                                            </option>
                                            <option value="SD">
                                              South Dakota
                                            </option>
                                            <option value="TX">Texas</option>
                                            <option value="UT">Utah</option>
                                            <option value="VT">Vermont</option>
                                            <option value="VA">Virginia</option>
                                            <option value="WA">
                                              Washington
                                            </option>
                                            <option value="WV">
                                              West Virginia
                                            </option>
                                            <option value="WI">
                                              Wisconsin
                                            </option>
                                            <option value="WY">Wyoming</option>
                                          </Field>
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneAddressState`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                      </Container>
                                      <Container className="col-span-3 sm:col-span-1 w-3/4">
                                        <Container className="grid-rows-2 ">
                                          <label
                                            htmlFor={`BeneficiaryInfo.${index}.beneAddressZip`}
                                            className="text-black p-1 text-sm font-semibold"
                                          >
                                            Zip
                                          </label>
                                          <Field
                                            name={`BeneficiaryInfo.${index}.beneAddressZip`}
                                            placeholder="Enter 5-digit Zip code"
                                            type="tel"
                                            className="amount"
                                          />
                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneAddressZip`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Container>
                                      </Container>
                                    </Grid>

                                    <Grid className="grid grid-cols-2 mt-2 pr-2">
                                      <div className="col-span-2 sm:col-span-1 text-black pt-0 sm:pt-6 text-md pr-0 sm:pr-2 font-semibold">
                                        <Label className="col-span-1 text-black text-sm  font-semibold">
                                          Is this designation irrevocable?
                                        </Label>
                                      </div>
                                      <div className="col-span-2 sm:col-span-1 text-black p-1 text-md px-0 sm:px-2 font-semibold">
                                        <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                                          <div className=" col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 p-field-radiobutton radio-border h-11 ml-0 sm:ml-32  ">
                                            <Field
                                              type="radio"
                                              name={`BeneficiaryInfo.${index}.beneIrrevocable`}
                                              value="Yes"
                                            />
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneIrrevocable`}
                                              className="p-2 text-sm"
                                              //style={{ fontSize: "16px" }}
                                            >
                                              Yes
                                            </label>
                                          </div>
                                          <div className="col-span-1 sm:col-span-1 w-3/4 sm:w-6/12 mt-3 p-field-radiobutton radio-border h-11 ml-0 sm:ml-12">
                                            <Field
                                              type="radio"
                                              name={`BeneficiaryInfo.${index}.beneIrrevocable`}
                                              value="No"
                                            />
                                            <label
                                              htmlFor={`BeneficiaryInfo.${index}.beneIrrevocable`}
                                              className="p-2 text-sm"
                                              //style={{ fontSize: "16px" }}
                                            >
                                              No
                                            </label>
                                          </div>

                                          <ErrorMessage
                                            name={`BeneficiaryInfo.${index}.beneIrrevocable`}
                                            component="div"
                                            className="p-error grid text-sm p-d-block"
                                          />
                                        </Grid>
                                      </div>
                                    </Grid>
                                  </div>
                                </Card>

                                <div className="flex flex-row justify-center sm:justify-end mt-4 ml">
                                  {item.benePartyType === "Trust" && (
                                    <ModalPopUp
                                      showsModal={warnperson}
                                      title={titlewarn}
                                      closeModal={warncloseperson}
                                    />
                                  )}

                                  {item.benePartyType === "Person" && (
                                    <ModalPopUp
                                      showsModal={warntrust}
                                      title={titlewarn}
                                      closeModal={warnclosetrust}
                                    />
                                  )}
                                </div>
                              </AccordionTab>
                            </Accordion>
                          </div>
                        ))}

                      <Divider className="inline-block sm:hidden" />
                      <div className="bene-border">
                        <Flex className="flex flex-col sm:flex-row ml-5 pl-0 sm:pl-55 justify-between mt-5 mb-0 sm:mb-4 h-10 ">
                          <Label className=" text-sm ml-0 sm:ml-4 mb-3 sm:mb-0 mt-0 sm:mt-2 text-black font-semibold">
                            Do you want to add another primary beneficiary?
                          </Label>

                          <Flex className="flex justify-center sm:justify-end ">
                            <Button
                              type="button"
                              disabled={
                                values.BeneficiaryInfo?.length >= 5
                                  ? true
                                  : false
                              }
                              className="text-white bg-indigo-600 hover:bg-indigo-700  px-4 py-2 text-base flex justify-center items-center font-medium border border-transparent rounded-md shadow-sm focus:outline-none  focus:ring-offset-2 recalc p-4 font-bold w-28 mr-4"
                              onClick={() =>
                                push({
                                  beneType: "Primary",
                                  benePartyType: "Person",
                                  beneTrustee: "",
                                  beneTrustName: "",
                                  beneFirstname: "",
                                  beneMiddlename: "",
                                  beneLastname: "",
                                  beneGovtidtype: "SSN",
                                  beneGovtid: "",
                                  beneDob: "",
                                  beneGender: "",
                                  benePhone: "",
                                  beneEmail: "",
                                  beneRelationOwner: "",
                                  beneSharingPercent: "",
                                  beneAddressLine1: "",
                                  beneAddressLine2: "",
                                  beneAddressCity: "",
                                  beneAddressState: "",
                                  beneAddressZip: "",
                                  beneAddressCountry: "USA",
                                  beneIrrevocable: "No",
                                  addForm: "",
                                })
                              }
                            >
                              Add
                            </Button>
                          </Flex>
                        </Flex>
                      </div>

                      <span
                        className={`${
                          values.BeneficiaryInfo?.length >= 5
                            ? "block"
                            : "hidden"
                        } block p-error text-sm grid mt-10 sm:mt-2 pl-4 sm:pl-18 ml-2 sm:ml-14 p-d-block`}
                      >
                        Your policy can have a maximum of 5 beneficiaries only.
                      </span>
                    </div>
                  )}
                </FieldArray>

                <Container className="flex-1">
                  <Container className="p-0">
                    <Flex className="h-12 mt-20 pl-0 sm:pl-55 sm:mt-5 card-header blue-bg">
                      <h4 className="mt-3 ml-5 sm:ml-10 sub-font-size">
                        Contingent Beneficiary
                      </h4>
                    </Flex>
                  </Container>
                  <Card className="pl-0 sm:pl-55">
                    <Grid className="grid grid-cols-2  pr-2">
                      <div className="col-span-2 pt-0 sm:col-span-1 text-black pt-0 sm:pt-3 text-sm ml-0 sm:ml-4 px-0 sm:px-2 font-semibold">
                        <Label className="">
                          Do you want to add a contingent beneficiary?
                        </Label>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-black py-1 text-md font-semibold">
                        <Grid className="grid grid-cols-2 ml-0 sm:ml-20">
                          <div className=" w-9/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12  mt-3 sm:mt-0 ml-0 sm:ml-32 p-field-radiobutton radio-border h-11  ">
                            <RadioButton
                              inputId="yes"
                              name="show"
                              value="yes"
                              onChange={(e) => setShow(true)}
                              checked={show === true}
                            />
                            <label htmlFor="yes" className="p-2 sm:p-2 text-sm">
                              Yes
                            </label>
                          </div>
                          <div className=" w-9/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12  mt-3 sm:mt-0 ml-0 sm:ml-10 p-field-radiobutton radio-border h-11">
                            <RadioButton
                              inputId="no"
                              name="show"
                              value="no"
                              onChange={(e) => setShow(false)}
                              checked={show === false}
                            />
                            <label htmlFor="no" className="p-2 sm:p-2 text-sm">
                              No
                            </label>
                          </div>
                        </Grid>
                      </div>
                    </Grid>
                  </Card>
                </Container>
                <Container className={`${show ? "block" : "hidden"}`}>
                  <FieldArray name="contingentBeneficiary">
                    {({ remove, push }) => (
                      <div>
                        {values.contingentBeneficiary.length < 6 &&
                          values.contingentBeneficiary.map((item, index) => (
                            <div key={index}>
                              {deletepopup1 && (
                                <ModalPopUp
                                  showsModal={true}
                                  title={deletewarn}
                                  confirmdelete={true}
                                  index={index}
                                  remove={() => {
                                    remove(index);
                                    if (
                                      values.contingentBeneficiary.length == 1
                                    ) {
                                      setShow(false);
                                    }
                                  }}
                                  closeModal={closedeletemodal}
                                />
                              )}

                              <Accordion
                                header="Beneficiary"
                                activeIndex={0}
                                className="font-bold quotecolor pl-0 sm:pl-55 mt-1"
                              >
                                <AccordionTab
                                  header={
                                    <Flex className="flex flex-row justify-between acc-width">
                                      <div className="flex items-center mt-0 sm:mt-0 w-64 sm:w-72">
                                        {" "}
                                        {ordinal(index + 1) +
                                          " " +
                                          " Contingent Beneficiary Details"}
                                      </div>
                                      {
                                        <Flex className=" flex justify-end ">
                                          <div className="hidden sm:inline-block">
                                            <Button className="accordion-btn">
                                              <img
                                                src={IMAGE_PATHS.DELETE}
                                                className="inline deleteicon "
                                                title="Delete"
                                                onClick={() => {
                                                  delete2();
                                                }}
                                              />
                                              <label
                                                className="cursor-pointer pl-1 font-semibold text-blue-500"
                                                onClick={() => {
                                                  delete2();
                                                }}
                                              >
                                                Delete
                                              </label>
                                            </Button>
                                          </div>
                                          <Flex className="inline-block sm:hidden justify-end">
                                            <img
                                              className="inline h-5 pr-0 ml-5 cursor-pointer"
                                              src={IMAGE_PATHS.DELETE_BIG}
                                              onClick={() => {
                                                delete2();
                                              }}
                                            />
                                          </Flex>
                                        </Flex>
                                      }
                                    </Flex>
                                  }
                                >
                                  <Card className="">
                                    <Grid className="grid grid-cols-2 ml-0 sm:ml-5 mt-2 pr-2">
                                      <div className="col-span-2 sm:col-span-1 ">
                                        <Label className="col-span-1 sm: col-span-3 ">
                                          <h5 className="sub-font-size font-bold text-gray-700">
                                            Beneficiary Type
                                          </h5>
                                          <div className="text-sm text-black font-semibold">
                                            Who is the contingent beneficiary on
                                            the policy?
                                          </div>
                                        </Label>
                                      </div>
                                      <div className="col-span-2 sm:col-span-1 text-black p-1 text-md px-0 sm:px-2 font-semibold">
                                        {cont && cont.length > 0 ? (
                                          item && item.addForm == "" ? (
                                            <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                                              <div className=" w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 ml-0 sm:ml-32 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                                <Field
                                                  type="radio"
                                                  name={`contingentBeneficiary.${index}.benePartyType`}
                                                  value="Person"
                                                  checked={
                                                    values
                                                      .contingentBeneficiary[
                                                      index
                                                    ].benePartyType === "Person"
                                                  }
                                                />
                                                <label
                                                  htmlFor={`contingentBeneficiary.${index}.benePartyType`}
                                                  className="pl-2 text-sm"
                                                >
                                                  Person
                                                </label>
                                              </div>

                                              <div className=" w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 ml-1 sm:ml-12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                                <Field
                                                  type="radio"
                                                  name={`contingentBeneficiary.${index}.benePartyType`}
                                                  value="Trust"
                                                  checked={
                                                    values
                                                      .contingentBeneficiary[
                                                      index
                                                    ].benePartyType === "Trust"
                                                  }
                                                />
                                                <label
                                                  htmlFor={`contingentBeneficiary.${index}.benePartyType`}
                                                  className="pl-2 text-sm"
                                                >
                                                  Trust
                                                </label>
                                              </div>
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.benePartyType`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Grid>
                                          ) : (
                                            <Grid className="grid grid-cols-2 ml-0 sm:ml-16 ">
                                              <div
                                                className=" cursor-pointer w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 ml-0 sm:ml-32 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11"
                                                onClick={addwarnperson}
                                              >
                                                <Field
                                                  type="radio"
                                                  name={`contingentBeneficiary.${index}.benePartyType`}
                                                  value="Person"
                                                  disabled={
                                                    values
                                                      .contingentBeneficiary[
                                                      index
                                                    ].benePartyType === "Trust"
                                                      ? true
                                                      : false
                                                  }
                                                  checked={
                                                    values
                                                      .contingentBeneficiary[
                                                      index
                                                    ].benePartyType === "Person"
                                                  }
                                                />
                                                <label
                                                  htmlFor={`contingentBeneficiary.${index}.benePartyType`}
                                                  className="pl-2 text-sm"
                                                >
                                                  Person
                                                </label>
                                              </div>

                                              <div
                                                className="cursor-pointer w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 ml-1 sm:ml-12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11"
                                                onClick={addwarntrust}
                                              >
                                                <Field
                                                  type="radio"
                                                  name={`contingentBeneficiary.${index}.benePartyType`}
                                                  value="Trust"
                                                  disabled={
                                                    values
                                                      .contingentBeneficiary[
                                                      index
                                                    ].benePartyType === "Person"
                                                      ? true
                                                      : false
                                                  }
                                                  checked={
                                                    values
                                                      .contingentBeneficiary[
                                                      index
                                                    ].benePartyType === "Trust"
                                                  }
                                                />
                                                <label
                                                  htmlFor={`contingentBeneficiary.${index}.benePartyType`}
                                                  className="pl-2 text-sm"
                                                >
                                                  Trust
                                                </label>
                                              </div>
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.benePartyType`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Grid>
                                          )
                                        ) : (
                                          <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                                            <div className=" w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-0 sm:ml-32 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                              <Field
                                                type="radio"
                                                name={`contingentBeneficiary.${index}.benePartyType`}
                                                value="Person"
                                              />
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.benePartyType`}
                                                className="pl-2 text-sm"
                                              >
                                                Person
                                              </label>
                                            </div>
                                            <div className="w-10/12 sm:w-6/12 col-span-1 sm:col-span-1 w-6/12 ml-1 sm:ml-12 mt-3 sm:mt-1 p-field-radiobutton radio-border h-11">
                                              <Field
                                                type="radio"
                                                name={`contingentBeneficiary.${index}.benePartyType`}
                                                value="Trust"
                                              />
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.benePartyType`}
                                                className="pl-2 text-sm"
                                              >
                                                Trust
                                              </label>
                                            </div>
                                          </Grid>
                                        )}
                                      </div>
                                    </Grid>

                                    <ErrorMessage
                                      name={`contingentBeneficiary.${index}.benePartyType`}
                                      component="div"
                                      className="p-error grid text-sm  p-d-block"
                                    />
                                  </Card>
                                  <Card className="prim-beneficiary1 border-transparent">
                                    <div className="ml-0 sm:ml-5">
                                      <h2 className=" quotecolor ml-1 h-5 sm:h-0 font-bold sub-font-size">
                                        Primary Details
                                      </h2>
                                      {values.contingentBeneficiary[index]
                                        .benePartyType === "Person" ? (
                                        <Grid className="grid-cols-3 gap-4 mt-4 sm:mt-10">
                                          <Container className="col-span-3 sm:col-span-1 w-3/4">
                                            <Container className="grid-rows-2">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneFirstname`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                First Name*
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneFirstname`}
                                                placeholder="First Name"
                                                type="text"
                                                className="amount"
                                              />
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneFirstname`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                          <Container className="col-span-3 sm:col-span-1">
                                            <Container className="grid-rows-2">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneMiddlename`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Middle Name
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneMiddlename`}
                                                placeholder="Middle Name"
                                                type="text"
                                                className="amount"
                                              />
                                            </Container>
                                          </Container>
                                          <Container className="col-span-3 sm:col-span-1">
                                            <Container className="grid-rows-2">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneLastname`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Last Name*
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneLastname`}
                                                placeholder="Last Name"
                                                type="text"
                                                className="amount"
                                              />
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneLastname`}
                                                component="div"
                                                className="p-error grid text-sm  p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                        </Grid>
                                      ) : null}

                                      {values.contingentBeneficiary[index]
                                        .benePartyType === "Trust" ? (
                                        <Grid className="grid-cols-1  gap-4">
                                          <Container className="col-span-1 sm:col-span-1 mt-6 w-full sm:w-4/6">
                                            <Container className="grid-rows-2 mt-2 sm:mt-7 pr-0 sm:pr-4">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneTrustName`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Full Legal Name of Trust*
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneTrustName`}
                                                placeholder="Full Legal Name of Trust"
                                                type="text"
                                                className="sm:w-11/12 amount"
                                              />
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneTrustName`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                        </Grid>
                                      ) : null}

                                      {values.contingentBeneficiary[index]
                                        .benePartyType === "Person" ? (
                                        <Grid className="grid-cols-3 gap-4 mt-5">
                                          <Container className="col-span-3 sm:col-span-1">
                                            <Container className="relative grid-rows-2">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneGovtid`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Social Security Number
                                              </label>

                                              <SecureMaskInput
                                                name={`contingentBeneficiary.${index}.beneGovtid`}
                                                value={item.beneGovtid}
                                                realvalue={handleChange}
                                                className="amount"
                                                mask={showcontingent[index]}
                                              />

                                              <span
                                                className={`${
                                                  showcontingent[index] ===
                                                  false
                                                    ? "inline-block"
                                                    : "hidden"
                                                } icon ml-16 sm:ml-0`}
                                              >
                                                <img
                                                  onClick={() =>
                                                    ssnshow1(index, true)
                                                  }
                                                  className="icon-image inline cursor-pointer"
                                                  src={IMAGE_PATHS.HIDE_EYE}
                                                />
                                              </span>

                                              <span
                                                className={`${
                                                  showcontingent[index] === true
                                                    ? "inline-block"
                                                    : "hidden"
                                                } icon ml-16 sm:ml-0`}
                                              >
                                                <img
                                                  onClick={() =>
                                                    ssnshow1(index, false)
                                                  }
                                                  className="icon-image inline cursor-pointer"
                                                  src={IMAGE_PATHS.SHOW_EYE}
                                                />
                                              </span>
                                            </Container>
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneGovtid`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                          <Container className="col-span-3 sm:col-span-1">
                                            <Container className="grid-rows-2 w-3/4">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneDob`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Birth Date
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneDob`}
                                                placeholder="MM-DD-YYYY"
                                                type="date"
                                                className="amount"
                                              />
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneDob`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                          <Container className="col-span-3 sm:col-span-1">
                                            <Container className="grid-rows-2">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneGender`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Gender assigned at birth
                                              </label>

                                              <Field
                                                as="select"
                                                className="amount"
                                                name={`contingentBeneficiary.${index}.beneGender`}
                                              >
                                                <option value="">Select</option>
                                                <option value="Male">
                                                  Male
                                                </option>
                                                <option value="Female">
                                                  Female
                                                </option>
                                              </Field>
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneGender`}
                                                component="div"
                                                className="p-error grid text-sm  p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                        </Grid>
                                      ) : null}

                                      {values.contingentBeneficiary[index]
                                        .benePartyType === "Trust" ? (
                                        <Grid className="grid-cols-1 gap-4 mt-5">
                                          <Container className="col-span-1 sm:col-span-1 w-full sm:w-4/6">
                                            <Container className="grid-rows-2 ">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneTrustee`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Trustee*
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneTrustee`}
                                                placeholder="Trustee"
                                                type="text"
                                                className="sm:w-11/12 amount"
                                              />
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneTrustee`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                        </Grid>
                                      ) : null}

                                      {values.contingentBeneficiary[index]
                                        .benePartyType === "Trust" ? (
                                        <Grid className=" grid  grid-cols-3 gap-4 mt-5">
                                          <Container className="col-span-3 w-full pr-0 sm:pr-4 sm:col-span-1">
                                            <Container className="relative grid-rows-2 ">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneGovtid`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Tax ID of Trust
                                              </label>

                                              <SecureMaskInput
                                                name={`contingentBeneficiary.${index}.beneGovtid`}
                                                value={item.beneGovtid}
                                                realvalue={handleChange}
                                                className="amount"
                                                mask={showcontingent[index]}
                                              />

                                              <span
                                                className={`${
                                                  showcontingent[index] ===
                                                  false
                                                    ? "inline-block"
                                                    : "hidden"
                                                } icon ml-16 sm:ml-0`}
                                              >
                                                <img
                                                  onClick={() =>
                                                    ssnshow1(index, true)
                                                  }
                                                  className="icon-image inline cursor-pointer"
                                                  src={IMAGE_PATHS.HIDE_EYE}
                                                />
                                              </span>

                                              <span
                                                className={`${
                                                  showcontingent[index] === true
                                                    ? "inline-block"
                                                    : "hidden"
                                                } icon ml-16 sm:ml-0`}
                                              >
                                                <img
                                                  onClick={() =>
                                                    ssnshow1(index, false)
                                                  }
                                                  className="icon-image inline cursor-pointer"
                                                  src={IMAGE_PATHS.SHOW_EYE}
                                                />
                                              </span>
                                            </Container>
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneGovtid`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                          <Container className="container col-span-3 w-full pr-0 sm:pr-7  sm:col-span-1">
                                            <Container className="grid-rows-2 ">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneSharingPercent`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Percentage sharing* (%)
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneSharingPercent`}
                                                placeholder="%"
                                                type="tel"
                                                className="sm:w-11/12 amount"
                                              />
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneSharingPercent`}
                                                component="div"
                                                className="p-error grid text-sm  p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                        </Grid>
                                      ) : null}

                                      <Grid className="grid-cols-3 gap-4 mt-5 pr-3">
                                        <Container className="col-span-3 sm:col-span-1">
                                          <Container
                                            className={`${
                                              values.contingentBeneficiary[
                                                index
                                              ].benePartyType === "Person"
                                                ? "pr-1 sm:pr-3"
                                                : "pr-7 sm:pr-3"
                                            } grid-rows-2 `}
                                          >
                                            <label
                                              htmlFor={`contingentBeneficiary.${index}.benePhone`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Phone Number
                                            </label>

                                            <InputMask
                                              id="primaryOwnerPhone"
                                              name={`contingentBeneficiary.${index}.benePhone`}
                                              mask="(999) 999-9999"
                                              placeholder="(999) 999-9999"
                                              value={item.benePhone}
                                              onChange={handleChange}
                                              className="pi-amount"
                                            />
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.benePhone`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                        <Container
                                          className={`col-span-3 sm:col-span-2 ${
                                            values.contingentBeneficiary[index]
                                              .benePartyType === "Person"
                                              ? "pr-1 sm: pr-0"
                                              : "pr-7 sm:pr-0"
                                          } `}
                                        >
                                          <Container className="pr-0 sm:pr-1 grid-rows-2">
                                            <label
                                              htmlFor={`contingentBeneficiary.${index}.beneEmail`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              Email ID
                                            </label>
                                            <Field
                                              name={`contingentBeneficiary.${index}.beneEmail`}
                                              placeholder="email@gmail.com"
                                              type="email"
                                              className="amount sm:w-11/12"
                                            />
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneEmail`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>

                                      {values.contingentBeneficiary[index]
                                        .benePartyType === "Person" ? (
                                        <Grid className="grid-cols-3 gap-4 mt-5 ">
                                          <Container className=" col-span-3 sm:col-span-1 ">
                                            <Container className="grid-rows-2">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneRelationOwner`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Relationship with Owner
                                              </label>

                                              <Field
                                                as="select"
                                                className="amount"
                                                name={`contingentBeneficiary.${index}.beneRelationOwner`}
                                              >
                                                <option value="">Select</option>
                                                <option value="Spouse">
                                                  Spouse
                                                </option>
                                                <option value="Son">Son</option>
                                                <option value="Daughter">
                                                  Daughter
                                                </option>
                                                <option value="Father">
                                                  Father
                                                </option>
                                                <option value="Mother">
                                                  Mother
                                                </option>
                                                <option value="Friend">
                                                  Friend
                                                </option>
                                                <option value="Others">
                                                  Others
                                                </option>
                                              </Field>
                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneRelationOwner`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                          <Container className="col-span-3 sm:col-span-1 ">
                                            <Container className="grid-rows-2 ">
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneSharingPercent`}
                                                className="text-black p-1 text-sm font-semibold"
                                              >
                                                Percentage sharing* (%)
                                              </label>
                                              <Field
                                                name={`contingentBeneficiary.${index}.beneSharingPercent`}
                                                placeholder="%"
                                                type="tel"
                                                className="amount"
                                              />

                                              <ErrorMessage
                                                name={`contingentBeneficiary.${index}.beneSharingPercent`}
                                                component="div"
                                                className="p-error grid text-sm p-d-block"
                                              />
                                            </Container>
                                          </Container>
                                        </Grid>
                                      ) : null}
                                      <Divider className="inline-block sm:hidden" />
                                      <Container className=" quotecolor font-bold ">
                                        <h2 className="mt-0 sm:mt-5  quotecolor font-bold  sub-font-size">
                                          Address
                                        </h2>
                                      </Container>
                                      <Grid className="grid-cols-4 gap-2 mt-4 pr-7 pr-0 sm:pr-8  ">
                                        <Container className="col-span-4 sm:col-span-2">
                                          <Container className="grid-rows-2">
                                            <label
                                              htmlFor={`contingentBeneficiary.${index}.beneAddressLine1`}
                                              className="text-black pr-14 text-sm font-semibold"
                                            >
                                              Address Line 1
                                            </label>
                                            <Field
                                              name={`contingentBeneficiary.${index}.beneAddressLine1`}
                                              placeholder="Address"
                                              type="text"
                                              className="sm:w-full amount"
                                            />
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneAddressLine1`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>

                                        <Container className="col-span-4 sm:col-span-2">
                                          <Container className="grid-rows-2 ">
                                            <label
                                              htmlFor={`contingentBeneficiary.${index}.beneAddressLine2`}
                                              className="text-black pr-14 text-sm font-semibold"
                                            >
                                              {" "}
                                              Address Line 2
                                            </label>
                                            <Field
                                              name={`contingentBeneficiary.${index}.beneAddressLine2`}
                                              placeholder="Address"
                                              type="text"
                                              className=" sm:w-11/12 amount"
                                            />
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneAddressLine2`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>
                                      <Grid className="mt-4  grid-cols-3 gap-4">
                                        <Container className="col-span-3 sm:col-span-1">
                                          <Container className="grid-rows-2 w-3/4">
                                            <label
                                              htmlFor={`contingentBeneficiary.${index}.beneAddressCity`}
                                              className="text-black pr-14 text-sm font-semibold"
                                            >
                                              {" "}
                                              City
                                            </label>
                                            <Field
                                              name={`contingentBeneficiary.${index}.beneAddressCity`}
                                              placeholder="Address"
                                              type="text"
                                              className="amount"
                                            />
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneAddressCity`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                        <Container className="col-span-3 sm:col-span-1 w-3/4">
                                          <Container className="grid-rows-2 ">
                                            <label
                                              htmlFor={`contingentBeneficiary.${index}.beneAddressState`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              State
                                            </label>

                                            <Field
                                              as="select"
                                              className="amount"
                                              name={`contingentBeneficiary.${index}.beneAddressState`}
                                            >
                                              <option value="">Select</option>
                                              <option value="AL">
                                                Alabama
                                              </option>
                                              <option value="AZ">
                                                Arizona
                                              </option>
                                              <option value="AK">Alaska</option>
                                              <option value="AR">
                                                Arkansas
                                              </option>
                                              <option value="CA">
                                                California
                                              </option>
                                              <option value="CO">
                                                Colorado
                                              </option>
                                              <option value="CT">
                                                Connecticut
                                              </option>
                                              <option value="DE">
                                                Delaware
                                              </option>
                                              <option value="DC">
                                                District of Columbia
                                              </option>
                                              <option value="FLv">
                                                Florida
                                              </option>
                                              <option value="GA">
                                                Georgia
                                              </option>
                                              <option value="HI">Hawaii</option>
                                              <option value="ID">Idaho</option>
                                              <option value="IL">
                                                Illinois
                                              </option>
                                              <option value="IN">
                                                Indiana
                                              </option>
                                              <option value="KY">
                                                Kentucky
                                              </option>
                                              <option value="LA">
                                                Louisiana
                                              </option>
                                              <option value="ME">Maine</option>
                                              <option value="MD">
                                                Maryland
                                              </option>
                                              <option value="MA">
                                                Massachusetts
                                              </option>
                                              <option value="MA">
                                                Michigan
                                              </option>
                                              <option value="MA">
                                                Massachusetts
                                              </option>
                                              <option value="MI">
                                                Michigan
                                              </option>
                                              <option value="MN">
                                                Minnesota
                                              </option>
                                              <option value="MA">
                                                Mississippi
                                              </option>
                                              <option value="MO">
                                                Missouri
                                              </option>
                                              <option value="MT">
                                                Montana
                                              </option>
                                              <option value="NE">
                                                Nebraska
                                              </option>
                                              <option value="NV">Nevada</option>
                                              <option value="NH">
                                                New Hampshire
                                              </option>
                                              <option value="NJ">
                                                New Jersey
                                              </option>
                                              <option value="NM">
                                                New Mexico
                                              </option>
                                              <option value="NY">
                                                New York
                                              </option>
                                              <option value="NC">
                                                North Carolina
                                              </option>
                                              <option value="ND">
                                                North Dakota
                                              </option>
                                              <option value="OH">Ohio</option>
                                              <option value="OK">
                                                Oklahoma
                                              </option>
                                              <option value="OR">Oregon</option>
                                              <option value="PA">
                                                Pennsylvania
                                              </option>
                                              <option value="RI">
                                                Rhode Island
                                              </option>
                                              <option value="SC">
                                                South Carolina
                                              </option>
                                              <option value="SD">
                                                South Dakota
                                              </option>
                                              <option value="TX">Texas</option>
                                              <option value="UT">Utah</option>
                                              <option value="VT">
                                                Vermont
                                              </option>
                                              <option value="VA">
                                                Virginia
                                              </option>
                                              <option value="WA">
                                                Washington
                                              </option>
                                              <option value="WV">
                                                West Virginia
                                              </option>
                                              <option value="WI">
                                                Wisconsin
                                              </option>
                                              <option value="WY">
                                                Wyoming
                                              </option>
                                            </Field>
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneAddressState`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                        <Container className="col-span-3 sm:col-span-1 w-3/4">
                                          <Container className="grid-rows-2 ">
                                            <label
                                              htmlFor={`contingentBeneficiary.${index}.beneAddressZip`}
                                              className="text-black p-1 text-sm font-semibold"
                                            >
                                              {" "}
                                              Zip
                                            </label>
                                            <Field
                                              name={`contingentBeneficiary.${index}.beneAddressZip`}
                                              placeholder="Enter 5-digit Zip code"
                                              type="tel"
                                              className="amount"
                                            />
                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneAddressZip`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Container>
                                        </Container>
                                      </Grid>

                                      <Grid className="grid grid-cols-2 mt-2 pr-2">
                                        <div className="col-span-2 sm:col-span-1 text-black pt-0 sm:pt-6 text-md pr-0 sm:pr-2 font-semibold">
                                          <Label className="col-span-1 text-black text-sm  font-semibold">
                                            Is this designation irrevocable?
                                          </Label>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1 text-black p-1 text-md px-0 sm:px-2 font-semibold">
                                          <Grid className="grid grid-cols-2 ml-0 sm:ml-16">
                                            <div className=" w-3/4 sm:w-6/12 col-span-1 sm:col-span-1 ml-1 mt-3 p-field-radiobutton radio-border h-11 ml-0 sm:ml-32">
                                              <Field
                                                type="radio"
                                                name={`contingentBeneficiary.${index}.beneIrrevocable`}
                                                value="Yes"
                                                // checked={values.contingentBeneficiary[index].beneIrrevocable === "Yes" }
                                              />
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneIrrevocable`}
                                                className="p-2 text-sm"
                                                //style={{ fontSize: "16px" }}
                                              >
                                                Yes
                                              </label>
                                            </div>
                                            <div className=" w-3/4 sm:w-6/12 col-span-1 sm:col-span-1 ml-1 mt-3 p-field-radiobutton radio-border h-11 ml-0 sm:ml-12">
                                              <Field
                                                type="radio"
                                                name={`contingentBeneficiary.${index}.beneIrrevocable`}
                                                value="No"
                                                // checked={values.contingentBeneficiary[index].beneIrrevocable === "No" }
                                              />
                                              <label
                                                htmlFor={`contingentBeneficiary.${index}.beneIrrevocable`}
                                                className="p-2 text-sm"
                                                //style={{ fontSize: "16px" }}
                                              >
                                                No
                                              </label>
                                            </div>

                                            <ErrorMessage
                                              name={`contingentBeneficiary.${index}.beneIrrevocable`}
                                              component="div"
                                              className="p-error grid text-sm p-d-block"
                                            />
                                          </Grid>
                                        </div>
                                      </Grid>
                                    </div>
                                  </Card>

                                  <div className="flex flex-row justify-center sm:justify-end mt-4 ml">
                                    {item.benePartyType === "Trust" && (
                                      <ModalPopUp
                                        showsModal={warnperson}
                                        title={titlewarn}
                                        closeModal={warncloseperson}
                                      />
                                    )}

                                    {item.benePartyType === "Person" && (
                                      <ModalPopUp
                                        showsModal={warntrust}
                                        title={titlewarn}
                                        closeModal={warnclosetrust}
                                      />
                                    )}
                                  </div>
                                </AccordionTab>
                              </Accordion>
                            </div>
                          ))}
                        <div className="bene-border">
                          <Flex className="flex flex-col sm:flex-row ml-5 pl-0 sm:pl-55 justify-between border-gray-400 mt-5 mb-0 sm:mb-4 h-10  ">
                            <Label className=" text-sm ml-0 sm:ml-4 mb-3 sm:mb-0 mt-0 sm:mt-2 text-black font-semibold">
                              Do you want to add another contingent beneficiary?
                            </Label>
                            <Flex className="flex justify-center  sm:justify-end mb-0 sm:mb-5">
                              <Button
                                type="button"
                                disabled={
                                  values.contingentBeneficiary?.length >= 5
                                    ? true
                                    : false
                                }
                                //className="btncolor h-10 border-solid text-white border-blue-500 rounded-lg font-bold  w-28 mr-4"
                                className="text-white bg-indigo-600 hover:bg-indigo-700  px-4 py-2 text-base flex justify-center items-center font-medium border border-transparent rounded-md shadow-sm focus:outline-none  focus:ring-offset-2 recalc p-4 font-bold w-28 mr-4"
                                onClick={() =>
                                  push({
                                    beneType: "Contingent",
                                    benePartyType: "Person",
                                    beneTrustName: "",
                                    beneTrustee: "",
                                    beneFirstname: "",
                                    beneMiddlename: "",
                                    beneLastname: "",
                                    beneGovtidtype: "SSN",
                                    beneGovtid: "",
                                    beneDob: "",
                                    beneGender: "",
                                    benePhone: "",
                                    beneEmail: "",
                                    beneRelationOwner: "",
                                    beneSharingPercent: "",
                                    beneAddressLine1: "",
                                    beneAddressLine2: "",
                                    beneAddressCity: "",
                                    beneAddressState: "",
                                    beneAddressZip: "",
                                    beneAddressCountry: "USA",
                                    beneIrrevocable: "No",
                                    addForm: "",
                                  })
                                }
                              >
                                Add
                              </Button>
                            </Flex>
                          </Flex>
                        </div>
                        <span
                          className={`${
                            values.contingentBeneficiary?.length >= 5
                              ? "block"
                              : "hidden"
                          } p-error text-sm grid mt-2   p-d-block  pl-4 sm:pl-12 ml-4   mt-10 sm:mt-2 sm:mt-2  `}
                        >
                          Your policy can have a maximum of 5 beneficiaries
                          only.
                        </span>
                      </div>
                    )}
                  </FieldArray>
                </Container>

                <Flex className="flex-col-reverse md:flex-row ml-0 pl-0 sm:pl-55 items-center justify-center space-y-3 sm:justify-between border-gray-400 mt-10 sm:mt-5 mb-5 h-15 pt-5 sm:pt-0">
                  <Button
                    type="button"
                    className=" btn-cancel  h-10 text-blue-500 border-blue-500 font-bold  py-2 rounded-sm  w-5/6 my-5 sm:w-1/6"
                    onClick={() => handleRedirect()}
                  >
                    Back
                  </Button>
                  {values.BeneficiaryInfo.length > 0 && (
                    <Button
                      type="button"
                      disabled={isSubmitting && percentcheck}
                      onClick={submitForm}
                      className="btncolor h-10 font-bold py-2 px-4 rounded-r w-5/6 sm:w-1/6"
                      loading={isSubmitting}
                    >
                      Save & Continue
                    </Button>
                  )}

                  {values.BeneficiaryInfo.length === 0 && (
                    <Link
                      className="cursor-pointer"
                      href={ROUTE_PATHS.PRODUCT_DETAILS}
                    >
                      <Button
                        type="button"
                        onClick={() => removeLocator()}
                        className="btncolor h-10 font-bold py-2 mr-3 ml-2 px-4 rounded-r w-5/6 sm:w-1/6"
                      >
                        Save & Continue
                      </Button>
                    </Link>
                  )}
                </Flex>
              </Form>
            )}
          </Formik>
        </Container>
      </main>
    </>
  );
};

export default withAuthentication(beneficiaryForm);
