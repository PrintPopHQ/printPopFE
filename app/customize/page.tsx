'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhoneModel } from '@/types/phone';
import CanvasEditor from '@/components/CanvasEditor';
import EditorControls from '@/components/EditorControls';
import { exportCanvasAsImage } from '@/lib/canvas-utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

import SelectionModals from '@/components/modals/SelectionModals';
import { useGetModels } from '@/packages/Queries';

function CustomizeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brand = searchParams.get('brand');

  const [localModelId, setLocalModelId] = useState<string | null>(null);
  const [phoneModel, setPhoneModel] = useState<PhoneModel | null>(null);
  const [canvas, setCanvas] = useState<any | null>(null);
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [caseType, setCaseType] = useState<string>('Non-Magnetic');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: modelsResponse, isLoading: isLoadingModels } = useGetModels(brand || '');
  const models = (modelsResponse as any)?.data || [];
  useEffect(() => {
    // Reset phone model and local selection when brand changes
    if (brand) {
      setPhoneModel(null);
      setLocalModelId(null);
    }
  }, [brand]);

  useEffect(() => {
    if (models.length > 0) {
      const selectedModel = localModelId
        ? models.find((m: any) => m.id === localModelId)
        : models[0];

      if (selectedModel) {
        if (!localModelId) {
          setLocalModelId(selectedModel.id);
        }
        const mappedModel: PhoneModel = {
          id: selectedModel.id,
          name: selectedModel.name,
          displayName: selectedModel.name,
          image: selectedModel.model_pic,
          canvasWidth: 320,
          canvasHeight: 720,
          safeArea: {
            left: 0,
            top: 0,
            width: 320,
            height: 720,
            rx: selectedModel.model_radius,
            ry: selectedModel.model_radius,
          },
          price: 35.0,
        };
        setPhoneModel(mappedModel);
        setCaseType(selectedModel.case_types?.[0] || 'Non-Magnetic');
      }
    }
  }, [localModelId, models]);

  const handleModelSelect = (selectedModelId: string) => {
    setLocalModelId(selectedModelId);
  };

  const handleCanvasReady = (canvasInstance: any) => {
    setCanvas(canvasInstance);
  };

  const handlePreview = () => {
    if (canvas) {
      const imageData = exportCanvasAsImage(canvas, 'png', 1);
      const win = window.open();
      if (win) {
        win.document.write(`
          <html>
            <head><title>Preview - ${phoneModel?.displayName}</title></head>
            <body style="margin:0;display:flex;align-items:center;justify-center;min-height:100vh;background:#f0f0f0;">
              <img src="${imageData}" alt="Preview" style="max-width:100%;max-height:100vh;" />
            </body>
          </html>
        `);
      }
    }
  };

  const handleAddToCart = () => {
    if (canvas) {
      const imageData = exportCanvasAsImage(canvas, 'png', 1);
      console.log('Adding to cart:', {
        phoneModel: phoneModel?.id,
        caseType,
        designImage: imageData,
      });
      alert('Added to cart! (This is a demo)');
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-16 px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
        <p className="text-muted-foreground font-comic">Connecting to Design Lab...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-16 md:py-24 xl:py-32 px-4 md:px-8 relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-32 left-32 w-[180px] h-[180px] bg-secondary opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
        <div className="absolute top-[calc(80%-128px)] right-32 w-[180px] h-[180px] bg-primary opacity-15 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
      </div>

      {phoneModel ? (
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[380px] flex flex-col gap-5 shrink-0 z-20">
            <div className="space-y-1">
              <h1 className="text-4xl font-neon font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">DESIGN LAB</h1>
              <p className="text-muted-foreground font-comic text-xs tracking-wide uppercase opacity-70">Configure your ultimate armor.</p>
            </div>

            <div className="bg-[#161616] border border-[#1F2937] rounded-2xl p-5 relative overflow-hidden group shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                  </div>
                  <h3 className="font-neon font-bold text-[11px] tracking-[0.2em] uppercase text-white">Device Model</h3>
                </div>
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Step 1</span>
              </div>

              <div className="relative group/select">
                <select
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold appearance-none cursor-pointer focus:border-primary/50 transition-all outline-none"
                  value={phoneModel.id}
                  onChange={(e) => handleModelSelect(e.target.value)}
                >
                  {models.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover/select:text-primary transition-colors">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#1F2937] rounded-2xl p-5 relative overflow-hidden group shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <h3 className="font-neon font-bold text-[11px] tracking-[0.2em] uppercase text-white">Armor Type</h3>
                </div>
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Step 2</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-left">
                {(models.find((m: any) => m.id === localModelId)?.case_types || ['Non-Magnetic', 'Magnetic']).map((type: string) => (
                  <div
                    key={type}
                    onClick={() => setCaseType(type)}
                    className={cn(
                      "cursor-pointer rounded-xl border p-3 transition-all duration-300 relative overflow-hidden group active:scale-[0.98]",
                      caseType === type
                        ? (type === 'Magnetic'
                          ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(255,49,49,0.1)]"
                          : "border-primary bg-primary/10 shadow-[0_0_15px_rgba(92,225,230,0.1)]")
                        : "border-[#1F2937] bg-black/40 hover:border-white/20"
                    )}
                  >
                    <div className="space-y-0.5">
                      <p className={cn("text-[10px] font-black font-neon uppercase",
                        caseType === type
                          ? (type === 'Magnetic' ? "text-secondary" : "text-primary")
                          : "text-white"
                      )}>
                        {type}
                      </p>
                      <p className="text-[8px] text-muted-foreground leading-tight font-medium uppercase font-sans tracking-tight">
                        {type === 'Magnetic' ? 'MagSafe Compatible' : 'Slim & Lightweight'}
                      </p>
                    </div>
                    {caseType === type && (
                      <div className={cn(
                        "absolute top-2 right-2 w-1 h-1 rounded-full",
                        type === 'Magnetic'
                          ? "bg-secondary shadow-[0_0_5px_rgba(255,49,49,0.8)]"
                          : "bg-primary shadow-[0_0_5px_rgba(92,225,230,0.8)]"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#161616] border border-[#1F2937] rounded-2xl p-5 relative overflow-hidden group shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <Palette color="white" />
                  <h3 className="font-neon font-bold text-[11px] tracking-[0.2em] uppercase text-white">Customize</h3>
                </div>
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Step 3</span>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-2">Base Color</p>
                <div className="flex gap-2 mb-6">
                  {['#000000', '#FF3131', '#5CE1E6', '#8B5CF6', '#FACC15', '#FFFFFF'].map((color, i) => (
                    <div
                      key={i}
                      onClick={() => setTextColor(color)}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 cursor-pointer transition-all hover:scale-110",
                        textColor === color ? "border-white ring-2 ring-primary/20" : "border-transparent px-0.5"
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
            </div>

            <div className="hidden lg:block bg-[#112238]/60 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-md shadow-2xl">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Total Price</p>
                  <h2 className="text-4xl font-neon font-black text-white">$ {phoneModel.price.toFixed(2)}</h2>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border border-green-500/20">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                  IN STOCK
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-xs font-neon font-black btn-brand-gradient text-white rounded-xl shadow-[0_0_25px_rgba(255,49,49,0.3)] hover:shadow-[0_0_40px_rgba(255,49,49,0.5)] transition-all duration-500 group uppercase tracking-[0.2em]"
                onClick={handleAddToCart}
                disabled={!canvas}
              >
                ADD TO CART
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-4 h-4 ml-3 group-hover:translate-x-1.5 transition-transform duration-300"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 w-full lg:min-h-[850px] relative">
            <div className="flex-1 bg-black/40 border border-[#1F2937] rounded-[2.5rem] relative flex flex-col items-center justify-center p-8 backdrop-blur-sm overflow-hidden min-h-[600px] shadow-inner">
              <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl shadow-[-10px_-10px_30px_-10px_rgba(92,225,230,0.4)]" />
              <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-secondary/40 rounded-tr-2xl shadow-[10px_-10px_30px_-10px_rgba(255,49,49,0.4)]" />
              <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-secondary/40 rounded-bl-2xl shadow-[-10px_10px_30px_-10px_rgba(255,49,49,0.4)]" />
              <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-2xl shadow-[10px_10px_30px_-10px_rgba(92,225,230,0.4)]" />

              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xl border border-[#1F2937] rounded-2xl px-5 py-2 z-30 shadow-2xl">
                <button className="p-2.5 text-primary hover:bg-primary/20 rounded-xl transition-all duration-300"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /></svg></button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <p className="text-primary">DEVICE SETTINGS</p>
              </div>

              <div
                className="scale-[0.80] sm:scale-[0.85] md:scale-90 transition-transform relative bg-transparent overflow-hidden my-16 z-20"
                style={{ borderRadius: phoneModel.safeArea.rx }}
              >
                <CanvasEditor
                  phoneModel={phoneModel}
                  onCanvasReady={handleCanvasReady}
                  onObjectSelected={setSelectedObject}
                />
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/60 backdrop-blur-xl border border-[#1F2937] px-8 py-4 rounded-2xl z-30 shadow-2xl">
                <div className="text-left">
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1 opacity-60">Dimensions</p>
                  <p className="text-[12px] font-black text-primary tracking-wider transition-colors hover:text-white cursor-default">160.7 × 77.6 MM</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-left">
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1 opacity-60">Material</p>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(255,49,49,0.5)]",
                      caseType === 'Magnetic' ? "bg-secondary" : "bg-primary"
                    )} />
                    <p className={cn(
                      "text-[12px] font-black tracking-wider transition-colors hover:text-white cursor-default uppercase",
                      caseType === 'Magnetic' ? "text-secondary" : "text-primary"
                    )}>
                      {caseType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:hidden bg-[#112238]/60 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-md shadow-2xl mt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Total Price</p>
                  <h2 className="text-4xl font-neon font-black text-white">$ {phoneModel.price.toFixed(2)}</h2>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border border-green-500/20">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                  IN STOCK
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-xs font-neon font-black btn-brand-gradient text-white rounded-xl shadow-[0_0_25px_rgba(255,49,49,0.3)] hover:shadow-[0_0_40px_rgba(255,49,49,0.5)] transition-all duration-500 group uppercase tracking-[0.2em]"
                onClick={handleAddToCart}
                disabled={!canvas}
              >
                ADD TO CART
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-4 h-4 ml-3 group-hover:translate-x-1.5 transition-transform duration-300"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] z-10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
          <p className="text-muted-foreground font-comic">Preparing your Design Lab...</p>
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


export default function CustomizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    }>
      <CustomizeContent />
    </Suspense>
  );
}
