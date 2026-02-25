'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Palette } from 'lucide-react';

import { PhoneModel } from '@/types/phone';
import CanvasEditor from '@/components/CanvasEditor';
import EditorControls from '@/components/EditorControls';
import { exportCanvasAsImage } from '@/lib/canvas-utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SelectionModals from '@/components/modals/SelectionModals';
import { useGetModels } from '@/packages/Queries';

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
}: {
  canvas: any;
  selectedObject: any;
  textColor: string;
  onColorChange: (color: string) => void;
}) {
  const swatches = ['#000000', '#FF3131', '#5CE1E6', '#8B5CF6', '#FACC15', '#FFFFFF'];

  return (
    <SectionCard>
      <SectionHeader
        step={3}
        icon={<Palette color="white" />}
        title="Customize"
      />

      <div className="space-y-4">
        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
          Base Color
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
        />
      </div>
    </SectionCard>
  );
}

/** Price display + Add-to-Cart CTA. Pass `className` for responsive show/hide. */
function PriceActionBlock({
  price,
  canvas,
  onAddToCart,
  className,
}: {
  price: number;
  canvas: any;
  onAddToCart: () => void;
  className?: string;
}) {
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
            Total Price
          </p>
          <h2 className="text-4xl font-neon font-black text-white">
            $ {price.toFixed(2)}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border border-green-500/20">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
          IN STOCK
        </div>
      </div>

      <Button
        size="lg"
        className="w-full h-14 text-xs font-neon font-black btn-brand-gradient text-white rounded-xl shadow-[0_0_25px_rgba(255,49,49,0.3)] hover:shadow-[0_0_40px_rgba(255,49,49,0.5)] transition-all duration-500 group uppercase tracking-[0.2em]"
        onClick={onAddToCart}
        disabled={!canvas}
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
    </div>
  );
}

