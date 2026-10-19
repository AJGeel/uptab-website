"use client";

import { StarIcon } from "@heroicons/react/16/solid";
import { useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { toggleCoverAction } from "@/features/backgrounds/api/toggle-cover";
import { useActionToast } from "@/features/backgrounds/hooks/use-action-toast";
import { MAX_COVER_IMAGES } from "@/features/backgrounds/utils/metadata";

// type="button", so it doesn't submit the surrounding edit form
export const CoverButton = ({
  id,
  position,
  isFull,
  isPublished,
}: {
  id: string;
  /** 1-based place in the cover, if the photo is in it. */
  position?: number;
  isFull: boolean;
  isPublished: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const reason = !isPublished
    ? "Add an author to publish it first"
    : !position && isFull
      ? `A cover has at most ${MAX_COVER_IMAGES} photos`
      : undefined;

  const toggle = () =>
    startTransition(async () => {
      notify(await toggleCoverAction(id));
    });

  return (
    <Button
      type="button"
      variant={position ? "primary" : "ghost"}
      onClick={toggle}
      disabled={isPending || reason !== undefined}
      title={reason}
    >
      <StarIcon className="size-4" />
      {position ? `Cover ${position} of ${MAX_COVER_IMAGES}` : "Add to cover"}
    </Button>
  );
};
