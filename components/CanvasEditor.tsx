'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { PhoneModel } from '@/types/phone';
import {
  initializeCanvas,
  loadCaseImage,
  createSafeAreaOutline,
} from '@/lib/canvas-utils';

interface CanvasEditorProps {
  phoneModel: PhoneModel;
  onCanvasReady?: (canvas: any) => void;
  onObjectSelected?: (obj: any | null) => void;
  onModelLoaded?: (canvas: any) => void;
}

export default function CanvasEditor({
  phoneModel,
  onCanvasReady,
  onObjectSelected,
  onModelLoaded,
}: CanvasEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<any | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const onCanvasReadyRef = useRef(onCanvasReady);
  const onObjectSelectedRef = useRef(onObjectSelected);
  const onModelLoadedRef = useRef(onModelLoaded);

  // Track pinch state
  const lastPinchDistRef = useRef<number | null>(null);
  const pinchBaseScaleRef = useRef<{ x: number; y: number } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Keep callback refs fresh
  useEffect(() => {
    onCanvasReadyRef.current = onCanvasReady;
    onObjectSelectedRef.current = onObjectSelected;
    onModelLoadedRef.current = onModelLoaded;
  });

  const [isMobile, setIsMobile] = useState(false);

  // Sync isMobile state with window width
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Mount canvas element and initialize Fabric ONCE (re-init on model or mobile-view change)
  useEffect(() => {
    if (!wrapperRef.current || fabricCanvasRef.current) return;

    const canvasEl = document.createElement('canvas');
    canvasEl.className = 'max-w-full h-auto shadow-lg';
    canvasElRef.current = canvasEl;
    wrapperRef.current.appendChild(canvasEl);

    const CANVAS_PADDING = isMobile ? 20 : 140;
    const width = (phoneModel?.canvasWidth || 320) + CANVAS_PADDING * 2;
    const height = (phoneModel?.canvasHeight || 720) + CANVAS_PADDING * 2;
    const canvas = initializeCanvas(canvasEl, width, height);
    fabricCanvasRef.current = canvas;

    canvas.on('selection:created', (e: any) => {
      if (onObjectSelectedRef.current && e.selected?.[0]) {
        onObjectSelectedRef.current(e.selected[0]);
      }
    });
    canvas.on('selection:updated', (e: any) => {
      if (onObjectSelectedRef.current && e.selected?.[0]) {
        onObjectSelectedRef.current(e.selected[0]);
      }
    });
    canvas.on('selection:cleared', () => {
      onObjectSelectedRef.current?.(null);
    });

    onCanvasReadyRef.current?.(canvas);

    return () => {
      canvas.dispose().then(() => {
        if (canvasEl.parentNode) canvasEl.remove();
      }).catch(console.error);
      fabricCanvasRef.current = null;
    };
  }, [isMobile]);

  // 2. Reload image whenever phoneModel changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const toRemove = canvas.getObjects().filter(
      (obj: any) => obj.id === 'phone-overlay' || obj.id === 'safe-area-outline'
    );
    if (toRemove.length > 0) canvas.remove(...toRemove);

    setIsLoading(true);

    loadCaseImage(canvas, phoneModel.image, phoneModel.safeArea.rx, (safeArea) => {
      const outline = createSafeAreaOutline(safeArea);
      canvas.add(outline);
      canvas.bringObjectToFront(outline);
      (canvas as any).safeArea = safeArea;
      canvas.renderAll();
      setIsLoading(false);
      // Notify parent that the model has fully loaded with the real safeArea
      onModelLoadedRef.current?.(canvas);
    }, phoneModel.canvasWidth || 320).catch((err) => {
      console.error('Failed to load case image:', err);
      setIsLoading(false);
    });
  }, [phoneModel]);

  // 3. Pinch-to-zoom — scales the SELECTED OBJECT, not the viewport
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const getDistance = (t1: Touch, t2: Touch) =>
      Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      const canvas = fabricCanvasRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj) return;

      lastPinchDistRef.current = getDistance(e.touches[0], e.touches[1]);
      pinchBaseScaleRef.current = {
        x: activeObj.scaleX ?? 1,
        y: activeObj.scaleY ?? 1,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      if (lastPinchDistRef.current === null || pinchBaseScaleRef.current === null) return;
      e.preventDefault();

      const canvas = fabricCanvasRef.current;
      const activeObj = canvas?.getActiveObject();
      if (!activeObj) return;

      const newDist = getDistance(e.touches[0], e.touches[1]);
      const ratio = newDist / lastPinchDistRef.current;

      // Apply ratio on top of the base scale recorded at touch-start
      const newScaleX = Math.min(Math.max(pinchBaseScaleRef.current.x * ratio, 0.05), 10);
      const newScaleY = Math.min(Math.max(pinchBaseScaleRef.current.y * ratio, 0.05), 10);

      activeObj.set({ scaleX: newScaleX, scaleY: newScaleY });
      activeObj.setCoords();
      canvas.renderAll();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastPinchDistRef.current = null;
        pinchBaseScaleRef.current = null;
      }
    };

    wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background flex flex-col items-center justify-center z-20 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(92,225,230,0.5)]" />
            <p className="text-sm font-medium text-primary">Loading case...</p>
          </div>
        </div>
      )}

      {/* Fabric mounts the canvas here imperatively — React does NOT manage children */}
      <div ref={wrapperRef} />
    </div>
  );
}
