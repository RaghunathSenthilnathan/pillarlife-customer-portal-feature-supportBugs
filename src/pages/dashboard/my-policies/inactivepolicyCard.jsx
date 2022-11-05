import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import { NextLink } from "@components/next-link";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import moment from "moment";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Policy Card";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const inactivepolicyCard = value => {
  // const [data,setData] = useState();
  const [val, setVal] = useState();

  function addDays(date, term) {
    var d = new Date(date);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + parseInt(term), month, day);
    return moment(c).format("MM-DD-YYYY");
  }

  useEffect(() => {
    setVal(value.result);
  }, [value]);

  const sortedData = val?.sort(function(a, b) {
    return (
      new Date(b.characteristics[b.characteristics.length-1].fieldValues.polEffDate) -
      new Date(a.characteristics[a.characteristics.length-1].fieldValues.polEffDate)
    );
  });

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

      {sortedData?.map((item,index) => {
        return (
          <div key={index} className="flex flex-col policy-display text-xs font-semibold text-black border-gray-200 rounded-md col-space-y-4 mb-4">
            <div className="card p-4">
              <div className="flex flex-row space-x-10 sm:divide-x-2 divide-gray-300">
                <div className="flex flex-col space-y-5 sm:space-y-14  md:p-2 md:w-1/3">
                  <div className="flex flex-col">
                    <label className="pb-2">
                      Policy{" "}
                      <span className="font-bold text-blue-800">
                        {item.characteristics[item.characteristics.length-1].policyLocator}
                      </span>
                    </label>
                    <label>Multi-Year Guaranteed Annuity</label>
                  </div>
                  <div className="flex flex-col ">
                    <label className="pb-2 hidden sm:inline-block">
                      Policy Start Date{" "}
                      <span className="font-bold text-blue-800">
                        {moment(
                          item.characteristics[item.characteristics.length-1].fieldValues.polEffDate[0]
                        ).format("MM-DD-YYYY")}
                      </span>
                    </label>
                    <label className=" hidden sm:inline-block">
                      End Date{" "}
                      <span className="font-bold text-blue-800">
                        {moment(
                          item.characteristics[item.characteristics.length-1].fieldValues.guaranteedEndDate[0]
                        ).format("MM-DD-YYYY")}
                      </span>
                    </label>
                  </div>
                  
                  <label className=" inline-block sm:hidden">
                    <span className="font-bold text-blue-800">
                      {moment(
                          item.characteristics[item.characteristics.length-1].fieldValues.guaranteedEndDate[0]
                        ).format("MM-DD-YYYY")}
                    </span>
                    <div>End Date </div>
                  </label>
                  <div className="inline-block sm:hidden">
                    <div className="font-bold text-blue-800 pb-1">
                      {"$" +
                        item.characteristics[item.characteristics.length-1].fieldValues.amountInvesting}
                    </div>
                    <label>Invested Amount</label>
                  </div>
                </div>

                <div className="flex flex-col hidden sm:inline-block md: space-y-7 md:p-2 w-1/4">
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {item.characteristics[item.characteristics.length-1].fieldValues
                        .primaryOwnerFirstname +
                        " " +
                        item.characteristics[item.characteristics.length-1].fieldValues
                          .primaryOwnerMiddlename +
                        " " +
                        item.characteristics[item.characteristics.length-1].fieldValues
                          .primaryOwnerLastname}
                    </div>
                    <label className="pb-2">Primary Owner</label>

                    <div
                      className={`${
                        item.characteristics[item.characteristics.length-1].fieldValues.appType[0] ===
                        "Joint"
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      <div className="font-bold text-blue-800 pb-1">
                        {item.characteristics[item.characteristics.length-1].fieldValues
                          .jointOwnerFirstname +
                          " " +
                          item.characteristics[item.characteristics.length-1].fieldValues
                            .jointOwnerMiddlename +
                          " " +
                          item.characteristics[item.characteristics.length-1].fieldValues
                            .jointOwnerLastname}
                      </div>
                      <label>Joint Owner</label>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {item.exposures[0].characteristics[item.exposures[0].characteristics.length-1].fieldValues
                        .annuitantFirstname[0] +
                        " " +
                        item.exposures[0].characteristics[item.exposures[0].characteristics.length-1].fieldValues
                          .annuitantLastname[0]}
                    </div>
                    <label>Annuitant</label>
                  </div>
                </div>

                <div className="flex flex-col hidden sm:inline-block md: space-y-7 md:p-2 md:w-1/3">
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {"$" +
                        item.characteristics[item.characteristics.length-1].fieldValues.amountInvesting}
                    </div>
                    <label>Invested Amount</label>
                  </div>
                </div>

                <div className="flex p-0 sm:p-4 place-items-center">
                  <NextLink
                    href={`/dashboard/my-policies/inactive-policies?id=${item.characteristics[item.characteristics.length-1].policyLocator}`}
                  >
                    <div>
                      <img src={IMAGE_PATHS.EDIT} />
                    </div>
                  </NextLink>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* })}  */}
    </>
  );
};
export default inactivepolicyCard;
