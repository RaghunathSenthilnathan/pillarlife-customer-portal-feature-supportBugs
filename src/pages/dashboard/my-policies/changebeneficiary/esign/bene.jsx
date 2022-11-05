import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";

export function BeneSubmitModal({ showsModal, closeModal }) {
  return (
    <>
      <Modal
        processed={true}
        showsModal={showsModal}
        body={
          <Flex className="flex-col">
            <div className="flex justify-center">
              <label
                className="pb-2 m-4 font-semibold text-base justify-center"
                style={{ color: "#616161" }}
              >
                Beneficiary update will be processed soon.
              </label>
            </div>
            <div className="flex justify-center mt-10">
              <Button
                className="btncolor font-bold mr-6 w-40"
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
