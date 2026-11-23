import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ImageOff,
  ImagePlus,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import {
  BOUQUET_IMAGE_PATH,
  CAP_SWATCHES,
  CATEGORY_BRANCHES,
  ROBE_IMAGE_PATH,
  SHAWL_IMAGE_PATH,
} from '../data/defaultStore';
import { CartItem, CategoryId, Product } from '../types/store';
import capRoundImg from '../assets/images/round.webp';
import capTriangleImg from '../assets/images/triangle.webp';
import capTuxedoImg from '../assets/images/tuxedo.webp';

interface ProductCatalogProps {
  products: Product[];
  isAdminMode: boolean;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  onOpenAddProduct: (defaultCategory?: CategoryId) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onReplaceProductImage: (productId: string, file: File) => void;
  onSetProductColorImage?: (productId: string, colorName: string, file: File | null) => void;
  onToggleProductField?: (
    productId: string,
    field: 'hideSizing' | 'hideCapDetails' | 'hideAmericanShawl'
  ) => void;
  onRemoveProductImage?: (productId: string) => void;
}

const MAIN_SECTIONS = [
  {
    id: 'shawl' as CategoryId,
    title: 'الوشاح',
    subtitle: 'شال ميس أو عادي أو بالظهر مع القبعة، بقماش الكريب أو الدان، وتصمّمه باسمك وشعارك.',
    priceLabel: 'من 3,800 دج مع القبعة',
    buttonText: 'صمّم وشاحك',
    fallbackImg: SHAWL_IMAGE_PATH,
  },
  {
    id: 'robe' as CategoryId,
    title: 'الروب',
    subtitle: 'روب التخرج بألوان ملكية ومقاس رجالي أو نسائي أو بقياساتك الخاصة بدقة.',
    priceLabel: 'من 2,500 دج',
    buttonText: 'اختر روبك',
    fallbackImg: ROBE_IMAGE_PATH,
  },
  {
    id: 'accessories' as CategoryId,
    title: 'ورد وإكسسوارات',
    subtitle: 'باقات ورد التخرج الفاخرة والقبعات المنفردة لإكمال إطلالة تخرجك.',
    priceLabel: 'تشكيلة مميزة',
    buttonText: 'تصفح الإكسسوارات',
    fallbackImg: BOUQUET_IMAGE_PATH,
  },
];

const CAP_STYLES = [
  { id: 'round', label: 'القبعة الدائرية', extraPrice: 0, priceText: 'مشمولة', image: capRoundImg },
  { id: 'triangle', label: 'القبعة المثلثة', extraPrice: 0, priceText: 'مشمولة', image: capTriangleImg },
  { id: 'tuxedo', label: 'قبعة توكسيدو', extraPrice: 100, priceText: '+100 دج', image: capTuxedoImg },
];

function withViewTransition(update: () => void, cleanup?: () => void) {
  if (typeof document === 'undefined' || !('startViewTransition' in document)) {
    update();
    cleanup?.();
    return;
  }
  document
    .startViewTransition(() => {
      flushSync(update);
    })
    .finished.finally(() => cleanup?.());
}

const MORPH_STYLE = { viewTransitionName: 'product-hero' } as React.CSSProperties;

