import { Modal } from "@components/modal";
import { useEffect, useState } from "react";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";
import { RadioButton } from "primereact/radiobutton";
import { IMAGE_PATHS } from "src/constants";
import { ProgressSpinner } from "primereact/progressspinner";

export function PaymentModal({
  showsModal,
  closeModal,
  user,
  publictoken,
  select,
}) {
  const [val, setValue] = useState(user);
  var arrayfill = [];
  const [ischecked, setischecked] = useState(arrayfill);
  const [selectedaccount, setselectedaccount] = useState(null);
  var accounts = [];
  const [checkselect, setcheckselect] = useState(true);

  useEffect(() => {
    user ? (arrayfill = new Array(user.length).fill(false)) : null;

    user &&
      user.map((item) => {
        if (
          item.subtype.toLowerCase() === "savings" ||
          item.subtype.toLowerCase() === "checking"
        ) {
          accounts.push(item);
        }
      });

    setValue(accounts);
  }, [user]);

  const handleCheck = (e, index) => {
    setcheckselect(false);
    arrayfill = new Array(user.length).fill(false);
    const newTodos = [...arrayfill];
    newTodos[index] = true;
    setischecked(newTodos);
    setselectedaccount(e);
  };

  async function postdata() {
    setcheckselect(true);
    const publicbody = {
      public_token: publictoken,
      account_id: selectedaccount.account_id,
    };
    const jwt_key = sessionStorage.getItem("userName");
    const token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID +
        "." +
        jwt_key +
        ".accessToken"
    );

    await fetch(
      process.env.NEXT_PUBLIC_API_BACKEND +
        "/esign/api/v1/communication/send-public-token-account-id",
      {
        method: "POST",
        body: JSON.stringify(publicbody),

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.log("Error:", error);
      });
    select();
  }
  const title = (
    <Flex className="flex-row items-center justify-around">
      <div></div>

      <h3 className="text-blue-800 text-lg font-semibold ">
        Select Bank Account{" "}
      </h3>
      <div className="">
        <img
          src={IMAGE_PATHS.CROSS_DELETE_ICON}
          className="cursor-pointer"
          onClick={closeModal}
        />
      </div>
    </Flex>
  );

  return (
    <Modal
      title={title}
      showsModal={showsModal}
      logout={true}
      payheight={true}
      body={
        <Flex className="flex-col items-center justify-center space-y-2 mt-10 sm:justify-end">
          {val && val?.length < 1 && (
            <div className=" flex flex-row  pl-3   space-x-7 p-3 paymentmodal-width sm:w-full">
              <div className="flex flex-row space-x-16">
                <div className="flex flex-col   space-y-1 mt-2">
                  <div className="text-black text-sm font-bold">
                    <ProgressSpinner
                      style={{ width: "50px", height: "50px" }}
                      className="fixed top-1/2 right-0  left-0 sm: object-fill"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {val?.length >= 1 &&
            val?.map((item, index) => {
              return (
                <div
                  key={index}
                  className=" flex flex-row bene-mobile pl-3 shadow-2xl shadow-gray-900/75  space-x-7 p-3  paymentmodal-width sm:w-full"
                >
                  <div className="ml-2 mt-1">
                    <RadioButton
                      name={item}
                      value={item}
                      onChange={(e) => handleCheck(item, index)}
                      checked={ischecked[index]}
                    />
                  </div>

                  <div className="flex flex-row font-muli space-x-16">
                    <div className="flex flex-col space-y-1 mt-2">
                      <div className="text-black text-md sm:text-lg font-bold">
                        {" XXX" + "-" + "XXXX" + "-" + item.mask}
                      </div>
                      <div className="text-gray-500 text-left text-sm sm:text-md font-semibold">
                        {item.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </Flex>
      }
      footer={
        <Flex className="flex-col items-center justify-center mt-5  pt-10  space-y-2 sm:justify-end">
          <Button
            className=" w-2/3 sm:w-3/6 bg-linkcolor font-bold font-muli mt-4 mb-4"
            onClick={postdata}
            disabled={checkselect}
          >
            Pay
          </Button>
        </Flex>
      }
    />
  );
}
