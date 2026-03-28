'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Palette, Maximize, Info, Eye, ArrowRight, ArrowLeft } from 'lucide-react';

import { PhoneModel } from '@/types/phone';
import CanvasEditor from '@/components/CanvasEditor';
import EditorControls from '@/components/EditorControls';
import ImageCropper from '@/components/ImageCropper';
import { exportCanvasAsImage, fitImageToCanvas, fitSelectedImageToSafeArea, clearCanvas, exportArtworkOnly, addImageToCanvas } from '@/lib/canvas-utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import SelectionModals from '@/components/modals/SelectionModals';
import { GuestEmailModal } from '@/components/modals/GuestEmailModal';
import { toast } from 'sonner';
import { useGetModels } from '@/packages/Queries';
import { isLoggedIn, getUser, getGuestEmail } from '@/lib/auth-store';
import { TrendingStyles } from '@/app/landing/TrendingStyles';

// ─── Shared Primitives ────────────────────────────────────────────────────────

/** Consistent dark panel card used for all sidebar sections. */
function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Step label + icon header row used inside each section card. */
function SectionHeader({
  step,
  icon,
  title,
  iconColorClass = 'text-primary',
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  iconColorClass?: string;
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className={cn('flex items-center gap-2', iconColorClass)}>
        {icon}
        <h3 className="font-neon font-bold text-[11px] tracking-[0.2em] uppercase text-white">
          {title}
        </h3>
      </div>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
        Step {step}
      </span>
    </div>
  );
}

// ─── Sidebar Sections ─────────────────────────────────────────────────────────

