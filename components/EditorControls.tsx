'use client';

import { useRef, useState, useEffect } from 'react';
import {
  CloudUpload,
  Maximize2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eraser,
  Minus,
  Plus,
  RefreshCcw as RotateIcon,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  addImageToCanvas,
  addTextToCanvas,
  updateObjectScale,
  updateObjectRotation,
  updateObjectColor,
  updateObjectFontFamily,
  centerObject,
  moveObject,
  deleteObject,
  clearCanvas,
} from '@/lib/canvas-utils';
import { cn } from '@/lib/utils';
import ClearDesignModal from './modals/ClearDesignModal';

// ─── Font options ─────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Impact', value: 'Impact' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS' },
  { label: 'Pacifico', value: 'Pacifico' },
  { label: 'Lobster', value: 'Lobster' },
  { label: 'Oswald', value: 'Oswald' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Dancing Script', value: 'Dancing Script' },
  { label: 'Press Start 2P', value: 'Press Start 2P' },
];

// Google Fonts families that need to be loaded dynamically
const GOOGLE_FONTS = [
  'Pacifico',
  'Lobster',
  'Oswald',
  'Playfair+Display',
  'Dancing+Script',
  'Press+Start+2P',
];

// ─── Component ────────────────────────────────────────────────────────────────

interface EditorControlsProps {
  canvas: any | null;
  selectedObject: any | null;
  textColor?: string;
  onObjectAdded?: () => void;
  onImageUpload?: (file: File) => void;
}

