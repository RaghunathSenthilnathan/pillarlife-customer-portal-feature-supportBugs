import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex } from "@components/layout";
import { useRouter } from "next/router";
import { NextLink } from "@components/next-link/next-link";

export function IncompleteAppModal({ showsModal, closeModal }) {
  const router = useRouter();
  // const handleLogout = useLogout()

  const handleClick = () => {
    sessionStorage.removeItem("modalFlag")
    closeModal();
  };
  const handleSubmit=()=>{
      sessionStorage.removeItem("modalFlag")
    window.location.href = "/dashboard/my-applications?index=1";
  }

  return (
    <Modal
      title="Would you like to proceed with your Incomplete Application(s)? "
      showsModal={showsModal}
      body={
        <Flex className="px-12 mt-10 justify-center">
          <Button
            className="w-20 sm:w-40  btn-cancel text-blue-500 font-bold border-blue-500"
            onClick={handleClick}
          >
            No
          </Button>
        
            <Button
              className="w-20 sm:w-40 ml-8 font-bold btncolor"
              onClick={handleSubmit}
            >
              Yes
            </Button>
        </Flex>
      }
    />
  );
}
