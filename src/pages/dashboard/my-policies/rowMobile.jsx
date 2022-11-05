import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import { Grid } from "@components/layout";
import { ROUTE_PATHS } from "src/constants";
import { Checkbox } from "primereact/checkbox";


import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Change Beneficiary";
const description =
  "Enables you to resend the registration activation link to your email address.";

const rowMobile = ({ value, setSelected }) => {
  const [val, setValue] = useState();
  const [primary1, setPrimary1] = useState(null);
  const [check1, setCheck1] = useState(false);

  const handleCheck = (e, index) => {
    var show = [false, false, false, false, false];
    const newTodos = [...show];
    newTodos[index] = true;
    setischecked(newTodos);
    setSelected(e);
    setPrimary1(e.value);
  };

  const [ischecked, setischecked] = useState([
    false,

    false,

    false,

    false,

    false
  ]);

  useEffect(() => {
    setValue(value);
  }, [value]);

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

      {val?.map((item, index) => {
        return (
          <div key={index} className="block sm:hidden flex flex-row w-full">
            <div className="ml-2 mt-3">
              <Checkbox
                checked={ischecked[index]}
                value={item}
                onChange={e => handleCheck(e, index)}
              ></Checkbox>
            </div>
            <Grid className="bene-mobile p-4 w-10/12 mb-4">
              <div className="flex flex-row space-x-16">
                <div className="flex flex-col  w-1/2  space-y-1">
                  <div className="text-black text-sm font-bold">
                    {item.beneFullName}
                  </div>
                  <div className="text-gray-500 text-sm font-semibold">
                    {item.beneRelationOwner}
                  </div>
                </div>
                <div className="flex flex-col w-1/2 space-y-1">
                  <div className="text-black text-sm  ">Percentage</div>
                  <div className="text-black text-sm  font-semibold">
                    {item.beneSharingPercent}
                  </div>
                  <div className="text-black text-sm  ">Irrevocable</div>
                  <div className="text-black text-sm  font-semibold">
                    {item.beneIrrevocable}
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        );
      })}
    </>
  );
};
export default rowMobile;
