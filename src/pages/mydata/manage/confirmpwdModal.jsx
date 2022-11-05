import { Button, Input, Label } from "@components/forms";
import { Modal } from "@components/modal";
import { LoadingInline } from "@components/loading-spinner";
import { Flex } from "@components/layout";
import { NextLink } from "@components/next-link";
import { NotificationType, useNotification } from "@context/notification";
import { isValidEmail } from "@shared/index";
import { withAnonymous } from "@utils/route-hocs";
import { NextSeo } from "next-seo";
import { useAuth } from "@context/auth";
import { IMAGE_PATHS, ROUTE_PATHS } from "src/constants";
import { useRouter } from "next/router";
import { useWelcomeBack } from "./use-welcome-back";
import { ChangePasswordForm } from './confirmpwdForm';
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.WELCOME_BACK}`;
const title = "Welcome Back";
const description =
  "Enables you to enter your password to complete registration.";

export function ManageModal({ showsModal, closeModal }) {
      const {
    handleSubmit,
    register,
    formErrors,
    isError,
    error,
    isLoading
  } = useWelcomeBack();
  const { addNotification } = useNotification();
  return (
    <Modal title="Confirm Password"  showsModal={showsModal} closeModal={closeModal}  body={<ChangePasswordForm register={register} closeModal={closeModal} handleSubmit={handleSubmit} isError={isError} formErrors={formErrors} isLoading={isLoading}/>}/>);
}
// export default withAnonymous(ManageModal);