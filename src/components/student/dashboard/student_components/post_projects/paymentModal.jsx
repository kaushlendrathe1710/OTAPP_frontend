import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Payment from "./Payment";

const PaymentModal = ({
  open, 
  setOpen,
  totalAmount,
  currency,
  assignmentTitle,
  handleSubmit,
}) => {

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          className="DialogContent"
          style={{ maxWidth: "768px" }}
        >
          <Payment
            currency={currency}
            handleSubmit={handleSubmit}
            assignmentTitle={assignmentTitle}
            totalAmount={totalAmount}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PaymentModal;
