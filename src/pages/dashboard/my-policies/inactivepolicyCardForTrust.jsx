import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import { NextLink } from "@components/next-link";
import moment from "moment";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Policy Card";
const description =
  "Enables you to view and perform actions on your Active & Inactive Policies";

const inactivepolicyCardForTrust = value => {
  const [val, setVal] = useState();

  useEffect(() => {
    setVal(value.result);
  }, [value]);

  function addDays(date, term) {
    var d = new Date(date);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + parseInt(term), month, day);
    return moment(c).format("MM-DD-YYYY");
  }

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
          <div key={index} className="flex flex-col policy-display text-xs font-semibold text-black border-gray-200 rounded-md mb-4">
            <div className="card p-4">
              <div className="flex flex-row space-x-10 divide-x-2 divide-gray-300">
                <div className="flex flex-col space-y-14  md:p-2 md: w-1/3">
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
                    <label className="pb-2">
                      Policy Start Date{" "}
                      <span className="font-bold text-blue-800">
                        {moment(
                          item.characteristics[item.characteristics.length-1].fieldValues.polEffDate[0]
                        ).format("MM-DD-YYYY")}
                      </span>
                    </label>
                    <label>
                      End Date{" "}
                      <span className="font-bold text-blue-800">
                        {moment(
                          item.characteristics[item.characteristics.length-1].fieldValues.guaranteedEndDate[0]
                        ).format("MM-DD-YYYY")}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col invisible md:visible md: space-y-7 md:p-2 w-1/4">
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {item.characteristics[item.characteristics.length-1].fieldValues.trustName}
                    </div>
                    <label className="pb-2">Trust</label>
                    <div className="font-bold text-blue-800 pb-1">
                      {item.characteristics[item.characteristics.length-1].fieldValues.trusteeName}
                    </div>
                    <label>Trustee Name</label>
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {item.exposures[0].characteristics[item.exposures[0].characteristics.length-1].fieldValues
                        .annuitantFirstname[0] +
                        item.exposures[0].characteristics[item.exposures[0].characteristics.length-1].fieldValues
                          .annuitantLastname[0]}
                    </div>
                    <label>Annuitant</label>
                  </div>
                </div>

                <div className="flex flex-col invisible md:visible md: space-y-7 md:p-2 md:w-1/3">
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-800 pb-1">
                      {"$" +
                        item.characteristics[item.characteristics.length-1].fieldValues.amountInvesting}
                    </div>
                    <label>Invested Amount</label>
                  </div>
                </div>

                <div className="flex p-4 place-items-center">
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
    </>
  );
};
export default inactivepolicyCardForTrust;
