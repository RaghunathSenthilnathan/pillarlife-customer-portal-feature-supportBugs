import { Modal } from "@components/modal";
import { Button} from "@components/forms";
import { Flex } from "@components/layout";
export function ValidateModal({ showsModal, closeModal }) {
  return (
    <Modal
      title="Sorry, you are not eligible for this product at this point."
      showsModal={showsModal}
      body={
        <Flex className="items-center justify-center sm:justify-center">
          <Button
            className=" w-2/3 sm:w-2/6 bg-linkcolor font-bold font-muli"
            onClick={closeModal}
          >
            Close
          </Button>
        </Flex>
      }
    />
  );
}
