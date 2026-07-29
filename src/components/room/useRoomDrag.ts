import { useCallback, useRef, useState } from 'react';
import { RoomBand, RoomPoint, clampToBand } from './roomLayout';

interface DragState {
  itemId: string;
  point: RoomPoint;
  /** Offset between the pointer and the item's anchor, so the item doesn't
   *  jump to centre itself under the finger on grab. */
  offsetX: number;
  offsetY: number;
  /** Whether the pointer has actually travelled — used to tell a tap (which
   *  should speak the item) from a drag (which should not). */
  moved: boolean;
}

interface UseRoomDragOptions {
  /** Element the coordinates are measured against. */
  stageRef: React.RefObject<HTMLElement>;
  /** Called once, on release, with the item's final position. */
  onCommit: (itemId: string, x: number, y: number) => void;
  /** When false, pointer handlers do nothing and taps behave normally. */
  enabled: boolean;
}

/** Pointer travel (in stage fractions) before a press counts as a drag. */
const DRAG_THRESHOLD = 0.012;

/**
 * Pointer-event dragging for room items.
 *
 * Uses PointerEvents with setPointerCapture rather than HTML5 drag-and-drop:
 * drag-and-drop has no touch support at all on mobile browsers, while pointer
 * capture gives identical behaviour for mouse, touch, and stylus and keeps
 * receiving moves even when the finger slides outside the element.
 */
export const useRoomDrag = ({ stageRef, onCommit, enabled }: UseRoomDragOptions) => {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const setDragBoth = (next: DragState | null) => {
    dragRef.current = next;
    setDrag(next);
  };

  /** Convert a pointer position into stage fractions. */
  const toStagePoint = useCallback(
    (clientX: number, clientY: number): RoomPoint | null => {
      const stage = stageRef.current;
      if (!stage) return null;
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      return {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
      };
    },
    [stageRef]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, itemId: string, current: RoomPoint) => {
      if (!enabled) return;
      // Ignore secondary mouse buttons so right-click never starts a drag.
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      const point = toStagePoint(event.clientX, event.clientY);
      if (!point) return;

      event.currentTarget.setPointerCapture?.(event.pointerId);
      setDragBoth({
        itemId,
        point: current,
        offsetX: current.x - point.x,
        offsetY: current.y - point.y,
        moved: false,
      });
    },
    [enabled, toStagePoint]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent, band: RoomBand) => {
      const active = dragRef.current;
      if (!active) return;

      const point = toStagePoint(event.clientX, event.clientY);
      if (!point) return;

      const next = clampToBand(
        { x: point.x + active.offsetX, y: point.y + active.offsetY },
        band
      );

      const travelled =
        Math.abs(next.x - active.point.x) + Math.abs(next.y - active.point.y);

      setDragBoth({
        ...active,
        point: next,
        moved: active.moved || travelled > DRAG_THRESHOLD,
      });
    },
    [toStagePoint]
  );

  /**
   * Ends the gesture. Returns true when it was a real drag, so the caller can
   * suppress the tap action (speaking the item name) for that gesture.
   */
  const handlePointerUp = useCallback(
    (event: React.PointerEvent): boolean => {
      const active = dragRef.current;
      if (!active) return false;

      event.currentTarget.releasePointerCapture?.(event.pointerId);
      if (active.moved) {
        onCommit(active.itemId, active.point.x, active.point.y);
      }
      setDragBoth(null);
      return active.moved;
    },
    [onCommit]
  );

  /**
   * Live position for an item mid-drag, so it follows the finger without a
   * state round-trip through the parent on every move.
   */
  const positionFor = useCallback(
    (itemId: string, saved: RoomPoint): RoomPoint =>
      drag?.itemId === itemId ? drag.point : saved,
    [drag]
  );

  return {
    draggingItemId: drag?.itemId ?? null,
    isDragging: drag !== null,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    positionFor,
  };
};
