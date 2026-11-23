import { ChangeEvent, useRef, useState } from 'react';
import { Check, ImagePlus, ShoppingBag } from 'lucide-react';
import { STOLE_COLORS, THREAD_COLORS } from '../data/defaultStore';
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

  // 🟢 الدالة الجديدة: ترسل الاسم والألوان فقط، بلا سعر وبلا نوع قماش
  const handleAddCustomStole = () => {
    const customRight = rightText.trim() || 'دفعة 2026';
    const customLeft = leftText.trim() || 'بدون نص';
    const embroideredText = `يمين: "${customRight}" · يسار: "${customLeft}"`;

    onAddToCart({
      category: 'custom-stole',
      title: 'شال تخرج (تصميم خاص)',
      unitPrice: 0, // السعر كيتحدد من لوحة الإدارة من بعد
      details: `لون الشال: ${stoleColor.name} · لون التطريز: ${threadColor.name} · التطريز: ${embroideredText}`,
    });
  };

  const isLightStole = stoleColor.hex === '#f4efe6' || stoleColor.hex === '#ffffff';

  return (
    <section id="studio-sec" className="py-12 sm:py-16 border-b border-[#e6ddd3]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-[#762b43] mb-1.5">
            التخصيص الفوري
          </p>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f1917]">
            {title}
          </h2>
          <p className="text-sm text-[#6e645e] mt-1.5 max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* المعاينة */}
          <div
            className="lg:col-span-6 w-full rounded-2xl bg-[#faf8f5] border border-[#e6ddd3] flex flex-col items-center justify-center p-6 sm:p-10 min-h-[380px] relative overflow-hidden shadow-sm"
            style={
              studioBgUrl
                ? {
                    backgroundImage: `linear-gradient(rgba(250,248,245,0.8), rgba(250,248,245,0.9)), url("${studioBgUrl}")`,
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e6ddd3] text-xs font-bold text-[#1f1917] shadow-sm hover:bg-gray-50 cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-[#762b43]" />
                  <span>الخلفية</span>
                </button>
              </div>
            )}

            <div className="relative flex flex-col items-center">
              <div
                className="relative w-48 sm:w-56 h-72 sm:h-80 transition-colors duration-200 flex justify-between px-4 sm:px-5 pt-7 pb-10 shadow-xl"
                style={{
                  backgroundColor: stoleColor.hex,
                  color: threadColor.hex,
                  clipPath:
                    'polygon(0 0, 35% 0, 50% 38%, 65% 0, 100% 0, 86% 100%, 50% 76%, 14% 100%)',
                  border: isLightStole ? '1px solid #d6cdc2' : 'none',
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
                <p className="text-xs font-bold text-[#1f1917]">
                  {stoleColor.name} <span className="text-[#762b43] mx-1">·</span> تطريز {threadColor.name}
                </p>
              </div>
            </div>
          </div>

          {/* أدوات التصميم */}
          <div className="lg:col-span-6 w-full bg-white border border-[#e6ddd3] rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1f1917] mb-1.5">
                  عبارة الجهة اليمنى
                </label>
                <input
                  type="text"
                  maxLength={32}
                  value={rightText}
                  onChange={(e) => setRightText(e.target.value)}
                  placeholder="مثال: دفعة 2026"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e6ddd3] bg-[#faf8f5] text-sm text-[#1f1917] placeholder:text-[#a89f91] focus:outline-none focus:border-[#762b43]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1f1917] mb-1.5">
                  الاسم أو التخصص (الجهة اليسرى)
                </label>
                <input
                  type="text"
                  maxLength={32}
                  value={leftText}
                  onChange={(e) => setLeftText(e.target.value)}
                  placeholder="مثال: دعاء بن خالد"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e6ddd3] bg-[#faf8f5] text-sm text-[#1f1917] placeholder:text-[#a89f91] focus:outline-none focus:border-[#762b43]"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#1f1917] mb-2.5">
                لون قماش الوشاح: <span className="text-[#762b43]">{stoleColor.name}</span>
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
                          ? 'ring-2 ring-[#762b43] ring-offset-2 scale-110 border-[#762b43]'
                          : 'border-[#e6ddd3] hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {active && (
                        <Check
                          className={`w-4 h-4 ${
                            c.hex === '#f4efe6' || c.hex === '#ffffff' ? 'text-[#762b43]' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#1f1917] mb-2.5">
                لون خيط التطريز: <span className="text-[#762b43]">{threadColor.name}</span>
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
                          ? 'ring-2 ring-[#762b43] ring-offset-2 scale-110 border-[#762b43]'
                          : 'border-[#e6ddd3] hover:scale-105'
                      }`}
                      style={{ backgroundColor: t.hex }}
                    >
                      {active && (
                        <Check
                          className={`w-4 h-4 ${
                            t.hex === '#ffffff' || t.hex === '#e2e8f0'
                              ? 'text-[#1f1917]'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e6ddd3]">
              <button
                type="button"
                onClick={handleAddCustomStole}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#762b43] hover:bg-[#581e31] text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>أضف هذا الوشاح للحقيبة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
