import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Calendar,
  Check,
  Copy,
  Globe,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  X,
} from 'lucide-react';
import { IMPACT_STATS, type Lang } from './data/vyabData';
import {
  EuGlobalGatewayMark,
  FourColorMark,
  FramedPhoto,
  VyabConcentricRings,
  VyabCoralCircles,
  VyabKicker,
  VyabRibbon,
  VyabWordmark,
} from './components/VyabBrandMark';
import { PillarsSection } from './components/PillarsSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { BoothInteractiveSection } from './components/BoothInteractiveSection';
import { YouthPolicyMapSection } from './components/YouthPolicyMapSection';
import { PeopleAndFinaleSection } from './components/PeopleAndFinaleSection';
import {
  AboutPhotoLightbox,
  type AboutGalleryPhoto,
} from './components/AboutPhotoLightbox';

const EASE_BRAND: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ABOUT_GALLERY_PHOTOS: (AboutGalleryPhoto & { borderHex: string })[] = [
  {
    src: '/assets/vyab/event_07_820x546.png',
    altVi: 'Tuần lễ Ngoại giao Xanh EU tại Việt Nam 2024',
    altEn: 'EU Green Diplomacy Weeks 2024 in Viet Nam',
    locationVi: 'Hà Nội',
    locationEn: 'Hanoi',
    dateVi: 'Tháng 12, 2024',
    dateEn: 'December 2024',
    captionVi:
      'Hơn 100 bạn trẻ và đại diện đối tác EU hội tụ với thông điệp #Engage, #Empower, #Connect và #Sustainability hướng tới lực lượng thanh niên xanh.',
    captionEn:
      'Over 100 youth leaders and EU partners gathered under #Engage, #Empower, #Connect, and #Sustainability to advance green skills and climate action.',
    borderHex: '#1CD07A',
  },
  {
    src: '/assets/vyab/event_12_1024x682.png',
    altVi: 'Ngày Châu Âu 2025 — 35 năm quan hệ ngoại giao EU–Việt Nam',
    altEn: 'Europe Day 2025 — 35th Anniversary of EU–Viet Nam Relations',
    locationVi: 'Hà Nội',
    locationEn: 'Hanoi',
    dateVi: 'Tháng 5, 2025',
    dateEn: 'May 2025',
    captionVi:
      'Các thành viên VYAB Khóa 1 cùng Đại sứ EU Julien Guerrier và đại diện các quốc gia thành viên EU trong lễ kỷ niệm Ngày Châu Âu 2025.',
    captionEn:
      'VYAB Cohort 1 members alongside H.E. EU Ambassador Julien Guerrier and European Member State representatives celebrating Europe Day 2025.',
    borderHex: '#FFD014',
  },
  {
    src: '/assets/vyab/event_13_1229x922.png',
    altVi: 'Tập thể thành viên VYAB Khóa 1 trong tà áo dài Việt Nam',
    altEn: 'VYAB Cohort 1 members celebrating Vietnamese heritage',
    locationVi: 'Việt Nam',
    locationEn: 'Viet Nam',
    dateVi: 'Nhiệm kỳ 2024–2026',
    dateEn: '2024–2026 Cohort',
    captionVi:
      'Mạng lưới liên ngành gồm các bạn trẻ từ khắp mọi miền đất nước — cùng nhau kết nối bản sắc Việt Nam với đối thoại chính sách quốc tế.',
    captionEn:
      'A multidisciplinary network of young Vietnamese voices uniting local identity with EU–Viet Nam bilateral policy dialogue.',
    borderHex: '#F04533',
  },
];

const VYAB_STAT_COLORS = ['#00104E', '#F04533', '#15B567', '#1C69C7'];

