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
}

export default function CanvasEditor({
  phoneModel,
  onCanvasReady,
  onObjectSelected,
}: CanvasEditorProps) {
  // A stable, non-Fabric container wrapper
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<any | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const onCanvasReadyRef = useRef(onCanvasReady);
  const onObjectSelectedRef = useRef(onObjectSelected);

  // isLoading lives OUTSIDE the Fabric-managed DOM region to avoid insertBefore conflicts
  const [isLoading, setIsLoading] = useState(true);

  // Keep callback refs fresh
  useEffect(() => {
    onCanvasReadyRef.current = onCanvasReady;
    onObjectSelectedRef.current = onObjectSelected;
  });

  // 1. Mount canvas element and initialize Fabric ONCE
  useEffect(() => {
    if (!wrapperRef.current || fabricCanvasRef.current) return;

    // Dynamically create the canvas element and append to wrapper
    // This way React never manages the canvas element directly
    const canvasEl = document.createElement('canvas');
    canvasEl.className = 'max-w-full h-auto shadow-lg';
    canvasElRef.current = canvasEl;
    wrapperRef.current.appendChild(canvasEl);

    const canvas = initializeCanvas(canvasEl, 320, 720);
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
        // After Fabric v7 gracefully restores the canvas element, we remove it from the DOM
        if (canvasEl.parentNode) {
          canvasEl.remove();
        }
      }).catch(console.error);
      fabricCanvasRef.current = null;
    };
  }, []);

  // 2. Reload image whenever phoneModel changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Remove old phone overlay and outline only
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
    }).catch((err) => {
      console.error('Failed to load case image:', err);
      setIsLoading(false);
    });
  }, [phoneModel]);

  return (
    // Outer div managed by React — safe for state-driven children
    <div className="relative">
      {/* Loading Overlay — SIBLING to the Fabric wrapper, not inside it */}
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
