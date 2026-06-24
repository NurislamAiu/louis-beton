import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Instagram,
  ShoppingCart,
  Trash2,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Check,
  Star,
  Shield,
  Zap,
  Clock,
  Award,
  Layers,
} from "lucide-react";

const CONTACTS = {
  phoneHref: "tel:+77780080404",
  phoneDisplay: "+7 778 008 0404",
  whatsappBase: "https://wa.me/77780080404",
  instagramHref: "https://www.instagram.com/louis_beton_7say?igsh=N2t3MGgya29taDA=",
};

const IMGS = {
  hero: "https://images.unsplash.com/photo-1558661091-5cc1b64d0dc5?w=1920&h=1080&fit=crop&auto=format",
  panel1: "https://images.unsplash.com/photo-1579492450119-80542d516179?w=700&h=500&fit=crop&auto=format",
  panel2: "https://images.unsplash.com/photo-1584184200374-73d7f6c6a175?w=700&h=500&fit=crop&auto=format",
  panel3: "https://images.unsplash.com/photo-1560780552-ba54683cb263?w=700&h=500&fit=crop&auto=format",
  paving1: "https://images.unsplash.com/photo-1539021879172-ff830dce65a9?w=700&h=500&fit=crop&auto=format",
  paving2: "https://images.unsplash.com/photo-1573429507076-426c8d8cf376?w=700&h=500&fit=crop&auto=format",
  paving3: "https://images.unsplash.com/photo-1632228835744-80f7ebe6b7cf?w=700&h=500&fit=crop&auto=format",
  house: "https://images.unsplash.com/photo-1614595737476-42487331b8a1?w=900&h=700&fit=crop&auto=format",
};

type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  tag: string;
  tagBg: string;
  description: string;
  specs: string[];
};

type CartItem = Product & {
  quantity: number;
};

const thermalPanels: Product[] = [
  {
    id: 1,
    name: "Кирпич Классик",
    image: IMGS.panel1,
    price: "3 200",
    tag: "Хит продаж",
    tagBg: "#FF7A00",
    description: "Имитация кирпичной кладки. Стиль лофт и классика для любого фасада.",
    specs: ["Толщина: 60 мм", "Гарантия: 50 лет", "Класс: A+"],
  },
  {
    id: 2,
    name: "Травертин Люкс",
    image: IMGS.panel2,
    price: "4 800",
    tag: "Премиум",
    tagBg: "#B8973B",
    description: "Изысканная текстура натурального травертина для премиальных объектов.",
    specs: ["Толщина: 70 мм", "Гарантия: 50 лет", "Класс: A+"],
  },
  {
    id: 3,
    name: "Бетон Индастриал",
    image: IMGS.panel3,
    price: "2 900",
    tag: "Новинка",
    tagBg: "#3A8A4A",
    description: "Современный индустриальный стиль с текстурой шлифованного бетона.",
    specs: ["Толщина: 60 мм", "Гарантия: 50 лет", "Класс: A"],
  },
];

const pavingStones: Product[] = [
  {
    id: 4,
    name: "Брусчатка Классик",
    image: IMGS.paving1,
    price: "1 800",
    tag: "Хит продаж",
    tagBg: "#FF7A00",
    description: "Классическая прямоугольная брусчатка для дорожек, дворов и площадей.",
    specs: ["Толщина: 60 мм", "Гарантия: 30 лет", "Нагрузка: 400 т/м²"],
  },
  {
    id: 5,
    name: "Плита Квадрат",
    image: IMGS.paving2,
    price: "2 100",
    tag: "Премиум",
    tagBg: "#B8973B",
    description: "Крупноформатная квадратная плита — элегантность и простор.",
    specs: ["Толщина: 80 мм", "Гарантия: 30 лет", "Нагрузка: 400 т/м²"],
  },
  {
    id: 6,
    name: "Гранит Нуар",
    image: IMGS.paving3,
    price: "3 400",
    tag: "Люкс",
    tagBg: "#B8973B",
    description: "Тёмная гранитная фактура для парадных входов и VIP-объектов.",
    specs: ["Толщина: 60 мм", "Гарантия: 50 лет", "Нагрузка: 600 т/м²"],
  },
];

const TICKER = [
  "ТЕРМОПАНЕЛИ","•","БРУСЧАТКА","•","ФАСАДНЫЕ СИСТЕМЫ","•",
  "ЖЕТЫСАЙ","•","ПРЯМОЙ ПРОИЗВОДИТЕЛЬ","•","50 ЛЕТ ГАРАНТИИ","•",
];

const allProducts = [...thermalPanels, ...pavingStones];

