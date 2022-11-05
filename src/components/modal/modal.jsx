import { useClickOutside } from "@components/navbar/use-click-outside";
import { useRef } from "react";
export function Modal({
  showsModal = false,
  closeModal,
  icon,
  changePwd,
  sharing = false,
  percent = false,
  title,
  logout,
  description,
  body,
  withdrew,
  payheight,
  redistribute,
  footer,
  useclick
}) {
  const modalRef = useRef(null);
  useclick ? "" : useClickOutside(modalRef, closeModal);
  return (
    <div
      className={`${
        showsModal ? "block" : "hidden"
      } fixed inset-0 z-10 overflow-y-auto`}
    >
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20  text-center sm:block sm:p-0">
        <ModalBackgroundOverlay showsModal={showsModal} />

        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`${
            showsModal ? "inline-block" : "hidden"
          }  overflow-hidden text-left align-bottom m-auto transition-all transform bg-white rounded-lg shadow-xl sm:my-8  sm:align-middle ${
            percent
              ? "sm:max-w-md px-0 pt-0 pb-0 sm:p-0 sm:max-w-3xl px-0 sm:p-0"
              : " pt-5 pb-4 "
          } ${
            logout
              ? "sm:max-w-sm px-6":
              withdrew?"sm:max-w-lg h-64 "
              : changePwd
              ? "sm:max-w-3xl"
              : "sm:max-w-lg"
          } 
         
          ${
            payheight
              ? "h-80 px-2 p-2 paymentmodal-height overflow-y-auto"
              : redistribute && "px-0 sm:p-0 sm:max-w-md"
          }  
          ${redistribute && "px-0 sm:p-0 sm:max-w-md"}
          ${sharing ? "" : "sm:w-full"}
          `}
          aria-modal="true"
        >
          {/* Modal contents */}
          <div>
             <div className="flex items-center justify-center w-12 mx-auto">
              {icon}
            </div>

            <div className=" text-center ">
              <ModalTitle title={title} />
              <div className="mt-2">
                <ModalDescription description={description} />
              </div>

              <div className="mt-4">{body}</div>
            </div>
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
function ModalBackgroundOverlay({ showsModal }) {
  return (
    <>
      <div
        className={`${
          showsModal ? "block" : "hidden"
        } fixed inset-0 transition-opacity`}
      >
        <div className="absolute inset-0 bg-gray-500 opacity-100" />
      </div>

      {/* This element is to trick the browser into centering the modal contents. */}
      <span
        className="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      />
    </>
  );
}
function ModalTitle({ title }) {
  return (
    <div
      className="text-lg font-medium leading-6 text-gray-900"
      id="modal-headline"
    >
      {title}
    </div>
  );
}
function ModalDescription({ description }) {
  return (
    <div className="text-md text-left mx-6 font-bold text-gray-500">
      {description}
    </div>
  );
}
