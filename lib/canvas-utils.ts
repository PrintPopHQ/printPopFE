import * as fabric from 'fabric';
import { SafeArea } from '@/types/phone';

export const initializeCanvas = (
  canvasElement: HTMLCanvasElement,
  width: number = 360,
  height: number = 720
): any => {
  const canvas = new fabric.Canvas(canvasElement, {
    width,
    height,
    backgroundColor: 'transparent',
    preserveObjectStacking: true,
    allowTouchScrolling: true,
    stopContextMenu: true,
  });

  return canvas;
};

export const loadCaseImage = (
  canvas: any,
  imageUrl: string,
  borderRadius?: number,
  onLoaded?: (safeArea: SafeArea) => void,
  targetWidth?: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const fabricImg = new fabric.Image(img, {
        selectable: false,
        evented: false,
      });

      // Scale image to fit specified targetWidth or canvas (same logic as HTML example)
      let scale: number;
      const effectiveWidth = targetWidth || canvas.width;

      if (img.width > img.height) {
        fabricImg.scaleToWidth(effectiveWidth);
        scale = effectiveWidth / img.width;
      } else {
        scale = Math.min(effectiveWidth / img.width, canvas.height / img.height);
        fabricImg.scale(scale);
      }

      // Center the image
      canvas.centerObject(fabricImg);

      // Calculate safe area based on scaled image dimensions (like HTML example)
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Use provided border radius or default to 8% of width
      const radius = borderRadius !== undefined ? borderRadius : scaledWidth * 0.08;

      const safeArea: SafeArea = {
        left: fabricImg.left || 0,
        top: fabricImg.top || 0,
        width: scaledWidth,
        height: scaledHeight,
        rx: radius,
        ry: radius,
      };

      canvas.add(fabricImg);
      fabricImg.set('id', 'phone-overlay');

      reorderLayers(canvas);
      canvas.renderAll();

      if (onLoaded) onLoaded(safeArea);
      resolve({ image: fabricImg, safeArea });
    };

    img.onerror = () => {
      console.error('Failed to load phone image:', imageUrl);
      reject(new Error('Failed to load image'));
    };

    // Use proxy for external URLs to avoid CORS issues and canvas tainting
    if (imageUrl.startsWith('http')) {
      img.src = `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
    } else {
      img.src = imageUrl;
    }
  });
};

export const reorderLayers = (canvas: any): void => {
  const objects = canvas.getObjects();
  const backgroundLayer = objects.find((obj: any) => obj.id === 'background-layer');
  const phoneCase = objects.find((obj: any) => obj.id === 'phone-overlay');
  const safeArea = objects.find((obj: any) => obj.id === 'safe-area-outline');

  if (backgroundLayer) {
    canvas.sendObjectToBack(backgroundLayer);
  }

  // Ensure other objects (user content) are above background but below phone case
  if (phoneCase) {
    canvas.bringObjectToFront(phoneCase);
  }

  if (safeArea) {
    canvas.bringObjectToFront(safeArea);
  }

  canvas.renderAll();
};

export const createSafeAreaOutline = (
  safeArea: SafeArea
): any => {
  return new fabric.Rect({
    left: safeArea.left,
    top: safeArea.top,
    width: safeArea.width,
    height: safeArea.height,
    rx: safeArea.rx,
    ry: safeArea.ry,
    fill: 'rgba(0,0,0,0)',
    stroke: 'transparent',
    strokeWidth: 2,
    strokeDashArray: [6, 4],
    selectable: false,
    evented: false,
    absolutePositioned: true,
    id: 'safe-area-outline',
  });
};

export const createClipPath = (safeArea: SafeArea): any => {
  return new fabric.Rect({
    left: safeArea.left,
    top: safeArea.top,
    width: safeArea.width,
    height: safeArea.height,
    rx: safeArea.rx,
    ry: safeArea.ry,
    absolutePositioned: true,
  });
};

export const addImageToCanvas = (
  canvas: any,
  imageUrl: string,
  safeArea: SafeArea
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const fabricImg = new fabric.Image(img, {
        scaleX: 0.5,
        scaleY: 0.5,
      });

      fabricImg.scaleToWidth(200);

      // Position at center of canvas
      fabricImg.set({
        left: canvas.width / 2 - fabricImg.getScaledWidth() / 2,
        top: canvas.height / 2 - fabricImg.getScaledHeight() / 2,
        cornerColor: '#4f46e5',
        cornerSize: 12,
        padding: 20,
        transparentCorners: false,
      });

      // Apply safe area clipping (like HTML example)
      const clipPath = new fabric.Rect({
        left: safeArea.left,
        top: safeArea.top,
        width: safeArea.width,
        height: safeArea.height,
        rx: safeArea.rx,
        ry: safeArea.ry,
        absolutePositioned: true,
      });

      fabricImg.clipPath = clipPath;

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      reorderLayers(canvas);

      resolve(fabricImg);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Use proxy for external URLs to avoid CORS issues
    if (imageUrl.startsWith('http')) {
      img.src = `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
    } else {
      img.src = imageUrl;
    }
  });
};

