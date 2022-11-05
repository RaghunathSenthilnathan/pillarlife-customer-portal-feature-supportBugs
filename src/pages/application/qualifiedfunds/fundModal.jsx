import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";
export function FundModal({ showsModal, closeModal }) {
  return (
    <Modal
      //title="We are sorry, we are not yet able to offer this feature."
      showsModal={showsModal}
      body={
        <div>
          <div className="text-left text-gray-500 px-6">
            We are sorry, we are not yet able to offer this feature.
          </div>
          <Flex className="items-center justify-center sm:justify-end pr-6">
            <Button
              className=" w-2/3 sm:w-2/6 font-bold bg-linkcolor"
              onClick={closeModal}
            >
              Close
            </Button>
          </Flex>
        </div>
      }
    />
  );
}
