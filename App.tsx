
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/Button';
import { transformImage } from './services/geminiService';
import { APP_TITLE, APP_SUBTITLE, getTransformationPrompt } from './constants';
import { ImageState, OutfitType, HairstyleType, BackgroundType, CameraAngleType, ColorPaletteType, ExpressionType } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    transformed: null,
    isLoading: false,
    error: null,
  });
  
  const [outfit, setOutfit] = useState<OutfitType>('suit');
  const [hairstyle, setHairstyle] = useState<HairstyleType>('waves');
  const [background, setBackground] = useState<BackgroundType>('berlin');
  const [cameraAngle, setCameraAngle] = useState<CameraAngleType>('eye_level');
  const [colorPalette, setColorPalette] = useState<ColorPaletteType>('default');
  const [expression, setExpression] = useState<ExpressionType>('natural');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update prompt whenever selections change
  useEffect(() => {
    setCustomPrompt(getTransformationPrompt(outfit, hairstyle, background, cameraAngle, colorPalette, expression));
  }, [outfit, hairstyle, background, cameraAngle, colorPalette, expression]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setState(prev => ({ ...prev, error: "Please upload a valid image file." }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setState({
          original: result,
          transformed: null,
          isLoading: false,
          error: null
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransform = async () => {
    if (!state.original) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await transformImage(state.original, customPrompt);
      setState(prev => ({ ...prev, transformed: result, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "An unexpected error occurred." 
      }));
    }
  };

  const reset = () => {
    setState({
      original: null,
      transformed: null,
      isLoading: false,
      error: null
    });
    setOutfit('suit');
    setHairstyle('waves');
    setBackground('berlin');
    setCameraAngle('eye_level');
    setColorPalette('default');
    setExpression('natural');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const SelectionChip = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 border ${
        selected 
          ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
          : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="w-full text-center mb-10 mt-4">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold tracking-widest uppercase mb-3">
          AI Studio v3.0 Elite
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
          {APP_TITLE}
        </h1>
        <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          {APP_SUBTITLE}
        </p>
      </header>

      {/* Main Workspace */}
      <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Controls & Input */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Step 1: Source Identity
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300
                ${state.original ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}
              `}
            >
              {state.original ? (
                <div className="relative group mx-auto max-w-[200px]">
                  <img 
                    src={state.original} 
                    alt="Reference" 
                    className="aspect-square mx-auto rounded-xl shadow-lg object-cover grayscale-[30%]"
                  />
                  <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">Update Photo</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-slate-500">
                    <p className="font-bold text-xs uppercase tracking-tighter">Upload high-res headshot</p>
                  </div>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          </section>

          {/* Style Configuration Section */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Step 2: Configuration
            </h2>

            <div>
              <label className="block text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-3">Facial Presence</label>
              <div className="flex flex-wrap gap-2">
                <SelectionChip label="Natural" selected={expression === 'natural'} onClick={() => setExpression('natural')} />
                <SelectionChip label="Warm Smile" selected={expression === 'smile'} onClick={() => setExpression('smile')} />
                <SelectionChip label="Serious / Focus" selected={expression === 'serious'} onClick={() => setExpression('serious')} />
                <SelectionChip label="Confident Smirk" selected={expression === 'smirk'} onClick={() => setExpression('smirk')} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-3">Global Attire</label>
              <div className="flex flex-wrap gap-2">
                <SelectionChip label="Business Suit" selected={outfit === 'suit'} onClick={() => setOutfit('suit')} />
                <SelectionChip label="Power Dress" selected={outfit === 'dress'} onClick={() => setOutfit('dress')} />
                <SelectionChip label="Executive Coat" selected={outfit === 'coat'} onClick={() => setOutfit('coat')} />
                <SelectionChip label="Premium Knit" selected={outfit === 'knitwear'} onClick={() => setOutfit('knitwear')} />
                <SelectionChip label="Leather Studio" selected={outfit === 'leather'} onClick={() => setOutfit('leather')} />
                <SelectionChip label="Smart Casual" selected={outfit === 'casual'} onClick={() => setOutfit('casual')} />
                <SelectionChip label="Minimalist Tee" selected={outfit === 'tee'} onClick={() => setOutfit('tee')} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-3">Location & Atmosphere</label>
              <div className="flex flex-wrap gap-2">
                <SelectionChip label="Berlin District" selected={background === 'berlin'} onClick={() => setBackground('berlin')} />
                <SelectionChip label="Tokyo View" selected={background === 'tokyo'} onClick={() => setBackground('tokyo')} />
                <SelectionChip label="NY Financial" selected={background === 'ny'} onClick={() => setBackground('ny')} />
                <SelectionChip label="Parisian Cafe" selected={background === 'paris'} onClick={() => setBackground('paris')} />
                <SelectionChip label="Blank Studio" selected={background === 'studio'} onClick={() => setBackground('studio')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-3">Camera Logic</label>
                <div className="grid grid-cols-1 gap-2">
                  <SelectionChip label="Eye-Level" selected={cameraAngle === 'eye_level'} onClick={() => setCameraAngle('eye_level')} />
                  <SelectionChip label="Dynamic 3/4" selected={cameraAngle === 'three_quarter'} onClick={() => setCameraAngle('three_quarter')} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-3">Color Theory</label>
                <div className="grid grid-cols-1 gap-2">
                  <SelectionChip label="Natural" selected={colorPalette === 'default'} onClick={() => setColorPalette('default')} />
                  <SelectionChip label="Monochrome" selected={colorPalette === 'monochromatic'} onClick={() => setColorPalette('monochromatic')} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
              <Button 
                onClick={handleTransform} 
                className="flex-1 rounded-2xl h-12"
                disabled={!state.original}
                isLoading={state.isLoading}
              >
                Render Professional Persona
              </Button>
              <Button 
                variant="outline" 
                onClick={reset}
                className="rounded-2xl h-12"
                disabled={!state.original && !state.transformed}
              >
                Reset
              </Button>
            </div>
            
            {state.error && (
              <p className="mt-2 text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-xl border border-red-100 flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {state.error}
              </p>
            )}
          </section>
        </div>

        {/* Right Column: Output Display */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 h-full min-h-[700px] flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Studio Output</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{expression} expression • {outfit} texture</p>
              </div>
              {state.transformed && (
                <div className="flex gap-4">
                  <a 
                    href={state.transformed} 
                    download={`persona-${background}-${expression}.png`}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export RAW
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-10 flex flex-col items-center justify-center bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]">
              {state.isLoading ? (
                <div className="text-center space-y-8 animate-pulse w-full max-w-sm">
                  <div className="aspect-[3/4] bg-slate-100 rounded-[40px] flex items-center justify-center mx-auto overflow-hidden shadow-2xl relative border-[12px] border-white">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent animate-sweep"></div>
                    <div className="relative z-10 flex flex-col items-center gap-4">
                       <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-slate-200 animate-spin"></div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Synthesis...</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Refining Identity</p>
                    <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase">Applying {expression} geometry</p>
                  </div>
                </div>
              ) : state.transformed ? (
                <div className="max-w-md w-full animate-fade-in group">
                  <div className="relative aspect-[3/4] bg-slate-100 rounded-[40px] shadow-[0_40px_80px_rgba(15,23,42,0.15)] overflow-hidden border-[16px] border-white transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-[0_50px_100px_rgba(15,23,42,0.2)]">
                    <img 
                      src={state.transformed} 
                      alt="Professional Result" 
                      className="w-full h-full object-cover grayscale-[10%]"
                    />
                    <div className="absolute top-6 right-6 bg-slate-900/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20">
                       <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">Elite v3.0</span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                          <div className="flex flex-col">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Global Master Render</span>
                            <span className="text-white/40 text-[7px] font-mono tracking-tighter">TIMESTAMP: {new Date().toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-8 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                      <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Environment: {background}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Expression: {expression}</span>
                      <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center max-w-sm space-y-6 opacity-30 group cursor-default">
                  <div className="w-24 h-24 mx-auto bg-white rounded-[32px] shadow-inner flex items-center justify-center border border-slate-100 transition-transform group-hover:scale-110">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <p className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Awaiting Identity Synthesis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Metrics */}
      <footer className="w-full mt-24 pb-12 text-center border-t border-slate-100 pt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          <div className="px-8 py-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <span className="block text-3xl font-black text-slate-900 tracking-tighter">100%</span>
             <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Likeness Preservation</span>
          </div>
          <div className="px-8 py-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <span className="block text-3xl font-black text-slate-900 tracking-tighter">4K</span>
             <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Pixel Fidelity</span>
          </div>
          <div className="px-8 py-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <span className="block text-3xl font-black text-slate-900 tracking-tighter">REAL</span>
             <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Skin Pores & Texture</span>
          </div>
          <div className="px-8 py-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <span className="block text-3xl font-black text-slate-900 tracking-tighter">PRO</span>
             <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Studio Lighting</span>
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Elite Digital Identity System • Global Standard</p>
        <p className="text-slate-300 text-[8px] font-medium tracking-[0.2em]">&copy; {new Date().getFullYear()} Persona AI Studio • Engineered with Gemini 2.5 Intelligence</p>
      </footer>

      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-150%) skewX(-45deg); }
          100% { transform: translateX(250%) skewX(-45deg); }
        }
        .animate-sweep {
          animation: sweep 2s infinite ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
