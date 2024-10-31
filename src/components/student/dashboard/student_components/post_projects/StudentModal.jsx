import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const StudentModal = ({
  open,
  setOpen,
  handleSubmit,
  handlePayment,
}) => {
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);

  function handleCloseModal() {
    setOpen(false);
  }

  async function handlePayLater() {
    setIsProjectSubmitting(true);
    await handleSubmit();
    setIsProjectSubmitting(false);
  }
  function handlePayNow() {
    handlePayment();
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent" style={{ maxWidth: "460px" }}>
          <Dialog.Title className="DialogTitle">
            Are you sure to submit?
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            By submitting project you are agree with our terms and conditons.
          </Dialog.Description>
          <div
            style={{
              marginTop: "100px",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button className="btnPrimary btn--medium" onClick={handlePayNow}>
              Pay now
            </button>
            <button
              className="btnInfo btn--medium"
              onClick={handlePayLater}
              disabled={isProjectSubmitting}
            >
              {isProjectSubmitting ? "Submitting..." : "Pay later and Submit"}
            </button>

            <button
              style={{ justifySelf: "flex-start" }}
              className="btnDanger btn--medium"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
