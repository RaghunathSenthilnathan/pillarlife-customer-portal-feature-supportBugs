import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";
export function ModalPopUp({ id, showsModal, closeModal, title }) {
  async function handleClick() {
    closeModal();
    if (id) {
      window.location.href = `/dashboard/my-policies/changebeneficiary?id=${id}`;
    }
  }

  return (
    <Modal
      description={title}
      showsModal={showsModal}
      body={
        <Flex className="items-center justify-center">
          <Button
            className="w-2/6 bg-linkcolor font-bold"
            onClick={handleClick}
          >
            OK
          </Button>
        </Flex>
      }
    />
  );
}