export const addTextToCanvas = (
  canvas: any,
  text: string = 'Double click to edit',
  safeArea: SafeArea,
  options: any = {}
): any => {
  const fabricText = new fabric.IText(text, {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fontSize: 24,
    fill: '#000000',
    fontFamily: 'Arial',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    cornerColor: '#4f46e5',
    cornerSize: 12,
    padding: 20,
    transparentCorners: false,
    ...options,
  });

  // Apply safe area clipping
  const clipPath = new fabric.Rect({
    left: safeArea.left,
    top: safeArea.top,
    width: safeArea.width,
    height: safeArea.height,
    rx: safeArea.rx,
    ry: safeArea.ry,
    absolutePositioned: true,
  });

  fabricText.clipPath = clipPath;

  canvas.add(fabricText);
  canvas.setActiveObject(fabricText);
  reorderLayers(canvas);

  return fabricText;
};

export const updateObjectScale = (
  canvas: any,
  object: any,
  scale: number
): void => {
  object.scale(scale / 100);
  canvas.renderAll();
};

export const updateObjectRotation = (
  canvas: any,
  object: any,
  angle: number
): void => {
  object.rotate(angle);
  canvas.renderAll();
};

export const updateObjectColor = (
  canvas: any,
  object: any,
  color: string
): void => {
  object.set({ fill: color });
  canvas.renderAll();
};

export const centerObject = (
  canvas: any,
  object: any
): void => {
  canvas.centerObject(object);
  canvas.renderAll();
};

export const moveObject = (
  canvas: any,
  object: any,
  direction: 'up' | 'down' | 'left' | 'right',
  step: number = 10
): void => {
  const left = object.left || 0;
  const top = object.top || 0;

  switch (direction) {
    case 'up':
      object.set({ top: top - step });
      break;
    case 'down':
      object.set({ top: top + step });
      break;
    case 'left':
      object.set({ left: left - step });
      break;
    case 'right':
      object.set({ left: left + step });
      break;
  }

  object.setCoords();
  canvas.renderAll();
};

export const deleteObject = (
  canvas: any,
  object: any
): void => {
  canvas.remove(object);
  canvas.renderAll();
};

export const clearCanvas = (
  canvas: any,
  keepCaseImage: boolean = true
): void => {
  if (keepCaseImage) {
    const objects = canvas.getObjects();
    const objectsToRemove = objects.filter(
      (obj: any) =>
        obj.id !== 'phone-overlay' &&
        obj.id !== 'background-layer' &&
        obj.id !== 'safe-area'
    );
    objectsToRemove.forEach((obj: any) => canvas.remove(obj));
  } else {
    canvas.clear();
  }
  canvas.renderAll();
};

