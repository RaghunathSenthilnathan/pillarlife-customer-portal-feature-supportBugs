import React, { useState, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { Modal } from "@components/modal";
import { Flex } from "@components/layout";
import { Button } from "primereact/button";
import { refreshJwt } from "@utils/refresh-jwt";

export const IdleTimerContainer = ({ logout, refresh, isAuthenticated }) => {
  // Modal open state
  const [Open, setOpen] = useState(false);

  const logout1 = () => {
    logout();
    closeModal();
  };

  const closeModal = () => {
    setOpen(false);
  };

  const timeout = 1000 * 1740;
  const promptTimeout = 1000 * 60;

  // Time before idle
  const [remaining, setRemaining] = useState(0);

  const onPrompt = () => {
    // onPrompt will be called after the timeout value is reached
    // In this case 30 minutes. Here you can open your prompt.
    // All events are disabled while the prompt is active.
    // If the user wishes to stay active, call the `reset()` method.
    // You can get the remaining prompt time with the `getRemainingTime()` method,
    setOpen(true);
    setRemaining(promptTimeout);
  };

  const onIdle = () => {
    // onIdle will be called after the promptTimeout is reached.
    // In this case 30 seconds. Here you can close your prompt and
    // perform what ever idle action you want such as log out your user.
    // Events will be rebound as long as `stopOnMount` is not set.
    setOpen(true);
    setRemaining(10000);
    logout1();
  };

  const onActive = () => {
    // onActive will only be called if `reset()` is called while `isPrompted()`
    // is true. Here you will also want to close your modal and perform
    // any active actions.
    setRemaining(0);
  };

  const { getRemainingTime, isPrompted, reset } = useIdleTimer({
    timeout,
    promptTimeout,
    onPrompt,
    onIdle,
    onActive
  });
  const time = getRemainingTime();

  const handleStillHere = () => {
    refresh();
    closeModal();
    reset();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPrompted()) {
        setRemaining(Math.ceil(getRemainingTime() / 1000));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime, isPrompted, isAuthenticated]);

  useEffect(() => {
    const timerId = setInterval(async () => {
      if (isAuthenticated === true) {
        await refreshJwt();
      }
    }, 1000 * 3550);
    return () => {
      clearInterval(timerId);
    };
  }, [isAuthenticated]);

  return (
    <>
      <div>
        <Modal
          refcheck={true}
          useclick={true}
          showsModal={Open}
          closeModal={closeModal}
          description={
            <span className="text-left mt-3 text-neutral-900 font-muli font-bold">
              Your session is about to expire and you will be logged out
              automatically in 60 seconds. Please click on 'Stay logged in' to
              continue with this session.
              {/* -{time}- milliseconds left */}
            </span>
          }
          body={
            <Flex className="items-center mt-10 justify-between">
              <Button
                className=" w-5/12 sm:w-2/6 font-bold btncolor font-muli flex justify-center items-center "
                onClick={logout1}
              >
                Log out
              </Button>
              <Button
                className=" w-6/8 sm:w-2/6 font-bold btncolor font-muli flex justify-center items-center"
                onClick={handleStillHere}
              >
                Stay logged in
              </Button>
            </Flex>
          }
        />
      </div>
    </>
  );
};
