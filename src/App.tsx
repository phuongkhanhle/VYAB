import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Calendar,
  Check,
  Copy,
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

const JOURNEY_LABELS = [
  { vi: 'Xanh & bền vững', en: 'Green & sustainable' },
  { vi: '35 năm EU–Việt Nam', en: '35 years EU–Viet Nam' },
  { vi: 'Bản sắc & kết nối', en: 'Identity & connection' },
];

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

  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en);

  const langSwitch = (
    <div
      role="group"
      aria-label="Language switcher"
      className="inline-flex items-center p-0.5 bg-[#F2F4F9] border border-[#010C44]/20 rounded-full"
    >
      {(['vi', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-colors cursor-pointer ${
            lang === code ? 'bg-[#010C44] text-white' : 'text-[#010C44]/70 hover:text-[#010C44]'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-[#00104E] flex flex-col">
      {/* ==================== TOP NAVIGATION ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#010C44]/10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <a
            href="#top"
            aria-label="VYAB — Vietnam Youth Advisory Board"
            className="inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#010C44]"
          >
            <VyabWordmark compact />
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 font-display text-[17px] font-extrabold uppercase tracking-[0.04em] text-[#010C44]/75"
          >
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-1 hover:text-[#010C44] transition-colors whitespace-nowrap after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:w-0 hover:after:w-full after:bg-[#010C44] after:transition-all"
              >
                {t(item.vi, item.en)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="hidden sm:inline-flex">{langSwitch}</span>
            <a
              href="#booth"
              className="px-4 py-2 font-display text-sm sm:text-base font-extrabold uppercase tracking-[0.04em] bg-[#010C44] text-white rounded-full hover:bg-[#072A6A] transition-colors whitespace-nowrap"
            >
              {t('Tương tác Booth', 'Visit Booth')}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#010C44] border border-[#010C44]/20 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#010C44]/10 bg-white px-6 py-4 space-y-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-display text-lg font-extrabold uppercase tracking-[0.04em] text-[#010C44] border-b border-[#010C44]/10 last:border-b-0"
              >
                {t(item.vi, item.en)}
              </a>
            ))}
            <div className="pt-3 sm:hidden">{langSwitch}</div>
          </div>
        )}

        <motion.div
          className="h-[3px] origin-left bg-[#010C44]"
          style={{ scaleX: smoothProgress }}
          aria-hidden="true"
        />
      </header>

      <main id="top" className="flex-1">
        {/* Crimson title tag, like the board's label */}
        <div className="flex justify-center px-4 pt-8 sm:pt-10">
          <p className="inline-block bg-[#EF3E38] text-white font-display text-lg sm:text-2xl font-extrabold uppercase tracking-[0.06em] px-6 sm:px-10 py-2.5 shadow-md text-center">
            {t('Hội đồng Cố vấn Thanh niên Việt Nam', 'Viet Nam Youth Advisory Board')}
          </p>
        </div>

        {/* ==================== HERO: GIANT WORDMARK OVER PHOTO ==================== */}
        <section
          ref={heroRef}
          className="vy-hero text-white bg-[#010C44] !mt-6 sm:!mt-8"
          aria-labelledby="hero-title"
        >
          <motion.div
            style={{ y: heroImgY }}
            className="absolute inset-0 scale-110 pointer-events-none"
            aria-hidden="true"
          >
            <img
              src="/assets/vyab/event_12_1024x682.png"
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_35%]"
            />
          </motion.div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#010C44]/90 via-[#010C44]/60 to-[#010C44]/90 pointer-events-none"
            aria-hidden="true"
          />
          <VyabConcentricRings
            className="absolute -right-24 -top-24 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] opacity-90 pointer-events-none"
            strokeColor="#072A6A"
          />
          <VyabCoralCircles className="absolute right-6 bottom-0 w-40 sm:w-56 pointer-events-none" />

          <div className="relative z-10 px-5 sm:px-10 md:px-14 pt-7 sm:pt-10 pb-10 sm:pb-14 min-h-[520px] sm:min-h-[600px] flex flex-col">
            {/* Corner labels */}
            <div className="flex items-start justify-between gap-4 text-[11px] sm:text-sm font-semibold">
              <p className="max-w-[46%]">
                {t('Cẩm nang hành trình', 'A journey guide')}
                <span className="block text-white/75 font-normal">
                  {t('Khóa 1 · 2024 – 2026', 'Cohort 1 · 2024 – 2026')}
                </span>
              </p>
              <p className="text-right max-w-[46%]">
                {t('Phái đoàn EU tại Việt Nam', 'EU Delegation to Viet Nam')}
                <span className="block text-white/75 font-normal">EU Youth Action Plan</span>
              </p>
            </div>

            {/* Giant wordmark */}
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_BRAND }}
              className="font-display font-black uppercase leading-[0.8] text-center mt-auto pt-10 select-none"
            >
              <span className="sr-only">
                {t(
                  'VYAB — Hội đồng Cố vấn Thanh niên Việt Nam',
                  'VYAB — Viet Nam Youth Advisory Board',
                )}
              </span>
              <span
                aria-hidden="true"
                className="flex items-end justify-center gap-[1vw] text-[34vw] sm:text-[26vw] lg:text-[300px] drop-shadow-[0_6px_30px_rgba(1,12,68,0.45)]"
              >
                <span className="text-[#EF3E38]">V</span>
                <span className="text-[#2573BE] mr-[4vw] lg:mr-14">Y</span>
                <span className="text-[#FFCD0E]">A</span>
                <span className="text-[#23CC83]">B</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-display text-center text-xl sm:text-3xl font-extrabold uppercase tracking-[0.12em] mt-4"
            >
              Engage · Empower · Connect
            </motion.p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-white/90 tabular-nums">
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0 text-[#FFD014]" />
                {t('Thứ Sáu, 27/11/2026 · 16:00–18:00', 'Friday 27 November 2026 · 16:00–18:00')}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#FFD014]" />
                {t('Sky Garden, Phái đoàn EU tại Hà Nội', 'Sky Garden, EU Delegation, Ha Noi')}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#booth"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#010C44] font-display text-base sm:text-lg font-extrabold uppercase tracking-[0.05em] rounded-full hover:bg-[#FFD014] hover:text-[#00104E] transition-colors shadow-lg"
              >
                {t('Tham gia Booth', 'Enter the Booth')}
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/60 text-white font-display text-base sm:text-lg font-extrabold uppercase tracking-[0.05em] rounded-full hover:bg-white/10 transition-colors"
              >
                {t('Khám phá hành trình', 'Explore the journey')}
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ==================== JOURNEY: 01 · 02 · 03 ==================== */}
        <section id="journey" className="bg-white">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10 py-14 md:py-20">
            <h2 className="vy-title text-center mb-10 md:mb-12">
              {t('Hành trình kết nối xuyên Việt', 'A journey across Viet Nam')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {ABOUT_GALLERY_PHOTOS.map((photo, idx) => (
                <motion.div
                  key={photo.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: idx * 0.08, ease: EASE_BRAND }}
                  className="text-center"
                >
                  <p className="font-display text-3xl font-black text-[#EF3E38] text-left mb-2 tabular-nums">
                    0{idx + 1}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={t(
                      `Xem ảnh phóng to: ${photo.altVi}`,
                      `View high-resolution photo: ${photo.altEn}`,
                    )}
                    className="group relative block w-full overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#010C44]"
                  >
                    <FramedPhoto
                      src={photo.src}
                      alt={t(photo.altVi, photo.altEn)}
                      framed={false}
                      className="aspect-[4/3] w-full"
                      imgClassName="group-hover:scale-[1.05]"
                    />
                    <span
                      className="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-white text-[#010C44] flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                      aria-hidden="true"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </button>
                  <h3 className="font-display text-xl font-extrabold text-[#010C44] mt-4 mb-1.5">
                    {t(JOURNEY_LABELS[idx].vi, JOURNEY_LABELS[idx].en)}
                  </h3>
                  <p className="text-sm text-[#42537A] leading-relaxed max-w-[30ch] mx-auto">
                    {t(photo.altVi, photo.altEn)} · {t(photo.dateVi, photo.dateEn)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <AboutPhotoLightbox
            photos={ABOUT_GALLERY_PHOTOS}
            activeIndex={lightboxIndex}
            lang={lang}
            onClose={() => setLightboxIndex(null)}
            onSelectIndex={setLightboxIndex}
          />
        </section>

        {/* ==================== ABOUT: GIỚI THIỆU CHUNG ==================== */}
        <section id="about" className="vy-edge-right bg-white">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              <div className="lg:col-span-6">
                <h2 className="vy-title mb-8">{t('Giới thiệu chung', 'About VYAB')}</h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-[#25355C] max-w-xl">
                  <p>
                    {t(
                      'Hội đồng Cố vấn Thanh niên Việt Nam (VYAB) là nền tảng tham vấn dành cho người trẻ Việt Nam đối thoại cùng các nhà hoạch định chính sách Liên minh Châu Âu — đóng góp vào hợp tác EU–Việt Nam về biến đổi khí hậu, phát triển bền vững và y tế.',
                      'A consultative platform for young Vietnamese to engage with EU policymakers — contributing to EU–Viet Nam cooperation on climate change, sustainable development, and health, supported by the EU Delegation to Viet Nam.',
                    )}
                  </p>
                  <p>
                    {t(
                      'Được thành lập trong khuôn khổ Kế hoạch Hành động Thanh niên EU 2022–2027 và Lộ trình Gắn kết Thanh niên EU 2024–2027, VYAB phối hợp chặt chẽ cùng Phái đoàn EU tại Việt Nam, Hội đồng Thanh niên EU tại ASEAN (YSBEA), Hội đồng Thanh niên Toàn cầu (GYSB) và các tổ chức thanh niên đối tác.',
                      'Established under the EU Youth Action Plan 2022–2027 and the EU Roadmap for Engagement with Youth 2024–2027, VYAB works closely with the EU Delegation to Viet Nam, the Youth Sounding Board for EU in ASEAN (YSBEA), INTPA Global YSB, and partner youth organisations.',
                    )}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <EuGlobalGatewayMark />
                  <span className="h-6 w-px bg-[#00104E]/15" aria-hidden="true" />
                  <FourColorMark />
                </div>
              </div>

              {/* Collage: tall photo on a royal block + overlapping landscape photo */}
              <div className="lg:col-span-6 relative min-h-[420px] sm:min-h-[480px]">
                <div
                  className="absolute right-0 top-0 w-[62%] h-[78%] bg-[#010C44] rounded-r-xl translate-x-3 -translate-y-3"
                  aria-hidden="true"
                />
                <motion.img
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: EASE_BRAND }}
                  src="/assets/vyab/event_11_1024x683.png"
                  alt={t(
                    'VYAB Khóa 1 cùng Đại sứ Liên minh Châu Âu tại Ngày Châu Âu 2025',
                    'VYAB Cohort 1 with the EU Ambassador at Europe Day 2025',
                  )}
                  referrerPolicy="no-referrer"
                  className="absolute right-0 top-0 w-[62%] h-[78%] object-cover"
                />
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.12, ease: EASE_BRAND }}
                  src="/assets/vyab/photo_03_767x332.jpg"
                  alt={t(
                    'Tọa đàm Hành trình Xanh cùng sinh viên',
                    'Green Pathways dialogue with students',
                  )}
                  referrerPolicy="no-referrer"
                  className="absolute left-0 bottom-0 w-[64%] aspect-[16/10] object-cover border-[6px] border-white shadow-xl"
                />
              </div>
            </div>

            {/* By the numbers */}
            <div className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#010C44]/15 border border-[#010C44]/15">
              {IMPACT_STATS.map((stat, idx) => (
                <motion.div
                  key={stat.value + stat.labelEn}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: EASE_BRAND }}
                  className="bg-white p-5 sm:p-7"
                >
                  <p className="font-display text-6xl md:text-7xl font-black text-[#010C44] leading-none mb-3 tabular-nums">
                    {stat.value}
                  </p>
                  <h3 className="font-display text-lg font-extrabold text-[#00104E] mb-1.5">
                    {t(stat.labelVi, stat.labelEn)}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#42537A]">
                    {t(stat.detailVi, stat.detailEn)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <PillarsSection lang={lang} />
        <ActivitiesSection lang={lang} />
        <BoothInteractiveSection lang={lang} />
        <YouthPolicyMapSection lang={lang} />
        <PeopleAndFinaleSection lang={lang} />

        {/* ==================== CLOSING: XIN CẢM ƠN ==================== */}
        <section className="vy-edge-left bg-white">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Photo collage with a royal text box overlapping, like the region slides */}
              <div className="lg:col-span-6 relative order-2 lg:order-1 min-h-[400px] sm:min-h-[460px]">
                <img
                  src="/assets/vyab/event_13_1229x922.png"
                  alt={t('Tập thể VYAB Khóa 1', 'VYAB Cohort 1 Community')}
                  referrerPolicy="no-referrer"
                  className="absolute left-0 top-0 w-[78%] h-[72%] object-cover"
                />
                <img
                  src="/assets/vyab/event_07_820x546.png"
                  alt={t('Tuần lễ Ngoại giao Xanh EU 2024', 'EU Green Diplomacy Weeks 2024')}
                  referrerPolicy="no-referrer"
                  className="absolute right-0 bottom-0 w-[52%] aspect-[4/3] object-cover border-[6px] border-white shadow-xl"
                />
                <p className="absolute left-4 sm:left-8 bottom-6 sm:bottom-10 w-[46%] bg-[#010C44] text-white text-xs sm:text-[13px] leading-relaxed p-4 shadow-lg">
                  {t(
                    'Một mạng lưới liên ngành gồm các bạn trẻ từ khắp mọi miền — kết nối bản sắc Việt Nam với đối thoại chính sách quốc tế.',
                    'A multidisciplinary network of young voices from every region — linking Vietnamese identity with international policy dialogue.',
                  )}
                </p>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <h2 className="vy-title !text-[clamp(3.5rem,10vw,7.5rem)] mb-2">
                  {t('Xin cảm ơn', 'Thank you')}
                </h2>
                <p className="vy-label text-xl sm:text-2xl mb-6">
                  {t('Hẹn gặp lại trên hành trình mới', 'See you on the next journey')}
                </p>
                <p className="text-[15px] text-[#364770] leading-relaxed max-w-md mb-8">
                  {t(
                    'Cảm ơn bạn đã đồng hành cùng Hội đồng Cố vấn Thanh niên Việt Nam Khóa 1 (2024–2026). Hẹn gặp lại bạn trong hành trình Engage · Empower · Connect tiếp theo.',
                    'Thank you for visiting the Vietnam Youth Advisory Board Cohort 1 showcase. Stay connected as we carry Engage, Empower, and Connect forward.',
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-[#F2F4F9] border border-[#010C44]/20 text-[#00104E] text-sm font-semibold hover:border-[#010C44] transition-colors cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#010C44] text-white flex items-center justify-center shrink-0">
                      {copiedEmail ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </span>
                    <span>vyab.ysb@gmail.com</span>
                    <Copy className="w-3.5 h-3.5 text-[#5B6885]" />
                  </button>
                  <a
                    href="https://www.linkedin.com/company/vyab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#010C44] text-white text-sm font-semibold hover:bg-[#072A6A] transition-colors"
                  >
                    LinkedIn
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                <p
                  className={`text-xs font-semibold text-[#15B567] mt-3 h-4 transition-opacity ${
                    copiedEmail ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-live="polite"
                >
                  {copiedEmail
                    ? t('Đã sao chép email vyab.ysb@gmail.com', 'Copied vyab.ysb@gmail.com to clipboard')
                    : ''}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER BAND ==================== */}
      <footer className="px-3 sm:px-6 pb-8">
        <div className="max-w-[1240px] mx-auto bg-[#010C44] text-white px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-xl sm:text-2xl font-extrabold tracking-[0.03em]">
            @vyab · Vietnam Youth Advisory Board
          </p>
          <FourColorMark className="hidden md:inline-flex" />
          <p className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-[0.03em] text-center sm:text-right">
            {t('Chủ đề', 'Topic')}: Engage · Empower · Connect
          </p>
        </div>
        <p className="max-w-[1240px] mx-auto text-center text-xs text-[#42537A] mt-4">
          Vietnam Youth Advisory Board (VYAB) ·{' '}
          {t(
            'Hỗ trợ bởi Phái đoàn Liên minh Châu Âu tại Việt Nam',
            'Supported by the EU Delegation to Viet Nam',
          )}{' '}
          · 2024–2026
        </p>
      </footer>
    </div>
  );
}
