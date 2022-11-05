import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";
import { useRouter } from "next/router";

export function WithdrawalSubmitModal({
  showsModal,
  closeModal,
  id,
  data,
  key
}) {
  const router = useRouter();

  return (
    <>
      <Modal
        processed={true}
        showsModal={showsModal}
        body={
          <Flex className="flex-col">
            <div className="flex">
              {/* <img className="inline mx-4 w-6 h-5" src={IMAGE_PATHS.ADMIN_SUCCESS} /> */}
              <label
                className="pb-2 m-4 font-semibold text-base text-center"
                style={{ color: "#616161" }}
              >
                A withdrawal request is already in process. Please come back
                later.
              </label>
            </div>
            <div className="flex flex-row-reverse mt-10">
              <Button
                className="btncolor mr-6 w-40 font-bold"
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          </Flex>
        }
      />
    </>
  );
}