function DeviceModelSelector({
  models,
  activeModelId,
  onSelect,
}: {
  models: any[];
  activeModelId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <SectionCard>
      <SectionHeader
        step={1}
        icon={
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
        }
        title="Device Model"
      />

      <div className="relative group/select">
        <select
          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold appearance-none cursor-pointer focus:border-primary/50 transition-all outline-none"
          value={activeModelId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {models.map((m: any) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover/select:text-primary transition-colors">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </SectionCard>
  );
}

function ArmorTypeSelector({
  models,
  activeModelId,
  caseType,
  onSelect,
}: {
  models: any[];
  activeModelId: string | null;
  caseType: string;
  onSelect: (type: string) => void;
}) {
  const types: string[] =
    models.find((m: any) => m.id === activeModelId)?.case_types ?? ['Non-Magnetic', 'Magnetic'];

  return (
    <SectionCard>
      <SectionHeader
        step={2}
        iconColorClass="text-secondary"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        }
        title="Armor Type"
      />

      <div className="grid grid-cols-2 gap-2.5 text-left">
        {types.map((type) => {
          const isActive = caseType === type;
          const isMagnetic = type === 'Magnetic';

          return (
            <div
              key={type}
              onClick={() => onSelect(type)}
              className={cn(
                'cursor-pointer rounded-xl border p-3 transition-all duration-300 relative overflow-hidden active:scale-[0.98]',
                isActive
                  ? isMagnetic
                    ? 'border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(255,49,49,0.1)]'
                    : 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(92,225,230,0.1)]'
                  : 'border-border-subtle bg-black/40 hover:border-white/20',
              )}
            >
              <div className="space-y-0.5">
                <p
                  className={cn(
                    'text-[10px] font-black font-neon uppercase',
                    isActive ? (isMagnetic ? 'text-secondary' : 'text-primary') : 'text-white',
                  )}
                >
                  {type}
                </p>
                <p className="text-[8px] text-muted-foreground leading-tight font-medium uppercase font-sans tracking-tight">
                  {isMagnetic ? 'MagSafe Compatible' : 'Slim & Lightweight'}
                </p>
              </div>

              {isActive && (
                <div
                  className={cn(
                    'absolute top-2 right-2 w-1 h-1 rounded-full',
                    isMagnetic
                      ? 'bg-secondary shadow-[0_0_5px_rgba(255,49,49,0.8)]'
                      : 'bg-primary shadow-[0_0_5px_rgba(92,225,230,0.8)]',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function CustomizeSection({
  canvas,
  selectedObject,
  textColor,
  onColorChange,
  onImageUpload,
  onObjectAdded,
}: {
  canvas: any;
  selectedObject: any;
  textColor: string;
  onColorChange: (color: string) => void;
  onImageUpload?: (file: File) => void;
  onObjectAdded?: () => void;
}) {
  const swatches = ['#20211A', '#FF3131', '#5CE1E6', '#8B5CF6', '#FACC15', '#FFFFFF'];

  return (
    <SectionCard>
      <SectionHeader
        step={3}
        icon={<Palette color="white" />}
        title="Customize"
      />

      <div className="space-y-4">
        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
          Text Colour
        </p>
        <div className="flex gap-2 mb-6">
          {swatches.map((color) => (
            <div
              key={color}
              onClick={() => onColorChange(color)}
              className={cn(
                'w-7 h-7 rounded-full border-2 cursor-pointer transition-all hover:scale-110',
                textColor === color
                  ? 'border-white ring-2 ring-primary/20'
                  : 'border-transparent px-0.5',
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <EditorControls
          canvas={canvas}
          selectedObject={selectedObject}
          textColor={textColor}
          onImageUpload={onImageUpload}
          onObjectAdded={onObjectAdded}
        />
      </div>
    </SectionCard>
  );
}

/** Price display + Add-to-Cart CTA. Pass `className` for responsive show/hide. */
function PriceActionBlock({
  price,
  originalPrice,
  canvas,
  onAddToCart,
  onNext,
  className,
  selectedObject,
  isPreMadeDesign,
  hasCustomization,
  isGroupOrder,
  currentIteration,
  groupSize
}: {
  price: number;
  originalPrice?: number;
  canvas: any;
  onAddToCart: () => void;
  onNext: () => void;
  className?: string;
  selectedObject: any;
  isPreMadeDesign?: boolean;
  hasCustomization: boolean;
  isGroupOrder: boolean;
  currentIteration: number;
  groupSize: number;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = () => {
    if (!canvas) return;
    const url = exportCanvasAsImage(canvas, 'png', 1, 2);
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  return (
    <div
      className={cn(
        'bg-surface-alt/60 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-md shadow-2xl',
        className,
      )}
    >
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">
            {isGroupOrder ? `Phone ${currentIteration} Price` : 'Total Price'}
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-neon font-black text-white">
              ${price.toFixed(2)}
            </h2>
            {originalPrice && originalPrice > price && (
              <span className="text-xl font-neon text-white/40 line-through decoration-secondary/60 decoration-2">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border border-green-500/20">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
          IN STOCK
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          variant="outline"
          className="w-full h-12 text-xs font-neon font-black border-transparent bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 uppercase tracking-[0.2em]"
          onClick={handlePreview}
          disabled={!canvas || (!isPreMadeDesign && !hasCustomization)}
        >
          <Eye className="w-4 h-4 mr-2" />
          PREVIEW
        </Button>

        {isGroupOrder && currentIteration < groupSize ? (
          <Button
            size="lg"
            className="w-full h-14 text-xs font-neon font-black bg-primary text-black rounded-xl hover:bg-primary/90 transition-all duration-300 uppercase tracking-[0.2em]"
            onClick={onNext}
            disabled={!canvas || (!isPreMadeDesign && !hasCustomization)}
          >
            NEXT PHONE
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full h-14 text-xs font-neon font-black btn-brand-gradient text-white rounded-xl shadow-[0_0_25px_rgba(255,49,49,0.3)] hover:shadow-[0_0_40px_rgba(255,49,49,0.5)] transition-all duration-500 group uppercase tracking-[0.2em]"
            onClick={onAddToCart}
            disabled={!canvas || (!isPreMadeDesign && !hasCustomization)}
          >
            ADD TO CART
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="w-4 h-4 ml-3 group-hover:translate-x-1.5 transition-transform duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>
        )}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md w-[85vw] bg-[#0a0f18] p-4 overflow-hidden border border-white/10 rounded-3xl flex justify-center items-center">
          {previewUrl && (
            <img src={previewUrl} alt="Design Preview" className="w-auto h-auto max-h-[75vh]" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Canvas area with corner glow decorations, toolbar, and info bar. */
function CanvasPreviewArea({
  phoneModel,
  caseType,
  canvas,
  selectedObject,
  onCanvasReady,
  onObjectSelected,
  onModelLoaded,
  isPreMadeDesign,
  onImageDrop,
}: {
  phoneModel: PhoneModel;
  caseType: string;
  canvas: any;
  selectedObject: any;
  onCanvasReady: (instance: any) => void;
  onObjectSelected: (obj: any) => void;
  onModelLoaded?: (canvas: any) => void;
  isPreMadeDesign?: boolean;
  onImageDrop?: (file: File) => void;
}) {
  const isMagnetic = caseType === 'Magnetic';
  const fitFileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    if (file && file.type.startsWith('image/') && onImageDrop) {
      onImageDrop(file);
    }
  };

  const handleFitImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;
    const safeArea = (canvas as any).safeArea;
    if (!safeArea) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        fitImageToCanvas(canvas, reader.result as string, safeArea);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /** Click handler for the Fit to Model button.
   *  - If a user image is already selected → resize it to fill the safe area.
   *  - Otherwise → open file picker so user can upload a new image. */
  const handleFitToModel = () => {
    if (!canvas) return;
    const safeArea = (canvas as any).safeArea;
    if (!safeArea) return;

    // Use the currently selected object if it's an image
    if (selectedObject && selectedObject.type === 'image' && selectedObject.id !== 'phone-overlay') {
      fitSelectedImageToSafeArea(canvas, selectedObject, safeArea);
    } else {
      // No image selected — let user pick one
      fitFileInputRef.current?.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex-1 bg-black/40 border border-border-subtle rounded-[2.5rem] relative flex flex-col items-center justify-center p-4 md:p-6 backdrop-blur-sm min-h-[600px] shadow-inner transition-all duration-300',
        isDragging && 'border-primary bg-primary/5 scale-[1.01] shadow-[0_0_30px_rgba(92,225,230,0.2)]',
      )}
    >
      {/* Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-[2px] rounded-[2.5rem] pointer-events-none">
          <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50 border-dashed">
              <Maximize className="w-8 h-8 text-primary animate-bounce" />
            </div>
            <p className="text-primary font-black uppercase tracking-widest text-sm">Drop your Art here</p>
          </div>
        </div>
      )}
      {/* Corner glow accents */}
      <div className="hidden md:block absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl shadow-[-10px_-10px_30px_-10px_rgba(92,225,230,0.4)]" />
      <div className="hidden md:block absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-secondary/40 rounded-tr-2xl shadow-[10px_-10px_30px_-10px_rgba(255,49,49,0.4)]" />
      <div className="hidden md:block absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-secondary/40 rounded-bl-2xl shadow-[-10px_10px_30px_-10px_rgba(255,49,49,0.4)]" />
      <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-2xl shadow-[10px_10px_30px_-10px_rgba(92,225,230,0.4)]" />

      {/* Hidden file input for fit-to-model */}
      <input
        ref={fitFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFitImageSelect}
      />

      {/* Top toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xl border border-border-subtle rounded-2xl px-5 py-2 z-30 shadow-2xl">

        {/* Device Settings with tooltip */}
        <div className="relative group/devset">
          <button className="p-2.5 text-primary hover:bg-primary/20 rounded-xl transition-all duration-300 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            </svg>
            <Info className="w-3 h-3 opacity-50 group-hover/devset:opacity-100 transition-opacity" />
          </button>

          {/* Tooltip */}
          <div
            className="absolute top-full left-0 mt-2 w-56 bg-black/90 border border-white/10 rounded-xl p-3.5 shadow-2xl backdrop-blur-xl
                       opacity-0 invisible group-hover/devset:opacity-100 group-hover/devset:visible
                       transition-all duration-200 pointer-events-none z-50 text-left"
          >
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Device Info</p>
            <div className="space-y-1.5 text-[10px] text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-semibold text-white/60">Dimensions</span>
                <span>160.7 × 77.6 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-white/60">Canvas</span>
                <span>320 × 720 px</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Tips</p>
              <p className="text-[9px] text-white/50 leading-relaxed">📌 Pinch with two fingers to zoom in/out on mobile.</p>
              <p className="text-[9px] text-white/50 leading-relaxed">🖼 Use <span className="text-primary">Fit to Model</span> to fill the case full-bleed.</p>
            </div>
          </div>
        </div>

        {/* <div className="w-px h-6 bg-white/10 mx-1 hidden lg:block" /> */}
        {/* <p className="text-primary text-xs font-bold tracking-widest uppercase hidden lg:block">Device Settings</p> */}

        {/* Fit to Model button */}
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={handleFitToModel}
          disabled={!selectedObject || selectedObject.type !== 'image' || selectedObject.id === 'phone-overlay'}
          className="p-2.5 text-white/60 hover:text-primary hover:bg-primary/20 rounded-xl transition-all duration-300 group/fit flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
          title={selectedObject?.type === 'image' && selectedObject?.id !== 'phone-overlay' ? 'Fit image to fill the model' : 'Select an image first'}
        >
          <Maximize className="w-4 h-4" />
          <span className="text-[10px] font-black tracking-widest uppercase hidden sm:inline">Fit to Model</span>
        </button>
      </div>

      {/* Canvas */}
      <div
        className="scale-[0.80] sm:scale-[0.85] md:scale-90 transition-transform relative bg-transparent my-8 lg:my-10 z-20"
      >
        <CanvasEditor
          phoneModel={phoneModel}
          onCanvasReady={onCanvasReady}
          onObjectSelected={onObjectSelected}
          onModelLoaded={onModelLoaded}
        />
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-8 bg-black/60 backdrop-blur-xl border border-border-subtle px-4 md:px-8 py-2.5 md:py-4 rounded-2xl z-30 shadow-2xl">
        <div className="text-left">
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1 opacity-60">
            Dimensions
          </p>
          <p className="text-[10px] md:text-[12px] font-black text-primary tracking-wider hover:text-white transition-colors cursor-default whitespace-nowrap">
            160.7 × 77.6 MM
          </p>
        </div>

        <div className="w-px h-8 bg-white/10" />

        <div className="text-left">
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1 opacity-60">
            Material
          </p>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                isMagnetic
                  ? 'bg-secondary shadow-[0_0_5px_rgba(255,49,49,0.5)]'
                  : 'bg-primary shadow-[0_0_5px_rgba(92,225,230,0.5)]',
              )}
            />
            <p
              className={cn(
                'text-[10px] md:text-[12px] font-black tracking-wider hover:text-white transition-colors cursor-default uppercase whitespace-nowrap',
                isMagnetic ? 'text-secondary' : 'text-primary',
              )}
            >
              {caseType}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Loading / Empty States ───────────────────────────────────────────────────

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-muted-foreground font-comic text-sm">{label}</p>
    </div>
  );
}

// ─── Main Page Content ────────────────────────────────────────────────────────

function CustomizeContent() {
  const searchParams = useSearchParams();
  const brand = searchParams.get('brand');
  const router = useRouter();

  // ── Group ordering params ─────────────────────────────────────────────────
  const groupSize = parseInt(searchParams.get('g') ?? '1', 10);
  const currentIteration = parseInt(searchParams.get('c') ?? '1', 10);
  const isGroupOrder = groupSize > 1;

  const [localModelId, setLocalModelId] = useState<string | null>(null);
  const [phoneModel, setPhoneModel] = useState<PhoneModel | null>(null);
  const [canvas, setCanvas] = useState<any | null>(null);
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [caseType, setCaseType] = useState<string>('Non-Magnetic');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [isMounted, setIsMounted] = useState(false);
  const [groupItemsLoaded, setGroupItemsLoaded] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  // Holds a pending cart item while waiting for guest email
  const [pendingCartItem, setPendingCartItem] = useState<any | null>(null);
  const [hasCustomization, setHasCustomization] = useState(false);
  const [groupItems, setGroupItems] = useState<any[]>([]);

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setSelectedImageSrc(reader.result as string);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: string) => {
    if (!canvas) return;
    const safeArea = (canvas as any).safeArea;
    if (!safeArea) return;

    addImageToCanvas(canvas, croppedImage, safeArea);
    setCropperOpen(false);
    setSelectedImageSrc(null);
  };

  const loadingDesignRef = useRef<string | null>(null);

  const { data: modelsResponse, isLoading: isLoadingModels } = useGetModels(brand || '');
  const models = (modelsResponse as any)?.data ?? [];

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setIsMounted(true);
    // Load group cache on mount
    const storedGroup = sessionStorage.getItem('printpop_group_order');
    if (storedGroup) {
      try {
        setGroupItems(JSON.parse(storedGroup));
      } catch (e) {
        console.error('Failed to parse group order cache');
      }
    }
    setGroupItemsLoaded(true);
  }, []);

  useEffect(() => {
    if (brand) {
      setPhoneModel(null);
      setLocalModelId(null);
    }
  }, [brand]);

  // ── Reset all state when group iteration increments ───────────────────────
  useEffect(() => {
    if (!isMounted || !groupItemsLoaded) return;
    // Clear canvas user content and reset UI state for each new iteration
    if (canvas) {
      clearCanvas(canvas, true);
    }
    
    const savedItem = groupItems[currentIteration - 1];
    if (savedItem) {
      setLocalModelId(savedItem.phoneModelId);
      setCaseType(savedItem.caseType);
      setTextColor(savedItem.textColor);
      if (savedItem.customImage) {
        loadingDesignRef.current = savedItem.customImage;
      }
    } else {
      // NOTE: setting localModelId to null triggers the next effect to auto-select the first model.
      // Since this effect no longer depends on canvas or localModelId, it won't loop.
      setSelectedObject(null);
      setTextColor('#000000');
      setLocalModelId(null);
      setPhoneModel(null);
      setCaseType('Non-Magnetic');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIteration, isMounted, groupItemsLoaded]); // Run when iteration or mount state changes.

  useEffect(() => {
    if (models.length === 0) return;

    const selected = localModelId
      ? models.find((m: any) => m.id === localModelId)
      : models[0];

    if (!selected) return;

    if (!localModelId) {
      setLocalModelId(selected.id);
      return; // Wait for next tick with selected ID
    }

    const newSafeArea = {
      left: 0,
      top: 0,
      width: 320,
      height: 720,
      rx: selected.model_radius,
      ry: selected.model_radius,
    };

    // Use functional update or equality check to prevent redundant re-renders
    setPhoneModel((prev) => {
      const next = {
        id: selected.id,
        name: selected.name,
        displayName: selected.name,
        image: selected.model_pic,
        canvasWidth: 320,
        canvasHeight: 720,
        safeArea: newSafeArea,
        price: 35.0,
      };
      // Simple shallow equality check for the relevant parts
      if (prev?.id === next.id && prev?.image === next.image) return prev;
      return next;
    });

    setCaseType((prev) => {
      const nextType = selected.case_types?.[0] ?? 'Non-Magnetic';
      if (prev === nextType) return prev;
      return nextType;
    });
  }, [localModelId, models]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const basePrice = groupSize > 1 ? 30 : 35;
  const originalBasePrice = 35;
  const currentPrice = caseType === 'Magnetic' ? basePrice + 5 : basePrice;
  const originalPrice = caseType === 'Magnetic' ? originalBasePrice + 5 : originalBasePrice;

  const updateCustomizationState = (c: any) => {
    const objects = c.getObjects();
    const userObjects = objects.filter(
      (obj: any) =>
        obj.id !== 'phone-overlay' &&
        obj.id !== 'background-layer' &&
        obj.id !== 'safe-area' &&
        obj.id !== 'safe-area-outline'
    );
    setHasCustomization(userObjects.length > 0);
  };

  const buildCartItem = async (email?: string) => {
    return {
      id: crypto.randomUUID(),
      phoneModel: phoneModel!.name,
      phoneModelId: phoneModel!.id,
      caseType,
      textColor,
      price: currentPrice,
      // image: full canvas preview/mockup (complete design)
      // Use lower resolution (1x) and JPEG for localStorage to save space (prevents QuotaExceededError)
      image: exportCanvasAsImage(canvas, 'jpeg', 0.7, 1),
      // customImage: the artwork itself (user upload + text, no phone frame)
      // Use lower resolution (1x) and JPEG for localStorage to save space
      customImage: await exportArtworkOnly(canvas, 'jpeg', 0.7, 1),
      quantity: 1,
      brand: brand || searchParams.get('brand'),
      // attach user email (logged-in or guest) for order tracking
      ...(email ? { guestEmail: email } : {}),
      ...(getUser() ? { userEmail: getUser()!.email } : {}),
    };
  };

  const commitToCart = (item: any) => {
    const existingCartRaw = localStorage.getItem('printpop_cart');
    const existingCart = existingCartRaw ? JSON.parse(existingCartRaw) : [];
    existingCart.push(item);

    const saveCart = (cart: any[]) => {
      try {
        localStorage.setItem('printpop_cart', JSON.stringify(cart));
      } catch (e) {
        // Storage quota hit — clear stale cart and retry with just this item
        console.warn('Cart storage full, clearing old items and retrying.', e);
        toast.error('Cart Storage Full', {
          description: 'Clearing old items to make room for your new design.',
        });
        try {
          localStorage.removeItem('printpop_cart');
          localStorage.setItem('printpop_cart', JSON.stringify([item]));
        } catch (e2) {
          console.error('Could not save cart item even after clearing storage.', e2);
          toast.error('Storage Exhausted', {
            description: 'Your design is too large to save. Try using a smaller image.',
          });
          return;
        }
      }
    };

    saveCart(existingCart);
    sessionStorage.removeItem('printpop_group_order');
    window.dispatchEvent(new Event('cart_updated'));

    router.push('/cart');
  };

  const handleNextIteration = async () => {
    if (!canvas || !phoneModel) return;
    const item = await buildCartItem();
    
    const newItems = [...groupItems];
    newItems[currentIteration - 1] = item;
    setGroupItems(newItems);
    sessionStorage.setItem('printpop_group_order', JSON.stringify(newItems));

    const nextIteration = currentIteration + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set('c', nextIteration.toString());
    
    // Check if we already have a saved brand for the next iteration
    const nextItem = newItems[nextIteration - 1];
    if (nextItem && nextItem.brand) {
      params.set('brand', nextItem.brand);
    } else {
      params.delete('brand'); // Prompt brand selection for new phone
    }
    
    router.push(`/customize?${params.toString()}`);
  };

  const handlePreviousIteration = () => {
    const prevIteration = currentIteration - 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set('c', prevIteration.toString());
    
    // Restore brand for the prev iteration if available
    const prevItem = groupItems[prevIteration - 1];
    if (prevItem && prevItem.brand) {
      params.set('brand', prevItem.brand);
    } else {
      params.delete('brand');
    }
    
    router.push(`/customize?${params.toString()}`);
  };

  const handleAddToCart = async () => {
    if (!canvas || !phoneModel) return;

    let finalCartItem: any;
    const currentItem = await buildCartItem();

    if (isGroupOrder) {
      // It's the last iteration!
      const allItems = [...groupItems];
      allItems[currentIteration - 1] = currentItem;
      const groupName = groupSize === 2 ? 'TWO-PAIR' : groupSize === 3 ? 'THREE OF A KIND' : 'FAMILY DEAL';
      const totalPrice = allItems.reduce((sum, item) => sum + (item?.price || 0), 0);
      finalCartItem = {
        id: crypto.randomUUID(),
        isGroup: true,
        groupName,
        price: totalPrice,
        image: allItems[0]?.image || currentItem.image,
        items: allItems,
        quantity: 1
      };
    } else {
      finalCartItem = currentItem;
    }

    if (isLoggedIn()) {
      // ── Logged-in path: go straight to cart ──────────────────────────────
      finalCartItem.userEmail = getUser()!.email;
      if (finalCartItem.isGroup) {
         finalCartItem.items.forEach((i: any) => i.userEmail = getUser()!.email);
      }
      commitToCart(finalCartItem);
      return;
    }

    // ── Guest path ────────────────────────────────────────────────────────
    const existingGuestEmail = getGuestEmail();

    if (existingGuestEmail) {
      finalCartItem.guestEmail = existingGuestEmail;
      if (finalCartItem.isGroup) {
         finalCartItem.items.forEach((i: any) => i.guestEmail = existingGuestEmail);
      }
      commitToCart(finalCartItem);
    } else {
      // First item: capture email via modal
      setPendingCartItem(finalCartItem);
      setShowGuestModal(true);
    }
  };

  const handleGuestEmailConfirm = (email: string) => {
    setShowGuestModal(false);
    if (!pendingCartItem) return;
    const itemWithEmail = { ...pendingCartItem, guestEmail: email };
    if (itemWithEmail.isGroup) {
        itemWithEmail.items.forEach((i: any) => i.guestEmail = email);
    }
    commitToCart(itemWithEmail);
    setPendingCartItem(null);
  };

  /**
   * Called by CanvasEditor after the phone overlay has fully loaded.
   * At this point canvas.safeArea reflects the real scaled dimensions of the
   * new phone model — safe to auto-fit any existing user image.
   */
  const handleModelLoaded = (loadedCanvas: any) => {
    const safeArea = (loadedCanvas as any).safeArea;
    if (!safeArea) return;

    // ── Auto-load pre-made design ──────────────────────────────────────────
    const designUrl = searchParams.get('design_url');
    const urlToLoad = loadingDesignRef.current || designUrl;

    if (urlToLoad) {
      // Prevent concurrent loads of the same design URL
      if (loadingDesignRef.current === urlToLoad && !designUrl) {
         // It's loading from ref, we just let it proceed
      } else if (loadingDesignRef.current === designUrl) {
         return; 
      }
      
      if (!loadingDesignRef.current) {
        loadingDesignRef.current = designUrl;
      }

      // Clear any existing user content before adding the pre-made design or cached design
      clearCanvas(loadedCanvas, true);

      fitImageToCanvas(loadedCanvas, urlToLoad, safeArea).finally(() => {
        // Reset ref after load completes
        setTimeout(() => {
          loadingDesignRef.current = null;
        }, 500);
      });
      return;
    }

    const uploadedImg = loadedCanvas.getObjects().find(
      (obj: any) => obj.type === 'image' && obj.id !== 'phone-overlay'
    );
    if (uploadedImg) {
      fitSelectedImageToSafeArea(loadedCanvas, uploadedImg, safeArea);
    }

    // Attach listeners to track customization
    loadedCanvas.on('object:added', () => updateCustomizationState(loadedCanvas));
    loadedCanvas.on('object:removed', () => updateCustomizationState(loadedCanvas));
    // Initial check
    updateCustomizationState(loadedCanvas);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const isPreMadeDesign = !!searchParams.get('design_url');

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-16 px-4">
        <Spinner label="Connecting to Design Lab…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-16 md:pt-24 xl:pt-32 px-4 md:px-8 relative overflow-x-hidden">

      {/* Ambient background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-32 left-32 w-[180px] h-[180px] bg-secondary opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-4000" />
        <div className="absolute top-[calc(80%-128px)] right-32 w-[180px] h-[180px] bg-primary opacity-15 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-4000" />
      </div>

      {phoneModel ? (
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left sidebar ──────────────────────────────────────────────── */}
          <div className="w-full lg:w-[380px] flex flex-col gap-5 shrink-0 z-20">

            {/* Page heading */}
            <div className="space-y-1">
              <h1 className="text-4xl font-neon font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                DESIGN LAB
              </h1>
              <p className="text-muted-foreground font-comic text-xs tracking-wide uppercase opacity-70">
                Configure your ultimate armor.
              </p>
            </div>

            {/* Group progress indicator */}
            {isGroupOrder && (
              <div className="bg-surface border border-border-subtle rounded-2xl p-4 relative overflow-hidden shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Group Order</p>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                    Item {currentIteration} of {groupSize}
                  </span>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {Array.from({ length: groupSize }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 flex-1 rounded-full transition-all duration-500',
                        i < currentIteration
                          ? 'bg-primary shadow-[0_0_6px_rgba(92,225,230,0.6)]'
                          : 'bg-white/10',
                      )}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs uppercase tracking-widest text-[#9CA3AF] hover:text-white"
                    disabled={currentIteration === 1}
                    onClick={handlePreviousIteration}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs uppercase tracking-widest bg-primary text-black hover:bg-primary/90"
                    disabled={!canvas || (!isPreMadeDesign && !hasCustomization) || currentIteration === groupSize}
                    onClick={handleNextIteration}
                  >
                    Next
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>

                <p className="text-[9px] text-muted-foreground mt-4 leading-relaxed text-center">
                  {currentIteration < groupSize
                    ? `${groupSize - currentIteration} more phone${groupSize - currentIteration > 1 ? 's' : ''} to customize after this.`
                    : 'Last phone — add to cart to complete your group!'}
                </p>
              </div>
            )}

            {/* Step 1 — Device Model */}
            <DeviceModelSelector
              models={models}
              activeModelId={phoneModel.id}
              onSelect={setLocalModelId}
            />

            {/* Step 2 — Armor Type */}
            <ArmorTypeSelector
              models={models}
              activeModelId={localModelId}
              caseType={caseType}
              onSelect={setCaseType}
            />

            {/* Step 3 — Customize */}
            <CustomizeSection
              canvas={canvas}
              selectedObject={selectedObject}
              textColor={textColor}
              onColorChange={(color: string) => {
                setTextColor(color);
                if (canvas && selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'textbox')) {
                  selectedObject.set('fill', color);
                  canvas.renderAll();
                  updateCustomizationState(canvas);
                }
              }}
              onImageUpload={handleImageUpload}
              onObjectAdded={() => updateCustomizationState(canvas)}
            />

            {/* Price block — desktop only */}
            <PriceActionBlock
              price={currentPrice}
              originalPrice={originalPrice}
              canvas={canvas}
              onAddToCart={handleAddToCart}
              onNext={handleNextIteration}
              className="hidden lg:block"
              selectedObject={selectedObject}
              isPreMadeDesign={isPreMadeDesign}
              hasCustomization={hasCustomization}
              isGroupOrder={isGroupOrder}
              currentIteration={currentIteration}
              groupSize={groupSize}
            />
          </div>

          {/* ── Right canvas area ─────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6 w-full lg:min-h-[850px] relative">
            <CanvasPreviewArea
              phoneModel={phoneModel}
              caseType={caseType}
              canvas={canvas}
              selectedObject={selectedObject}
              onCanvasReady={setCanvas}
              onObjectSelected={(obj: any) => {
                setSelectedObject(obj);
                if (obj && (obj.type === 'i-text' || obj.type === 'textbox')) {
                  setTextColor(obj.fill);
                }
              }}
              onModelLoaded={handleModelLoaded}
              isPreMadeDesign={isPreMadeDesign}
              onImageDrop={handleImageUpload}
            />

            {/* Price block — mobile only */}
            <PriceActionBlock
              price={currentPrice}
              originalPrice={originalPrice}
              canvas={canvas}
              onAddToCart={handleAddToCart}
              onNext={handleNextIteration}
              className="lg:hidden mt-4"
              selectedObject={selectedObject}
              isPreMadeDesign={isPreMadeDesign}
              hasCustomization={hasCustomization}
              isGroupOrder={isGroupOrder}
              currentIteration={currentIteration}
              groupSize={groupSize}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[60vh] z-10">
          <Spinner label="Preparing your Design Lab…" />
        </div>
      )}

      {/* Inserted Trending Styles Section */}
      <TrendingStyles title={<><span className="text-neon-blue">OUR CUSTOMER</span> LIKE THESE</>} />

      <SelectionModals
        brand={brand}
        modelId={localModelId}
        models={models}
        isLoadingModels={isLoadingModels}
      />

      <GuestEmailModal
        open={showGuestModal}
        onConfirm={handleGuestEmailConfirm}
        onClose={() => { setShowGuestModal(false); setPendingCartItem(null); }}
      />

      {/* Lifted Cropper Modal */}
      <ImageCropper
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageSrc={selectedImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}

// ─── Page Entry Point ─────────────────────────────────────────────────────────

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CustomizeContent />
    </Suspense>
  );
}
