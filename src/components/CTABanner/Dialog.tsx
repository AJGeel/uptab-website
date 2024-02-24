import { Dialog as HDialog } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useStoreAttributes } from "@/hooks/useStoreAttributes";

import { Link } from "../Header/partials/Link";

type DialogProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const Dialog = ({ isOpen, setIsOpen }: DialogProps) => {
  const [hasClicked, setHasClicked] = useState(false);
  const { url, label } = useStoreAttributes();

  useEffect(() => {
    setHasClicked(false);
  }, [isOpen]);

  return (
    <HDialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center bg-slate-900/80 p-4">
        <HDialog.Panel className="overflow-hidden rounded bg-white shadow-lg outline outline-black/10">
          {hasClicked ? (
            <div
              className="flex flex-col items-center justify-center gap-10 p-8"
              style={{ width: 330, height: 338 }}
            >
              <div className="flex flex-col items-center gap-2">
                <p>How about now?</p>
                <Link
                  label={label}
                  href={`${url}?utm_source=cat`}
                  iconName="plus"
                />
              </div>
              <button
                onClick={() => setHasClicked(false)}
                className="text-xs text-slate-400"
              >
                Just show me the cat again.
              </button>
            </div>
          ) : (
            <Image
              src="/images/pretty-please.gif"
              width="330"
              height="338"
              alt="Pretty please?"
              className="cursor-pointer rounded-sm border-4 duration-150 hover:border-sky-500"
              onClick={() => setHasClicked(true)}
            />
          )}
        </HDialog.Panel>
      </div>
    </HDialog>
  );
};

export default Dialog;
