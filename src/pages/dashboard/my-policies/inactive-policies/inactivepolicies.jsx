import { useEffect, useState } from "react";
import { Label } from "@components/forms";
import { BreadCrumb } from "primereact/breadcrumb";
import { Panel } from "primereact/panel";
import { NextSeo } from "next-seo";
import { NextLink } from "@components/next-link";
import { useRouter } from "next/router";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import {withAuthentication} from "@utils/route-hocs";
import { DataTable } from "primereact/datatable";
import { Grid, Container } from "@components/layout";
import { Sider } from "@components/sidebar";
import { useMediaQuery } from "react-responsive";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import {
  Url,
  products,
  lambda
} from "../../../../constants/apiconstant";
import moment from "moment";
import { Ripple } from "primereact/ripple";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.UPDATE_BENEFICIARY}`;
const title = "Inactive Policies";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const inactivepolicies = () => {
  const router = useRouter();
  const { query } = router;
  const [payment, setPayment] = useState();
  const [transactions, setTrasactions] = useState();
  const [policydata, setPolicyData] = useState();
  const [ridersFromProducts, setRidersFromProducts] = useState();
  const [riders, setRiders] = useState([]);
  const [annuitant, setAnnuitant] = useState();
  const [benefi, setBeneficiary] = useState();
  const [cont, setcontBeneficiary] = useState();
  const [suit, setSuitablity] = useState();
  const [id, setId] = useState();
  const [quoteinterest, setQuoteInterest] = useState();
  const [accountbalance, setAccountBalance] = useState();

  let disp;
  const items = [
    { label: "My Policies", icon: "pi pi-home", url: "/dashboard/my-policies" },
    { label: "Inactive Policies", url: "/dashboard/my-policies?index=1" },
    { label: `Policy No. ${query.id}` }
  ];

  function ordinal(number) {
    const english_ordinal_rules = new Intl.PluralRules("en", {
      type: "ordinal"
    });
    const suffixes = {
      one: "st",
      two: "nd",
      few: "rd",
      other: "th"
    };
    const suffix = suffixes[english_ordinal_rules.select(number)];
    return number + suffix;
  }
  const header = (
    <>
      <div className="flex justify-between py-4 px-4 pl-8">
        <div>
          <h2 className="text-md  font-semibold text-blue">
            Policy No. {query.id}
          </h2>
          <h2 className="text-black text-sm font-semibold">
            Multi-Year Guaranteed Annuity
          </h2>
        </div>
      </div>
    </>
  );

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });

  const template = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Product Information</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };

  const template1 = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Owner Information</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };

  const template2 = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Annuitant Information</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };

  const template3 = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Beneficiary</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };

  const template4 = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Policy Transactions</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };
  const template5 = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start panel-bg`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Primary Beneficiary</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };
  const template6 = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start panel-bg`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Contigent Beneficiary</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };
  const template7 = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>Payment</span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };
  const transactiontemplate = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start transaction-bg p-2`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <div>
          <label>Transaction Type</label>
          <h2 className={`${titleClassName} mt-2`}>
            {options.props.transactions.transactionType}{" "}
          </h2>
        </div>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };
  const paymenttemplate = options => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} p-jc-start transaction-bg p-2`;
    const titleClassName = `${options.titleClassName} text-black p-pl-1`;

    return (
      <div className={className}>
        <div>
          <label>Payment Type</label>
          <h2 className={`${titleClassName} mt-2`}>
            {options.props.transactions.paymentType}{" "}
          </h2>
        </div>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };
  useEffect(() => {
    const pl = query && parseInt(query.id);
    if (pl) {
      setId(pl);
      fetchPolicyDetails(pl);
    }

    getQuestions();
  }, [query]);

  const redirect = e => {
    if (e === "/dashboard/my-policies/changebeneficiary") {
      window.location.href = `/dashboard/my-policies/changebeneficiary?id=${id}`;
    }
    if (e === "/dashboard/my-policies/withdrawmoney") {
      window.location.href = `/dashboard/my-policies/withdrawmoney?id=${id}`;
    }
  };

  async function fetchPolicyDetails(pl) {
    const beneficiary = [];
    const contigent = [];
    const transaction = [];
    const pay = [];
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
        setPolicyData(data.characteristics[data.characteristics.length-1].fieldValues);
        setAnnuitant(data.exposures[0].characteristics[data.exposures[0].characteristics.length-1].fieldValues);
        data &&
          data.exposures.map(o => {
            if (
              o.name === "Beneficiary" &&
              o.characteristics[ o.characteristics.length-1].fieldValues.beneType[0] === "Primary"
            ) {
              beneficiary.push(o.characteristics[o.characteristics.length-1].fieldValues);
            }
          });
        data &&
          data.exposures.map(o => {
            if (
              o.name === "Beneficiary" &&
              o.characteristics[ o.characteristics.length-1].fieldValues.beneType[0] === "Contingent"
            ) {
              contigent.push(o.characteristics[o.characteristics.length-1].fieldValues);
            }
          });
        setBeneficiary(beneficiary);
        setcontBeneficiary(contigent);
        const suitablity = Object.values(
          data.characteristics[data.characteristics.length - 1].fieldGroupsByLocator
        )[0];
        setSuitablity(Object.values(suitablity));
        const RiderData = data.exposures && data.exposures[0].perils;
        setRiders(RiderData);

        function isFilter(value) {
          if (
            data.characteristics[
              data.characteristics.length - 1
            ].fieldValues.financialTransactions.includes(value[0])
          ) {
            value[1].transactionEffectiveDate[0] = moment(
              value[1].transactionEffectiveDate[0]
            ).format("MM-DD-YYYY");
            transaction.push(value[1]);
          }
        }

        function isPsFilter(value) {
          if (
            data.characteristics[
              data.characteristics.length - 1
            ].fieldValues.payment.includes(value[0])
          ) {
            value[1].paymentDate[0] = moment(value[1].paymentDate[0]).format(
              "MM-DD-YYYY"
            );
            if (value[1].paymentCheckID) {
              value[1]["paymentRefID"] = value[1].paymentCheckID;
            }
            pay.push(value[1]);
          }
        }

        const ts = Object.entries(
          data.characteristics &&
            data.characteristics[data.characteristics.length - 1]
              .fieldGroupsByLocator
        ).filter(isFilter);
        const ps = Object.entries(
          data.characteristics &&
            data.characteristics[data.characteristics.length - 1]
              .fieldGroupsByLocator
        ).filter(isPsFilter);

        setTrasactions(transaction);
        setPayment(pay);
      })
      .catch(error => {
        console.log("Error:", error);
      });

    const quoteBody = {
      operation: "quoteAccount",

      payload: {
        guaranteedTerm: policydata ? policydata.amountInvesting[0] : "",

        premium: policydata ? policydata.guaranteedTerm[0] : "",

        riders: {}
      }
    };

    await fetch(Url + lambda, {
      method: "POST",
      body: JSON.stringify(quoteBody),
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setQuoteInterest(data.payload.interestRate);
      })
      .catch(error => {
        console.log("Error:", error);
      });



    const accountBalanceBody = {
      operation: "accountBalance",
      payload: {
        locator: pl
      }
    };

    await fetch(Url + lambda, {
      method: "POST",
      body: JSON.stringify(accountBalanceBody),
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setAccountBalance(data.payload);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }
  async function getQuestions() {
    var auth = JSON.parse(localStorage.getItem("Auth_Token_Soc"));

    await fetch(Url + products, {
      method: "GET",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        data.map(o => {
          if (o.name === "MYGA") {
            const exposures = o.policyConfiguration.exposures;
            exposures.map(p => {
              if (p.displayName === "Annuitant") {
                setRidersFromProducts(p.perils);
              }
            });
          }
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  const mapRiderNames = item => {
    ridersFromProducts?.map(obj => {
      if (item.name === obj.name) {
        disp = obj.displayName;
      }
    });
  };

  function addDays(date, term) {
    var d = new Date(date);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + parseInt(term), month, day);
    return moment(c).format("MM-DD-YYYY");
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

      <div className="flex md:flex-row md:space-x-1">
        <div className="ml-4 sm:w-3/12 h-10">
          <Sider />
        </div>
        <div className="Flex w-5/6 flex-col sm:pl-2">
          <BreadCrumb
            className={"bread-crumb pl-0 ml-5 text-sm"}
            model={items}
          />
          <div className=" pr-4">
            <p className="  sm:mt-0 mb-2 sm:mb-0 sm:ml-2 h-policies font-bold text-lg md:text-lg">
              Inactive Policies
            </p>
          </div>
        </div>
        {/* <div className="hidden sm:inline-block"> */}
        <div className=" w-0 sm:w-4/6 flex flex-col justify-end mt-0   ">
          {!isTabletOrMobile && (
            <div className="Flex self-end mt-4">
              <NextLink href={ROUTE_PATHS.MY_POLICIES}>
                <img className="inline ml-5  " src={IMAGE_PATHS.BACK_ARROW} />
              </NextLink>
            </div>
          )}
        </div>
        {/* </div> */}
      </div>

      <div className="flex">
        <Card header={header} className="active-policies-card space-y-0 mt-2">
          <Panel className="ml-3 sm:ml-0 bene-panel">
            <Grid className="grid-cols-10  gap-0 sm:gap-2  border-bt mt-2 sm:mt-0 ">
              <Container className="col-span-6 sm:col-span-3 ">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black  text-sm font-semibold"
                  >
                    Policy Status
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-4 sm:col-span-2  ">
                <Container className="grid-rows-2">
                  <span className="font-bold text-black text-sm">
                    {policydata && policydata.polStatus[0]}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-2 ">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black  text-sm font-semibold"
                  >
                    Current Account Value
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-4 sm:col-span-3  ">
                <Container className="grid-rows-2">
                  <span className="font-bold text-black text-sm">
                    ${accountbalance && accountbalance.endingAccountValue}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-10  gap-0 sm:gap-2  border-bt ">
              <Container className="col-span-6 sm:col-span-3 mt-1">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black  text-sm font-semibold"
                  >
                    Policy Effective Date
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-4 sm:col-span-2  mt-1">
                <Container className="grid-rows-2">
                  <span className="font-bold text-black text-sm">
                    {policydata &&
                      moment(policydata.polEffDate[0]).format("MM-DD-YYYY")}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-2 mt-1">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black  text-sm font-semibold"
                  >
                    Invested Amount
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-4 sm:col-span-3  mt-1">
                <Container className="grid-rows-2">
                  <span className="font-bold text-black text-sm">
                    ${policydata && policydata.amountInvesting[0]}
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-10  gap-0 sm:gap-2  border-bt ">
              <Container className="col-span-6 sm:col-span-3 mt-1">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black  text-sm font-semibold"
                  >
                    Guaranteed Period End Date
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-4 sm:col-span-2  mt-1">
                <Container className="grid-rows-2">
                  <span className="font-bold text-black text-sm">
                    {policydata &&
                      moment(policydata.guaranteedEndDate[0]).format("MM-DD-YYYY")}
                  </span>
                </Container>
              </Container>
              <Container className="col-span-6 sm:col-span-2 mt-1">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black  text-sm font-semibold"
                  >
                    Guaranteed Interest
                  </Label>
                </Container>
              </Container>
              <Container className="col-span-4 sm:col-span-3  mt-1">
                <Container className="grid-rows-2">
                  <span className="font-bold text-black text-sm">
                    {quoteinterest}%
                  </span>
                </Container>
              </Container>
            </Grid>
            <Grid className="grid-cols-10  gap-0 sm:gap-2  border-bt ">
              <Container className="col-span-10 sm:col-start-6 col-span-2 sm:ml-5  mt-1">
                <Container className="grid-rows-1">
                  <Label
                    htmlFor="amount"
                    className="text-black  text-sm font-semibold"
                  >
                    Cash Surrender Value
                  </Label>
                  <span className="font-bold text-black text-sm ml-14 sm:ml-16">
                    ${accountbalance && accountbalance.cashSurrenderValue}
                  </span>
                </Container>
              </Container>
            </Grid>
          </Panel>
          <Container className="mt-2 sm:mt-0 p-2 sm:p-4 ">
            <Panel
              id="panel"
              headerTemplate={template}
              collapsed={true}
              toggleable
            >
              <Grid className="grid grid-cols-10  gap-0 sm:gap-2  border-bt  ">
                <Container className="col-span-5 sm:col-span-3     mt-2 sm:mt-0 my-0 sm:my-4">
                  <Container className="grid-rows-1">
                    <Label
                      htmlFor="amount"
                      className="text-black p-4 text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Product Name
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-5 sm:col-span-3    mt-2 sm:mt-0  my-0 sm:my-4">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-semibold sm:font-medium">
                      Multi-Year Guaranteed Annuity
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Grid className="grid grid-cols-10  gap-0 sm:gap-2  border-bt mb-2 sm:mb-0  ">
                <Container className="col-span-6 sm:col-span-3     my-0 sm:my-4">
                  <Container className="grid-rows-1">
                    <Label
                      htmlFor="amount"
                      className="text-black p-4 text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Initial Guaranteed Term
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4 sm:col-span-3     my-0 sm:my-4">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-semibold sm:font-medium">
                      {policydata && policydata.guaranteedTerm[0] + " Years"}
                    </span>
                  </Container>
                </Container>
              </Grid>
              <Panel
                header="Rider(s) Selected"
                className="policy-panel panel-b-0 mb-2 sm:mb-0"
              >
                {riders?.map(item => {
                  mapRiderNames(item);
                  return (
                    <div>
                      <div className="mt-1 sm:mt-0"></div>
                      <Grid
                        //  className="grid-cols-1  gap-0 sm:gap-4  border-bt"
                        className={`${
                          disp === undefined ? "hidden" : "inline-block"
                        } grid-cols-1  gap-0 sm:gap-2  border-bt`}
                      >
                        <Container className="col-span-3 sm:col-span-1 mb-0 sm:mb-4 ml-3 sm:ml-0">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black pl-1 sm:pl-0 p-0 sm:p-1 mt-1 sm:mt-0 mb-1sm:mb-0 text-13 sm:text-sm font-semibold sm:font-normal"
                            >
                              {disp}
                            </Label>

                            <span className="ml-8 font-bold  ">{""}</span>
                          </Container>
                        </Container>
                      </Grid>
                    </div>
                  );
                })}
              </Panel>
            </Panel>
          </Container>
          <Container className="mt-2 sm:mt-0 p-2 sm:p-4 ">
            <Panel
              id="panel"
              headerTemplate={template1}
              collapsed={true}
              toggleable
            >
              {policydata &&
                policydata.primaryOwnerFirstname &&
                policydata.primaryOwnerFirstname[0] && (
                  <div>
                    <Panel
                      header="Primary Owner"
                      className="policy-panel panel-b-0"
                    >
                      <Grid className="grid-cols-10  gap-0 sm:gap-1   border-bt  ml-4 sm:ml-0 mt-2 sm:mt-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal sm:font-normal"
                            >
                              Full Name
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4 sm:col-span-3 my-0 ">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryOwnerFirstname[0] +
                                  " " +
                                  policydata.primaryOwnerMiddlename[0] +
                                  " " +
                                  policydata.primaryOwnerLastname[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2 my-0">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Gender assigned at birth
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata && policydata.primaryOwnerGender[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Birth Date
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                moment(policydata.primaryOwnerDob[0]).format(
                                  "MM-DD-YYYY"
                                )}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black   text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Phone Number
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata && policydata.primaryOwnerPhone[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Social Security Number
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryOwnerGovtid &&
                                "XXX-XX-" +
                                  policydata.primaryOwnerGovtid[0].substr(-4)}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Email ID
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black break-words text-13 sm:text-sm font-semibold sm:font-medium">
                              {policydata && policydata.primaryOwnerEmail[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 1
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryResidenceAddressLine1[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 2
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                              policydata.primaryResidenceAddressLine2
                                ? policydata.primaryResidenceAddressLine2[0]
                                : ""}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              City
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryResidenceAddressCity[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              State
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryResidenceAddressState[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mb-2 sm:mb-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Zip
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryResidenceAddressZip[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                    </Panel>
                    <Panel
                      header="Mailing Address"
                      className="policy-panel panel-b-0"
                    >
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mt-2 sm:mt-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 1
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryMailingAddressLine1[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 2
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                              policydata.primaryMailingAddressLine2
                                ? policydata.primaryMailingAddressLine2[0]
                                : ""}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              City
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryMailingAddressCity[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              State
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryMailingAddressState[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mb-2 sm:mb-0">
                        <Container className="col-span-6 sm:col-span-2      my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Zip
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4   sm:col-span-3  my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.primaryMailingAddressZip[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                    </Panel>
                  </div>
                )}
              {policydata &&
                policydata.jointOwnerFirstname &&
                policydata.jointOwnerFirstname[0] && (
                  <div>
                    <Panel
                      header="Joint Owner"
                      className="policy-panel panel-b-0"
                    >
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mt-2 sm:mt-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Full Name
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointOwnerFirstname[0] +
                                  " " +
                                  policydata.jointOwnerMiddlename[0] +
                                  " " +
                                  policydata.jointOwnerLastname[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Gender assigned at birth
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata && policydata.jointOwnerGender[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Birth Date
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                moment(policydata.jointOwnerDob[0]).format(
                                  "MM-DD-YYYY"
                                )}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Phone Number
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata && policydata.jointOwnerPhone[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Social Security Number
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointOwnerGovtid &&
                                "XXX-XX-" +
                                  policydata.jointOwnerGovtid[0].substr(-4)}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Email ID
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black break-words text-13 sm:text-sm font-semibold sm:font-medium">
                              {policydata && policydata.jointOwnerEmail[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 1
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointResidenceAddressLine1[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 2
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                              policydata.jointResidenceAddressLine2
                                ? policydata.jointResidenceAddressLine2[0]
                                : ""}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              City
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointResidenceAddressCity[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              State
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointResidenceAddressState[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mb-2 sm:mb-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Zip
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointResidenceAddressZip[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                    </Panel>
                    <Panel
                      header="Mailing Address"
                      className="policy-panel panel-b-0"
                    >
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 1
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointMailingAddressLine1[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Address Line 2
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata && policydata.jointMailingAddressLine2
                                ? policydata.jointMailingAddressLine2[0]
                                : ""}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              City
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointMailingAddressCity[0]}
                            </span>
                          </Container>
                        </Container>
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-2">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              State
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointMailingAddressState[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                      {!isTabletOrMobile && <Divider />}
                      <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mb-2 sm:mb-0">
                        <Container className="col-span-6 sm:col-span-2        my-0 ">
                          <Container className="grid-rows-3">
                            <Label
                              htmlFor="amount"
                              className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                            >
                              Zip
                            </Label>
                          </Container>
                        </Container>
                        <Container className="col-span-4  sm:col-span-3      my-0">
                          <Container className="grid-rows-2">
                            <span className="text-black text-13 sm:text-sm font-medium">
                              {policydata &&
                                policydata.jointMailingAddressZip[0]}
                            </span>
                          </Container>
                        </Container>
                      </Grid>
                    </Panel>
                  </div>
                )}
              {policydata &&
                policydata.trusteeName &&
                policydata.trusteeName[0] && (
                  <Panel header="Trust" className="policy-panel">
                    <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mt-2 sm:mt-0">
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Trust Name
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trustName[0]}
                          </span>
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-2">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Trustee Name
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trusteeName[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Tax ID of Trust
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata &&
                              "XXX-XX-" + policydata.trustGovtid[0].substr(-4)}
                          </span>
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-2">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Phone Number
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trustPhone[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Date the Trust was formed
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata &&
                              policydata.trustDate &&
                              moment(policydata.trustDate[0]).format(
                                "MM-DD-YYYY"
                              )}
                          </span>
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-2">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Email ID
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black break-words text-13 sm:text-sm font-semibold sm:font-medium">
                            {policydata && policydata.trustEmail[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Address Line 1
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trustAddressLine1[0]}
                          </span>
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-2">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Address Line 2
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trustAddressLine2
                              ? policydata.trustAddressLine2[0]
                              : ""}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            City
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trustAddressCity[0]}
                          </span>
                        </Container>
                      </Container>
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-2">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            State
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trustAddressState[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                    {!isTabletOrMobile && <Divider />}
                    <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mb-2 sm:mb-0">
                      <Container className="col-span-6 sm:col-span-2        my-0 ">
                        <Container className="grid-rows-3">
                          <Label
                            htmlFor="amount"
                            className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                          >
                            Zip
                          </Label>
                        </Container>
                      </Container>
                      <Container className="col-span-4  sm:col-span-3      my-0">
                        <Container className="grid-rows-2">
                          <span className="text-black text-13 sm:text-sm font-medium">
                            {policydata && policydata.trustAddressZip[0]}
                          </span>
                        </Container>
                      </Container>
                    </Grid>
                  </Panel>
                )}
            </Panel>
          </Container>
          <Container className="mt-2 sm:mt-0 p-2 sm:p-4">
            <Panel headerTemplate={template2} collapsed={true} toggleable>
              <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 ">
                <Container className="col-span-6 sm:col-span-2    mt-2 sm:mt-0     my-0 ">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black   text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Full Name
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3  mt-2 sm:mt-0  my-0">
                  <Container className="grid-rows-3">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant &&
                        annuitant.annuitantFirstname[0] +
                          " " +
                          annuitant.annuitantMiddlename[0] +
                          " " +
                          annuitant.annuitantLastname[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Gender assigned at birth
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-3">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant && annuitant.annuitantGender[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Birth Date
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-3">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant &&
                        moment(annuitant.annuitantDob[0]).format("MM-DD-YYYY")}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-2">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Phone Number
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-3">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant && annuitant.annuitantPhone[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Social Security Number
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant &&
                        annuitant.annuitantGovtid &&
                        "XXX-XX-" + annuitant.annuitantGovtid[0].substr(-4)}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-2">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Email ID
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-2">
                    <span className="text-black break-words text-13 sm:text-sm font-semibold sm:font-medium">
                      {annuitant && annuitant.annuitantEmail[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Address Line 1
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant && annuitant.annuitantAddressLine1[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-2">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Address Line 2
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant && annuitant.annuitantAddressLine2
                        ? annuitant.annuitantAddressLine2[0]
                        : ""}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      City
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant && annuitant.annuitantAddressCity[0]}
                    </span>
                  </Container>
                </Container>
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-2">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      State
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant &&
                        annuitant.annuitantAddressState &&
                        annuitant.annuitantAddressState[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
              {!isTabletOrMobile && <Divider />}
              <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mb-2 sm:mb-0">
                <Container className="col-span-6 sm:col-span-2         my-0 ">
                  <Container className="grid-rows-3">
                    <Label
                      htmlFor="amount"
                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                    >
                      Zip
                    </Label>
                  </Container>
                </Container>
                <Container className="col-span-4  sm:col-span-3       my-0">
                  <Container className="grid-rows-2">
                    <span className="text-black text-13 sm:text-sm font-medium">
                      {annuitant &&
                        annuitant.annuitantAddressZip &&
                        annuitant.annuitantAddressZip[0]}
                    </span>
                  </Container>
                </Container>
              </Grid>
            </Panel>
          </Container>
          <Container className="mt-2 sm:mt-0 p-2 sm:p-4 ">
            <Panel
              id="panel"
              //className=" panel-b-0 "
              headerTemplate={template3}
              collapsed={true}
              toggleable
            >
              <Panel
                headerTemplate={template5}
                collapsed={true}
                toggleable
                className=" panel-b-0 "
              >
                {benefi &&
                  benefi.map((bene, index) => {
                    return (
                      <div>
                        <Panel
                          header={
                            ordinal(index + 1) + " " + " Primary Beneficiary"
                          }
                          className="policy-bene-panel panel-b-0 "
                          toggleable
                        >
                          <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mt-2 sm:mt-0">
                            {bene.benePartyType[0] === "Trust" ? (
                              <>
                                <Container className="col-span-6 sm:col-span-2         my-0 ">
                                  <Container className="grid-rows-3">
                                    <Label
                                      htmlFor="amount"
                                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                    >
                                      Trust Name
                                    </Label>
                                  </Container>
                                </Container>
                                <Container className="col-span-4  sm:col-span-3       my-0">
                                  <Container className="grid-rows-2">
                                    <span className="text-black text-13 sm:text-sm font-medium">
                                      {bene &&
                                        bene.beneTrustee &&
                                        bene.beneTrustee[0]}
                                    </span>
                                  </Container>
                                </Container>
                              </>
                            ) : (
                              <>
                                <Container className="col-span-6 sm:col-span-2         my-0 ">
                                  <Container className="grid-rows-3">
                                    <Label
                                      htmlFor="amount"
                                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                    >
                                      Full Name
                                    </Label>
                                  </Container>
                                </Container>
                                <Container className="col-span-4  sm:col-span-3       my-0">
                                  <Container className="grid-rows-2">
                                    <span className="text-black text-13 sm:text-sm font-medium">
                                      {bene && bene.beneMiddlename
                                        ? bene.beneFirstname[0] +
                                          " " +
                                          bene.beneMiddlename[0] +
                                          " " +
                                          bene.beneLastname[0]
                                        : bene && bene.beneFirstname
                                        ? bene.beneFirstname[0]
                                        : "" + " " + bene && bene.beneLastname
                                        ? bene.beneLastname[0]
                                        : ""}
                                    </span>
                                  </Container>
                                </Container>
                              </>
                            )}
                            {bene.benePartyType[0] === "Trust" ? (
                              <>
                                <Container className="col-span-6 sm:col-span-2         my-0 ">
                                  <Container className="grid-rows-2">
                                    <Label
                                      htmlFor="amount"
                                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                    >
                                      Trustee Name
                                    </Label>
                                  </Container>
                                </Container>
                                <Container className="col-span-4  sm:col-span-3       my-0">
                                  <Container className="grid-rows-2">
                                    <span className="text-black text-13 sm:text-sm font-medium">
                                      {bene && bene.beneMiddlename
                                        ? bene.beneFirstname[0] +
                                          " " +
                                          bene.beneMiddlename[0] +
                                          " " +
                                          bene.beneLastname[0]
                                        : bene && bene.beneFirstname
                                        ? bene.beneFirstname[0]
                                        : "" + " " + bene && bene.beneLastname
                                        ? bene.beneLastname[0]
                                        : ""}
                                    </span>
                                  </Container>
                                </Container>
                              </>
                            ) : (
                              <>
                                <Container className="col-span-6 sm:col-span-2         my-0 ">
                                  <Container className="grid-rows-2">
                                    <Label
                                      htmlFor="amount"
                                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                    >
                                      Gender assigned at birth
                                    </Label>
                                  </Container>
                                </Container>
                                <Container className="col-span-4  sm:col-span-3       my-0">
                                  <Container className="grid-rows-2">
                                    <span className="text-black text-13 sm:text-sm font-medium">
                                      {bene &&
                                        bene.beneGender &&
                                        bene.beneGender[0]}
                                    </span>
                                  </Container>
                                </Container>
                              </>
                            )}
                          </Grid>
                          {!isTabletOrMobile && <Divider />}
                          <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                            {bene.benePartyType[0] === "Trust" ? (
                              <>
                                <Container className="col-span-6 sm:col-span-2         my-0 ">
                                  <Container className="grid-rows-3">
                                    <Label
                                      htmlFor="amount"
                                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                    >
                                      Tax ID of Trust
                                    </Label>
                                  </Container>
                                </Container>
                                <Container className="col-span-4  sm:col-span-3       my-0">
                                  <Container className="grid-rows-2">
                                    <span className="text-black text-13 sm:text-sm font-medium">
                                      {bene &&
                                        bene.beneGovtid &&
                                        "XXX-XX-" +
                                          bene.beneGovtid[0].substr(-4)}
                                    </span>
                                  </Container>
                                </Container>
                              </>
                            ) : (
                              <>
                                <Container className="col-span-6 sm:col-span-2         my-0 ">
                                  <Container className="grid-rows-3">
                                    <Label
                                      htmlFor="amount"
                                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                    >
                                      Birth Date
                                    </Label>
                                  </Container>
                                </Container>
                                <Container className="col-span-4  sm:col-span-3       my-0">
                                  <Container className="grid-rows-2">
                                    <span className="text-black text-13 sm:text-sm font-medium">
                                      {bene &&
                                        bene.beneDob &&
                                        moment(bene.beneDob[0]).format(
                                          "MM-DD-YYYY"
                                        )}
                                    </span>
                                  </Container>
                                </Container>
                              </>
                            )}
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-2">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Phone Number
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene && bene.benePhone && bene.benePhone[0]}
                                </span>
                              </Container>
                            </Container>
                          </Grid>
                          {!isTabletOrMobile && <Divider />}
                          <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                            {bene.benePartyType[0] === "Person" && (
                              <>
                                <Container className="col-span-6 sm:col-span-2         my-0 ">
                                  <Container className="grid-rows-3">
                                    <Label
                                      htmlFor="amount"
                                      className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                    >
                                      Social Security Number
                                    </Label>
                                  </Container>
                                </Container>
                                <Container className="col-span-4  sm:col-span-3       my-0">
                                  <Container className="grid-rows-2">
                                    <span className="text-black text-13 sm:text-sm font-medium">
                                      {bene &&
                                        bene.beneGovtid &&
                                        "XXX-XX-" +
                                          bene.beneGovtid[0].substr(-4)}
                                    </span>
                                  </Container>
                                </Container>
                              </>
                            )}
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-2">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Email ID
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black break-words text-13 sm:text-sm font-semibold sm:font-medium">
                                  {bene && bene.beneEmail && bene.beneEmail[0]}
                                </span>
                              </Container>
                            </Container>
                          </Grid>
                          {!isTabletOrMobile && <Divider />}
                          <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-3">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Address Line 1
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene &&
                                    bene.beneAddressLine1 &&
                                    bene.beneAddressLine1[0]}
                                </span>
                              </Container>
                            </Container>
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-2">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Address Line 2
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene && bene.beneAddressLine2
                                    ? bene.beneAddressLine2[0]
                                    : ""}
                                </span>
                              </Container>
                            </Container>
                          </Grid>
                          {!isTabletOrMobile && <Divider />}
                          <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-3">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  City
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene &&
                                    bene.beneAddressCity &&
                                    bene.beneAddressCity[0]}
                                </span>
                              </Container>
                            </Container>
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-2">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  State
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene &&
                                    bene.beneAddressState &&
                                    bene.beneAddressState[0]}
                                </span>
                              </Container>
                            </Container>
                          </Grid>
                          {!isTabletOrMobile && <Divider />}
                          <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-3">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Zip
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene &&
                                    bene.beneAddressZip &&
                                    bene.beneAddressZip[0]}
                                </span>
                              </Container>
                            </Container>
                          </Grid>
                          {!isTabletOrMobile && <Divider />}
                          <Grid className="grid-cols-10  gap-0 sm:gap-4  border-bt ml-4 sm:ml-0">
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-3">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Relationship with owner
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene &&
                                    bene.beneRelationOwner &&
                                    bene.beneRelationOwner[0]}
                                </span>
                              </Container>
                            </Container>
                            <Container className="col-span-6 sm:col-span-2         my-0 ">
                              <Container className="grid-rows-3">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Percentage Sharing (%)
                                </Label>
                              </Container>
                            </Container>
                            <Container className="col-span-4  sm:col-span-3       my-0">
                              <Container className="grid-rows-2">
                                <span className="text-black text-13 sm:text-sm font-medium">
                                  {bene &&
                                    bene.beneSharingPercent &&
                                    bene.beneSharingPercent[0]}
                                </span>
                              </Container>
                            </Container>
                          </Grid>
                          {!isTabletOrMobile && <Divider />}
                          <Grid className="grid-cols-2  gap-0 sm:gap-4  border-bt ml-4 sm:ml-0 mb-2 sm:mb-0">
                            <Container className="col-span-3 sm:col-span-1">
                              <Container className="grid-rows-3">
                                <Label
                                  htmlFor="amount"
                                  className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                >
                                  Is this designation irrevocable?
                                </Label>
                                <span className="text-black text-13 sm:text-sm font-medium ml-4">
                                  {bene &&
                                    bene.beneIrrevocable &&
                                    bene.beneIrrevocable[0]}
                                </span>
                              </Container>
                            </Container>
                          </Grid>
                        </Panel>
                      </div>
                    );
                  })}
              </Panel>
              <Panel
                headerTemplate={template6}
                collapsed={true}
                toggleable
                className=" panel-b-0 "
              >
                {cont &&
                  cont.map((bene, index) => {
                    return (
                      bene.beneSharingPercent && (
                        <div>
                          <Panel
                            header={
                              ordinal(index + 1) +
                              " " +
                              " Contingent Beneficiary"
                            }
                            className="policy-bene-panel panel-b-0"
                            toggleable
                          >
                            <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0 mt-2 sm:mt-0">
                              {bene.benePartyType[0] === "Trust" ? (
                                <>
                                  <Container className="col-span-6 sm:col-span-2         my-0 ">
                                    <Container className="grid-rows-3">
                                      <Label
                                        htmlFor="amount"
                                        className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                      >
                                        Trust Name
                                      </Label>
                                    </Container>
                                  </Container>
                                  <Container className="col-span-4  sm:col-span-3       my-0">
                                    <Container className="grid-rows-2">
                                      <span className="text-black  text-13 sm:text-sm font-medium">
                                        {bene &&
                                          bene.beneTrustee &&
                                          bene.beneTrustee[0]}
                                      </span>
                                    </Container>
                                  </Container>
                                </>
                              ) : (
                                <>
                                  <Container className="col-span-6 sm:col-span-2         my-0 ">
                                    <Container className="grid-rows-3">
                                      <Label
                                        htmlFor="amount"
                                        className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                      >
                                        Full Name
                                      </Label>
                                    </Container>
                                  </Container>
                                  <Container className="col-span-4  sm:col-span-3       my-0">
                                    <Container className="grid-rows-2">
                                      <span className="text-black text-13 sm:text-sm font-medium">
                                        {bene && bene.beneMiddlename
                                          ? bene.beneFirstname[0] +
                                            " " +
                                            bene.beneMiddlename[0] +
                                            " " +
                                            bene.beneLastname[0]
                                          : bene && bene.beneFirstname
                                          ? bene.beneFirstname[0]
                                          : "" + " " + bene && bene.beneLastname
                                          ? bene.beneLastname[0]
                                          : ""}
                                      </span>
                                    </Container>
                                  </Container>
                                </>
                              )}
                              {bene.benePartyType[0] === "Trust" ? (
                                <>
                                  <Container className="col-span-6 sm:col-span-2         my-0 ">
                                    <Container className="grid-rows-2">
                                      <Label
                                        htmlFor="amount"
                                        className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                      >
                                        Trustee Name
                                      </Label>
                                    </Container>
                                  </Container>
                                  <Container className="col-span-4  sm:col-span-3       my-0">
                                    <Container className="grid-rows-2">
                                      <span className="text-black text-13 sm:text-sm font-medium">
                                        {bene && bene.beneMiddlename
                                          ? bene.beneFirstname[0] +
                                            " " +
                                            bene.beneMiddlename[0] +
                                            " " +
                                            bene.beneLastname[0]
                                          : bene && bene.beneFirstname
                                          ? bene.beneFirstname[0]
                                          : "" + " " + bene && bene.beneLastname
                                          ? bene.beneLastname[0]
                                          : ""}
                                      </span>
                                    </Container>
                                  </Container>
                                </>
                              ) : (
                                <>
                                  <Container className="col-span-6 sm:col-span-2         my-0 ">
                                    <Container className="grid-rows-2">
                                      <Label
                                        htmlFor="amount"
                                        className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                      >
                                        Gender assigned at birth
                                      </Label>
                                    </Container>
                                  </Container>
                                  <Container className="col-span-4  sm:col-span-3       my-0">
                                    <Container className="grid-rows-2">
                                      <span className="text-black text-13 sm:text-sm font-medium">
                                        {bene &&
                                          bene.beneGender &&
                                          bene.beneGender[0]}
                                      </span>
                                    </Container>
                                  </Container>
                                </>
                              )}
                            </Grid>
                            {!isTabletOrMobile && <Divider />}
                            <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                              {bene.benePartyType[0] === "Trust" ? (
                                <>
                                  <Container className="col-span-6 sm:col-span-2         my-0 ">
                                    <Container className="grid-rows-3">
                                      <Label
                                        htmlFor="amount"
                                        className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                      >
                                        Tax ID of Trust
                                      </Label>
                                    </Container>
                                  </Container>
                                  <Container className="col-span-4  sm:col-span-3       my-0">
                                    <Container className="grid-rows-2">
                                      <span className="text-black text-13 sm:text-sm font-medium">
                                        {bene &&
                                          bene.beneGovtid &&
                                          "XXX-XX-" +
                                            bene.beneGovtid[0].substr(-4)}
                                      </span>
                                    </Container>
                                  </Container>
                                </>
                              ) : (
                                <>
                                  <Container className="col-span-6 sm:col-span-2         my-0 ">
                                    <Container className="grid-rows-3">
                                      <Label
                                        htmlFor="amount"
                                        className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                      >
                                        Birth Date
                                      </Label>
                                    </Container>
                                  </Container>
                                  <Container className="col-span-4  sm:col-span-3       my-0">
                                    <Container className="grid-rows-2">
                                      <span className="text-black text-13 sm:text-sm font-medium">
                                        {bene &&
                                          bene.beneDob &&
                                          moment(bene.beneDob[0]).format(
                                            "MM-DD-YYYY"
                                          )}
                                      </span>
                                    </Container>
                                  </Container>
                                </>
                              )}
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-2">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Phone Number
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene &&
                                      bene.benePhone &&
                                      bene.benePhone[0]}
                                  </span>
                                </Container>
                              </Container>
                            </Grid>
                            {!isTabletOrMobile && <Divider />}
                            <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                              {bene.benePartyType[0] === "Person" && (
                                <>
                                  <Container className="col-span-6 sm:col-span-2         my-0 ">
                                    <Container className="grid-rows-3">
                                      <Label
                                        htmlFor="amount"
                                        className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                      >
                                        Social Security Number
                                      </Label>
                                    </Container>
                                  </Container>
                                  <Container className="col-span-4  sm:col-span-3       my-0">
                                    <Container className="grid-rows-2">
                                      <span className="text-black text-13 sm:text-sm font-medium">
                                        {bene &&
                                          bene.beneGovtid &&
                                          "XXX-XX-" +
                                            bene.beneGovtid[0].substr(-4)}
                                      </span>
                                    </Container>
                                  </Container>
                                </>
                              )}
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-2">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Email ID
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black break-words text-13 sm:text-sm font-semibold sm:font-medium">
                                    {bene &&
                                      bene.beneEmail &&
                                      bene.beneEmail[0]}
                                  </span>
                                </Container>
                              </Container>
                            </Grid>
                            {!isTabletOrMobile && <Divider />}
                            <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-3">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Address Line 1
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene &&
                                      bene.beneAddressLine1 &&
                                      bene.beneAddressLine1[0]}
                                  </span>
                                </Container>
                              </Container>
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-2">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Address Line 2
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene && bene.beneAddressLine2
                                      ? bene.beneAddressLine2[0]
                                      : ""}
                                  </span>
                                </Container>
                              </Container>
                            </Grid>
                            {!isTabletOrMobile && <Divider />}
                            <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-3">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    City
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene &&
                                      bene.beneAddressCity &&
                                      bene.beneAddressCity[0]}
                                  </span>
                                </Container>
                              </Container>
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-2">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    State
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene &&
                                      bene.beneAddressState &&
                                      bene.beneAddressState[0]}
                                  </span>
                                </Container>
                              </Container>
                            </Grid>
                            {!isTabletOrMobile && <Divider />}
                            <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-3">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Zip
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene &&
                                      bene.beneAddressZip &&
                                      bene.beneAddressZip[0]}
                                  </span>
                                </Container>
                              </Container>
                            </Grid>
                            {!isTabletOrMobile && <Divider />}
                            <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt  ml-4 sm:ml-0">
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-3">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Relationship with owner
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene &&
                                      bene.beneRelationOwner &&
                                      bene.beneRelationOwner[0]}
                                  </span>
                                </Container>
                              </Container>
                              <Container className="col-span-6 sm:col-span-2         my-0 ">
                                <Container className="grid-rows-3">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Percentage Sharing (%)
                                  </Label>
                                </Container>
                              </Container>
                              <Container className="col-span-4  sm:col-span-3       my-0">
                                <Container className="grid-rows-2">
                                  <span className="text-black text-13 sm:text-sm font-medium">
                                    {bene &&
                                      bene.beneSharingPercent &&
                                      bene.beneSharingPercent[0]}
                                  </span>
                                </Container>
                              </Container>
                            </Grid>
                            {!isTabletOrMobile && <Divider />}
                            <Grid className="grid-cols-2  gap-0 sm:gap-4  border-bt ml-4 sm:ml-0 mb-2 sm:mb-0">
                              <Container className="col-span-3 sm:col-span-1">
                                <Container className="grid-rows-3">
                                  <Label
                                    htmlFor="amount"
                                    className="text-black  text-13 sm:text-sm font-normal sm:font-normal"
                                  >
                                    Is this designation irrevocable?
                                  </Label>
                                  <span className="text-black text-13 sm:text-sm font-medium ml-4">
                                    {bene &&
                                      bene.beneIrrevocable &&
                                      bene.beneIrrevocable[0]}
                                  </span>
                                </Container>
                              </Container>
                            </Grid>
                          </Panel>
                        </div>
                      )
                    );
                  })}
              </Panel>
            </Panel>
          </Container>
          <Container className="mt-2 sm:mt-0 p-2 sm:p-4">
            <Panel headerTemplate={template4} collapsed={true} toggleable>
              {isTabletOrMobile ? (
                transactions ? (
                  transactions.map(o => {
                    return (
                      <Panel
                        headerTemplate={transactiontemplate}
                        transactions={o}
                        className="mb-2 panel-b-0"
                        collapsed={true}
                        toggleable
                      >
                        <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt ml-3 sm:ml-0 mb-2 sm:mb-0">
                          <Container className="col-span-5 sm:col-span-2         my-0 ">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black   p-1 text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Effective Date
                              </Label>
                              <div className="text-black text-13 sm:text-sm font-medium ml-1">
                                {o.transactionEffectiveDate}
                              </div>
                            </Container>
                          </Container>
                          <Container className="col-span-5  sm:col-span-3       my-0">
                            <Container className="grid-rows-2">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black  p-1 text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Amount
                              </Label>
                              <div className="text-black text-13 sm:text-sm font-medium ml-1">
                                {o.amountRequested}
                              </div>
                            </Container>
                          </Container>
                        </Grid>
                        <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt ml-3 sm:ml-0 mb-2 sm:mb-0">
                          <Container className="col-span-5 sm:col-span-2         my-0 ">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black  p-1 text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Status
                              </Label>
                              <div className="text-black   text-13 sm:text-sm font-medium ml-1">
                                {o.transactionStatus}
                              </div>
                            </Container>
                          </Container>
                        </Grid>
                      </Panel>
                    );
                  })
                ) : (
                  <h2>No records found</h2>
                )
              ) : (
                <DataTable
                  value={transactions}
                  resizableColumns
                  columnResizeMode="fit"
                  showGridlines
                  responsiveLayout="scroll"
                  sortField="transactionEffectiveDate"
                  sortOrder={1}
                >
                  <Column
                    field="transactionEffectiveDate"
                    header="Effective Date"
                  ></Column>
                  <Column
                    field="transactionType"
                    header="Transactions"
                  ></Column>
                  <Column
                    field="amountRequested"
                    header="Amount Processed"
                  ></Column>
                  <Column field="transactionStatus" header="Status"></Column>
                </DataTable>
              )}
            </Panel>
          </Container>
          <Container className="mt-2 sm:mt-0 p-2 sm:p-4  pb-20">
            <Panel headerTemplate={template7} collapsed={true} toggleable>
              {isTabletOrMobile ? (
                payment ? (
                  payment.map(o => {
                    return (
                      <Panel
                        headerTemplate={paymenttemplate}
                        transactions={o}
                        className="mb-2 panel-b-0"
                        collapsed={true}
                        toggleable
                      >
                        <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt ml-3 sm:ml-0 mb-2 sm:mb-0">
                          <Container className="col-span-5 sm:col-span-2         my-0 ">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black  p-1   text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Payment Date
                              </Label>
                              <div className="text-black   text-13 sm:text-sm font-medium ml-1">
                                {o.paymentDate}
                              </div>
                            </Container>
                          </Container>
                          <Container className="col-span-5  sm:col-span-3       my-0">
                            <Container className="grid-rows-2">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black p-1   text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Amount
                              </Label>
                              <div className="text-black   text-13 sm:text-sm font-medium ml-1">
                                {o.paymentAmount}
                              </div>
                            </Container>
                          </Container>
                        </Grid>
                        <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt ml-3 sm:ml-0 mb-2 sm:mb-0">
                          <Container className="col-span-5 sm:col-span-2         my-0 ">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black p-1    text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Status
                              </Label>
                              <div className="text-black   text-13 sm:text-sm font-medium ml-1">
                                {o.paymentStatus}
                              </div>
                            </Container>
                          </Container>
                          <Container className="col-span-5 sm:col-span-2         my-0 ">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black p-1    text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Category
                              </Label>
                              <div className="text-black   text-13 sm:text-sm font-medium ml-1">
                                {}
                              </div>
                            </Container>
                          </Container>
                        </Grid>
                        <Grid className="grid-cols-10  gap-0 sm:gap-1  border-bt ml-3 sm:ml-0 mb-2 sm:mb-0">
                          <Container className="col-span-5 sm:col-span-2         my-0 ">
                            <Container className="grid-rows-3">
                              <Label
                                htmlFor="amount"
                                className="text-black sm:text-black p-1   text-13 sm:text-sm font-normal sm:font-normal"
                              >
                                Reference No.
                              </Label>
                              <div className="text-black   text-13 sm:text-sm font-medium ml-1">
                                {o.paymentRefID}
                              </div>
                            </Container>
                          </Container>
                        </Grid>
                      </Panel>
                    );
                  })
                ) : (
                  <h2>No records found</h2>
                )
              ) : (
                <DataTable
                  value={payment}
                  resizableColumns
                  columnResizeMode="fit"
                  showGridlines
                  responsiveLayout="scroll"
                  sortField="paymentDate"
                  sortOrder={1}
                >
                  <Column field="paymentDate" header="Payment Date"></Column>
                  <Column field="paymentType" header="Payment Type"></Column>
                  <Column field="paymentAmount" header="Amount"></Column>
                  <Column field="paymentStatus" header="Status"></Column>
                  <Column field="" header="Category"></Column>
                  <Column field="paymentRefID" header="Reference No."></Column>
                </DataTable>
              )}
            </Panel>
          </Container>
        </Card>
      </div>
    </>
  );
};

export default withAuthentication(inactivepolicies);
