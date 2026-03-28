"use client";

import { Dialog } from "@/components/ui/dialog";
import RegisterDialogContent from "../auth/RegisterDialogContent";
import VerifyRegistrationDialogContent from "../auth/VerifyRegistrationDialogContent";
import RegistrationCompleteDialogContent from "../auth/RegistrationCompleteDialogContent";
import { useEffect } from "react";
import LoginDialogContent from "../auth/LoginDialogContent";
import ForgotPasswordDialogContent from "../auth/ForgotPasswordDialogContent";
import ForgotPasswordVerifyDialogContent from "../auth/ForgotPasswordVerifyDialogContent";
import ResetPasswordDialogContent from "../auth/ResetPasswordDialogContent";
import ResetPasswordCompleteDialogContent from "../auth/ResetPasswordCompleteDialogContent";
import { useStateContext } from "@/hooks/useStateContext";

const AuthDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { state, setState } = useStateContext();

  useEffect(() => {
    return () => {
      setState(1);
    };
  }, [setState]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {state === 1 && (
        <RegisterDialogContent
          onOpenChange={onOpenChange}
          setState={setState}
        />
      )}
      {state === 2 && <VerifyRegistrationDialogContent setState={setState} />}
      {state === 3 && <RegistrationCompleteDialogContent setState={setState} />}
      {state === 4 && (
        <LoginDialogContent onOpenChange={onOpenChange} setState={setState} />
      )}
      {state === 5 && <ForgotPasswordDialogContent setState={setState} />}
      {state === 6 && <ForgotPasswordVerifyDialogContent setState={setState} />}
      {state === 7 && <ResetPasswordDialogContent setState={setState} />}
      {state === 8 && (
        <ResetPasswordCompleteDialogContent setState={setState} />
      )}
    </Dialog>
  );
};

export default AuthDialog;
