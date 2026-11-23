import { ChangeEvent, useRef, useState } from 'react';
import { Check, ImagePlus, ShoppingBag } from 'lucide-react';
import {
  STOLE_COLORS,
  STOLE_STUDIO_MODELS,
  THREAD_COLORS,
} from '../data/defaultStore';
import { CartItem } from '../types/store';

interface StoleStudioProps {
  title: string;
  subtitle: string;
  studioBgUrl: string;
  isAdminMode: boolean;
  onUploadStudioBg: (file: File) => void;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
}

export function StoleStudio({
  title,
  subtitle,
  studioBgUrl,
  isAdminMode,
  onUploadStudioBg,
  onAddToCart,
}: StoleStudioProps) {
  const [rightText, setRightText] = useState('دفعة 2026');
  const [leftText, setLeftText] = useState('الاسم واللقب');
  const [selectedModel, setSelectedModel] = useState(STOLE_STUDIO_MODELS[0]);
  const [stoleColor, setStoleColor] = useState(STOLE_COLORS[0]);
  const [threadColor, setThreadColor] = useState(THREAD_COLORS[0]);

  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleSelectStoleColor = (color: (typeof STOLE_COLORS)[number]) => {
    setStoleColor(color);
    const matchingThread = THREAD_COLORS.find((t) => t.hex === color.defaultThreadHex);
    if (matchingThread) {
      setThreadColor(matchingThread);
    } else {
      setThreadColor({ name: color.defaultThreadName, hex: color.defaultThreadHex });
    }
  };

  const handleBgUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadStudioBg(file);
      e.target.value = '';
    }
  };

  const handleAddCustomStole = () => {
    const fabricType = selectedModel.label.includes('دان') ? 'دان' : 'كريب';
    const customRight = rightText.trim() || 'دفعة 2026';
    const customLeft = leftText.trim() || 'بدون نص';
    const embroideredText = `يمين: "${customRight}" · يسار: "${customLeft}"`;

    onAddToCart({
      category: 'custom-stole',
      title: `${selectedModel.label} (تصميم خاص)`,
      unitPrice: selectedModel.price,
      fabricType,
      shawlColor: stoleColor.name,
      threadColor: threadColor.name,
      embroideredText,
      details: `القماش: ${fabricType} · لون الشال: ${stoleColor.name} · لون التطريز: ${threadColor.name} · التطريز: ${embroideredText}`,
    });
  };

  const isLightStole = stoleColor.hex === '#f4efe6';

  return (
    <section id="studio-sec" className="py-12 sm:py-16 border-b border-[#D4AF37]/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-[#D4AF37] mb-1.5">
            التخصيص الفوري
          </p>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F7F3EA]">
            {title}
          </h2>
          <p className="text-sm text-[#B5ADA0] mt-1.5 max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* المعاينة */}
          <div
            className="lg:col-span-6 w-full rounded-2xl bg-[#141414] border border-[#D4AF37]/25 flex flex-col items-center justify-center p-6 sm:p-10 min-h-[380px] relative overflow-hidden shadow-2xl"
            style={
              studioBgUrl
                ? {
                    backgroundImage: `linear-gradient(rgba(10,10,10,0.72), rgba(10,10,10,0.82)), url("${studioBgUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            {isAdminMode && (
              <div className="absolute top-3 right-3 z-20">
                <input
                  ref={bgInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBgUpload}
                />
                <button
                  type="button"
                  onClick={() => bgInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1A16]/90 border border-[#D4AF37]/30 text-xs font-bold text-[#F7F3EA] shadow-sm hover:bg-[#27231C] cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>الخلفية</span>
                </button>
              </div>
            )}

            <div className="relative flex flex-col items-center">
              <div
                className="relative w-48 sm:w-56 h-72 sm:h-80 transition-colors duration-200 flex justify-between px-4 sm:px-5 pt-7 pb-10 shadow-2xl"
                style={{
                  backgroundColor: stoleColor.hex,
                  color: threadColor.hex,
                  clipPath:
                    'polygon(0 0, 35% 0, 50% 38%, 65% 0, 100% 0, 86% 100%, 50% 76%, 14% 100%)',
                  border: isLightStole ? '1px solid #d6cdc2' : '1px solid rgba(212,175,55,0.28)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-1.5 opacity-60"
                  style={{
                    borderInline: `1.5px solid ${threadColor.hex}`,
                  }}
                />

                <div className="w-[38%] flex flex-col items-center justify-start pt-2 z-10">
                  <div
                    className="text-center font-bold leading-snug max-h-44 overflow-hidden select-none font-editorial text-lg sm:text-xl"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {rightText || 'دفعة 2026'}
                  </div>
                </div>

                <div className="w-[38%] flex flex-col items-center justify-start pt-2 z-10">
                  <div
                    className="text-center font-bold leading-snug max-h-44 overflow-hidden select-none font-editorial text-lg sm:text-xl"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {leftText || 'الاسم واللقب'}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs font-bold text-[#F7F3EA]">
                  {stoleColor.name} <span className="text-[#D4AF37] mx-1">·</span> تطريز {threadColor.name}
                </p>
                <p className="text-[11px] text-[#A89F91] mt-1">
                  {selectedModel.label}
                </p>
              </div>
            </div>
          </div>

          {/* أدوات التصميم */}
          <div className="lg:col-span-6 w-full bg-[#141414] border border-[#D4AF37]/25 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#F7F3EA] mb-1.5">
                  عبارة الجهة اليمنى
                </label>
                <input
                  type="text"
                  maxLength={32}
                  value={rightText}
                  onChange={(e) => setRightText(e.target.value)}
                  placeholder="مثال: دفعة 2026"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4AF37]/25 bg-[#0A0A0A] text-sm text-[#F7F3EA] placeholder:text-[#6E655A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F7F3EA] mb-1.5">
                  الاسم أو التخصص (الجهة اليسرى)
                </label>
                <input
                  type="text"
                  maxLength={32}
                  value={leftText}
                  onChange={(e) => setLeftText(e.target.value)}
                  placeholder="مثال: دعاء بن خالد"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4AF37]/25 bg-[#0A0A0A] text-sm text-[#F7F3EA] placeholder:text-[#6E655A]"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#F7F3EA] mb-2">
                الموديل ونوع القماش
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STOLE_STUDIO_MODELS.map((model) => {
                  const active = model.id === selectedModel.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModel(model)}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        active
                          ? 'border-[#D4AF37] bg-[#1E1B14]'
                          : 'border-[#D4AF37]/15 bg-[#0A0A0A] hover:border-[#D4AF37]/40'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#F7F3EA]">
                        {model.label}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#D4AF37] tabular-nums">
                        {model.price.toLocaleString('en-US')} دج
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#F7F3EA] mb-2.5">
                لون قماش الوشاح: <span className="text-[#D4AF37]">{stoleColor.name}</span>
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {STOLE_COLORS.map((c) => {
                  const active = c.hex === stoleColor.hex;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => handleSelectStoleColor(c)}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border transition-transform flex items-center justify-center cursor-pointer ${
                        active
                          ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#141414] scale-110 border-[#D4AF37]'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {active && (
                        <Check
                          className={`w-4 h-4 ${
                            c.hex === '#f4efe6' ? 'text-[#0A0A0A]' : 'text-[#D4AF37]'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#F7F3EA] mb-2.5">
                لون خيط التطريز: <span className="text-[#D4AF37]">{threadColor.name}</span>
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {THREAD_COLORS.map((t) => {
                  const active = t.hex === threadColor.hex;
                  return (
                    <button
                      key={t.hex}
                      type="button"
                      onClick={() => setThreadColor(t)}
                      title={t.name}
                      className={`w-9 h-9 rounded-full border transition-transform flex items-center justify-center cursor-pointer ${
                        active
                          ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#141414] scale-110 border-[#D4AF37]'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: t.hex }}
                    >
                      {active && (
                        <Check
                          className={`w-4 h-4 ${
                            t.hex === '#ffffff' || t.hex === '#e2e8f0'
                              ? 'text-[#0A0A0A]'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs text-[#A89F91]">السعر شامل القبعة والتطريز</span>
                <span className="text-2xl font-extrabold text-[#D4AF37] tabular-nums">
                  {selectedModel.price.toLocaleString('en-US')} دج
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddCustomStole}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] text-sm font-bold shadow-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>أضف للحقيبة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