export default function EditorControls({
  canvas,
  selectedObject,
  textColor,
  onObjectAdded,
  onImageUpload,
}: EditorControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fontFamily, setFontFamily] = useState('Arial');

  // Clear modal state
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // ── Load Google Fonts once on mount ────────────────────────────────────────
  useEffect(() => {
    const linkId = 'printpop-google-fonts';
    if (document.getElementById(linkId)) return;
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS.map((f) => `${f}:wght@400;700`).join('&family=')}&display=swap`;
    document.head.appendChild(link);
  }, []);

  // ── Sync font and transform when selected object changes ──────────────────
  useEffect(() => {
    if (selectedObject) {
      if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
        setFontFamily(selectedObject.fontFamily || 'Arial');
      }
      // Sync scale (zoom) and rotation
      // Note: scale is multiplier, so 1.0 = 100%
      const currentScale = selectedObject.scaleX || 1;
      setZoom(Math.round(currentScale * 100));
      setRotation(Math.round(selectedObject.angle || 0));
    }
  }, [selectedObject]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    if (canvas && selectedObject) {
      updateObjectFontFamily(canvas, selectedObject, font);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/') && onImageUpload) {
      onImageUpload(file);
    }
  };

  const handleZoomChange = (value: number) => {
    setZoom(value);
    if (canvas && selectedObject) {
      updateObjectScale(canvas, selectedObject, value);
    }
  };

  const handleRotationChange = (value: number) => {
    setRotation(value);
    if (canvas && selectedObject) {
      updateObjectRotation(canvas, selectedObject, value);
    }
  };

  const handleTextAdd = () => {
    if (!canvas) return;
    const safeArea = (canvas as any).safeArea;
    if (!safeArea) {
      alert('Please wait for the phone case to load first!');
      return;
    }
    addTextToCanvas(canvas, 'YOUR TEXT', safeArea, {
      fill: textColor || '#FFFFFF',
      fontFamily,
    });
    if (onObjectAdded) onObjectAdded();
  };

  const handleDelete = () => {
    if (canvas && selectedObject) deleteObject(canvas, selectedObject);
  };

  const handleReset = () => {
    if (canvas) {
      setIsClearModalOpen(true);
    }
  };

  const confirmReset = () => {
    if (canvas) {
      clearCanvas(canvas, true);
      setZoom(100);
      setRotation(0);
    }
  };

  const isTextSelected =
    selectedObject &&
    (selectedObject.type === 'i-text' || selectedObject.type === 'text');

  return (
    <div className="space-y-6">
      <ClearDesignModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmReset}
      />

      <ClearDesignModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmReset}
      />

      {/* Action Buttons (Add Art / Add Text) */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group active:scale-[0.98] relative overflow-hidden',
            isDragging ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(92,225,230,0.2)]' : 'hover:bg-primary/10 hover:border-primary/50',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <CloudUpload className="w-5 h-5 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
          <p className="text-[10px] font-black tracking-widest uppercase text-white">Upload Art</p>
        </div>
        <div
          onClick={handleTextAdd}
          className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group active:scale-[0.98]"
        >
          <span className="text-xl font-black text-muted-foreground group-hover:text-primary mb-1.5 transition-colors">T</span>
          <p className="text-[10px] font-black tracking-widest uppercase text-white">Add Text</p>
        </div>
      </div>

      {/* Font Family Picker — visible always, active only when text selected */}
      <div className={cn('space-y-2 transition-all duration-500', !isTextSelected && 'opacity-40 pointer-events-none')}>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-black uppercase tracking-wider">
          <Type className="w-3 h-3" />
          <span>Font Style</span>
        </div>
        <div className="relative group/font">
          <select
            value={fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            disabled={!isTextSelected}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold appearance-none cursor-pointer focus:border-primary/50 transition-all outline-none disabled:opacity-30"
            style={{ fontFamily }}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover/font:text-primary transition-colors">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        {/* Font preview strip */}
        {isTextSelected && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFontChange(f.value)}
                className={cn(
                  'shrink-0 px-2.5 py-1 rounded-lg border text-[11px] transition-all',
                  fontFamily === f.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/10 bg-black/40 text-white hover:border-white/30',
                )}
                style={{ fontFamily: f.value }}
              >
                Aa
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">Editor Settings</p>
          <button
            onClick={handleReset}
            disabled={!canvas || !selectedObject}
            className="text-[10px] text-primary/60 hover:text-primary font-black uppercase tracking-widest transition-all px-2 py-1 rounded-lg hover:bg-primary/10 disabled:opacity-20 active:scale-95 cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <div className={cn('space-y-5 transition-all duration-500', !selectedObject && 'opacity-20 pointer-events-none grayscale blur-[1px]')}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">Transform Art</p>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {/* Zoom */}
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Scale</span>
                <span>{zoom}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Minus
                  className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition-all active:scale-90"
                  onClick={() => handleZoomChange(Math.max(10, zoom - 10))}
                />
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={zoom}
                  onChange={(e) => handleZoomChange(Number(e.target.value))}
                  disabled={!selectedObject}
                  className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary disabled:opacity-30 hover:bg-white/20 transition-all"
                />
                <Plus
                  className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition-all active:scale-90"
                  onClick={() => handleZoomChange(Math.min(200, zoom + 10))}
                />
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Rotate</span>
                <span>{rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateIcon
                  className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition-all active:scale-90 hover:-rotate-45"
                  onClick={() => handleRotationChange((rotation - 90 + 360) % 360)}
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => handleRotationChange(Number(e.target.value))}
                  disabled={!selectedObject}
                  className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary disabled:opacity-30 hover:bg-white/20 transition-all"
                />
                <RotateIcon
                  className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition-all active:scale-90 scale-x-[-1] hover:rotate-45"
                  onClick={() => handleRotationChange((rotation + 90) % 360)}
                />
              </div>
            </div>
          </div>

          {/* Direction Controls & Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* D-Pad */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 backdrop-blur-sm">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-primary/20 hover:text-primary transition-all rounded-lg" onClick={() => moveObject(canvas, selectedObject, 'up')} disabled={!selectedObject}>
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-primary/20 hover:text-primary transition-all rounded-lg" onClick={() => moveObject(canvas, selectedObject, 'left')} disabled={!selectedObject}>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-primary/20 hover:text-primary transition-all rounded-lg" onClick={() => moveObject(canvas, selectedObject, 'down')} disabled={!selectedObject}>
                  <ArrowDown className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-primary/20 hover:text-primary transition-all rounded-lg" onClick={() => moveObject(canvas, selectedObject, 'right')} disabled={!selectedObject}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="flex-1 h-9 bg-black/40 hover:bg-primary/20 text-white border-white/10 hover:border-primary/50 hover:text-primary transition-all rounded-xl text-[10px] font-black tracking-widest uppercase"
                onClick={() => { if (canvas && selectedObject) centerObject(canvas, selectedObject); }}
                disabled={!selectedObject}
              >
                <Maximize2 className="w-3 h-3 mr-2" />
                Center
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-9 bg-black/40 hover:bg-secondary/20 text-white border-white/10 hover:border-secondary/50 hover:text-secondary transition-all rounded-xl text-[10px] font-black tracking-widest uppercase"
                onClick={handleDelete}
                disabled={!selectedObject}
              >
                <Eraser className="w-3 h-3 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
