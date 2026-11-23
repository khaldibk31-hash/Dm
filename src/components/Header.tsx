import { ChangeEvent, useRef } from 'react';
import { ShoppingBag, CloudUpload, LogOut, Type, ImagePlus, Plus } from 'lucide-react';
import { BRAND_LOGO_PATH } from '../data/defaultStore';

interface HeaderProps {
  brandName: string;
  logoUrl: string;
  cartCount: number;
  isAdminMode: boolean;
  isSaving: boolean;
  onOpenCart: () => void;
  onPublish: () => void;
  onLogout: () => void;
  onOpenCopyEditor: () => void;
  onOpenAddProduct: () => void;
  onUploadLogo: (file: File) => void;
}

export function Header({
  brandName,
  logoUrl,
  cartCount,
  isAdminMode,
  isSaving,
  onOpenCart,
  onPublish,
  onLogout,
  onOpenCopyEditor,
  onOpenAddProduct,
  onUploadLogo,
}: HeaderProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const activeLogo = logoUrl || BRAND_LOGO_PATH;
  const isDefaultEmblem = !logoUrl;

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadLogo(file);
      e.target.value = '';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Emblem & Single-line Wordmark */}
          <a
            href="#top"
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap group"
          >
            <img
              src={activeLogo}
              alt={brandName}
              referrerPolicy="no-referrer"
              className={`h-10 w-10 object-contain shrink-0 ${
                isDefaultEmblem
                  ? 'luxury-logo-gold'
                  : 'rounded-md object-cover border border-[#D4AF37]/30'
              }`}
            />
            <span className="font-editorial text-xl sm:text-2xl font-bold tracking-wide text-[#F7F3EA] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0">
              {brandName}
            </span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#B5ADA0]"
            aria-label="التنقل الرئيسي"
          >
            <a
              href="#studio-sec"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              صمّم وشاحك
            </a>
            <a
              href="#catalog-sec"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              المجموعة
            </a>
            <a
              href="#prices-sec"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              الأسعار
            </a>
            <a
              href="#faq-sec"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              الأسئلة
            </a>
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>الحقيبة</span>
              <span className="tabular-nums font-extrabold">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Atelier Bar (only visible when authenticated via Supabase Auth) */}
      {isAdminMode && (
        <div
          className="bg-[#141414] text-[#F7F3EA] border-b border-[#D4AF37]/25"
          role="region"
          aria-label="لوحة إدارة المتجر"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-[#D4AF37]">وضع الإدارة مفعّل</span>
              <span className="mx-2 text-[#6E655A]">·</span>
              <span className="text-[#B5ADA0]">
                احفظ التعديلات ليظهر التحديث لجميع الزوار
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/15 border border-[#D4AF37]/20 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تغيير الشعار</span>
              </button>
              <button
                type="button"
                onClick={onOpenCopyEditor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/15 border border-[#D4AF37]/20 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تعديل النصوص</span>
              </button>
              <button
                type="button"
                onClick={onOpenAddProduct}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/15 border border-[#D4AF37]/20 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>إضافة موديل</span>
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={onPublish}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] text-xs font-bold transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 cursor-pointer"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>{isSaving ? 'جاري النشر...' : 'حفظ ونشر'}</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1E1C18] text-[#F7F3EA] hover:bg-[#2A2620] border border-[#D4AF37]/25 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
