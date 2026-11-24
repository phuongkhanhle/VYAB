import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Rocket, ArrowRight } from 'lucide-react';
import { PILLARS, type Lang, type PillarKey } from '../data/vyabData';
import {
  FourColorMark,
  FramedPhoto,
  VyabCoralCircles,
  VyabKicker,
} from './VyabBrandMark';

interface PillarsSectionProps {
  lang: Lang;
}

const EASE_BRAND: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PILLAR_OFFICIAL_STYLE: Record<
  PillarKey,
  { letter: string; circleHex: string; headingHex: string }
> = {
  engage: { letter: 'E', circleHex: '#F04533', headingHex: '#1C69C7' },
  empower: { letter: 'E', circleHex: '#1C69C7', headingHex: '#F04533' },
  connect: { letter: 'C', circleHex: '#1CD07A', headingHex: '#15B567' },
};

export function PillarsSection({ lang }: PillarsSectionProps) {
  const [activePillar, setActivePillar] = useState<PillarKey>('engage');
  const current = PILLARS.find((p) => p.key === activePillar) || PILLARS[0];
  const currentStyle = PILLAR_OFFICIAL_STYLE[current.key];

  return (
    <section
      id="pillars"
      className="vy-edge-left relative bg-white overflow-hidden"
    >
      <VyabCoralCircles className="hidden lg:block absolute right-8 bottom-0 w-48 opacity-85" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
        {/* Heading + Interactive 3-Pillar Selector (Honoring Page 23 E·E·C circles) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-6">
            <VyabKicker
              label={
                lang === 'vi'
                  ? '02 · Kế hoạch Hành động Thanh niên EU'
                  : '02 · EU Youth Action Plan'
              }
              variant="light"
              className="mb-4"
            />
            <h2 className="vy-title font-display text-4xl md:text-5xl font-extrabold text-[#00104E] tracking-tight leading-[1.08]">
              {lang === 'vi'
                ? '3 trụ cột hành động & khuyến nghị'
                : '3 pillars of the EU Youth Action Plan'}
            </h2>
          </div>

          <div className="lg:col-span-6 lg:flex lg:justify-end">
            <div
              role="tablist"
              aria-label={lang === 'vi' ? 'Chọn trụ cột hành động' : 'Select action pillar'}
              className="inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1.5 bg-white border border-[#00104E]/12 rounded-xl"
            >
              {PILLARS.map((pillar) => {
                const isSelected = pillar.key === activePillar;
                const st = PILLAR_OFFICIAL_STYLE[pillar.key];
                return (
                  <button
                    key={pillar.key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActivePillar(pillar.key)}
                    className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#00104E] text-white'
                        : 'text-[#364770] hover:text-[#00104E] hover:bg-[#F4F7FC]'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
                      style={{ backgroundColor: st.circleHex }}
                      aria-hidden="true"
                    >
                      {st.letter}
                    </span>
                    <span>{lang === 'vi' ? pillar.nameVi : pillar.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Pillar Recommendations Card (Honoring Pages 24–26!) */}
        <div className="bg-white border border-[#00104E]/10 rounded-2xl p-7 sm:p-10 md:p-12 mb-16 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_BRAND }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3.5 mb-5">
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl font-extrabold text-white shrink-0"
                    style={{ backgroundColor: currentStyle.circleHex }}
                    aria-hidden="true"
                  >
                    {currentStyle.letter}
                  </span>
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#5B6885] tabular-nums">
                      {lang === 'vi' ? `Trụ cột ${current.index}` : `Pillar ${current.index}`}
                    </p>
                    <p className="text-xs font-semibold text-[#00104E]">
                      EU Youth Action Plan 2022–2027
                    </p>
                  </div>
                </div>

                <h3
                  className="font-serif text-4xl sm:text-5xl font-extrabold leading-none mb-4"
                  style={{ color: currentStyle.headingHex }}
                >
                  {lang === 'vi' ? current.nameVi : current.nameEn}
                </h3>

                <p className="text-base font-bold text-[#00104E] leading-snug mb-3">
                  {lang === 'vi' ? current.taglineVi : current.taglineEn}
                </p>

                <p className="text-sm text-[#364770] leading-relaxed">
                  {lang === 'vi' ? current.descriptionVi : current.descriptionEn}
                </p>
              </div>

              <div className="lg:col-span-7 lg:pl-8 lg:border-l border-[#00104E]/10">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-display text-sm font-bold text-[#00104E]">
                    {lang === 'vi'
                      ? 'Khuyến nghị từ Báo cáo Nhiệm kỳ VYAB (2024–2026)'
                      : 'Recommendations — VYAB Inaugural Report (2024–2026)'}
                  </p>
                  <FourColorMark />
                </div>

                <ul className="divide-y divide-[#00104E]/10">
                  {(lang === 'vi' ? current.recommendationsVi : current.recommendationsEn).map(
                    (rec, i) => (
                      <li
                        key={i}
                        className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 text-[15px] text-[#00104E] leading-relaxed"
                      >
                        <span
                          className="font-mono text-xs font-bold mt-1 tabular-nums shrink-0"
                          style={{ color: currentStyle.headingHex }}
                        >
                          0{i + 1}
                        </span>
                        <span>{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PRIORITY AREA 1: GREEN & DIGITAL (Directly honoring PDF Pages 29–30!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <VyabKicker
                label={lang === 'vi' ? 'Lĩnh vực ưu tiên 1' : 'Priority Area 1'}
                variant="navy-bar"
                className="mb-4"
              />
              <h3 className="font-display text-3xl md:text-4xl font-extrabold text-[#00104E] tracking-tight leading-[1.08] mb-6">
                {lang === 'vi'
                  ? 'GREEN & DIGITAL — Chuyển đổi Xanh & Số hóa'
                  : 'GREEN & DIGITAL'}
              </h3>

              <div className="space-y-6">
                <div className="pb-5 border-b border-[#00104E]/12">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-display text-base font-extrabold text-[#F04533] tabular-nums">
                      01
                    </span>
                    <Leaf className="w-4 h-4 text-[#15B567]" />
                    <h4 className="font-display text-base font-bold text-[#00104E]">
                      {lang === 'vi'
                        ? 'Đầu tư đào tạo Kỹ năng Xanh'
                        : 'Invest in Green Skills Training'}
                    </h4>
                  </div>
                  <p className="text-sm text-[#364770] leading-relaxed">
                    {lang === 'vi'
                      ? 'Mở rộng các chương trình thực hành về năng lượng tái tạo, kinh tế tuần hoàn và nông nghiệp bền vững cho sinh viên và lao động trẻ.'
                      : 'Expand programmes in renewable energy, circular economy, and sustainable agriculture tailored for Vietnamese youth.'}
                  </p>
                </div>

                <div className="pb-5 border-b border-[#00104E]/12">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-display text-base font-extrabold text-[#F04533] tabular-nums">
                      02
                    </span>
                    <Rocket className="w-4 h-4 text-[#1C69C7]" />
                    <h4 className="font-display text-base font-bold text-[#00104E]">
                      {lang === 'vi'
                        ? 'Tăng tốc Khởi nghiệp Xanh của Thanh niên'
                        : 'Accelerate Youth Entrepreneurship'}
                    </h4>
                  </div>
                  <p className="text-sm text-[#364770] leading-relaxed">
                    {lang === 'vi'
                      ? 'Mở rộng tăng tốc việc làm xanh dưới sáng kiến Global Gateway với lộ trình riêng cho doanh nghiệp xanh do thanh niên dẫn dắt, cố vấn và tài chính xanh.'
                      : 'Expand green job acceleration under Global Gateway with dedicated tracks for youth-led green enterprises, mentorship, and green finance access.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="#policy-map"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#00104E] hover:text-[#1C69C7] transition-colors group"
              >
                <span>
                  {lang === 'vi'
                    ? 'Đóng góp ý kiến vào Bản đồ Chính sách Thanh niên'
                    : 'Contribute to the Youth Policy Map'}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Framed Photos with Official Page-30 Emerald & Yellow Accent Borders */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border-[3px] border-[#1CD07A] shadow-md bg-white">
              <FramedPhoto
                src="/assets/vyab/event_08_800x600.png"
                alt="Empowering Youth for a Sustainable Mekong Delta"
                framed={false}
                className="aspect-[4/3] sm:aspect-auto sm:h-full"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border-[3px] border-[#FFD014] shadow-md bg-white">
              <FramedPhoto
                src="/assets/vyab/event_07_820x546.png"
                alt="EU Green Diplomacy Weeks 2024 in Vietnam"
                framed={false}
                className="aspect-[4/3] sm:aspect-auto sm:h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
