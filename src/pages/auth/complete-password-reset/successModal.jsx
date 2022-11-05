import { Modal } from '@components/modal';
import { Button, Input, Label } from '@components/forms';
import { Flex, Container } from '@components/layout';
import { NotificationType, useNotification } from '@context/notification';
export function SuccessModal({showsModal,closeModal}) {
    const { addNotification } = useNotification();
    return (
    <Modal title="Your password has been changed successfully." showsModal={showsModal}   
    body={
        <Flex className="items-center justify-center sm:justify-end"> 
         <Button className=" w-2/3 sm:w-2/6 bg-linkcolor" onClick={closeModal} >Close</Button>
        </Flex>
}/>);
}