/** Canvas area with corner glow decorations, toolbar, and info bar. */
function CanvasPreviewArea({
  phoneModel,
  caseType,
  canvas,
  onCanvasReady,
  onObjectSelected,
}: {
  phoneModel: PhoneModel;
  caseType: string;
  canvas: any;
  onCanvasReady: (instance: any) => void;
  onObjectSelected: (obj: any) => void;
}) {
  const isMagnetic = caseType === 'Magnetic';

  return (
    <div className="flex-1 bg-black/40 border border-border-subtle rounded-[2.5rem] relative flex flex-col items-center justify-center p-8 backdrop-blur-sm overflow-hidden min-h-[600px] shadow-inner">
      {/* Corner glow accents */}
      <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl shadow-[-10px_-10px_30px_-10px_rgba(92,225,230,0.4)]" />
      <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-secondary/40 rounded-tr-2xl shadow-[10px_-10px_30px_-10px_rgba(255,49,49,0.4)]" />
      <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-secondary/40 rounded-bl-2xl shadow-[-10px_10px_30px_-10px_rgba(255,49,49,0.4)]" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-2xl shadow-[10px_10px_30px_-10px_rgba(92,225,230,0.4)]" />

      {/* Top toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xl border border-border-subtle rounded-2xl px-5 py-2 z-30 shadow-2xl">
        <button className="p-2.5 text-primary hover:bg-primary/20 rounded-xl transition-all duration-300">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          </svg>
        </button>
        <div className="w-px h-6 bg-white/10 mx-2" />
        <p className="text-primary text-xs font-bold tracking-widest uppercase">Device Settings</p>
      </div>

      {/* Canvas */}
      <div
        className="scale-[0.80] sm:scale-[0.85] md:scale-90 transition-transform relative bg-transparent overflow-hidden my-16 z-20"
        style={{ borderRadius: phoneModel.safeArea.rx }}
      >
        <CanvasEditor
          phoneModel={phoneModel}
          onCanvasReady={onCanvasReady}
          onObjectSelected={onObjectSelected}
        />
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/60 backdrop-blur-xl border border-border-subtle px-8 py-4 rounded-2xl z-30 shadow-2xl">
        <div className="text-left">
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1 opacity-60">
            Dimensions
          </p>
          <p className="text-[12px] font-black text-primary tracking-wider hover:text-white transition-colors cursor-default">
            160.7 × 77.6 MM
          </p>
        </div>

        <div className="w-px h-8 bg-white/10" />

        <div className="text-left">
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1 opacity-60">
            Material
          </p>
          <div className="flex items-center gap-2">
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
                'text-[12px] font-black tracking-wider hover:text-white transition-colors cursor-default uppercase',
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

  const [localModelId, setLocalModelId] = useState<string | null>(null);
  const [phoneModel, setPhoneModel] = useState<PhoneModel | null>(null);
  const [canvas, setCanvas] = useState<any | null>(null);
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [caseType, setCaseType] = useState<string>('Non-Magnetic');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [isMounted, setIsMounted] = useState(false);

  const { data: modelsResponse, isLoading: isLoadingModels } = useGetModels(brand || '');
  const models = (modelsResponse as any)?.data ?? [];

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (brand) {
      setPhoneModel(null);
      setLocalModelId(null);
    }
  }, [brand]);

  useEffect(() => {
    if (models.length === 0) return;

    const selected = localModelId
      ? models.find((m: any) => m.id === localModelId)
      : models[0];

    if (!selected) return;

    if (!localModelId) setLocalModelId(selected.id);

    setPhoneModel({
      id: selected.id,
      name: selected.name,
      displayName: selected.name,
      image: selected.model_pic,
      canvasWidth: 320,
      canvasHeight: 720,
      safeArea: {
        left: 0,
        top: 0,
        width: 320,
        height: 720,
        rx: selected.model_radius,
        ry: selected.model_radius,
      },
      price: 35.0,
    });

    setCaseType(selected.case_types?.[0] ?? 'Non-Magnetic');
  }, [localModelId, models]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    if (!canvas || !phoneModel) return;
    const imageData = exportCanvasAsImage(canvas, 'png', 1);

    const cartItem = {
      id: crypto.randomUUID(),
      phoneModel: phoneModel.name,
      phoneModelId: phoneModel.id,
      caseType,
      textColor,
      price: phoneModel.price || 35.0,
      image: imageData,
      quantity: 1,
    };

    // Save to localStorage
    const existingCartRaw = localStorage.getItem('printpop_cart');
    const existingCart = existingCartRaw ? JSON.parse(existingCartRaw) : [];
    existingCart.push(cartItem);
    localStorage.setItem('printpop_cart', JSON.stringify(existingCart));

    // Optionally fire a custom event to update any cart badges
    window.dispatchEvent(new Event('cart_updated'));

    router.push('/cart');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-16 px-4">
        <Spinner label="Connecting to Design Lab…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-16 md:py-24 xl:py-32 px-4 md:px-8 relative overflow-x-hidden">

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
              onColorChange={setTextColor}
            />

            {/* Price block — desktop only */}
            <PriceActionBlock
              price={phoneModel.price}
              canvas={canvas}
              onAddToCart={handleAddToCart}
              className="hidden lg:block"
            />
          </div>

          {/* ── Right canvas area ─────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6 w-full lg:min-h-[850px] relative">
            <CanvasPreviewArea
              phoneModel={phoneModel}
              caseType={caseType}
              canvas={canvas}
              onCanvasReady={setCanvas}
              onObjectSelected={setSelectedObject}
            />

            {/* Price block — mobile only */}
            <PriceActionBlock
              price={phoneModel.price}
              canvas={canvas}
              onAddToCart={handleAddToCart}
              className="lg:hidden mt-4"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[60vh] z-10">
          <Spinner label="Preparing your Design Lab…" />
        </div>
      )}

      <SelectionModals
        brand={brand}
        modelId={localModelId}
        models={models}
        isLoadingModels={isLoadingModels}
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
