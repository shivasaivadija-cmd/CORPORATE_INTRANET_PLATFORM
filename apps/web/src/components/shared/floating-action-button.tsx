'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  Plus,
  X,
  FileText,
  Users,
  Calendar,
  Award,
  Image,
  Megaphone,
  Share2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const QUICK_ACTIONS = [
  { icon: FileText, label: 'New Post', href: '/feed', color: 'from-orange-500 to-red-500' },
  {
    icon: Megaphone,
    label: 'Announcement',
    href: '/announcements',
    color: 'from-yellow-500 to-orange-500',
  },
  { icon: Calendar, label: 'Event', href: '/events', color: 'from-rose-500 to-pink-500' },
  {
    icon: Award,
    label: 'Recognition',
    href: '/recognition',
    color: 'from-amber-500 to-yellow-500',
  },
  { icon: Image, label: 'Gallery', href: '/gallery', color: 'from-pink-500 to-rose-500' },
  { icon: Users, label: 'Invite', href: '/people', color: 'from-purple-500 to-pink-500' },
] as const;

type FabPoint = { x: number; y: number };

type UseEdgeSnapFabReturn = {
  pos: FabPoint;
  isDragging: boolean;
  bind: { onPointerDown: (e: React.PointerEvent) => void };
};

function useEdgeSnappedDraggableFab(opts: {
  initial: FabPoint;
  size: number;
  edgeInsetPctHidden?: number;
}): UseEdgeSnapFabReturn {
  const { initial, size, edgeInsetPctHidden = 0.7 } = opts;
  const [pos, setPos] = useState<FabPoint>(initial);
  const [isDragging, setIsDragging] = useState(false);

  const rafId = useRef<number | null>(null);
  const latestPos = useRef<FabPoint>(initial);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    pointerId: number;
  } | null>(null);

  const clampNeverFullyHidden = useCallback(
    (next: FabPoint) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const hidden = size * edgeInsetPctHidden;
      const visible = size - hidden;
      const safeOffset = size * 0.02;
      return {
        x: Math.min(vw - visible - safeOffset, Math.max(-hidden + safeOffset, next.x)),
        y: Math.min(vh - visible - safeOffset, Math.max(-hidden + safeOffset, next.y)),
      };
    },
    [edgeInsetPctHidden, size],
  );

  const snapToNearestEdge = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hidden = size * edgeInsetPctHidden;
    const visible = size - hidden;

    const dLeft = Math.abs(pos.x);
    const dRight = Math.abs(vw - (pos.x + size));
    const dTop = Math.abs(pos.y);
    const dBottom = Math.abs(vh - (pos.y + size));
    const min = Math.min(dLeft, dRight, dTop, dBottom);

    let targetX = pos.x;
    let targetY = pos.y;
    if (min === dLeft) targetX = -hidden;
    else if (min === dRight) targetX = vw - visible;
    else if (min === dTop) targetY = -hidden;
    else targetY = vh - visible;

    setPos(clampNeverFullyHidden({ x: targetX, y: targetY }));
  }, [clampNeverFullyHidden, edgeInsetPctHidden, pos.x, pos.y, size]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (typeof e.button === 'number' && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      latestPos.current = pos;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        baseX: pos.x,
        baseY: pos.y,
        pointerId: e.pointerId,
      };
      if (rafId.current) cancelAnimationFrame(rafId.current);
    },
    [pos],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      const next = clampNeverFullyHidden({
        x: drag.baseX + e.clientX - drag.startX,
        y: drag.baseY + e.clientY - drag.startY,
      });
      latestPos.current = next;
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        setPos(latestPos.current);
      });
    },
    [clampNeverFullyHidden],
  );

  const onPointerUpOrCancel = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      dragRef.current = null;
      setIsDragging(false);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
      snapToNearestEdge();
    },
    [snapToNearestEdge],
  );

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUpOrCancel);
    window.addEventListener('pointercancel', onPointerUpOrCancel);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUpOrCancel);
      window.removeEventListener('pointercancel', onPointerUpOrCancel);
    };
  }, [onPointerMove, onPointerUpOrCancel]);

  return useMemo(
    () => ({ pos, isDragging, bind: { onPointerDown } }),
    [isDragging, onPointerDown, pos],
  );
}

function useMagneticEdgeBias(args: { pos: FabPoint; size: number; edgeInsetPctHidden: number }) {
  const { pos, size, edgeInsetPctHidden } = args;
  return useMemo(() => {
    if (typeof window === 'undefined') return pos;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hidden = size * edgeInsetPctHidden;
    const visible = size - hidden;
    const candidates = [
      { ax: -hidden, ay: pos.y },
      { ax: vw - visible, ay: pos.y },
      { ax: pos.x, ay: -hidden },
      { ax: pos.x, ay: vh - visible },
    ];
    const threshold = 48;
    const bias = 0.35;
    let best = { x: pos.x, y: pos.y };
    let bestD = Number.POSITIVE_INFINITY;
    for (const c of candidates) {
      const d = Math.min(Math.abs(c.ax - pos.x), Math.abs(c.ay - pos.y));
      if (d < bestD) {
        bestD = d;
        best = { x: c.ax, y: c.ay };
      }
    }
    if (bestD <= threshold) {
      return {
        x: pos.x + (best.x - pos.x) * bias,
        y: pos.y + (best.y - pos.y) * bias,
      };
    }
    return pos;
  }, [edgeInsetPctHidden, pos, size]);
}

// FabShell uses Framer motion values for x/y so whileHover scale
// never conflicts with a style.transform string (which caused the top-left jump).
function FabShell(props: {
  ariaLabel: string;
  sizePx: number;
  isDragging: boolean;
  bind: { onPointerDown: (e: React.PointerEvent) => void };
  pos: FabPoint;
  gradient: string;
  children: React.ReactNode;
  quickActions?: React.ReactNode;
}) {
  const { ariaLabel, sizePx, isDragging, bind, pos, gradient, children, quickActions } = props;

  const edgeInsetPctHidden = 0.7;
  const magnetic = useMagneticEdgeBias({ pos, size: sizePx, edgeInsetPctHidden });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    mx.set(isDragging ? pos.x : magnetic.x);
    my.set(isDragging ? pos.y : magnetic.y);
  }, [isDragging, magnetic.x, magnetic.y, mx, my, pos.x, pos.y]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {quickActions}

      <motion.button
        type="button"
        aria-label={ariaLabel}
        {...bind}
        className="shadow-primary/40 pointer-events-auto relative flex touch-none select-none items-center justify-center overflow-hidden rounded-full shadow-2xl"
        style={{ width: sizePx, height: sizePx, x: mx, y: my, touchAction: 'none' }}
        whileHover={{ scale: isDragging ? 1 : 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.9 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="relative z-10">{children}</div>
      </motion.button>
    </div>
  );
}

export function FloatingActionButton() {
  return null;
}
