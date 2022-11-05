import { Button, Input, Label } from '@components/forms';
import { Flex } from "@components/layout";
import { LoadingInline } from '@components/loading-spinner';
export const ChangePasswordForm = ({ register, handleSubmit, formErrors,closeModal, isError,isLoading, newPasswordRef, }) => (
 <div className="flex flex-col sm:px-6 lg:px-8">
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div className="text-left font-normal">
                      Please confirm your password to delink your bank account(s). Please note that all your bank accounts currently linked to your policies will be delinked
                      </div>

                  <div className="text-left w-full sm:w-2/3">
                    <Label htmlFor="password" className="text-left font-bold">
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      ref={register({
                        required: "Password is required.",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters."
                        }
                      })}
                      error={formErrors.password?.message}
                    />
                  </div>
                  {isError && error && (
                    <p className="text-center" style={{ color: "red" }}>
                      Incorrect Password
                    </p>
                  )}
<Flex className="items-center mt-20 justify-end">
          <Button
            className="m-4 w-1/4 btn-cancel text-blue-500 font-bold border-blue-500"
            onClick={closeModal}
          >
            Cancel
          </Button>
           <Button
                      type="submit"
                      disabled={!!isLoading}
                    className="m-4 w-1/4 btncolor font-bold border-blue-500"
                    >
                     Confirm {isLoading && <LoadingInline />}
                    </Button>
        </Flex>
                  {/* <div>
                  <Button type="submit" disabled={!!isLoading} isFullWidth>
                    Reset Password {isLoading && <LoadingInline />}
                  </Button>
                </div> */}
                </form>

      </div>);