function ProductDetailView({
  product,
  sectionTitle,
  isAdminMode,
  onBackToHome,
  onBackToSection,
  onAddToCart,
  onSetColorImage,
  onToggleField,
  onEdit,
  onDelete,
  onReplaceImage,
  isMorphing,
}: {
  product: Product;
  sectionTitle: string;
  isAdminMode: boolean;
  onBackToHome: () => void;
  onBackToSection: () => void;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  onSetColorImage?: (colorName: string, file: File | null) => void;
  onToggleField?: (field: 'hideSizing' | 'hideCapDetails' | 'hideAmericanShawl') => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReplaceImage?: (file: File) => void;
  isMorphing?: boolean;
}) {
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [selectedSecondary, setSelectedSecondary] = useState(
    product.secondaryOptions?.at(0) || ''
  );
  const [selectedColor, setSelectedColor] = useState(CAP_SWATCHES.at(0)!);
  const [selectedCapStyle, setSelectedCapStyle] = useState(CAP_STYLES.at(0)!);
  const [customCapImages, setCustomCapImages] = useState<Record<string, string>>({});

  const [gender, setGender] = useState<'نسائي' | 'رجالي'>('نسائي');
  const [standardSize, setStandardSize] = useState('M');
  const [numericSize, setNumericSize] = useState('');
  const [fullLength, setFullLength] = useState('');
  const [shoulderAndSleeve, setShoulderAndSleeve] = useState('');

  const [capSameColor, setCapSameColor] = useState(true);
  const [capCustomColor, setCapCustomColor] = useState(CAP_SWATCHES.at(0)!);
  const [headSize, setHeadSize] = useState('');
  const [capEmbroideryPos, setCapEmbroideryPos] = useState<'سطح القبعة' | 'جبهة القبعة'>('سطح القبعة');
  const [capNotes, setCapNotes] = useState('');

  const [customNotes, setCustomNotes] = useState('');
  const colorFileRef = useRef<HTMLInputElement>(null);

  const handleCapImageUpload = (capId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomCapImages((prev) => ({ ...prev, [capId]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const activeOption = product.options[selectedOptionIdx];
  const basePrice = activeOption ? activeOption.price : product.basePrice;
  const showCapSection =
    product.category !== 'accessories' &&
    product.category !== 'cap' &&
    !product.hideCapDetails;
  const capStyleSurcharge = showCapSection ? selectedCapStyle.extraPrice : 0;
  const tuxedoSurcharge = selectedSecondary.includes('+100') ? 100 : 0;
  const displayPrice = basePrice + capStyleSurcharge + tuxedoSurcharge;

  const activeImageUrl = product.colorImages?.[selectedColor.name] || product.imageUrl;
  const hasDedicatedColorImg = Boolean(product.colorImages?.[selectedColor.name]);

  const handleColorFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file && onSetColorImage) {
      onSetColorImage(selectedColor.name, file);
      e.target.value = '';
    }
  };

  const handleAdd = () => {
    const detailParts: string[] = [];
    if (activeOption) detailParts.push(activeOption.label);
    if (selectedSecondary) detailParts.push(selectedSecondary);
    if (selectedColor) detailParts.push(`اللون: ${selectedColor.name}`);

    if (!product.hideSizing) {
      detailParts.push(`الفئة: ${gender}`);
      if (numericSize.trim()) {
        detailParts.push(`المقاس: ${numericSize.trim()}`);
      } else {
        detailParts.push(`المقاس: ${standardSize}`);
      }
      if (fullLength.trim()) detailParts.push(`الطول: ${fullLength.trim()} سم`);
      if (shoulderAndSleeve.trim()) detailParts.push(`الكتف/الكم: ${shoulderAndSleeve.trim()}`);
    }

    if (showCapSection) {
      detailParts.push(`شكل القبعة: ${selectedCapStyle.label}`);
      const finalCapColor = capSameColor ? selectedColor.name : capCustomColor.name;
      detailParts.push(`لون القبعة: ${finalCapColor}`);
      if (headSize.trim()) detailParts.push(`محيط الرأس: ${headSize.trim()} سم`);
      detailParts.push(`تطريز القبعة: ${capEmbroideryPos}`);
      if (capNotes.trim()) detailParts.push(`ملاحظة القبعة: ${capNotes.trim()}`);
    }

    if (customNotes.trim()) detailParts.push(`ملاحظة: ${customNotes.trim()}`);

    onAddToCart({
      category: product.category,
      title: product.name,
      details: detailParts.join(' · '),
      unitPrice: displayPrice,
    });
  };

  return (
    <div className="bg-white border border-[#e6ddd3] rounded-3xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 bg-[#faf8f5] border-b border-[#e6ddd3] flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#6e645e]">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onBackToHome} className="hover:text-[#762b43] underline cursor-pointer">
            الرئيسية
          </button>
          <ChevronLeft className="w-3.5 h-3.5" />
          <button type="button" onClick={onBackToSection} className="hover:text-[#762b43] underline cursor-pointer">
            {sectionTitle}
          </button>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[#1f1917]">{product.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {isAdminMode && onEdit && onDelete && (
            <div className="flex items-center gap-2 border-l border-[#e6ddd3] pl-3">
              <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-blue-700 hover:underline cursor-pointer font-bold">
                <Pencil className="w-3.5 h-3.5" /><span>تعديل</span>
              </button>
              <button type="button" onClick={() => { if (window.confirm('هل أنت متأكد من حذف هذا الموديل نهائياً؟')) onDelete(); }} className="inline-flex items-center gap-1 text-red-600 hover:underline cursor-pointer font-bold">
                <Trash2 className="w-3.5 h-3.5" /><span>حذف</span>
              </button>
            </div>
          )}
          <button type="button" onClick={onBackToSection} className="inline-flex items-center gap-1 text-[#762b43] hover:underline cursor-pointer">
            <ArrowRight className="w-3.5 h-3.5" /><span>رجوع للقسم</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-8 items-start">
        <div className="relative aspect-[3/4] min-w-0 rounded-2xl bg-[#faf8f5] overflow-hidden border border-[#e6ddd3] flex items-center justify-center">
          {isAdminMode && (
            <div className="absolute top-3 left-3 z-10">
              <label className="cursor-pointer bg-white/95 backdrop-blur-md text-[#1f1917] px-3 py-1.5 rounded-lg border border-[#e6ddd3] text-xs font-bold shadow-sm hover:bg-[#f3eee8] flex items-center gap-1.5">
                <ImagePlus className="w-4 h-4 text-[#762b43]" />تغيير الصورة
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.item(0);
                    if (file && onReplaceImage) onReplaceImage(file);
                    e.target.value = '';
                }} />
              </label>
            </div>
          )}

          {activeImageUrl ? (
            <>
              <img src={activeImageUrl} alt={product.name} style={isMorphing ? MORPH_STYLE : undefined} className="w-full h-full object-contain p-4 transition-all duration-300" />
              <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#e6ddd3] shadow-sm text-xs font-bold text-[#1f1917]">
                <span className="w-3.5 h-3.5 rounded-full border border-black/15" style={{ backgroundColor: selectedColor.hex }} />
                <span>اللون: {selectedColor.name}</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="w-10 h-10 text-[#762b43] mb-2 opacity-75" />
              <span className="font-editorial text-lg font-bold text-[#1f1917]">{product.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-5 min-w-0">
          <div className="space-y-4">
            <div>
              <span className="inline-block text-xs font-bold text-[#762b43] mb-1">{product.branch}</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f1917]">{product.name}</h3>
              <p className="text-xl font-extrabold text-[#762b43] mt-1.5">{displayPrice.toLocaleString('en-US')} دج</p>
              <p className="text-sm text-[#6e645e] leading-relaxed mt-2">{product.description}</p>
            </div>

            {product.options.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#1f1917] mb-2">اختر القماش أو المقاس:</label>
                <div className="grid grid-cols-2 gap-2">
                  {product.options.map((opt, idx) => {
                    const active = idx === selectedOptionIdx;
                    return (
                      <button key={opt.label} type="button" onClick={() => setSelectedOptionIdx(idx)} className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${active ? 'border-[#762b43] bg-[#faf8f5]' : 'border-[#e6ddd3] bg-white'}`}>
                        <span className="block text-xs font-bold text-[#1f1917]">{opt.label}</span>
                        <span className="text-[11px] font-extrabold text-[#762b43]">{opt.price.toLocaleString('en-US')} دج</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.secondaryOptions && product.secondaryOptions.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#1f1917] mb-2">خيار إضافي:</label>
                <div className="flex flex-wrap gap-2">
                  {product.secondaryOptions.map((sec) => {
                    const active = sec === selectedSecondary;
                    return (
                      <button key={sec} type="button" onClick={() => setSelectedSecondary(sec)} className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${active ? 'bg-[#1f1917] text-white border-[#1f1917]' : 'bg-[#faf8f5] text-[#1f1917] border-[#e6ddd3] hover:border-[#1f1917]'}`}>
                        {sec}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1f1917] mb-2">اختر اللون: <span className="text-[#762b43]">{selectedColor.name}</span></label>
              <div className="flex flex-wrap items-center gap-2.5">
                {CAP_SWATCHES.map((swatch) => {
                  const isActive = swatch.name === selectedColor.name;
                  const hasPhoto = Boolean(product.colorImages?.[swatch.name]);
                  return (
                    <button key={swatch.name} type="button" title={swatch.name} onClick={() => setSelectedColor(swatch)} className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-transform cursor-pointer ${isActive ? 'ring-2 ring-[#762b43] ring-offset-2 scale-110 border-[#762b43]' : 'border-[#d6cdc2]'}`} style={{ backgroundColor: swatch.hex }}>
                      {isActive && <Check className={`w-4 h-4 ${swatch.hex === '#f5f5f4' || swatch.hex === '#e7d8c9' || swatch.hex === '#9ca3af' ? 'text-[#1f1917]' : 'text-white'}`} />}
                      {hasPhoto && !isActive && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />}
                    </button>
                  );
                })}
              </div>

              {isAdminMode && (
                <div className="mt-3 p-3 rounded-xl bg-[#faf8f5] border border-[#e6ddd3] flex flex-wrap items-center justify-between gap-2">
                  <input ref={colorFileRef} type="file" accept="image/*" className="hidden" onChange={handleColorFileChange} />
                  <span className="text-xs font-bold text-[#1f1917]">صورة لون "{selectedColor.name}":</span>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => colorFileRef.current?.click()} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#762b43] text-white text-xs font-bold cursor-pointer">
                      <ImagePlus className="w-3.5 h-3.5" /><span>{hasDedicatedColorImg ? 'تغيير صورة اللون' : 'رفع صورة لهذا اللون'}</span>
                    </button>
                    {hasDedicatedColorImg && (
                      <button type="button" onClick={() => onSetColorImage?.(selectedColor.name, null)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-red-600 border border-red-200 text-xs font-bold cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /><span>حذف</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ... (باقي خيارات المقاس والقبعة كما هي) ... */}

            <div className="pt-3 border-t border-[#e6ddd3] space-y-2.5">
              <input type="text" value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} placeholder="ملاحظات إضافية للوشاح أو التطريز (اختياري)..." className="w-full px-3 py-2.5 rounded-xl border border-[#e6ddd3] bg-[#faf8f5] text-xs" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#e6ddd3] flex items-center justify-between gap-4">
            <div>
              <span className="block text-xs text-[#6e645e]">الإجمالي</span>
              <span className="text-2xl font-extrabold text-[#1f1917]">{displayPrice.toLocaleString('en-US')} دج</span>
            </div>
            <button type="button" onClick={handleAdd} className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#762b43] hover:bg-[#581e31] text-white text-sm font-bold shadow-md transition-colors cursor-pointer">
              <ShoppingBag className="w-4 h-4" /><span>أضف إلى السلة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ product, isAdminMode, onSelect, onEdit, onDelete, onReplaceImage, onRemoveImage, isMorphing }: any) {
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasValidImage = Boolean(product.imageUrl) && !imgError;

  return (
    // 🟢 كارت المنتج باللون الأبيض مع ظل خفيف
    <article onClick={onSelect} className="group bg-white border border-[#e6ddd3] rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-[#f3eee8] overflow-hidden">
        {hasValidImage ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center bg-[#f3eee8]">
            <ShoppingBag className="w-7 h-7 text-[#762b43] mb-2 opacity-80" />
          </div>
        )}
      </div>
      <div className="p-4 text-center flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-editorial text-lg font-bold text-[#1f1917] leading-snug">{product.name}</h3>
          <p className="text-xs sm:text-sm font-extrabold text-[#762b43] mt-1">من {product.basePrice.toLocaleString('en-US')} دج</p>
          <p className="text-[11px] text-[#6e645e] mt-0.5">{product.branch}</p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#f3eee8]">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#762b43] group-hover:underline">
            <span>تخصيص الطلب</span><ChevronLeft className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProductCatalog({ products, isAdminMode, onAddToCart, onOpenAddProduct, onEditProduct, onDeleteProduct, onReplaceProductImage, onRemoveProductImage, onSetProductColorImage, onToggleProductField }: ProductCatalogProps) {
  const [selectedSection, setSelectedSection] = useState<CategoryId | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeBranch, setActiveBranch] = useState<string>('الكل');
  const [morphProductId, setMorphProductId] = useState<string | null>(null);

  useEffect(() => { setSelectedSection('shawl'); }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      withViewTransition(() => {
        const state = event.state;
        if (state && state.catalogLevel === 'product') {
          setSelectedSection(state.section || null);
          setSelectedProductId(state.productId || null);
        } else if (state && state.catalogLevel === 'section') {
          setSelectedSection(state.section || null);
          setSelectedProductId(null);
        } else {
          setSelectedSection(null);
          setSelectedProductId(null);
        }
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenSection = (cat: CategoryId) => {
    withViewTransition(() => {
      window.history.pushState({ catalogLevel: 'section', section: cat }, '');
      setSelectedSection(cat);
      setSelectedProductId(null);
      setActiveBranch('الكل');
    });
  };

  const handleOpenProduct = (productId: string) => {
    flushSync(() => setMorphProductId(productId));
    withViewTransition(() => {
        window.history.pushState({ catalogLevel: 'product', section: selectedSection, productId }, '');
        setSelectedProductId(productId);
      }, () => setMorphProductId(null)
    );
  };

  const handleBackToHome = () => {
    withViewTransition(() => {
      setSelectedSection(null);
      setSelectedProductId(null);
      setActiveBranch('الكل');
    });
  };

  const handleBackToSection = () => {
    const pid = selectedProductId;
    if (pid) flushSync(() => setMorphProductId(pid));
    withViewTransition(() => setSelectedProductId(null), () => setMorphProductId(null));
  };

  const activeSectionMeta = selectedSection === 'shawl' 
    ? { id: 'shawl', title: 'صمم وشاحك', subtitle: 'اختر التفاصيل', priceLabel: '', buttonText: '', fallbackImg: '' } 
    : MAIN_SECTIONS.find((s) => s.id === selectedSection);
    
  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  const sectionProducts = products.filter((p) => {
    if (!selectedSection) return false;
    if (selectedSection === 'accessories') return p.category === 'accessories' || p.category === 'cap';
    return p.category === selectedSection;
  });

  const branches = selectedSection && CATEGORY_BRANCHES[selectedSection] ? CATEGORY_BRANCHES[selectedSection] : [];
  const filteredProducts = sectionProducts.filter((p) => activeBranch === 'الكل' || p.branch === activeBranch);

  return (
    <div key={selectedProductId || selectedSection || 'home'} className="catalog-enter">
      <section id="catalog-sec" className="py-12 sm:py-16 border-b border-[#e6ddd3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {selectedProduct && activeSectionMeta ? (
            <ProductDetailView
              product={selectedProduct}
              sectionTitle={activeSectionMeta.title}
              onBackToHome={handleBackToHome}
              onBackToSection={handleBackToSection}
              onAddToCart={onAddToCart}
              isAdminMode={isAdminMode}
              isMorphing={morphProductId === selectedProduct.id}
              onSetColorImage={(colorName, file) => onSetProductColorImage?.(selectedProduct.id, colorName, file)}
              onToggleField={(field) => onToggleProductField?.(selectedProduct.id, field)}
              onEdit={() => onEditProduct(selectedProduct)}
              onDelete={() => { onDeleteProduct(selectedProduct.id); handleBackToHome(); }}
              onReplaceImage={(file) => onReplaceProductImage(selectedProduct.id, file)}
            />
          ) : selectedSection && activeSectionMeta ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#6e645e]">
                  <button onClick={handleBackToHome} className="hover:text-[#762b43] underline cursor-pointer">الرئيسية</button>
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="text-[#1f1917]">{activeSectionMeta.title}</span>
                </div>
                <button onClick={handleBackToHome} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#e6ddd3] text-xs font-bold text-[#1f1917] hover:bg-[#f3eee8] cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5" /><span>كل الأقسام</span>
                </button>
              </div>

              <div className="mb-6">
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1f1917]">{activeSectionMeta.title}</h2>
                <p className="text-sm text-[#6e645e] mt-1.5 max-w-xl">{activeSectionMeta.subtitle}</p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#e6ddd3] rounded-2xl p-10 text-center">
                  <p className="text-sm font-semibold text-[#6e645e]">لا توجد قطع في هذا القسم حالياً.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <SectionCard key={product.id} product={product} onSelect={() => handleOpenProduct(product.id)} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-bold text-[#762b43] mb-1">اختر القسم المناسب</p>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f1917]">أقسام دار الأزياء</h2>
                </div>
                {isAdminMode && (
                  <button onClick={() => onOpenAddProduct('shawl')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1f1917] hover:bg-[#3a312d] text-white text-xs font-bold cursor-pointer">
                    <Plus className="w-4 h-4" /><span>إضافة موديل جديد</span>
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {MAIN_SECTIONS.map((sec) => {
                  const firstProdWithImg = products.find((p) => p.category === sec.id && p.imageUrl);
                  const coverImg = firstProdWithImg?.imageUrl || sec.fallbackImg;
                  return (
                    <div key={sec.id} onClick={() => handleOpenSection(sec.id)} className="group bg-white border border-[#e6ddd3] rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#762b43]/40">
                      <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f1917]">{sec.title}</h3>
                          <p className="text-sm text-[#6e645e] leading-relaxed mt-2">{sec.subtitle}</p>
                          <p className="text-base font-extrabold text-[#762b43] mt-3">{sec.priceLabel}</p>
                        </div>
                        <div className="mt-5">
                          <span className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3 rounded-full bg-[#762b43] group-hover:bg-[#581e31] text-white text-sm font-bold transition-colors">{sec.buttonText}</span>
                        </div>
                      </div>
                      <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto bg-[#f3eee8] overflow-hidden">
                        <img src={coverImg} alt={sec.title} className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
