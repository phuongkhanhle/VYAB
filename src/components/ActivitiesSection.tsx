import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, MapPin, Calendar, Users, X, Globe2 } from 'lucide-react';
import {
  FEATURED_ACTIVITIES,
  MILESTONES,
  type FeaturedActivity,
  type Lang,
  type PillarKey,
} from '../data/vyabData';
import {
  FramedPhoto,
  FourColorMark,
  VyabConcentricRings,
  VyabKicker,
} from './VyabBrandMark';

interface ActivitiesSectionProps {
  lang: Lang;
}

const PILLAR_LABELS: Record<PillarKey, { vi: string; en: string; color: string }> = {
  engage: { vi: 'Gắn kết', en: 'Engage', color: '#F04533' },
  empower: { vi: 'Trao quyền', en: 'Empower', color: '#1C69C7' },
  connect: { vi: 'Kết nối', en: 'Connect', color: '#15B567' },
};

const CITY_BORDER_COLORS = ['#1C69C7', '#FFD014', '#1CD07A'];
const EASE_BRAND: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ActivitiesSection({ lang }: ActivitiesSectionProps) {
  const [selectedActivity, setSelectedActivity] = useState<FeaturedActivity | null>(null);
  const [scopeFilter, setScopeFilter] = useState<'all' | 'domestic' | 'international'>('all');

  const filteredMilestones = MILESTONES.filter((m) =>
    scopeFilter === 'all' ? true : m.scope === scopeFilter
  );

  return (
    <section id="activities" className="vy-edge-right bg-white">
      {/* PART A: 3-City Green Career Showcase */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: EASE_BRAND }}
            className="lg:col-span-6"
          >
            <VyabKicker
              label={
                lang === 'vi'
                  ? '03 · Hoạt động nổi bật · 2024–2026'
                  : '03 · Highlighted Activities · 2024–2026'
              }
              variant="light"
              className="mb-4"
            />
            <h2 className="vy-title font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[#00104E] leading-[1.08]">
              {lang === 'vi'
                ? 'Dấu ấn ba miền trên hành trình xanh'
                : 'Three regions united on greener pathways'}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE_BRAND }}
            className="lg:col-span-6"
          >
            <p className="text-[15px] md:text-base leading-relaxed text-[#364770] max-w-xl">
              {lang === 'vi'
                ? 'Hơn 300 lượt thanh niên, sinh viên và nhà sáng lập đã tham gia chuỗi đối thoại việc làm xanh của VYAB từ Hà Nội đến Cần Thơ và Đà Nẵng. Nhấn vào từng điểm dừng chân để khám phá chi tiết.'
                : 'More than 300 young leaders, university students, and green entrepreneurs joined VYAB flagship dialogues from Hanoi to Can Tho and Da Nang. Select any city frame to explore.'}
            </p>
          </motion.div>
        </div>

        {/* Stepped 3-City Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8 items-start">
          {FEATURED_ACTIVITIES.map((item, idx) => {
            const stepOffset =
              idx === 0 ? 'md:mt-12' : idx === 1 ? 'md:mt-6' : 'md:mt-0';

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE_BRAND }}
                className={`group ${stepOffset}`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedActivity(item)}
                  className="w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00104E] cursor-pointer"
                >
                  <div
                    className="aspect-[16/10] w-full mb-4 rounded-2xl overflow-hidden border-[3px] shadow-md bg-[#00104E]/5"
                    style={{ borderColor: CITY_BORDER_COLORS[idx] }}
                  >
                    <FramedPhoto
                      src={item.image}
                      alt={lang === 'vi' ? item.programVi : item.programEn}
                      framed={false}
                      className="w-full h-full"
                      imgClassName="group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-[#00104E]/12 pb-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-[#5B6885] mb-1">
                        {lang === 'vi'
                          ? `${item.cityVi} · ${item.dateVi}`
                          : `${item.cityEn} · ${item.dateEn}`}
                      </p>
                      <h3 className="font-display text-xl font-bold text-[#00104E] group-hover:text-[#1C69C7] transition-colors leading-snug">
                        {lang === 'vi' ? item.programVi : item.programEn}
                      </h3>
                    </div>
                    <span
                      className="shrink-0 w-9 h-9 rounded-full bg-[#F4F7FC] border border-[#00104E]/15 flex items-center justify-center text-[#00104E] group-hover:bg-[#00104E] group-hover:text-[#FFD014] transition-colors"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <p className="text-sm text-[#364770] leading-relaxed line-clamp-3">
                    {lang === 'vi' ? item.summaryVi : item.summaryEn}
                  </p>
                  <p className="mt-2.5 text-xs font-bold text-[#15B567] tabular-nums">
                    {lang === 'vi' ? item.attendeesVi : item.attendeesEn}
                  </p>
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* PART B: Official Page-22 Midnight Navy Policy Dialogue + Page-20/21 Key Milestones */}
      <div className="border-t border-[#00104E]/10 bg-[#F4F7FC]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Page-22 Midnight Navy EU Policy Dialogue Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: EASE_BRAND }}
              className="lg:col-span-5 lg:sticky lg:top-24 bg-[#00104E] text-white rounded-2xl p-7 sm:p-8 relative overflow-hidden shadow-lg"
            >
              <VyabConcentricRings
                className="absolute -right-28 -top-24 w-64 h-64 opacity-45"
                strokeColor="#123985"
              />

              <div className="relative z-10">
                <VyabKicker
                  label={
                    lang === 'vi'
                      ? 'Đóng góp Chính sách EU'
                      : 'Contribution to EU Policy'
                  }
                  variant="on-dark"
                  className="mb-4"
                />

                <h2 className="vy-title font-display text-3xl font-extrabold text-white leading-[1.12] mb-5">
                  {lang === 'vi'
                    ? 'Từ Việt Nam tới đối thoại Brussels'
                    : "VYAB's Contribution to EU Policy Dialogue"}
                </h2>

                {/* Highlighted Official Metrics from Page 22 */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/15 mb-5">
                  <div>
                    <p className="font-display text-4xl font-extrabold text-[#FFD014] tabular-nums">
                      03
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                      {lang === 'vi'
                        ? 'Thành phố đối thoại quốc tế'
                        : 'International policy cities'}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#FFD014] tabular-nums pt-1">
                      2026–2028
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                      {lang === 'vi'
                        ? 'Nhiệm kỳ Global YSB (25 thành viên)'
                        : 'Global YSB Mandate (25 members)'}
                    </p>
                  </div>
                </div>

                {/* 3 International Cities List (Page 22 gold subheadings) */}
                <div className="space-y-3.5 text-xs sm:text-sm mb-6">
                  <div>
                    <p className="font-display font-bold text-[#FFD014]">Brussels</p>
                    <p className="text-white/80 leading-relaxed">
                      {lang === 'vi'
                        ? 'Đóng góp góc nhìn thanh niên Việt Nam vào khuyến nghị Global Gateway và Đối thoại Chính sách Thanh niên.'
                        : 'Contributed Vietnamese youth perspectives to Global Gateway youth recommendations.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-display font-bold text-[#FFD014]">Kuala Lumpur</p>
                    <p className="text-white/80 leading-relaxed">
                      {lang === 'vi'
                        ? 'Đồng soạn thảo tuyên bố thanh niên khu vực về kỹ năng xanh và trao đổi học thuật.'
                        : 'Helped draft a regional youth statement on green skills and academic mobility.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-display font-bold text-[#FFD014]">Manila</p>
                    <p className="text-white/80 leading-relaxed">
                      {lang === 'vi'
                        ? 'Đưa thực tiễn Cần Thơ và Đà Nẵng vào đàm phán ASEAN–EU về giáo dục đại học & kinh tế biển xanh.'
                        : 'Brought insights from Can Tho & Da Nang into ASEAN–EU talks on higher education and blue economy.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-white/20 mb-4">
                  <FramedPhoto
                    src="assets/vyab/event_05_544x640.png"
                    alt="INTPA Global Youth Sounding Board"
                    framed={false}
                    className="aspect-[5/4] w-full"
                  />
                </div>
                <p className="text-xs text-white/75 flex items-center gap-2">
                  <Globe2 className="w-3.5 h-3.5 text-[#1CD07A] shrink-0" />
                  <span>
                    {lang === 'vi'
                      ? 'Phó Chủ tịch VYAB Huỳnh Gia Bảo — Thành viên Ban Điều hành INTPA Global YSB.'
                      : 'VYAB VP Huynh Gia Bao — Steering Committee, INTPA Global YSB.'}
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Right Column: Official Key Milestones 2024–2026 Timeline */}
            <div className="lg:col-span-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#00104E]/12 mb-2">
                <div>
                  <VyabKicker
                    label={lang === 'vi' ? 'Key Milestones' : 'Key Milestones'}
                    variant="light"
                    className="mb-2"
                  />
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#00104E]">
                    {lang === 'vi' ? 'Cột mốc nổi bật 2024–2026' : 'Highlights 2024–2026'}
                  </h3>
                </div>

                {/* Clean Segmented Filter Control */}
                <div
                  role="tablist"
                  aria-label={lang === 'vi' ? 'Lọc cột mốc theo phạm vi' : 'Filter milestones'}
                  className="inline-flex items-center p-1 bg-white border border-[#00104E]/12 rounded-xl self-start"
                >
                  {(
                    [
                      { key: 'all', vi: 'Tất cả', en: 'All' },
                      { key: 'domestic', vi: 'Việt Nam', en: 'Viet Nam' },
                      { key: 'international', vi: 'Quốc tế', en: 'Global' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={scopeFilter === tab.key}
                      onClick={() => setScopeFilter(tab.key)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        scopeFilter === tab.key
                          ? 'bg-[#00104E] text-[#FFD014]'
                          : 'text-[#364770] hover:text-[#00104E]'
                      }`}
                    >
                      {lang === 'vi' ? tab.vi : tab.en}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-[#00104E]/10">
                <AnimatePresence mode="popLayout">
                  {filteredMilestones.map((item) => {
                    const pillarMeta = PILLAR_LABELS[item.pillar];
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.28, ease: EASE_BRAND }}
                        className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-5 items-baseline"
                      >
                        <div className="sm:col-span-3">
                          <span className="font-mono text-xs font-bold text-[#00104E] tabular-nums">
                            {lang === 'vi' ? item.dateVi : item.dateEn}
                          </span>
                          <p className="text-xs text-[#5B6885] mt-0.5">
                            {lang === 'vi' ? item.locationVi : item.locationEn}
                          </p>
                        </div>

                        <div className="sm:col-span-9">
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#5B6885] mb-1">
                            <span
                              className="font-bold"
                              style={{ color: pillarMeta.color }}
                            >
                              {lang === 'vi' ? pillarMeta.vi : pillarMeta.en}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {item.scope === 'international'
                                ? lang === 'vi'
                                  ? 'Đối thoại quốc tế'
                                  : 'International'
                                : lang === 'vi'
                                ? 'Tại Việt Nam'
                                : 'National'}
                            </span>
                          </div>
                          <h4 className="font-display text-base font-bold text-[#00104E] leading-snug mb-1.5">
                            {lang === 'vi' ? item.titleVi : item.titleEn}
                          </h4>
                          <p className="text-sm text-[#364770] leading-relaxed">
                            {lang === 'vi' ? item.detailVi : item.detailEn}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#00104E]/80 backdrop-blur-xs flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedActivity(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'vi' ? selectedActivity.programVi : selectedActivity.programEn}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE_BRAND }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#00104E]/15"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-[#00104E]">
                <FramedPhoto
                  src={selectedActivity.image}
                  alt={lang === 'vi' ? selectedActivity.programVi : selectedActivity.programEn}
                  framed={false}
                  className="w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  aria-label={lang === 'vi' ? 'Đóng chi tiết' : 'Close details'}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-lg bg-white/95 text-[#00104E] flex items-center justify-center hover:bg-[#FFD014] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-7 md:p-9">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#5B6885] mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F04533]" />
                    {lang === 'vi' ? selectedActivity.cityVi : selectedActivity.cityEn}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1C69C7]" />
                    {lang === 'vi' ? selectedActivity.dateVi : selectedActivity.dateEn}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#15B567]" />
                    {lang === 'vi' ? selectedActivity.attendeesVi : selectedActivity.attendeesEn}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#00104E] mb-4 leading-tight">
                  {lang === 'vi' ? selectedActivity.programVi : selectedActivity.programEn}
                </h3>

                <p className="text-[15px] leading-relaxed text-[#364770] mb-6">
                  {lang === 'vi' ? selectedActivity.summaryVi : selectedActivity.summaryEn}
                </p>

                <div className="border-t border-[#00104E]/12 pt-5">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-[#00104E] mb-3">
                    {lang === 'vi' ? 'Điểm nhấn chính' : 'Key Highlights'}
                  </p>
                  <ul className="space-y-2.5">
                    {(lang === 'vi'
                      ? selectedActivity.highlightsVi
                      : selectedActivity.highlightsEn
                    ).map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-[#25355C] leading-relaxed"
                      >
                        <span className="font-mono text-xs font-bold text-[#1C69C7] mt-0.5 tabular-nums">
                          0{i + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-5 border-t border-[#00104E]/10 flex items-center justify-between">
                  <FourColorMark />
                  <button
                    type="button"
                    onClick={() => setSelectedActivity(null)}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#00104E] text-[#FFD014] hover:bg-[#123985] transition-colors cursor-pointer"
                  >
                    {lang === 'vi' ? 'Quay lại trang' : 'Back to gallery'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
