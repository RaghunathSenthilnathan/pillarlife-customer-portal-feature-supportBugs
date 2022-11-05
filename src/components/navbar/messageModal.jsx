import { Modal } from "@components/modal";
import { Button, Input, Label } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { Auth } from "@aws-amplify/auth";
import { useAuth } from "@context/auth";
import router from "next/router";
import { useAsync } from "@hooks/use-async";
import { NotificationType, useNotification } from "@context/notification";
export function MessageModal({ value, showsModal, closeModal, message }) {
  const { dispatch } = useAuth();
  const { addNotification } = useNotification();
  async function handleClick() {
    message(false);
    await Auth.signOut();
    dispatch({ type: "LOGOUT_SUCCESS" });
    localStorage.clear();
    router.push("/auth/login");
  }
  return (
    <Modal
      title={
        "Password has been changed successfully. Please login again using your new password"
      }
      showsModal={showsModal}
      body={
        <Flex className="items-center justify-center">
          <Button className="w-2/6 bg-linkcolor" onClick={handleClick}>
            OK
          </Button>
        </Flex>
      }
    />
  );
}
