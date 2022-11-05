import { Button, Input, Label } from '@components/forms';
import { Heading, SubHeading } from '@components/heading/heading';
import { EmailIcon } from '@components/icons/icons';
import { LoadingInline } from '@components/loading-spinner';
import { NotificationType, useNotification } from '@context/notification';
import { NextLink } from '@components/next-link';
import { isValidEmail } from '@shared/index';
import { withAnonymous } from '@utils/route-hocs';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';
import { IMAGE_PATHS, ROUTE_PATHS } from 'src/constants';
import { useRequestPasswordReset } from './use-request-password-reset';
import { Container } from './../../../components/layout/container';
import router from 'next/router';
const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESET_PASSWORD}`;
const title = 'Reset password';
const description = 'Enables you to change your password in case you forget it.';
export default withAnonymous(RequestPasswordReset);
function RequestPasswordReset() {
    const { register, handleSubmit, formErrors, isError, error, isSuccess, isLoading, } = useRequestPasswordReset();
    const { addNotification } = useNotification();
    useEffect(() => {
          if (isSuccess) {
            router.push({pathname: '/auth/check-email',query:{data:"reset"}},"/auth/check-email");
          }
        if (isError && error) {
            addNotification({ type: NotificationType.ERROR, title: error.message });
        }
    }, [addNotification, error, isError, isSuccess]);

    const handleCancel = () => {
      router.push(ROUTE_PATHS.LOGIN)
    }
    return (<>
      <NextSeo title={title} description={description} canonical={url} openGraph={{
            url,
            title,
            description,
        }}/>
      <Container className="flex flex-col py-12 sm:px-6 lg:px-8">
        <Container className="lg:flex">
          <Container className="lg:pr-16 lg:flex-1">
            

            <Container className="sm:mx-auto sm:w-3/6 sm:max-w-3/6">
              <Container className=" py-8 sm:rounded-lg px-10 test">
              <Container className="text-left">
                  <Container className="text-left mb-5 customheader">
                    <Container className="text-900 text-2xl font-bold mb-3">Reset Password</Container>
                    <span className="text-600 text-sm font-semibold ">Enter the email address associated with your account and we'll send you a link to reset your password</span>
                    
                </Container>
                  </Container>
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  <Container className="w-12/12 sm:w-7/12 ">
                    <Label htmlFor="email" className="font-semibold">Email</Label>
                    <Input type="email" id="email"  name="email" placeholder="email@address.com" ref={register({
            required: 'Email is required.',
            validate: email => isValidEmail(email) || 'Email address is invalid.',
        })} error={formErrors.email?.message} />
                  </Container>
                 
                  <Container className="w-auto flex">
                  
                  
                    
                    <Button className=" btn-cancel h-9 text-blue-500 border-blue-500 font-medium py-2 px-4 rounded-sm mr-5 w-3/6 sm:w-2/6" onClick={handleCancel} >
                      Cancel
                    </Button>
                    
                    <Button type="submit" disabled={!!isLoading} className=" btncolor h-9 text-xs font-medium py-2 px-4 rounded-r w-3/6 sm:w-2/6">
                      Continue {isLoading && <LoadingInline />}
                    </Button>
                  </Container>
                 
                  {/* <div>
                    <Button type="submit" disabled={!!isLoading} isFullWidth>
                      Reset Password {isLoading && <LoadingInline />}
                    </Button>
                  </div> */}
                </form>
              </Container>
            </Container>
          </Container>
          
        </Container>
      </Container>
    </>);
}
//# sourceMappingURL=request-password-reset.jsx.map