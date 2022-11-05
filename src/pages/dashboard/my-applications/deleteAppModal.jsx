import { Modal } from '@components/modal';
import { Button, Input, Label } from '@components/forms';
import { Flex, Container } from '@components/layout';
import { useRouter } from "next/router";
import { NotificationType, useNotification } from '@context/notification';
import { NextLink } from '@components/next-link/next-link';


export function DeleteAppModal({showsModal,closeModal,setModal,data,key}) {
    const { addNotification } = useNotification(); 
    const router = useRouter();
 
    return (
        <>
    <Modal title="Are you sure you want to delete? "   showsModal={showsModal}   
    body={
        <Flex className="px-12 mt-10 "> 
      <NextLink href ="/dashboard/my-applications?index=1">
        <Button className="w-40 btncolor" onClick={setModal}  >Delete</Button>
        </NextLink>
        <Button className="w-40 ml-8 btn-cancel text-blue-500 border-blue-500" onClick={closeModal} >Cancel</Button>
         
        </Flex>
}/>

</>
);

}