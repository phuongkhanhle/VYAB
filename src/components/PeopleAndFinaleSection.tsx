import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import {
  COHORT_ADDITIONAL_MEMBERS,
  FINALE_AGENDA,
  PEOPLE,
  type Lang,
} from '../data/vyabData';
import { VyabKicker } from './VyabBrandMark';

interface PeopleAndFinaleSectionProps {
  lang: Lang;
}

const EASE_BRAND: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PeopleAndFinaleSection({ lang }: PeopleAndFinaleSectionProps) {
  const [groupFilter, setGroupFilter] = useState<'all' | 'leadership' | 'member'>('all');

  const visiblePeople = PEOPLE.filter((person) => {
    if (groupFilter === 'all') return true;
    if (groupFilter === 'leadership') {
      return person.group === 'leadership' || person.group === 'advisor';
    }
    return person.group === 'member';
  });

  return (
    <section id="people" className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
        {/* Section Heading & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#00104E]/12 mb-12">
          <div>
            <VyabKicker
              label={
                lang === 'vi'
                  ? '06 · Vinh danh Khóa 1 · 2024–2026'
                  : '06 · Cohort 1 Recognition · 2024–2026'
              }
              variant="light"
              className="mb-3"
            />
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#00104E] tracking-tight leading-[1.08]">
              {lang === 'vi' ? 'Gương mặt VYAB Khóa 1' : 'Leadership, Advisors & Members'}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label={lang === 'vi' ? 'Lọc thành viên VYAB' : 'Filter VYAB members'}
            className="inline-flex items-center p-1 bg-[#F4F7FC] border border-[#00104E]/10 rounded-xl self-start"
          >
            {(
              [
                { key: 'all', vi: `Tất cả (${PEOPLE.length})`, en: `All (${PEOPLE.length})` },
                {
                  key: 'leadership',
                  vi: `Điều hành & Cố vấn (${PEOPLE.filter((p) => p.group !== 'member').length})`,
                  en: `Leadership & Advisors (${PEOPLE.filter((p) => p.group !== 'member').length})`,
                },
                {
                  key: 'member',
                  vi: `Thành viên (${PEOPLE.filter((p) => p.group === 'member').length})`,
                  en: `Members (${PEOPLE.filter((p) => p.group === 'member').length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={groupFilter === tab.key}
                onClick={() => setGroupFilter(tab.key)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  groupFilter === tab.key
                    ? 'bg-[#00104E] text-[#FFD014]'
                    : 'text-[#364770] hover:text-[#00104E]'
                }`}
              >
                {lang === 'vi' ? tab.vi : tab.en}
              </button>
            ))}
          </div>
        </div>

        {/* Official VYAB Circular Color-Ringed Portraits (All 19 Cohort 1 Members from Pages 34–36) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-14">
          {visiblePeople.map((person, idx) => (
            <motion.article
              key={person.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: (idx % 4) * 0.05, ease: EASE_BRAND }}
              className="group flex flex-col items-center text-center"
            >
              <div
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 mb-4 shadow-md transition-transform duration-300 group-hover:scale-[1.03]"
                style={{ backgroundColor: person.accentHex }}
              >
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#F4F7FC]">
                    {person.image ? (
                      <img
                        src={person.image}
                        alt={person.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                        style={{
                          objectPosition: person.imagePosition ?? '50% 50%',
                          transform: person.imageTransform,
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-full flex flex-col items-center justify-center text-white"
                        style={{ backgroundColor: '#00104E' }}
                      >
                        <span className="font-display text-3xl font-extrabold tracking-wider text-[#FFD014]">
                          {person.initials}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-white/80 mt-0.5">
                          VYAB · GYSB
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="font-display text-lg font-extrabold text-[#00104E] leading-snug">
                {person.name}
              </h3>
              <p
                className="text-xs font-bold mt-1"
                style={{
                  color:
                    person.accentHex === '#FFD014' || person.accentHex === '#eab308'
                      ? '#B47B00'
                      : person.accentHex,
                }}
              >
                {lang === 'vi' ? person.roleVi : person.roleEn}
              </p>
              {person.noteVi && (
                <p className="text-xs text-[#4C5C80] leading-relaxed mt-1 max-w-[220px]">
                  {lang === 'vi' ? person.noteVi : person.noteEn}
                </p>
              )}
            </motion.article>
          ))}
        </div>

        {/* Additional Recognition Note */}
        {COHORT_ADDITIONAL_MEMBERS.length > 0 && (
          <div className="rounded-xl bg-[#F4F7FC] border border-[#00104E]/10 px-6 py-4 mb-20">
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-5">
              <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[#00104E] whitespace-nowrap shrink-0">
                {lang === 'vi'
                  ? 'Cùng đóng góp trình bày Báo cáo Nhiệm kỳ'
                  : 'Also honoring Cohort 1 contributor'}
              </span>
              <p className="text-sm font-semibold text-[#364770] leading-relaxed">
                {COHORT_ADDITIONAL_MEMBERS.join('  ·  ')}
              </p>
            </div>
          </div>
        )}

        {/* Finale Showcase Event & Official Page-14 Agenda Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <VyabKicker
              label={
                lang === 'vi'
                  ? 'Sự kiện Tổng kết Khóa 1'
                  : '1st Cohort Finale Showcase'
              }
              variant="navy-bar"
              className="mb-4"
            />
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-[#00104E] tracking-tight leading-[1.1] mb-5">
              {lang === 'vi'
                ? 'Khép lại Khóa 1, mở ra hành trình mới'
                : 'Celebrating Cohort 1, inspiring what comes next'}
            </h3>
            <p className="text-[15px] leading-relaxed text-[#364770] mb-6">
              {lang === 'vi'
                ? 'Lễ Tổng kết Khóa 1 và Ra mắt Báo cáo Nhiệm kỳ 2024–2026 có sự tham dự của Đại sứ Liên minh Châu Âu tại Việt Nam Julien Guerrier, đại diện Phái đoàn EU và các đối tác thanh niên.'
                : 'The 1st Cohort Finale & Inaugural Report Showcase convenes H.E. EU Ambassador Julien Guerrier, EU Delegation partners, and youth changemakers at Sky Garden, Ha Noi.'}
            </p>

            <div className="space-y-2.5 text-sm font-semibold text-[#00104E] border-t border-[#00104E]/12 pt-5">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#1C69C7] shrink-0" />
                <span className="tabular-nums">
                  {lang === 'vi'
                    ? '16:00 – 18:00 · Thứ Sáu, 27/11/2026'
                    : '16:00 – 18:00 · Friday, 27 November 2026'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F04533] shrink-0" />
                <span>
                  {lang === 'vi'
                    ? 'Sky Garden, Phái đoàn Liên minh Châu Âu tại Việt Nam, Hà Nội'
                    : 'Sky Garden, EU Delegation to Viet Nam, Ha Noi City'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Official Page-14 Blue-Header Agenda Table */}
          <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-[#1C69C7]/35 bg-white shadow-sm">
            <div className="grid grid-cols-12 bg-[#1C69C7] text-white font-display text-xs font-bold uppercase tracking-wider px-5 py-3.5">
              <span className="col-span-4 sm:col-span-3">
                {lang === 'vi' ? 'Thời gian' : 'Time'}
              </span>
              <span className="col-span-8 sm:col-span-9">
                {lang === 'vi' ? 'Nội dung chương trình · Agenda' : 'Activity · Agenda'}
              </span>
            </div>
            <div className="divide-y divide-[#1C69C7]/20">
              {FINALE_AGENDA.map((slot) => (
                <div
                  key={slot.time}
                  className="px-5 py-4 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline hover:bg-[#F4F7FC] transition-colors"
                >
                  <span className="sm:col-span-3 font-mono text-xs font-bold text-[#00104E] tabular-nums">
                    {slot.time}
                  </span>
                  <span className="sm:col-span-9 text-sm font-semibold text-[#00104E] leading-relaxed">
                    {lang === 'vi' ? slot.titleVi : slot.titleEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
