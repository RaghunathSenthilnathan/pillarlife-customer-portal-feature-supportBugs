import { Button, Input, Label } from "@components/forms";
import { AiFillEye } from "react-icons/ai";
import { LockIcon } from "@components/icons/icons";
import { Password } from "primereact/password";
import { Flex, Container } from "@components/layout";
import { LoadingInline } from "@components/loading-spinner";
import { IMAGE_PATHS } from "src/constants";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export const ChangePasswordForm = ({
  register,
  handleSubmit,
  isError,
  formErrors,
  isSuccess,
  visibility,
  visible,
  visibility1,
  visible1,
  visibility2,
  visible2,
  isLoading,
  newPasswordRef,
  closeModal,
  error
}) => (
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col py-0 sm:py-6   px-0 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row  flex-col-reverse sm:  divide-x-0 sm:divide-x-2 sm:divide-blue-300">
        <div className="flex flex-col mt-7 sm:mt-0 w-screen sm:w-1/2">
          <div className="flex flex-col w-10/12 sm:w-11/12 left-align">
            <div className="font-semibold">Note:</div>
            <div className="font-normal pb-2">
              The new password should be different from the previous 3 passwords
              used
            </div>
          </div>
          <div className="flex flex-col w-11/12 left-align">
            <label className="font-noraml sm:font-semibold">
              Password should consist of:
            </label>
            <label className="font-normal">At least 8 Characters</label>
            <label className="font-normal">- One Lower Case Letter</label>
            <label className="font-normal">- One Upper Case Letter</label>
            <label className="font-normal">- One Number</label>
            <label className="font-normal">- One Special Character</label>
          </div>
          <div className="w-10/12 mt-7 sm:hidden">
            <Container className="flex flex-col-reverse space-y-5 sm:spcae-y-4 ml-0 sm:ml-0">
              <Button
                className=" btn-cancel h-15 sm:h-9 text-blue-500 border-blue-500 font-medium py-2 mr-1 px-4 rounded-sm  w-6/6 sm:w-3/6 mt-3 sm:mt-0"
                onClick={closeModal}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!!isLoading}
                className=" btncolor h-15 sm:h-9 text-xs font-medium py-2 px-4 mr-1 rounded-r w-6/6 sm:w-3/6"
              >
                Change {isLoading && <LoadingInline />}
              </Button>
            </Container>
          </div>
        </div>

        <div className="flex flex-col w-70 sm:w-1/2">
          <div className="flex flex-col">
            <div className="space-y-4 ml-0 sm:ml-4 left-align">
              <div>
                <Label htmlFor="oldPassword" className="font-semibold">
                  Old Password
                </Label>
                <Input
                  type={visible ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  placeholder="Old Password"
                  ref={register({
                    required: "Old Password is required.",
                    minLength: {
                      value: 8,
                      message: "Old Password must be at least 8 characters."
                    }
                  })}
                />
                <span>
                  <i
                    id="old-pwd"
                    className={visible ? "pi pi-eye-slash" : "pi pi-eye"}
                    onClick={() => visibility(visible)}
                  ></i>
                </span>
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.oldPassword?.message}
                </p>
              </div>
              <div>
                <Label htmlFor="newPassword" className="font-semibold">
                  New Password
                </Label>

                <Input
                  type={visible1 ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  ref={register({
                    required: "New Password is required.",
                    minLength: {
                      value: 8,
                      message: "New Password must be at least 8 characters."
                    }
                  })}
                />
                <span>
                  <i
                    id="pwd-eye"
                    className={visible1 ? "pi pi-eye-slash" : "pi pi-eye"}
                    onClick={() => visibility1(visible1)}
                  ></i>
                </span>
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.newPassword?.message}
                </p>
              </div>
              <div>
                <Label htmlFor="newPasswordConfirm" className="font-semibold">
                  Confirm New Password
                </Label>
                <Input
                  type={visible2 ? "text" : "password"}
                  id="newPasswordConfirm"
                  rightIcon={IMAGE_PATHS.PERSON}
                  name="newPasswordConfirm"
                  placeholder="Confirm Password"
                  ref={register({
                    required: "Password confirmation is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters."
                    },
                    validate: newPasswordConfirm =>
                      newPasswordConfirm === newPasswordRef.current ||
                      "The passwords do not match."
                  })}
                />
                <span>
                  <i
                    id="confirm-pwd"
                    className={visible2 ? "pi pi-eye-slash" : "pi pi-eye"}
                    onClick={() => visibility2(visible2)}
                  ></i>
                </span>
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.newPasswordConfirm?.message}
                </p>
              </div>
              {isError && error && (
                <p className="text-center" style={{ color: "red" }}>
                  {error.message === "Incorrect username or password."
                    ? "Old password not matched"
                    : error.message}
                </p>
              )}
              {isSuccess && (
                <p className="text-center" style={{ color: "blue" }}>
                  {"password Changed Successfully"}
                </p>
              )}
              <div className="hidden sm:block">
                <Container className="w-auto flex">
                  <Button
                    className=" btn-cancel h-9 text-blue-500 border-blue-500 font-medium py-2 px-4 rounded-sm mr-5 w-3/6 sm:w-3/6"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={!!isLoading}
                    className=" btncolor h-9 text-xs font-medium py-2 px-4 rounded-r w-3/6 sm:w-3/6"
                  >
                    Change {isLoading && <LoadingInline />}
                  </Button>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
);
