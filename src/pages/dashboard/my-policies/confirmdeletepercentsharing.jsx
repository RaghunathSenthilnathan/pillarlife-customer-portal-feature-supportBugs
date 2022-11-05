import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex, Container } from "@components/layout";
import { useNotification } from "@context/notification";

export function ConfirmDeletePercentSharing({
  showsModal,
  closeModal,
  primaryname,
  contingentname,
  openPercent,
  id,
  action,
  logout = false
}) {
  const { addNotification } = useNotification();

  const handleClick = () => {
    closeModal();

    if (action == true) {
      sessionStorage.removeItem("DeletedBeneLocator");
      if(id){
        sessionStorage.removeItem(id.toString());
      }
      
      sessionStorage.removeItem("exposures");
      window.location.href = `/dashboard/my-policies/updatebeneficiary?id=${id}`;
    } else if (action == false) {
      openPercent();
    }
  };

  const title = (
    <h2 className="text-left quotecolor bg-blue-900 text-white pl-8 sm:pl-12 p-3 font-normal text-md font-bold">
      Delete Beneficiary
    </h2>
  );

  return (
    <Modal
      title={action ? "" : title}
      logout={logout}
      description={
        !action ? (
          <Container className="px-12 sm:px-12 mt-10">
            <Container className="text-left text-neutral-900 text-md font-bold">
              Are you sure you want to delete beneficiary?
            </Container>
            <p className="text-left mt-3 text-blue-900 font-bold">
              {primaryname ? primaryname : contingentname}
            </p>
          </Container>
        ) : (
          <Container className="px-12 sm:px-12 mt-10">
            <Container className="text-left text-neutral-900 text-md font-bold">
              The updated information will be discarded if you do not complete
              the E-Sign process.
            </Container>
          </Container>
        )
      }
      percent={true}
      showsModal={showsModal}
      sharing={true}
      body={
        !action ? (
          <Flex className="flex-row  flex justify-center px-12 sm:px-12 mt-10  pb-10">
            <Button
              className="w-40  h-10 btn-cancel text-blue-500 border-blue-500 font-bold"
              onClick={closeModal}
            >
              No
            </Button>
            <Button
              className="h-10 w-40 ml-8 btncolor font-bold"
              onClick={handleClick}
            >
              Yes
            </Button>
          </Flex>
        ) : (
          <Flex className="flex-row flex justify-center px-12 sm:px-12 mt-10  pb-10">
            <Button
              className="w-40  h-10 btn-cancel text-blue-500 border-blue-500 font-bold"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className="h-10 w-40 ml-8 btncolor font-bold"
              onClick={handleClick}
            >
              OK
            </Button>
          </Flex>
        )
      }
    />
  );
}
