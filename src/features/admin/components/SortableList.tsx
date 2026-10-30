"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { type MouseEvent, type ReactNode, useId, useOptimistic, useRef, useTransition } from "react";

import { useActionToast } from "@/features/admin/hooks/use-action-toast";
import type { ActionState } from "@/features/admin/types/action-state";
import { cn } from "@/utils/cn";

type Item = { id: string; node: ReactNode };

const SortableItem = ({ id, withHandle, children }: { id: string; withHandle: boolean; children: ReactNode }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const dragProps = { ...attributes, ...listeners };

  return (
    <div
      ref={setNodeRef}
      {...(withHandle ? {} : dragProps)}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative h-full touch-manipulation",
        withHandle ? "flex items-start gap-1" : "cursor-grab",
        isDragging && "z-10 cursor-grabbing opacity-80 shadow-2xl"
      )}
    >
      {withHandle && (
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...dragProps}
          aria-label="Drag to reorder"
          className="mt-4 shrink-0 cursor-grab rounded-md p-1 text-[#7f8da0] hover:text-white active:cursor-grabbing"
        >
          <Bars3Icon className="size-4" />
        </button>
      )}
      <div className="h-full min-w-0 flex-1">{children}</div>
    </div>
  );
};

/**
 * Items that can be dragged into a new order, saved as soon as one is
 * dropped. The new order shows right away and the server's takes over once
 * the save is done. `withHandle` limits dragging to a grip, for items with
 * fields inside.
 */
export const SortableList = ({
  items,
  onReorder,
  layout,
  withHandle = false,
  className,
}: {
  items: Item[];
  onReorder: (ids: string[]) => Promise<ActionState>;
  layout: "grid" | "list";
  withHandle?: boolean;
  className?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [ids, setIds] = useOptimistic(items.map(({ id }) => id));
  const notify = useActionToast();
  const isDragging = useRef(false);
  // Without a fixed id, dnd-kit numbers its accessibility ids differently on server and client
  const dndId = useId();
  const sensors = useSensors(
    // Short drags stay clicks, so cards still open their theme
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // The mouse-up that ends a drag still clicks whatever is under it, e.g. a card's link
  const endDrag = () => setTimeout(() => (isDragging.current = false), 100);

  const swallowClick = (event: MouseEvent) => {
    if (isDragging.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    endDrag();

    if (!over || active.id === over.id) {
      return;
    }

    const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));

    startTransition(async () => {
      setIds(next);
      notify(await onReorder(next));
    });
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => (isDragging.current = true)}
      onDragEnd={onDragEnd}
      onDragCancel={endDrag}
    >
      <SortableContext items={ids} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <div onClickCapture={swallowClick} className={cn(className, isPending && "pointer-events-none")}>
          {ids.map((id) => (
            <SortableItem key={id} id={id} withHandle={withHandle}>
              {items.find((item) => item.id === id)?.node}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
