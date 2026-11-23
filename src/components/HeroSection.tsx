import { useState } from 'react';
import { ArrowDownLeft, Sparkles } from 'lucide-react';
import { HERO_IMAGE_PATH } from '../data/defaultStore';
import { StoreCopy } from '../types/store';

interface HeroSectionProps {
  copy: StoreCopy;
}

const TRUST_HIGHLIGHTS = [
  {
    title: 'لا تدفع شيئاً عند الطلب',
    desc: 'نراجع معك كل تفاصيل التطريز والمقاس عبر WhatsApp أولاً.',
  },
  {
    title: 'عربون 30% فقط بعد التأكيد',
    desc: 'يدفع الباقي عند استلام طقم تخرجك جاهزاً.',
  },
  {
    title: 'موعد تسليم من اختيارك',
    desc: 'تجهيز متقن يبدأ من 7 أيام حسب جدول حفلك.',
  },
  {
    title: 'توصيل لـ 58 ولاية',
    desc: 'شحن إلى باب المنزل أو الاستلام من مكتب التوصيل.',
  },
];

export function HeroSection({ copy }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="relative border-b border-[#D4AF37]/20 bg-[#0A0A0A]/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <p className="text-xs sm:text-sm font-bold tracking-wide text-[#D4AF37] mb-3">
              {copy.heroEyebrow} · الجزائر
            </p>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.85rem] font-bold leading-[1.25] text-[#F7F3EA] max-w-xl [text-wrap:balance] mb-4">
              {copy.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-[#B5ADA0] leading-relaxed max-w-lg mb-7">
              {copy.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-7">
              <a
                href="#studio-sec"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] text-sm font-bold transition-colors whitespace-nowrap shrink-0 shadow-md"
              >
                <span>صمّم وشاحك الآن</span>
                <ArrowDownLeft className="w-4 h-4" />
              </a>
              <a
                href="#catalog-sec"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#141414] hover:bg-[#1E1C18] text-[#F7F3EA] border border-[#D4AF37]/35 text-sm font-bold transition-colors whitespace-nowrap shrink-0"
              >
                <span>تصفح المجموعة</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[#A89F91] pt-4 border-t border-[#D4AF37]/20">
              <span>
                الشال مع القبعة من{' '}
                <strong className="text-[#D4AF37] tabular-nums">3,800 دج</strong>
              </span>
              <span aria-hidden="true" className="text-[#D4AF37]/50">·</span>
              <span>
                الروب الأكاديمي{' '}
                <strong className="text-[#D4AF37] tabular-nums">2,500 دج</strong>
              </span>
              <span aria-hidden="true" className="text-[#D4AF37]/50">·</span>
              <span className="text-[#F7F3EA]">التطريز مجاني</span>
            </div>
          </div>

          {/* Editorial Photography Column */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#141414] shadow-2xl">
              {!imgError ? (
                <>
                  <img
                    src={HERO_IMAGE_PATH}
                    alt="طقم تخرج فاخر من DG by Douaa باللون الأسود والذهبي يشمل روباً ووشاحاً مطرزاً وقبعة"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full lg:h-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/55 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#141414] to-[#0A0A0A]">
                  <Sparkles className="w-8 h-8 text-[#D4AF37] mb-3" />
                  <span className="font-editorial text-xl font-bold text-[#F7F3EA]">
                    DG by Douaa Atelier
                  </span>
                  <span className="text-xs text-[#B5ADA0] mt-1">
                    أزياء التخرج المصممة خصيصاً في الجزائر
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Atelier Trust Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#D4AF37]/20">
          {TRUST_HIGHLIGHTS.map((item, idx) => (
            <div
              key={item.title}
              className="bg-[#141414] border border-[#D4AF37]/20 rounded-xl p-4 sm:p-5 hover:border-[#D4AF37]/45 transition-colors"
            >
              <div className="text-xs font-bold text-[#D4AF37] tabular-nums mb-1">
                0{idx + 1}.
              </div>
              <h2 className="text-sm font-bold text-[#F7F3EA] mb-1">
                {item.title}
              </h2>
              <p className="text-xs text-[#A89F91] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
