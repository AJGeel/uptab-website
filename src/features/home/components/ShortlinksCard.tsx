"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { FakeFavicon, type FaviconKind } from "@/features/home/components/FakeFavicon";
import { cn } from "@/utils/cn";

type Shortlink = { id: FaviconKind; title: string; subtitle: string };

const SHORTLINKS: Shortlink[] = [
  { id: "mail", title: "Mail", subtitle: "Inbox" },
  { id: "docs", title: "Docs", subtitle: "Drafts" },
  { id: "calendar", title: "Calendar", subtitle: "This week" },
  { id: "news", title: "News", subtitle: "Morning read" },
];

/** While the visitor hasn't touched the grid, the first tile is dragged onto the second on a loop (home.css). */
const AMBIENT_CLASSES = ["ut-d-a", "ut-d-s"];

/** A tile like the extension's shortlinks: the site's icon, its name and a subtitle. Draggable. */
const SortableShortlink = ({ item, isAmbient, ambientClass }: { item: Shortlink; isAmbient: boolean; ambientClass?: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`${item.title}, ${item.subtitle}`}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className={cn(
        "flex cursor-grab touch-manipulation items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 shadow-xs ring-sky-500 outline-hidden duration-150 hover:ring-3 focus-visible:ring-3",
        isDragging && "cursor-grabbing shadow-[0_16px_26px_-10px_rgba(2,14,44,0.45)]",
        isAmbient && ambientClass
      )}
    >
      <FakeFavicon kind={item.id} size={24} />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">{item.title}</span>
        <span className="truncate text-sm text-[#4b5563]">{item.subtitle}</span>
      </div>
    </div>
  );
};

/**
 * Shortlinks you can drag around, like in UpTab. Until you touch them, a
 * looping demo drags one tile for you; the first touch hands over control.
 */
export const ShortlinksCard = () => {
  const [order, setOrder] = useState(SHORTLINKS.map(({ id }) => id));
  const [isTouched, setIsTouched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setIsDragging(false);

    if (over && active.id !== over.id) {
      setOrder((current) => arrayMove(current, current.indexOf(active.id as FaviconKind), current.indexOf(over.id as FaviconKind)));
    }
  };

  const touch = () => setIsTouched(true);

  return (
    <article className="ut-s3 flex flex-col gap-5.5 rounded-3xl bg-white p-7 ring-1 ring-[#e2e8ef] ring-inset">
      <div>
        <h3 className="text-[22px] font-extrabold tracking-tight">Pick up, put down</h3>
        <p className="mt-2 text-base leading-relaxed text-muted">
          Shortlinks stay exactly where you drop them. Any bookmark can join the club in one click.
        </p>
      </div>

      {/* Two columns like the extension. While a tile is held, the grid shows its dashed drop zone */}
      <DndContext
        id="shortlinks"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => {
          touch();
          setIsDragging(true);
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setIsDragging(false)}
      >
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <div
            aria-label="Shortlinks"
            onPointerEnter={touch}
            onPointerDown={touch}
            onFocus={touch}
            className={cn(
              "@container relative -m-2 mt-auto grid grid-cols-2 gap-2 rounded-2xl border border-dashed p-2 transition-colors duration-250",
              isTouched ? (isDragging ? "border-[#e5e7eb] bg-[#f3f4f6]" : "border-transparent") : "ut-d-zone border-transparent"
            )}
          >
            {order.map((id, index) => (
              <SortableShortlink
                key={id}
                item={SHORTLINKS.find((link) => link.id === id)!}
                isAmbient={!isTouched}
                ambientClass={AMBIENT_CLASSES[index]}
              />
            ))}
            {!isTouched && (
              <svg
                className="ut-d-cur pointer-events-none absolute top-9 left-10 z-3 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] motion-reduce:hidden"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                aria-hidden="true"
              >
                <path d="M4 2l14 8-6 1.6L9 18z" fill="#020E2C" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Room is always reserved, so the card doesn't change height once you've had a go */}
      <p aria-hidden="true" className={cn("-mt-3 h-5 text-sm text-muted transition-opacity duration-300", isTouched && "opacity-0")}>
        Go on, drag one.
      </p>
    </article>
  );
};
