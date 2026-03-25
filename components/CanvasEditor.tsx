'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { PhoneModel } from '@/types/phone';
import {
  initializeCanvas,
  loadCaseImage,
  createSafeAreaOutline,
  exportCanvasAsImage,
  fitImageToCanvas,
  fitSelectedImageToSafeArea,
  clearCanvas,
  exportArtworkOnly,
  reorderLayers,
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

  // --- Undo/Redo State ---
  const historyRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const isUndoingRef = useRef(false);
  const isRedoingRef = useRef(false);

  const saveHistory = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isUndoingRef.current || isRedoingRef.current) return;

    // Capture state with custom properties
    const json = JSON.stringify(canvas.toObject(['id', 'selectable', 'evented', 'clipPath']));

    // Only save if it's different from the last state
    if (historyRef.current.length > 0 && historyRef.current[historyRef.current.length - 1] === json) {
      return;
    }

    historyRef.current.push(json);
    if (historyRef.current.length > 30) {
      historyRef.current.shift();
    }

    // Clear redo stack on new action
    redoStackRef.current = [];
  };

  const undo = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;

    isUndoingRef.current = true;
    const currentState = historyRef.current.pop(); // Remove current state
    if (currentState) redoStackRef.current.push(currentState);

    const lastState = historyRef.current[historyRef.current.length - 1];

    try {
      await canvas.loadFromJSON(JSON.parse(lastState));
      reorderLayers(canvas);
      canvas.renderAll();
    } catch (err) {
      console.error('Failed to undo:', err);
    } finally {
      isUndoingRef.current = false;
    }
  };

  const redo = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || redoStackRef.current.length === 0) return;

    isRedoingRef.current = true;
    const nextState = redoStackRef.current.pop();
    if (nextState) {
      historyRef.current.push(nextState);
      try {
        await canvas.loadFromJSON(JSON.parse(nextState));
        reorderLayers(canvas);
        canvas.renderAll();
      } catch (err) {
        console.error('Failed to redo:', err);
      }
    }
    isRedoingRef.current = false;
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Mount canvas element and initialize Fabric ONCE
  useEffect(() => {
    if (!wrapperRef.current || fabricCanvasRef.current) return;

    const canvasEl = document.createElement('canvas');
    canvasEl.className = 'max-w-full h-auto shadow-lg';
    canvasElRef.current = canvasEl;
    wrapperRef.current.appendChild(canvasEl);

    // Use initial sizing
    const H_PADDING = window.innerWidth < 768 ? 0 : 140;
    const V_PADDING = window.innerWidth < 768 ? 0 : 60;
    const width = (phoneModel?.canvasWidth || 320) + H_PADDING * 2;
    const height = (phoneModel?.canvasHeight || 720) + V_PADDING * 2;
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

    // History tracking
    const handleObjectsChange = () => {
      saveHistory();
    };

    canvas.on('object:added', handleObjectsChange);
    canvas.on('object:modified', handleObjectsChange);
    canvas.on('object:removed', handleObjectsChange);

    onCanvasReadyRef.current?.(canvas);

    return () => {
      canvas.dispose().then(() => {
        if (canvasEl.parentNode) canvasEl.remove();
      }).catch(console.error);
      fabricCanvasRef.current = null;
    };
  }, []); // Only once

  // 1.1 Update dimensions on resize/mobile-view change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !phoneModel) return;

    const H_PADDING = isMobile ? 0 : 140;
    const V_PADDING = isMobile ? 0 : 60;
    const newWidth = (phoneModel.canvasWidth || 320) + H_PADDING * 2;
    const newHeight = (phoneModel.canvasHeight || 720) + V_PADDING * 2;

    if (canvas.width === newWidth && canvas.height === newHeight) return;

    // Track center shift to move objects
    const oldCenter = canvas.getCenterPoint();
    canvas.setDimensions({ width: newWidth, height: newHeight });
    const newCenter = canvas.getCenterPoint();

    const dx = newCenter.x - oldCenter.x;
    const dy = newCenter.y - oldCenter.y;

    canvas.getObjects().forEach((obj: any) => {
      obj.set({
        left: (obj.left || 0) + dx,
        top: (obj.top || 0) + dy,
      });

      // Crucial: shift absolutePositioned clipPaths too
      if (obj.clipPath && obj.clipPath.absolutePositioned) {
        obj.clipPath.set({
          left: (obj.clipPath.left || 0) + dx,
          top: (obj.clipPath.top || 0) + dy,
        });
      }

      obj.setCoords();
    });

    // Update the stored safeArea coordinates on the canvas instance
    const currentSafeArea = (canvas as any).safeArea;
    if (currentSafeArea) {
      (canvas as any).safeArea = {
        ...currentSafeArea,
        left: currentSafeArea.left + dx,
        top: currentSafeArea.top + dy,
      };
    }

    canvas.renderAll();
  }, [isMobile, phoneModel.id]);

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
      saveHistory(); // Save initial loaded state
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

  // 4. Keyboard Shortcuts: Ctrl+Z (Undo) and Delete/Backspace (Remove)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const activeObj = canvas.getActiveObject();
      // Guard: Don't delete/undo if we are typing or editing text
      const isEditingText = activeObj && activeObj.type === 'i-text' && (activeObj as any).isEditing;
      const isInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      if (isInputFocused) return;

      if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (isEditingText) return;
        e.preventDefault();
        undo();
        return;
      }

      if (
        (e.ctrlKey && e.key.toLowerCase() === 'y') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        if (isEditingText) return;
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (isEditingText) return;

        if (activeObj && activeObj.id !== 'phone-overlay' && activeObj.id !== 'safe-area-outline') {
          e.preventDefault();
          canvas.remove(activeObj);
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
