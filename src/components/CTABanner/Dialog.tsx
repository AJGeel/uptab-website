import { Dialog as HDialog } from "@headlessui/react";
import Image from "next/image";

type DialogProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const Dialog = ({ isOpen, setIsOpen }: DialogProps) => {
  return (
    <HDialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-slate-900/80">
        <HDialog.Panel className="rounded bg-white overflow-hidden outline outline-black/10 shadow-lg">
          <Image
            src="/images/pretty-please.gif"
            width="330"
            height="338"
            alt="Pretty please?"
          />
        </HDialog.Panel>
      </div>
    </HDialog>
  );
};

export default Dialog;
