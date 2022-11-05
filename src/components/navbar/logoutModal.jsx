import { Modal } from "@components/modal";
import { LogoutIcon } from "@components/icons/icons";
import { Button, Input, Label } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { NotificationType, useNotification } from "@context/notification";
import { useLogout } from "./use-logout";
export function LogoutModal({ showsModal, closeModal }) {
  const { addNotification } = useNotification();
  const handleLogout = useLogout();
  async function handleClick() {
    closeModal();
    await handleLogout();
  }
  return (
    <Modal
      title={"Are you sure you want to log out?"}
      logout={true}
      showsModal={showsModal}
      body={
        <Flex className="items-center mt-10 justify-end">
          <Button
            className="w-3/6 btn-cancel text-blue-500 font-bold border-blue-500"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            className="w-3/6 btncolor font-bold ml-10"
            onClick={handleClick}
          >
            Log Out
          </Button>
        </Flex>
      }
    />
  );
}
