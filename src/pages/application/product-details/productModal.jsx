import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";
export function ProductModal({ showsModal, closeModal }) {
  return (
    <Modal
      title="Sorry! This product is not available currently for the selected term. Please choose another term"
      showsModal={showsModal}
      body={
        <Flex className="items-center justify-center sm:justify-center">
          <Button
            className=" w-2/3 sm:w-2/6 font-bold bg-linkcolor"
            onClick={closeModal}
          >
            Close
          </Button>
        </Flex>
      }
    />
  );
}