export default function App() {
  const [lang, setLang] = useState<Lang>('vi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: pageScroll } = useScroll();
  const smoothProgress = useSpring(pageScroll, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(heroScroll, [0, 1], ['0%', '12%']);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('vyab.ysb@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      setCopiedEmail(false);
    }
  };

  const navLinks = [
    { href: '#about', vi: 'Giới thiệu', en: 'About' },
    { href: '#pillars', vi: 'Trụ cột', en: 'Pillars' },
    { href: '#activities', vi: 'Hoạt động', en: 'Activities' },
    { href: '#policy-map', vi: 'Bản đồ', en: 'Policy Map' },
    { href: '#people', vi: 'Gương mặt', en: 'Cohort 1' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#00104E] flex flex-col">
      {/* ==================== STRICT 3-ZONE TOP NAVIGATION BAR ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#00104E]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Official VYAB Wordmark */}
          <a
            href="#top"
            aria-label="VYAB — Vietnam Youth Advisory Board"
            className="inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00104E]"
          >
            <VyabWordmark compact />
          </a>

          {/* Zone 2: 5 Clean Single-Line Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#2A3B6B]"
          >
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-1 hover:text-[#00104E] transition-colors whitespace-nowrap shrink-0 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#FFD014] after:transition-all"
              >
                {lang === 'vi' ? item.vi : item.en}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary CTA Button + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#booth"
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-[#00104E] text-[#FFD014] rounded-lg hover:bg-[#123985] transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'vi' ? 'Tương tác Booth' : 'Visit Booth'}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#00104E] border border-[#00104E]/15 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#00104E]/10 bg-white px-6 py-4 space-y-2">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-[#00104E] border-b border-[#00104E]/8 last:border-b-0"
              >
                {lang === 'vi' ? item.vi : item.en}
              </a>
            ))}
          </div>
        )}

        {/* Official VYAB 4-Color Gradient Progress Bar */}
        <motion.div
          className="h-[3px] origin-left"
          style={{
            scaleX: smoothProgress,
            background: 'linear-gradient(90deg, #F04533 0%, #1C69C7 35%, #FFD014 70%, #1CD07A 100%)',
          }}
          aria-hidden="true"
        />
      </header>

      <main id="top" className="flex-1">
        {/* ==================== HERO: OFFICIAL VYAB MIDNIGHT NAVY + YELLOW RIBBON ==================== */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-[#00104E] text-white"
        >
          {/* Authentic Europe Day 2025 VYAB Photo with Midnight Navy Brand Scrim */}
          <motion.div
            style={{ y: heroImgY }}
            className="absolute inset-0 scale-105 pointer-events-none opacity-25"
            aria-hidden="true"
          >
            <img
              src="/assets/vyab/event_11_1024x683.png"
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          <div
            className="absolute inset-0 bg-gradient-to-br from-[#00104E]/95 via-[#00104E]/82 to-[#000B38]/92 pointer-events-none"
            aria-hidden="true"
          />

          {/* Official VYAB Left Concentric Cobalt Rings + Bottom-Right Twin Coral Circles */}
          <VyabConcentricRings
            className="absolute -left-36 top-1/2 -translate-y-1/2 w-[360px] h-[360px] opacity-65"
            strokeColor="#123985"
          />
          <VyabCoralCircles className="absolute right-6 bottom-0 w-52 sm:w-64 opacity-95" />

          {/* Top Co-Branding Header Band (EU Global Gateway + VYAB) */}
          <div className="relative z-10 bg-white text-[#00104E] border-b border-[#00104E]/10">
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <EuGlobalGatewayMark />
                <span className="h-6 w-px bg-[#00104E]/15" aria-hidden="true" />
                <span className="text-xs font-semibold text-[#2A3B6B] hidden sm:inline">
                  {lang === 'vi'
                    ? 'Khuôn khổ EU Youth Action Plan 2022–2027'
                    : 'EU Youth Action Plan 2022–2027'}
                </span>
              </div>

              {/* Clean Bilingual Switcher */}
              <div className="inline-flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#1C69C7]" aria-hidden="true" />
                <div
                  role="group"
                  aria-label="Language switcher"
                  className="inline-flex items-center p-0.5 bg-[#F4F7FC] border border-[#00104E]/12 rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() => setLang('vi')}
                    aria-pressed={lang === 'vi'}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                      lang === 'vi'
                        ? 'bg-[#00104E] text-[#FFD014]'
                        : 'text-[#3B4E7A] hover:text-[#00104E]'
                    }`}
                  >
                    VI
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    aria-pressed={lang === 'en'}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                      lang === 'en'
                        ? 'bg-[#00104E] text-[#FFD014]'
                        : 'text-[#3B4E7A] hover:text-[#00104E]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Main Content */}
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pt-14 pb-20 md:pt-20 md:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: EASE_BRAND }}
                className="lg:col-span-7"
              >
                {/* Signature VYAB Yellow Swallowtail Ribbon */}
                <div className="mb-6">
                  <VyabRibbon
                    textColor="#F04533"
                    className="text-xs sm:text-sm md:text-base"
                  >
                    {lang === 'vi'
                      ? 'VYAB KHÓA 1 · 2024 – 2026'
                      : 'VYAB 1ST COHORT FINALE · 2024 – 2026'}
                  </VyabRibbon>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.06] text-white mb-4">
                  {lang === 'vi'
                    ? 'Hội đồng Cố vấn Thanh niên Việt Nam'
                    : 'Viet Nam Youth Advisory Board'}
                </h1>

                <p className="font-display text-lg sm:text-2xl font-bold text-[#FFD014] tracking-wide mb-5">
                  Engage · Empower · Connect
                </p>

                <p className="text-[15px] md:text-base text-white/85 leading-relaxed max-w-xl mb-7">
                  {lang === 'vi'
                    ? 'Nền tảng tham vấn chính sách do Phái đoàn Liên minh Châu Âu tại Việt Nam hỗ trợ — kết nối tiếng nói thế hệ trẻ vào hợp tác EU–Việt Nam về khí hậu, phát triển bền vững và y tế.'
                    : 'A consultative platform supported by the EU Delegation to Viet Nam — bringing young Vietnamese voices into EU–Viet Nam cooperation on climate change, sustainability, and health.'}
                </p>

                {/* Event Date & Location in Official VYAB Mint Green */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#1CD07A] mb-8 tabular-nums">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0" />
                    {lang === 'vi'
                      ? 'Thứ Sáu, 27/11/2026 · 16:00–18:00'
                      : 'Friday 27 November 2026 · 16:00–18:00'}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-[#F04533]" />
                    {lang === 'vi'
                      ? 'Sky Garden, Phái đoàn EU tại Hà Nội'
                      : 'Sky Garden, EU Delegation, Ha Noi'}
                  </span>
                </div>

                {/* Single Focal Primary CTA + Quiet Secondary Link */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#booth"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FFD014] text-[#00104E] font-display text-sm font-extrabold rounded-lg hover:bg-[#ffe04d] transition-colors shadow-lg whitespace-nowrap"
                  >
                    <span>
                      {lang === 'vi' ? 'Tham gia Trải nghiệm Booth' : 'Enter Interactive Booth'}
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#policy-map"
                    className="inline-flex items-center gap-2 px-5 py-3.5 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    <span>
                      {lang === 'vi' ? 'Bản đồ Chính sách Trẻ' : 'Youth Policy Map'}
                    </span>
                    <ArrowDown className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>

              {/* Right: Crisp Featured Hero Photo Card with Official VYAB 4-Color Accent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.12, ease: EASE_BRAND }}
                className="lg:col-span-5"
              >
                <div className="relative p-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 shadow-2xl">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                    <img
                      src="/assets/vyab/event_11_1024x683.png"
                      alt={
                        lang === 'vi'
                          ? 'VYAB Khóa 1 cùng Đại sứ Liên minh Châu Âu tại Ngày Châu Âu 2025'
                          : 'VYAB Cohort 1 with the EU Ambassador at Europe Day 2025'
                      }
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 px-2 pb-1 flex items-center justify-between gap-3">
                    <p className="text-xs text-white/85 font-medium">
                      {lang === 'vi'
                        ? 'Ngày Châu Âu 2025 · 35 năm quan hệ EU–Việt Nam'
                        : 'Europe Day 2025 · 35 Years EU–Viet Nam'}
                    </p>
                    <FourColorMark className="shrink-0" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 1: ABOUT VYAB & BY THE NUMBERS ==================== */}
        <section id="about" className="relative bg-white overflow-hidden">
          <VyabConcentricRings
            className="hidden lg:block absolute -right-40 top-52 w-[340px] h-[340px] opacity-90"
            strokeColor="#00104E"
          />

          {/* Top Color-Blocked Navy Band behind the 3 Interactive Lightbox Photos */}
          <div className="relative">
            <div
              className="absolute inset-x-0 top-0 h-[52%] bg-[#00104E]"
              aria-hidden="true"
            />
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pt-8 md:pt-12 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
                {ABOUT_GALLERY_PHOTOS.map((photo, idx) => (
                  <motion.div
                    key={photo.src}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55, delay: idx * 0.08, ease: EASE_BRAND }}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      aria-label={
                        lang === 'vi'
                          ? `Xem ảnh phóng to: ${photo.altVi}`
                          : `View high-resolution photo: ${photo.altEn}`
                      }
                      style={{ borderColor: photo.borderHex }}
                      className="group relative block w-full text-left rounded-2xl overflow-hidden border-[3px] shadow-lg bg-[#00104E] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD014]"
                    >
                      <FramedPhoto
                        src={photo.src}
                        alt={lang === 'vi' ? photo.altVi : photo.altEn}
                        framed={false}
                        className="aspect-[4/3] w-full"
                        imgClassName="group-hover:scale-[1.04]"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#00104E]/90 via-[#00104E]/25 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-end justify-between gap-3 p-4 pointer-events-none"
                        aria-hidden="true"
                      >
                        <div className="min-w-0">
                          <p className="text-[11px] font-mono font-semibold text-[#FFD014] tabular-nums">
                            0{idx + 1} · {lang === 'vi' ? photo.dateVi : photo.dateEn}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5">
                            {lang === 'vi' ? photo.altVi : photo.altEn}
                          </p>
                        </div>
                        <span className="shrink-0 w-8 h-8 rounded-lg bg-[#FFD014] text-[#00104E] flex items-center justify-center">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* High-Resolution Editorial Photo Lightbox Carousel */}
          <AboutPhotoLightbox
            photos={ABOUT_GALLERY_PHOTOS}
            activeIndex={lightboxIndex}
            lang={lang}
            onClose={() => setLightboxIndex(null)}
            onSelectIndex={setLightboxIndex}
          />

          {/* Official "ABOUT VYAB · WHAT IS VYAB?" + "VYAB by the Numbers" (Pages 19 & 39) */}
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pt-10 pb-20 md:pb-24">
            <div className="max-w-3xl mb-16">
              <VyabKicker
                label={lang === 'vi' ? '01 · Về VYAB' : '01 · About VYAB'}
                variant="navy-bar"
                className="mb-5"
              />
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#00104E] tracking-tight leading-[1.08] mb-6">
                {lang === 'vi' ? 'VYAB là ai?' : 'What is VYAB?'}
              </h2>
              <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-[#25355C]">
                <p>
                  {lang === 'vi'
                    ? 'Hội đồng Cố vấn Thanh niên Việt Nam (VYAB) là nền tảng tham vấn dành cho người trẻ Việt Nam đối thoại cùng các nhà hoạch định chính sách Liên minh Châu Âu — đóng góp vào hợp tác EU–Việt Nam về biến đổi khí hậu, phát triển bền vững và y tế.'
                    : 'A consultative platform for young Vietnamese to engage with EU policymakers — contributing to EU–Viet Nam cooperation on climate change, sustainable development, and health, supported by the EU Delegation to Viet Nam.'}
                </p>
                <p>
                  {lang === 'vi'
                    ? 'Được thành lập trong khuôn khổ Kế hoạch Hành động Thanh niên EU 2022–2027 và Lộ trình Gắn kết Thanh niên EU 2024–2027, VYAB phối hợp chặt chẽ cùng Phái đoàn EU tại Việt Nam, Hội đồng Thanh niên EU tại ASEAN (YSBEA), Hội đồng Thanh niên Toàn cầu (GYSB) và các tổ chức thanh niên đối tác.'
                    : 'Established under the EU Youth Action Plan 2022–2027 and the EU Roadmap for Engagement with Youth 2024–2027, VYAB works closely with the EU Delegation to Viet Nam, the Youth Sounding Board for EU in ASEAN (YSBEA), INTPA Global YSB, and partner youth organisations.'}
                </p>
              </div>
            </div>

            {/* VYAB by the Numbers (Honoring Page 19's iconic color-coded giant serif numerals!) */}
            <div className="bg-[#F4F7FC] border border-[#00104E]/10 rounded-2xl p-7 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-[#00104E]/10">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#00104E]">
                  {lang === 'vi' ? 'VYAB qua những con số' : 'VYAB by the Numbers'}
                </h3>
                <FourColorMark />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {IMPACT_STATS.map((stat, idx) => (
                  <motion.div
                    key={stat.value + stat.labelEn}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: idx * 0.08, ease: EASE_BRAND }}
                  >
                    <p
                      className="font-serif text-5xl md:text-6xl font-extrabold tabular-nums leading-none mb-3"
                      style={{ color: VYAB_STAT_COLORS[idx] || '#00104E' }}
                    >
                      {stat.value}
                    </p>
                    <h4 className="font-display text-base font-bold text-[#00104E] mb-1.5">
                      {lang === 'vi' ? stat.labelVi : stat.labelEn}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#42537A]">
                      {lang === 'vi' ? stat.detailVi : stat.detailEn}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: THREE PILLARS & GREEN/DIGITAL ==================== */}
        <PillarsSection lang={lang} />

        {/* ==================== SECTION 3: HIGHLIGHTED ACTIVITIES & TIMELINE ==================== */}
        <ActivitiesSection lang={lang} />

        {/* ==================== SECTION 4: INTERACTIVE BOOTH EXPERIENCE ==================== */}
        <BoothInteractiveSection lang={lang} />

        {/* ==================== SECTION 5: YOUTH POLICY SURVEY & COLLECTIVE MAP ==================== */}
        <YouthPolicyMapSection lang={lang} />

        {/* ==================== SECTION 6: PEOPLE & FINALE AGENDA ==================== */}
        <PeopleAndFinaleSection lang={lang} />

        {/* ==================== CLOSING THANK YOU (HONORING OFFICIAL PAGE 40 HEXAGON DESIGN!) ==================== */}
        <section className="relative bg-white border-t border-[#00104E]/10 overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left: Official VYAB Thank You & Contact Actions */}
              <div className="lg:col-span-6">
                <div className="flex items-center gap-5 mb-8">
                  <EuGlobalGatewayMark />
                  <span className="h-6 w-px bg-[#00104E]/15" aria-hidden="true" />
                  <VyabWordmark compact />
                </div>

                <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#00104E] tracking-tight leading-[1.02] mb-5">
                  {lang === 'vi' ? 'Xin Cảm Ơn' : 'Thank You'}
                </h2>

                <p className="text-base text-[#364770] leading-relaxed max-w-md mb-8">
                  {lang === 'vi'
                    ? 'Cảm ơn bạn đã đồng hành cùng Hội đồng Cố vấn Thanh niên Việt Nam Khóa 1 (2024–2026). Hẹn gặp lại bạn trong hành trình Engage · Empower · Connect tiếp theo.'
                    : 'Thank you for visiting the Vietnam Youth Advisory Board Cohort 1 showcase. Stay connected as we carry Engage, Empower, and Connect forward.'}
                </p>

                {/* Official VYAB Contact Rows (Page 40) */}
                <div className="space-y-3 mb-8">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F4F7FC] border border-[#00104E]/12 text-[#00104E] text-sm font-semibold hover:border-[#1C69C7] transition-colors cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#1C69C7] text-white flex items-center justify-center shrink-0">
                      {copiedEmail ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </span>
                    <span>vyab.ysb@gmail.com</span>
                    <Copy className="w-3.5 h-3.5 text-[#5B6885]" />
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://www.linkedin.com/company/vyab/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00104E] text-white text-sm font-semibold hover:bg-[#123985] transition-colors"
                    >
                      <span>linkedin.com/company/vyab</span>
                      <ArrowUpRight className="w-4 h-4 text-[#FFD014]" />
                    </a>

                    <a
                      href="#booth"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#00104E]/20 text-[#00104E] text-sm font-semibold hover:bg-[#F4F7FC] transition-colors"
                    >
                      <span>{lang === 'vi' ? 'Quay lại Booth' : 'Back to Booth'}</span>
                    </a>
                  </div>
                </div>

                {copiedEmail && (
                  <p className="text-xs font-semibold text-[#15B567] mb-4">
                    {lang === 'vi'
                      ? 'Đã sao chép email vyab.ysb@gmail.com'
                      : 'Copied vyab.ysb@gmail.com to clipboard'}
                  </p>
                )}

                <FourColorMark />
              </div>

              {/* Right: Iconic Page-40 Geometric Hexagon Photo Composition */}
              <div className="lg:col-span-6 relative flex items-center justify-center py-6">
                {/* Decorative Brand Blue & Coral Hexagons echoing Slide 40 */}
                <div
                  className="hidden sm:block absolute -top-2 right-12 w-36 h-40 bg-[#1C69C7] vyab-hex opacity-90"
                  aria-hidden="true"
                />
                <div
                  className="hidden sm:block absolute bottom-6 left-4 w-28 h-32 bg-[#F04533] vyab-hex opacity-95"
                  aria-hidden="true"
                />
                <div
                  className="hidden sm:block absolute -bottom-4 right-4 w-32 h-36 bg-[#FFD014] vyab-hex opacity-90"
                  aria-hidden="true"
                />

                {/* Main Hexagon Community Photo */}
                <div className="relative z-10 w-full max-w-[420px] aspect-[10/11] bg-[#00104E] p-1.5 vyab-hex shadow-2xl">
                  <div className="w-full h-full vyab-hex overflow-hidden bg-[#00104E]">
                    <img
                      src="/assets/vyab/event_13_1229x922.png"
                      alt={lang === 'vi' ? 'Tập thể VYAB Khóa 1' : 'VYAB Cohort 1 Community'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== OFFICIAL VYAB MIDNIGHT NAVY FOOTER ==================== */}
      <footer className="bg-[#00104E] text-white/75 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span className="font-display font-bold text-white">
              Vietnam Youth Advisory Board (VYAB)
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {lang === 'vi'
                ? 'Hỗ trợ bởi Phái đoàn Liên minh Châu Âu tại Việt Nam'
                : 'Supported by the EU Delegation to Viet Nam'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Facebook: Vietnam Youth Advisory Board</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#FFD014] tabular-nums">2024–2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
