import { Modal } from "@components/modal";
import { Button } from "@components/forms";
import { Flex, Container, Grid } from "@components/layout";
import { useNotification } from "@context/notification";

export function ConfirmContingentDelete({
  showsModal,
  closeModal,
  primaryname,
  contingentname,
  openPopUp,
  logout = false
}) {
  const { addNotification } = useNotification();

  const handleClick = () => {
    openPopUp();
    closeModal();
  };

  const title = (
    <h2 className="text-left quotecolor bg-blue-900 text-white pl-8 sm:pl-12 p-3 font-normal text-md font-bold">
      Delete Beneficiary
    </h2>
  );

  return (
    <Modal
      title={title}
      logout={logout}
      description={
        <Container>
          <Container className="mt-8 px-8 sm:ml-12 text-left text-neutral-900 text-md font-bold">
            Are you sure you want to delete beneficiary?
          </Container>
          <p className="text-left ml-8 sm:ml-12 mt-3 text-blue-900 font-bold">
            {primaryname ? primaryname : contingentname}
          </p>
        </Container>
      }
      percent={true}
      showsModal={showsModal}
      sharing={true}
      body={
        <Flex className="flex-row px-8 sm:px-12 mt-10  pb-10">
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
      }
    />
  );
}