const buildWhatsAppHref = (cart: CartItem[]) => {
  const text = cart.length
    ? [
        "Здравствуйте! Я с сайта Louis Beton, хочу оформить заказ:",
        ...cart.map((item, index) => `${index + 1}. ${item.name} - ${item.quantity} шт., от ${item.price} ₸/м²`),
        "",
        "Пожалуйста, свяжитесь со мной для расчета.",
      ].join("\n")
    : "Здравствуйте! Я с сайта Louis Beton, хочу получить консультацию и расчет.";

  return `${CONTACTS.whatsappBase}?text=${encodeURIComponent(text)}`;
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"panels" | "paving" | "all">("panels");
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: "", phone: "", message: "" });
    setTimeout(() => setFormSent(false), 5000);
  };

  const addToCart = (product: Product) => {
    setAddedProductId(product.id);
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });
    window.setTimeout(() => {
      setAddedProductId((currentId) => currentId === product.id ? null : currentId);
    }, 1100);
  };

  const removeFromCart = (productId: number) => {
    setCart((items) => items.filter((item) => item.id !== productId));
  };

  const getCartQuantity = (productId: number) => {
    return cart.find((item) => item.id === productId)?.quantity ?? 0;
  };

  const products = activeTab === "all" ? allProducts : activeTab === "panels" ? thermalPanels : pavingStones;
  const whatsappHref = buildWhatsAppHref(cart);
  const cartTotalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white overflow-x-hidden pb-28 sm:pb-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .df { font-family: 'Barlow Condensed', sans-serif; }
        html { scroll-behavior: smooth; }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 30s linear infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu  { animation: fadeUp 0.75s ease both; }
        .fu1 { animation: fadeUp 0.75s 0.15s ease both; }
        .fu2 { animation: fadeUp 0.75s 0.3s ease both; }
        .fu3 { animation: fadeUp 0.75s 0.45s ease both; }

        @keyframes amberPulse {
          0%,100% { box-shadow: 0 0 22px rgba(255,122,0,0.3); }
          50%      { box-shadow: 0 0 44px rgba(255,122,0,0.55); }
        }
        .amber-glow { animation: amberPulse 2.8s ease-in-out infinite; }

        @keyframes addPop {
          0% { transform: scale(1); }
          38% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes addGlow {
          0% { box-shadow: 0 0 0 rgba(255,122,0,0); }
          42% { box-shadow: 0 0 0 4px rgba(255,122,0,0.2), 0 0 42px rgba(255,122,0,0.28); }
          100% { box-shadow: 0 0 0 rgba(255,122,0,0); }
        }
        @keyframes badgePop {
          0% { transform: translateY(6px) scale(0.85); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes modalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalUp {
          from { opacity: 0; transform: translateY(22px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .just-added { animation: addGlow 1.1s ease both; border-color: rgba(255,122,0,0.55) !important; }
        .order-pop { animation: addPop 0.38s ease both; }
        .cart-badge { animation: badgePop 0.24s ease both; }
        .modal-fade { animation: modalFade 0.22s ease both; }
        .modal-panel { animation: modalUp 0.28s ease both; }

        .card-img  { transition: transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94); }
        .pcard:hover .card-img { transform: scale(1.09); }
        .card-ol   { opacity: 0; transition: opacity 0.3s ease; }
        .pcard:hover .card-ol  { opacity: 1; }
        .card-btn  { transform: translateY(14px); transition: transform 0.32s ease; }
        .pcard:hover .card-btn { transform: translateY(0); }

        .pcard { transition: border-color 0.35s ease; }
        .pcard:hover { border-color: rgba(255,122,0,0.45) !important; }
        .details-btn { transition: transform 0.22s ease, background 0.22s ease; }
        .details-btn:hover { transform: translateY(-2px); background: #fff !important; }
        .order-btn { transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease; }
        .order-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(255,122,0,0.2); }
        .order-btn:active { transform: translateY(0) scale(0.98); }

        .feat { transition: border-color 0.3s ease, background 0.3s ease; }
        .feat:hover { border-color: rgba(255,122,0,0.38) !important; background: #181818 !important; }
        .feat-icon { transition: transform 0.3s ease; }
        .feat:hover .feat-icon { transform: scale(1.18) rotate(-6deg); }

        .nl::after {
          content:''; display:block; height:1px; width:0;
          background:#FF7A00; transition: width 0.28s ease; margin-top:2px;
        }
        .nl:hover::after { width:100%; }

        input:focus, textarea:focus {
          border-color: rgba(255,122,0,0.5) !important;
          outline: none;
        }
      `}</style>

      {/* ══════════════════════════ NAV ══════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(12,12,12,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: "#FF7A00" }}>
              <span className="df font-black text-[10px] text-black tracking-wider">LB</span>
            </div>
            <span className="df font-black tracking-[0.2em] text-lg">
              <span className="text-white">LOUIS</span>
              <span style={{ color: "#FF7A00" }}> BETON</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[["Продукция","#catalog"],["О нас","#why"],["Проекты","#custom"],["Контакты","#contact"]].map(([l,h]) => (
              <a key={l} href={h} className="nl text-white/55 hover:text-white text-sm font-medium tracking-wide transition-colors">{l}</a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <a href={CONTACTS.phoneHref} className="flex items-center gap-1.5 text-sm text-white/55 hover:text-white transition-colors">
              <Phone size={13} style={{ color: "#FF7A00" }} />
              {CONTACTS.phoneDisplay}
            </a>
            <a href="#contact" className="df font-bold text-sm tracking-widest px-5 py-2.5 text-black transition-colors" style={{ background:"#FF7A00" }}
              onMouseOver={e=>(e.currentTarget.style.background="#fff")}
              onMouseOut={e=>(e.currentTarget.style.background="#FF7A00")}>
              КАТАЛОГ
            </a>
          </div>

          {/* Burger */}
          <button className="md:hidden p-1.5 text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden px-6 py-8 flex flex-col gap-5 border-t"
            style={{ background:"rgba(8,8,8,0.98)", backdropFilter:"blur(20px)", borderColor:"rgba(255,255,255,0.06)" }}>
            {[["Продукция","#catalog"],["О нас","#why"],["Индивидуальный заказ","#custom"],["Контакты","#contact"]].map(([l,h]) => (
              <a key={l} href={h} onClick={()=>setMenuOpen(false)}
                className="df font-black text-2xl tracking-widest text-white/75 hover:text-white transition-colors uppercase">{l}</a>
            ))}
            <div className="border-t border-white/10 pt-5 flex flex-col gap-3">
              <a href={CONTACTS.phoneHref} className="flex items-center gap-2.5 text-white/55">
                <Phone size={15} style={{color:"#FF7A00"}}/> {CONTACTS.phoneDisplay}
              </a>
              <a href={whatsappHref} className="flex items-center justify-center gap-2 py-3.5 font-bold text-white" style={{background:"#25D366"}}>
                <MessageCircle size={17}/> Написать в WhatsApp
              </a>
              <a href={CONTACTS.instagramHref} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3.5 font-bold text-white"
                style={{ background:"linear-gradient(135deg,#833AB4,#E1306C,#F77737)" }}>
                <Instagram size={17}/> Instagram
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: "100svh" }}>
        {/* BG */}
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <img src={IMGS.hero} alt="Luxury modern house facade" className="w-full h-full object-cover"
            style={{ opacity:0.38, objectPosition:"center 30%", transform:"scale(1.04)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(110deg,#0E0E0E 38%,rgba(14,14,14,0.6) 62%,rgba(14,14,14,0.15) 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,#0E0E0E 0%,transparent 52%)" }}/>
          {/* Amber glow */}
          <div className="absolute pointer-events-none" style={{
            bottom:"-60px", left:"-20px", width:"560px", height:"560px",
            background:"radial-gradient(circle,rgba(255,122,0,0.13) 0%,transparent 68%)",
          }}/>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-24 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 fu"
            style={{ border:"1px solid rgba(255,122,0,0.35)", background:"rgba(255,122,0,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#FF7A00", boxShadow:"0 0 8px #FF7A00" }}/>
            <span className="df font-bold text-xs tracking-[0.3em] uppercase" style={{ color:"#FF7A00" }}>
              ЖЕТЫСАЙ • КАЗАХСТАН • ПРОИЗВОДИТЕЛЬ
            </span>
          </div>

          {/* Headline */}
          <div className="mb-5 fu1">
            <h1 className="df font-black text-white leading-none" style={{ fontSize:"clamp(3.8rem,13vw,11rem)", letterSpacing:"-0.02em" }}>
              LOUIS
              <br/>
              <span style={{ color:"#FF7A00" }}>BETON</span>
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-px w-9" style={{ background:"#FF7A00" }}/>
              <span className="df font-bold text-white/45 tracking-[0.32em] text-xs uppercase">
                ТЕРМОПАНЕЛИ И БРУСЧАТКА
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-white/60 text-base md:text-lg max-w-lg leading-relaxed mb-10 font-light fu2">
            Премиальные фасадные системы напрямую от производителя.{" "}
            <span className="text-white font-medium">Утепление и стиль вашего дома на 50 лет.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 fu3">
            <a href="#catalog" className="group inline-flex items-center justify-center gap-3 text-black font-bold px-8 py-4 df tracking-widest text-base transition-colors amber-glow"
              style={{ background:"#FF7A00" }}
              onMouseOver={e=>(e.currentTarget.style.background="#fff")}
              onMouseOut={e=>(e.currentTarget.style.background="#FF7A00")}>
              КАТАЛОГ ПРОДУКЦИИ
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </a>
            <a href="#contact" className="inline-flex items-center justify-center gap-3 text-white font-bold px-8 py-4 df tracking-widest text-base transition-all"
              style={{ border:"1px solid rgba(255,255,255,0.22)" }}
              onMouseOver={e=>{ e.currentTarget.style.borderColor="#FF7A00"; e.currentTarget.style.color="#FF7A00"; }}
              onMouseOut={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"; e.currentTarget.style.color="#fff"; }}>
              РАССЧИТАТЬ СТОИМОСТЬ
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
            style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            {[["500+","Объектов сдано"],["50 лет","Гарантия"],["6","Видов фактур"],["24/7","Поддержка"]].map(([v,l])=>(
              <div key={l}>
                <div className="df font-black text-2xl md:text-3xl" style={{ color:"#FF7A00" }}>{v}</div>
                <div className="text-white/35 text-xs mt-1 tracking-wide uppercase font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 right-7 hidden md:flex flex-col items-center gap-2 text-white/20">
          <div className="w-px h-14" style={{ background:"linear-gradient(to bottom,transparent,#FF7A00)" }}/>
          <span className="df text-[9px] tracking-widest uppercase" style={{ writingMode:"vertical-rl" }}>Листать</span>
        </div>
      </section>

      {/* ══════════════════════════ TICKER ══════════════════════════ */}
      <div className="overflow-hidden py-3" style={{ background:"#FF7A00" }}>
        <div className="flex gap-10 ticker-track whitespace-nowrap">
          {[...TICKER,...TICKER,...TICKER].map((item, i) => (
            <span key={i} className={`df font-bold text-xs tracking-[0.24em] uppercase ${item==="•"?"opacity-35 text-black":"text-black"}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ CATALOG ══════════════════════════ */}
      <section id="catalog" className="py-20 md:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background:"#FF7A00" }}/>
              <span className="df font-bold text-xs tracking-[0.28em] uppercase" style={{ color:"#FF7A00" }}>Наша продукция</span>
            </div>
            <h2 className="df font-black text-white leading-none" style={{ fontSize:"clamp(2.8rem,7vw,5.5rem)", letterSpacing:"-0.01em" }}>
              ВЫБОР<br/>ГОТОВОГО
            </h2>
          </div>
          {/* Tab switcher */}
          <div className="flex" style={{ border:"1px solid rgba(255,255,255,0.14)" }}>
            {(["panels","paving"] as const).map(tab => {
              const on = activeTab===tab;
              return (
                <button key={tab} onClick={()=>setActiveTab(tab)}
                  className="px-6 py-3 df font-bold text-sm tracking-widest uppercase transition-colors"
                  style={{ background:on?"#FF7A00":"transparent", color:on?"#000":"rgba(255,255,255,0.4)" }}>
                  {tab==="panels" ? "Термопанели" : "Брусчатка"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <div key={p.id} className={`pcard ${addedProductId === p.id ? "just-added" : ""}`} style={{ background:"#131313", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div className="relative h-52 overflow-hidden bg-[#1A1A1A]">
                <img src={p.image} alt={p.name} className="card-img w-full h-full object-cover"/>
                <div className="card-ol absolute inset-0 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.6)" }}>
                  <button onClick={() => setSelectedProduct(p)} className="card-btn details-btn df font-bold text-sm tracking-widest px-7 py-3 text-black" style={{ background:"#FF7A00" }}>
                    ПОДРОБНЕЕ
                  </button>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 df font-bold text-xs tracking-wide text-black" style={{ background:p.tagBg }}>
                  {p.tag}
                </div>
                {getCartQuantity(p.id) > 0 && (
                  <div className="cart-badge absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 df font-bold text-xs tracking-wide text-black"
                    style={{ background:"#FF7A00", boxShadow:"0 8px 22px rgba(0,0,0,0.35)" }}>
                    <ShoppingCart size={12}/> {getCartQuantity(p.id)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="df font-black text-white text-xl tracking-wide mb-2">{p.name}</h3>
                <p className="text-white/42 text-sm leading-relaxed mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.specs.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 text-white/32 font-medium" style={{ border:"1px solid rgba(255,255,255,0.08)" }}>{s}</span>
                  ))}
                </div>
                <button onClick={() => setSelectedProduct(p)}
                  className="mb-4 w-full flex items-center justify-center gap-2 df font-bold text-xs tracking-widest uppercase px-5 py-3 text-white/55 transition-all"
                  style={{ border:"1px solid rgba(255,255,255,0.1)" }}
                  onMouseOver={e=>{ e.currentTarget.style.borderColor="#FF7A00"; e.currentTarget.style.color="#FF7A00"; }}
                  onMouseOut={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; }}>
                  Подробнее <ChevronRight size={13}/>
                </button>
                <div className="pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white/32 text-xs">от</span>
                    <span className="df font-black text-2xl" style={{ color:"#FF7A00" }}>{p.price}</span>
                    <span className="text-white/32 text-xs">₸/м²</span>
                  </div>
                  <button onClick={() => addToCart(p)}
                    className={`order-btn mt-4 w-full flex items-center justify-center gap-2.5 df font-bold text-sm tracking-widest uppercase px-5 py-3.5 text-black ${addedProductId === p.id ? "order-pop" : ""}`}
                    style={{ background: addedProductId === p.id ? "#fff" : "#FF7A00" }}>
                    {addedProductId === p.id ? <Check size={17}/> : <ShoppingCart size={17}/>}
                    {addedProductId === p.id
                      ? "Добавлено"
                      : getCartQuantity(p.id)
                        ? `Добавить еще (${getCartQuantity(p.id)})`
                        : "Заказать"}
                    <ChevronRight size={15}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => setActiveTab("all")} className="df font-bold text-sm tracking-widest uppercase px-8 py-4 text-white/45 transition-all"
            style={{ border:"1px solid rgba(255,255,255,0.13)" }}
            onMouseOver={e=>{ e.currentTarget.style.borderColor="#FF7A00"; e.currentTarget.style.color="#FF7A00"; }}
            onMouseOut={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.13)"; e.currentTarget.style.color="rgba(255,255,255,0.45)"; }}>
            {activeTab === "all" ? "ВСЕ ПОЗИЦИИ ОТКРЫТЫ" : "СМОТРЕТЬ ВСЕ ПОЗИЦИИ →"}
          </button>
          {cart.length > 0 && (
            <a href={whatsappHref} className="inline-flex items-center gap-2 df font-bold text-sm tracking-widest uppercase px-8 py-4 text-white transition-colors"
              style={{ background:"#25D366" }}
              onMouseOver={e=>(e.currentTarget.style.background="#1fbd5a")}
              onMouseOut={e=>(e.currentTarget.style.background="#25D366")}>
              <MessageCircle size={16}/> Отправить заказ
            </a>
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-10 p-5 md:p-6" style={{ background:"#111", border:"1px solid rgba(255,122,0,0.22)" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center" style={{ background:"rgba(255,122,0,0.1)", color:"#FF7A00", border:"1px solid rgba(255,122,0,0.24)" }}>
                  <ShoppingCart size={18}/>
                </div>
                <div>
                  <h3 className="df font-black text-white text-2xl tracking-wide">ВАШ ЗАКАЗ</h3>
                  <p className="text-white/35 text-xs">Товаров в корзине: {cartTotalQuantity}</p>
                </div>
              </div>
              <a href={whatsappHref} className="inline-flex items-center justify-center gap-2 text-white font-bold px-5 py-3 df tracking-widest text-sm transition-colors"
                style={{ background:"#25D366" }}
                onMouseOver={e=>(e.currentTarget.style.background="#1fbd5a")}
                onMouseOut={e=>(e.currentTarget.style.background="#25D366")}>
                <MessageCircle size={16}/> НАПИСАТЬ В WHATSAPP
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div className="text-white text-sm font-semibold">{item.name}</div>
                    <div className="text-white/35 text-xs">Количество: {item.quantity} · от {item.price} ₸/м²</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} aria-label={`Удалить ${item.name}`} className="w-9 h-9 flex items-center justify-center text-white/35 transition-colors"
                    onMouseOver={e=>(e.currentTarget.style.color="#FF7A00")}
                    onMouseOut={e=>(e.currentTarget.style.color="rgba(255,255,255,0.35)")}>
                    <Trash2 size={15}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════ CUSTOM ORDER ══════════════════════════ */}
      <section id="custom" className="relative overflow-hidden" style={{ background:"#0B0B0B" }}>
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(255,122,0,1) 48px,rgba(255,122,0,1) 49px),repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(255,122,0,1) 48px,rgba(255,122,0,1) 49px)`,
        }}/>

        <div className="relative grid grid-cols-1 lg:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col justify-center px-8 md:px-14 lg:px-16 py-20 lg:py-28">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background:"#FF7A00" }}/>
                <span className="df font-bold text-xs tracking-[0.28em] uppercase" style={{ color:"#FF7A00" }}>Индивидуальный проект</span>
              </div>
              <h2 className="df font-black text-white leading-none mb-6" style={{ fontSize:"clamp(2.6rem,5.5vw,4.5rem)", letterSpacing:"-0.01em" }}>
                НА ЗАКАЗ.<br/>СОЗДАЙТЕ<br/><span style={{ color:"#FF7A00" }}>СВОЙ СТИЛЬ</span>
              </h2>
              <p className="text-white/52 leading-relaxed mb-10 text-sm md:text-base">
                Разработаем уникальный фасадный дизайн специально для вашего дома. 3D-визуализация, подбор цветов и фактур, монтаж под ключ — всё включено.
              </p>
              <div className="flex flex-col gap-3.5 mb-10">
                {["Бесплатный выезд замерщика с образцами","3D-визуализация фасада за 24 часа","Любая цветовая палитра RAL на выбор","Монтаж «под ключ» с гарантией 5 лет"].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/60">
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center"
                      style={{ border:"1px solid rgba(255,122,0,0.38)", background:"rgba(255,122,0,0.09)" }}>
                      <Check size={10} style={{ color:"#FF7A00" }}/>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <a href="#contact" className="group w-fit inline-flex items-center gap-3 text-black font-bold px-8 py-4 df tracking-wider text-sm transition-colors"
                style={{ background:"#FF7A00" }}
                onMouseOver={e=>(e.currentTarget.style.background="#fff")}
                onMouseOut={e=>(e.currentTarget.style.background="#FF7A00")}>
                РАЗРАБОТАТЬ ИНДИВИДУАЛЬНЫЙ ДИЗАЙН
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </a>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative min-h-[360px] lg:min-h-0 overflow-hidden">
            <img src={IMGS.house} alt="Дом с индивидуальным фасадным решением" className="w-full h-full object-cover" style={{ minHeight:"360px" }}/>
            <div className="absolute inset-0 hidden lg:block" style={{ background:"linear-gradient(to right,#0B0B0B 0%,transparent 45%)" }}/>
            <div className="absolute inset-0 lg:hidden" style={{ background:"linear-gradient(to top,#0B0B0B 0%,transparent 55%)" }}/>
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:max-w-[260px] p-5"
              style={{ background:"rgba(9,9,9,0.92)", backdropFilter:"blur(18px)", border:"1px solid rgba(255,122,0,0.28)" }}>
              <div className="df font-black text-3xl mb-1" style={{ color:"#FF7A00" }}>БЕСПЛАТНО</div>
              <div className="text-white text-sm font-semibold">Вызов замерщика с образцами</div>
              <div className="text-white/38 text-xs mt-1">Выезд по г. Жетысай и области</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ WHY US ══════════════════════════ */}
      <section id="why" className="py-20 md:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background:"#FF7A00" }}/>
            <span className="df font-bold text-xs tracking-[0.28em] uppercase" style={{ color:"#FF7A00" }}>Почему Louis Beton</span>
            <div className="h-px w-8" style={{ background:"#FF7A00" }}/>
          </div>
          <h2 className="df font-black text-white leading-none" style={{ fontSize:"clamp(2.8rem,7vw,5.5rem)", letterSpacing:"-0.01em" }}>
            СТАНДАРТ<br/>КАЧЕСТВА
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { Icon:Shield, title:"50 лет гарантии", desc:"Сертифицированные по ГОСТ материалы. Фасад сохраняет цвет и форму полвека без обслуживания." },
            { Icon:Zap,    title:"Экономия 40%",    desc:"Высокоэффективный пенополистирол снижает расходы на отопление до 40% уже в первый сезон." },
            { Icon:Award,  title:"Прямой производитель", desc:"Собственное производство в Жетысае. Без наценок посредников — цена завода напрямую вам." },
            { Icon:Clock,  title:"Монтаж за 3 дня", desc:"Профессиональная бригада монтирует 100 м² фасада за 3 рабочих дня с полной гарантией работ." },
            { Icon:Star,   title:"500+ клиентов",   desc:"Сотни реализованных объектов по Казахстану — жилые дома, бизнес-центры, загородные виллы." },
            { Icon:Layers, title:"6 коллекций",     desc:"Кирпич, травертин, бетон, натуральный камень — широкий выбор под любой архитектурный стиль." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="feat p-6" style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div className="feat-icon inline-block mb-4" style={{ color:"#FF7A00" }}><Icon size={26}/></div>
              <h3 className="df font-black text-white text-xl tracking-wide mb-2">{title}</h3>
              <p className="text-white/42 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ CONTACT ══════════════════════════ */}
      <section id="contact" className="py-20 md:py-32 relative overflow-hidden" style={{ background:"#0B0B0B" }}>
        <div className="absolute top-0 right-0 pointer-events-none" style={{
          width:"500px", height:"500px",
          background:"radial-gradient(circle,rgba(255,122,0,0.08) 0%,transparent 70%)",
        }}/>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background:"#FF7A00" }}/>
                <span className="df font-bold text-xs tracking-[0.28em] uppercase" style={{ color:"#FF7A00" }}>Связаться с нами</span>
              </div>
              <h2 className="df font-black text-white leading-none mb-6" style={{ fontSize:"clamp(2.6rem,5.5vw,4rem)", letterSpacing:"-0.01em" }}>
                БЕСПЛАТНАЯ<br/><span style={{ color:"#FF7A00" }}>КОНСУЛЬТАЦИЯ</span><br/>И ЗАМЕР
              </h2>
              <p className="text-white/52 leading-relaxed mb-10 text-sm md:text-base max-w-md">
                Оставьте заявку — наш специалист приедет с образцами материалов, рассчитает стоимость и предложит лучшее решение для вашего дома. Бесплатно.
              </p>
              <div className="flex flex-col gap-4 mb-10">
                {[
                  { href:CONTACTS.phoneHref, icon:<Phone size={16}/>, iconColor:"#FF7A00", border:"rgba(255,122,0,0.22)", bg:"rgba(255,122,0,0.07)", hbg:"rgba(255,122,0,0.16)", title:CONTACTS.phoneDisplay, sub:"Пн–Вс, 08:00–22:00" },
                  { href:whatsappHref, icon:<MessageCircle size={16}/>, iconColor:"#25D366", border:"rgba(37,211,102,0.22)", bg:"rgba(37,211,102,0.07)", hbg:"rgba(37,211,102,0.16)", title:"WhatsApp", sub:"Отвечаем за 5 минут · 24/7" },
                  { href:CONTACTS.instagramHref, icon:<Instagram size={16}/>, iconColor:"#E1306C", border:"rgba(225,48,108,0.22)", bg:"rgba(225,48,108,0.07)", hbg:"rgba(225,48,108,0.16)", title:"Instagram", sub:"@louis_beton_7say" },
                ].map(c => (
                  <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noreferrer" : undefined} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.iconColor }}
                      onMouseOver={e=>(e.currentTarget.style.background=c.hbg)}
                      onMouseOut={e=>(e.currentTarget.style.background=c.bg)}>
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{c.title}</div>
                      <div className="text-white/32 text-xs">{c.sub}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-3" style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"24px" }}>
                {["Без предоплаты","Гарантия договором","Выезд бесплатно"].map(b => (
                  <div key={b} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/42"
                    style={{ border:"1px solid rgba(255,255,255,0.09)" }}>
                    <Check size={10} style={{ color:"#FF7A00" }}/> {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="p-7 md:p-9" style={{ background:"#141414", border:"1px solid rgba(255,255,255,0.07)" }}>
              {formSent ? (
                <div className="flex flex-col items-center justify-center min-h-[340px] gap-5 text-center">
                  <div className="w-16 h-16 flex items-center justify-center"
                    style={{ background:"rgba(255,122,0,0.12)", border:"1px solid rgba(255,122,0,0.28)" }}>
                    <Check size={30} style={{ color:"#FF7A00" }}/>
                  </div>
                  <h3 className="df font-black text-white text-2xl tracking-wide">ЗАЯВКА ПРИНЯТА!</h3>
                  <p className="text-white/42 text-sm max-w-xs leading-relaxed">
                    Мы свяжемся с вами в течение 15 минут и договоримся об удобном времени визита.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {[
                    { key:"name",  label:"Ваше имя",          type:"text", placeholder:"Алибек Джаксыбеков", req:false },
                    { key:"phone", label:"Номер телефона *",   type:"tel",  placeholder:"+7 777 000-00-00",    req:true  },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="df text-white/38 text-[10px] tracking-[0.25em] uppercase block mb-2">{f.label}</label>
                      <input type={f.type} value={formData[f.key as "name"|"phone"]}
                        onChange={e=>setFormData({...formData,[f.key]:e.target.value})}
                        placeholder={f.placeholder} required={f.req}
                        className="w-full text-white text-sm px-4 py-3.5 placeholder:text-white/18 transition-all"
                        style={{ background:"#1C1C1C", border:"1px solid rgba(255,255,255,0.07)" }}/>
                    </div>
                  ))}
                  <div>
                    <label className="df text-white/38 text-[10px] tracking-[0.25em] uppercase block mb-2">Сообщение</label>
                    <textarea value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})}
                      placeholder="Опишите ваш проект или задайте вопрос..." rows={4}
                      className="w-full text-white text-sm px-4 py-3.5 placeholder:text-white/18 transition-all resize-none"
                      style={{ background:"#1C1C1C", border:"1px solid rgba(255,255,255,0.07)" }}/>
                  </div>
                  <button type="submit"
                    className="group w-full text-black font-bold py-4 df tracking-wider text-sm flex items-center justify-center gap-3 transition-colors mt-1"
                    style={{ background:"#FF7A00" }}
                    onMouseOver={e=>(e.currentTarget.style.background="#fff")}
                    onMouseOut={e=>(e.currentTarget.style.background="#FF7A00")}>
                    ВЫЗВАТЬ ЗАМЕРЩИКА С ОБРАЗЦАМИ БЕСПЛАТНО
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
                  <p className="text-white/18 text-xs text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ══════════════════════════ */}
      <footer className="py-8" style={{ background:"#080808", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 flex items-center justify-center" style={{ background:"#FF7A00" }}>
              <span className="df font-black text-[9px] text-black">LB</span>
            </div>
            <span className="df font-black tracking-widest text-sm text-white">LOUIS BETON</span>
          </div>
          <p className="text-white/22 text-xs text-center">© 2026 Louis Beton. Жетысай, Казахстан. Все права защищены.</p>
          <div className="flex gap-5">
            <a href={CONTACTS.phoneHref} className="text-white/22 hover:text-white/55 transition-colors text-xs">{CONTACTS.phoneDisplay}</a>
            <a href={whatsappHref} className="text-white/22 transition-colors text-xs"
              onMouseOver={e=>(e.currentTarget.style.color="#25D366")}
              onMouseOut={e=>(e.currentTarget.style.color="rgba(255,255,255,0.22)")}>WhatsApp</a>
            <a href={CONTACTS.instagramHref} target="_blank" rel="noreferrer" className="text-white/22 transition-colors text-xs"
              onMouseOver={e=>(e.currentTarget.style.color="#E1306C")}
              onMouseOut={e=>(e.currentTarget.style.color="rgba(255,255,255,0.22)")}>Instagram</a>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════ FLOATING WHATSAPP ══════════════════════════ */}
      <a href={whatsappHref}
        className="fixed bottom-5 right-5 z-50 hidden sm:flex items-center gap-2.5 text-white font-semibold text-sm py-3 px-4 transition-all"
        style={{ background:"#25D366", boxShadow:"0 0 30px rgba(37,211,102,0.32),0 4px 20px rgba(0,0,0,0.4)" }}
        onMouseOver={e=>(e.currentTarget.style.background="#1fbd5a")}
        onMouseOut={e=>(e.currentTarget.style.background="#25D366")}>
        <MessageCircle size={19}/>
        <span className="hidden sm:block">Написать в WhatsApp</span>
      </a>

      {/* ══════════════════════════ MOBILE QUICK ORDER ══════════════════════════ */}
      <div className="fixed left-0 right-0 bottom-0 z-[70] sm:hidden px-4 pt-3" style={{
        paddingBottom:"calc(12px + env(safe-area-inset-bottom))",
        background:"rgba(10,10,10,0.96)",
        backdropFilter:"blur(18px)",
        borderTop:"1px solid rgba(255,255,255,0.08)",
        boxShadow:"0 -12px 30px rgba(0,0,0,0.35)",
      }}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center flex-shrink-0" style={{ background:"rgba(255,122,0,0.12)", border:"1px solid rgba(255,122,0,0.28)", color:"#FF7A00" }}>
              <ShoppingCart size={18}/>
            </div>
            <div className="min-w-0">
              <div className="df font-black text-white text-lg tracking-wide leading-none">
                {cartTotalQuantity > 0 ? `В ЗАКАЗЕ: ${cartTotalQuantity}` : "БЫСТРЫЙ ЗАКАЗ"}
              </div>
              <div className="text-white/35 text-xs truncate">
                {cartTotalQuantity > 0 ? "Отправить выбранные товары" : "Написать в WhatsApp"}
              </div>
            </div>
          </div>
          <a href={whatsappHref} className="flex items-center justify-center gap-2 text-white font-bold px-5 py-3.5 df tracking-widest text-sm"
            style={{ background:"#25D366", minWidth:"132px" }}>
            <MessageCircle size={17}/>
            {cartTotalQuantity > 0 ? "ОТПРАВИТЬ" : "НАПИСАТЬ"}
          </a>
        </div>
      </div>

      {selectedProduct && (
        <div className="modal-fade fixed inset-0 z-[80] flex items-center justify-center px-4 py-6" style={{ background:"rgba(0,0,0,0.78)", backdropFilter:"blur(12px)" }}
          onClick={() => setSelectedProduct(null)}>
          <div className="modal-panel relative w-full max-w-5xl max-h-[92svh] overflow-y-auto" style={{ background:"#111", border:"1px solid rgba(255,122,0,0.22)" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} aria-label="Закрыть" className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white transition-colors"
              style={{ background:"rgba(0,0,0,0.45)", border:"1px solid rgba(255,255,255,0.12)" }}
              onMouseOver={e=>(e.currentTarget.style.color="#FF7A00")}
              onMouseOut={e=>(e.currentTarget.style.color="#fff")}>
              <X size={20}/>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[300px] lg:min-h-[520px] bg-[#1A1A1A] overflow-hidden">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.5),transparent 55%)" }}/>
                <div className="absolute left-5 bottom-5 px-3 py-1.5 df font-bold text-xs tracking-wide text-black" style={{ background:selectedProduct.tagBg }}>
                  {selectedProduct.tag}
                </div>
              </div>

              <div className="p-6 md:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8" style={{ background:"#FF7A00" }}/>
                    <span className="df font-bold text-xs tracking-[0.28em] uppercase" style={{ color:"#FF7A00" }}>Подробнее о товаре</span>
                  </div>
                  <h3 className="df font-black text-white leading-none mb-4" style={{ fontSize:"clamp(2.4rem,6vw,4.5rem)" }}>
                    {selectedProduct.name}
                  </h3>
                  <p className="text-white/55 text-sm md:text-base leading-relaxed mb-7">
                    {selectedProduct.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
                    {selectedProduct.specs.map(spec => (
                      <div key={spec} className="p-4" style={{ background:"#181818", border:"1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-white/35 text-xs mb-1">Характеристика</div>
                        <div className="text-white text-sm font-semibold">{spec}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-baseline gap-2 mb-7">
                    <span className="text-white/32 text-sm">Цена от</span>
                    <span className="df font-black text-4xl" style={{ color:"#FF7A00" }}>{selectedProduct.price}</span>
                    <span className="text-white/32 text-sm">₸/м²</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => addToCart(selectedProduct)}
                    className={`order-btn flex-1 flex items-center justify-center gap-2.5 df font-bold text-sm tracking-widest uppercase px-5 py-4 text-black ${addedProductId === selectedProduct.id ? "order-pop" : ""}`}
                    style={{ background: addedProductId === selectedProduct.id ? "#fff" : "#FF7A00" }}>
                    {addedProductId === selectedProduct.id ? <Check size={17}/> : <ShoppingCart size={17}/>}
                    {addedProductId === selectedProduct.id ? "Добавлено" : "Добавить в заказ"}
                  </button>
                  <a href={whatsappHref} className="flex-1 flex items-center justify-center gap-2.5 df font-bold text-sm tracking-widest uppercase px-5 py-4 text-white transition-colors"
                    style={{ background:"#25D366" }}
                    onMouseOver={e=>(e.currentTarget.style.background="#1fbd5a")}
                    onMouseOut={e=>(e.currentTarget.style.background="#25D366")}>
                    <MessageCircle size={17}/> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
