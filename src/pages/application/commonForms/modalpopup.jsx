import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";
//import { NotificationType, useNotification } from "@context/notification";
export function ModalPopUp({
  showsModal,
  closeModal,
  confirmdelete,
  index,
  remove,
  title
}) {
  //const { addNotification } = useNotification();

  async function handleClick() {
    closeModal();
    remove(index);
  }

  return (
    <Modal
      description={title}
      showsModal={showsModal}
      body={
        <Flex
          className={`${
            confirmdelete ? "" : "inline-block items-center justify-center"
          }`}
        >
          <Button
            className={`${
              confirmdelete
                ? "hidden"
                : "inline-block w-2/6 bg-linkcolor font-bold"
            }`}
            onClick={closeModal}
          >
            OK
          </Button>
          <Flex
            className={`${
              confirmdelete
                ? "inline-block flex-row px-8 sm:px-12 mt-10 ml-4 sm:ml-0  pb-10"
                : "hidden"
            }`}
          >
            <Button
              className="w-20 sm:w-40  h-10 btn-cancel text-blue-500 border-blue-500 font-bold"
              onClick={closeModal}
            >
              No
            </Button>
            <Button
              className="h-10 w-20 sm:w-40 ml-8 btncolor font-bold"
              onClick={handleClick}
            >
              Yes
            </Button>
          </Flex>
        </Flex>
      }
    />
  );
}