export const fitImageToCanvas = (
  canvas: any,
  imageUrl: string,
  safeArea: SafeArea
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Use naturalWidth/Height for true pixel dimensions
      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;

      // Scale to MATCH the safe area dimensions (stretch-to-fill)
      const scaleX = safeArea.width / natW;
      const scaleY = safeArea.height / natH;

      const fabricImg = new fabric.Image(img, {
        originX: 'center',
        originY: 'center',
        scaleX: scaleX,
        scaleY: scaleY,
        selectable: true,
        evented: true,
        cornerColor: '#4f46e5',
        cornerSize: 12,
        padding: 0,
        transparentCorners: false,
      });

      // Clip to the safe area bounds
      fabricImg.clipPath = new fabric.Rect({
        left: safeArea.left,
        top: safeArea.top,
        width: safeArea.width,
        height: safeArea.height,
        rx: safeArea.rx,
        ry: safeArea.ry,
        absolutePositioned: true,
      });

      canvas.add(fabricImg);
      canvas.centerObject(fabricImg);
      canvas.setActiveObject(fabricImg);
      reorderLayers(canvas);
      canvas.renderAll();

      resolve(fabricImg);
    };

    img.onerror = (err) => {
      console.error('fitImageToCanvas: failed to load', imageUrl, err);
      reject(new Error('Failed to load image'));
    };

    // Use proxy for external URLs to avoid CORS issues
    if (imageUrl.startsWith('http')) {
      img.src = `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
    } else {
      img.src = imageUrl;
    }
  });
};

/**
 * Fit an already-on-canvas image object to fill the safe area (cover behaviour).
 * The image will be centred and clipped to the safe area bounds.
 */
export const fitSelectedImageToSafeArea = (
  canvas: any,
  object: any,
  safeArea: SafeArea
): void => {
  if (!object || object.type !== 'image') return;

  const imgNatW = (object as any).width as number;
  const imgNatH = (object as any).height as number;

  const scaleX = safeArea.width / imgNatW;
  const scaleY = safeArea.height / imgNatH;

  // Re-clip so the image is bounded by the safe area
  const clipPath = new fabric.Rect({
    left: safeArea.left,
    top: safeArea.top,
    width: safeArea.width,
    height: safeArea.height,
    rx: safeArea.rx,
    ry: safeArea.ry,
    absolutePositioned: true,
  });

  object.set({
    scaleX: scaleX,
    scaleY: scaleY,
    originX: 'center',
    originY: 'center',
    cornerColor: '#4f46e5',
    cornerSize: 12,
    padding: 0,
    transparentCorners: false,
    clipPath,
  });

  // Centre on the canvas after scaling
  canvas.centerObject(object);
  object.setCoords();
  canvas.renderAll();
  // Fire modification event so history is saved
  canvas.fire('object:modified', { target: object });
  reorderLayers(canvas);
};

export const updateObjectFontFamily = (
  canvas: any,
  object: any,
  fontFamily: string
): void => {
  if (object && (object.type === 'i-text' || object.type === 'text')) {
    object.set({ fontFamily });
    canvas.renderAll();
  }
};

/**
 * Export the canvas as an image.
 * When cropToSafeArea=true, crops to just the phone-model safe area (no black padding borders).
 */
export const exportCanvasAsImage = (
  canvas: any,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 1,
  multiplier: number = 2,
  cropToSafeArea: boolean = false
): string => {
  if (cropToSafeArea) {
    const safeArea = (canvas as any).safeArea as SafeArea | undefined;
    if (safeArea) {
      return canvas.toDataURL({
        format,
        quality,
        multiplier,
        left: safeArea.left,
        top: safeArea.top,
        width: safeArea.width,
        height: safeArea.height,
      });
    }
  }
  return canvas.toDataURL({ format, quality, multiplier });
};

/**
 * Serialise the full Fabric canvas state (all user objects + system layers) to
 * a JSON string that can later be restored via canvas.loadFromJSON().
 * Custom properties (id, selectable, evented, clipPath) are preserved.
 */
export const exportCanvasJSON = (canvas: any): string => {
  return JSON.stringify(canvas.toObject(['id', 'selectable', 'evented', 'clipPath']));
};

/**
 * Exports only the user's artwork (images + text) cropped to the safe area.
 *
 * Uses Fabric's native left/top/width/height crop in toDataURL — this is the only reliable
 * approach because Fabric's toDataURL pixel output dimensions don't map 1:1 with logical
 * canvas coords on retina/HiDPI displays, making manual drawImage cropping unreliable.
 *
 * Returns a Promise for API compatibility.
 */
export const exportArtworkOnly = (
  canvas: any,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 1,
  resolutionMultiplier: number = 2
): Promise<string> => {
  if (!canvas) return Promise.resolve('');

  const safeArea = (canvas as any).safeArea as SafeArea | undefined;
  const objects = canvas.getObjects();
  const overlay = objects.find((obj: any) => obj.id === 'phone-overlay');
  const safeAreaOutline = objects.find((obj: any) => obj.id === 'safe-area-outline');
  const safeAreaObj = objects.find((obj: any) => obj.id === 'safe-area');

  // Hide system objects so only user artwork is visible
  const originalOverlayVisible = overlay?.visible ?? true;
  const originalOutlineVisible = safeAreaOutline?.visible ?? true;
  const originalSafeAreaVisible = safeAreaObj?.visible ?? true;

  if (overlay) overlay.set({ visible: false });
  if (safeAreaOutline) safeAreaOutline.set({ visible: false });
  if (safeAreaObj) safeAreaObj.set({ visible: false });
  canvas.renderAll();

  // Use Fabric's native crop export — avoids all manual coordinate & DPR math
  const result = canvas.toDataURL({
    format,
    quality,
    multiplier: resolutionMultiplier,
    left: safeArea?.left ?? 0,
    top: safeArea?.top ?? 0,
    width: safeArea?.width ?? canvas.width,
    height: safeArea?.height ?? canvas.height,
  });

  // Restore system objects
  if (overlay) overlay.set({ visible: originalOverlayVisible });
  if (safeAreaOutline) safeAreaOutline.set({ visible: originalOutlineVisible });
  if (safeAreaObj) safeAreaObj.set({ visible: originalSafeAreaVisible });
  canvas.renderAll();

  return Promise.resolve(result);
};
