import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Download,
  Heart,
  RotateCcw,
  Send,
  Award,
  MessageSquarePlus,
  BarChart3,
  ChevronRight,
  QrCode,
} from 'lucide-react';
import {
  INITIAL_VOICE_NOTES,
  POLL_OPTIONS,
  QUIZ_QUESTIONS,
  type Lang,
  type PillarKey,
  type VoiceNote,
} from '../data/vyabData';
import { FourColorMark, VyabConcentricRings, VyabCoralCircles, VyabKicker } from './VyabBrandMark';
import { BoothQrGenerator } from './BoothQrGenerator';

interface BoothInteractiveSectionProps {
  lang: Lang;
}

type BoothTab = 'quiz' | 'wall' | 'poll' | 'qr';

const STORAGE_VOICES_KEY = 'vyab_booth_voices_v1';
const STORAGE_UPVOTES_KEY = 'vyab_booth_upvoted_v1';
const STORAGE_POLL_KEY = 'vyab_booth_poll_v1';

const PERSONA_INFO: Record<
  PillarKey,
  {
    code: string;
    titleVi: string;
    titleEn: string;
    descVi: string;
    descEn: string;
    accentHex: string;
  }
> = {
  engage: {
    code: 'ENGAGE',
    titleVi: 'Người Gắn Kết Chính Sách',
    titleEn: 'Policy Engagement Catalyst',
    descVi:
      'Bạn tin vào sức mạnh của đối thoại minh bạch và luôn sẵn sàng đưa góc nhìn thế hệ trẻ vào các quyết sách khí hậu, số hóa EU–Việt Nam.',
    descEn:
      'You champion structured dialogue and love bringing grounded youth perspectives directly to EU–Viet Nam climate and digital policy tables.',
    accentHex: '#F04533',
  },
  empower: {
    code: 'EMPOWER',
    titleVi: 'Người Kiến Tạo Kỹ Năng Xanh',
    titleEn: 'Green & Digital Empowerer',
    descVi:
      'Bạn hành động thực tiễn qua khởi nghiệp bền vững, kỹ năng ESG và tạo ra cơ hội việc làm xanh cho cộng đồng trẻ.',
    descEn:
      'You turn ideas into impact through ESG mastery, sustainable entrepreneurship, and practical green career pathways.',
    accentHex: '#1C69C7',
  },
  connect: {
    code: 'CONNECT',
    titleVi: 'Người Kết Nối Cộng Đồng',
    titleEn: 'Regional Network Bridge',
    descVi:
      'Bạn là nhịp cầu đưa cơ hội giáo dục Châu Âu, Erasmus+ và mạng lưới thanh niên ASEAN tới gần hơn với người trẻ khắp ba miền.',
    descEn:
      'You bridge geographic divides, linking regional students across Viet Nam with Erasmus+ mentors and ASEAN–EU youth networks.',
    accentHex: '#15B567',
  },
};

const VOICE_TOPICS = [
  { key: 'Kỹ năng Xanh', labelVi: 'Kỹ năng Xanh', labelEn: 'Green Skills', pillar: 'empower' as PillarKey },
  { key: 'Chuyển đổi Số', labelVi: 'Chuyển đổi Số', labelEn: 'Digital Literacy', pillar: 'engage' as PillarKey },
  { key: 'Khởi nghiệp Bền vững', labelVi: 'Khởi nghiệp Bền vững', labelEn: 'Green Startups', pillar: 'empower' as PillarKey },
  { key: 'Học bổng & Kết nối EU–ASEAN', labelVi: 'Học bổng & Kết nối EU–ASEAN', labelEn: 'EU–ASEAN Mobility', pillar: 'connect' as PillarKey },
  { key: 'Khí hậu & Sức khỏe', labelVi: 'Khí hậu & Sức khỏe', labelEn: 'Climate & Health', pillar: 'engage' as PillarKey },
];

const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Tỉnh / Thành khác'];

const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function BoothInteractiveSection({ lang }: BoothInteractiveSectionProps) {
  const [activeTab, setActiveTab] = useState<BoothTab>('quiz');

  // --- TAB 1: QUIZ & DIGITAL PASS STATE ---
  const [visitorName, setVisitorName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [pillarTally, setPillarTally] = useState<Record<PillarKey, number>>({
    engage: 0,
    empower: 0,
    connect: 0,
  });
  const [quizFinished, setQuizFinished] = useState(false);
  const [passSerial, setPassSerial] = useState('VYAB-26-108');
  const [downloadToast, setDownloadToast] = useState(false);

  // --- TAB 2: LIVE YOUTH VOICE WALL STATE ---
  const [voices, setVoices] = useState<VoiceNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VOICES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage failure
    }
    return INITIAL_VOICE_NOTES;
  });
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UPVOTES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [wallFilter, setWallFilter] = useState<string>('all');
  const [authorInput, setAuthorInput] = useState('');
  const [cityInput, setCityInput] = useState('Hà Nội');
  const [topicInput, setTopicInput] = useState(VOICE_TOPICS[0].key);
  const [messageInput, setMessageInput] = useState('');
  const [wallSubmitted, setWallSubmitted] = useState(false);

  // --- TAB 3: LIVE POLICY POLL STATE ---
  const [pollVotes, setPollVotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POLL_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return Object.fromEntries(POLL_OPTIONS.map((o) => [o.id, o.baseVotes]));
  });
  const [userVotedOption, setUserVotedOption] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VOICES_KEY, JSON.stringify(voices));
    } catch {
      // ignore
    }
  }, [voices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_UPVOTES_KEY, JSON.stringify(upvotedIds));
    } catch {
      // ignore
    }
  }, [upvotedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POLL_KEY, JSON.stringify(pollVotes));
    } catch {
      // ignore
    }
  }, [pollVotes]);

  // Quiz computed persona
  const matchedPillar: PillarKey = useMemo(() => {
    const entries = Object.entries(pillarTally) as [PillarKey, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }, [pillarTally]);

  const currentQuestion = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return;
    const option = currentQuestion.options.find((o) => o.id === optId);
    if (!option) return;
    setSelectedOptionId(optId);
    if (option.isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
    setPillarTally((prev) => ({
      ...prev,
      [option.pillar]: prev[option.pillar] + (currentQIndex === QUIZ_QUESTIONS.length - 1 ? 3 : 1),
    }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOptionId(null);
    } else {
      const num = String(Math.floor(100 + Math.random() * 899));
      setPassSerial(`VYAB-26-${num}`);
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setCorrectCount(0);
    setPillarTally({ engage: 0, empower: 0, connect: 0 });
    setQuizFinished(false);
    setDownloadToast(false);
  };

  const handleDownloadPass = () => {
    const persona = PERSONA_INFO[matchedPillar];
    const displayName = visitorName.trim() || (lang === 'vi' ? 'Khách Tham Quan Booth' : 'VYAB Booth Guest');

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Official VYAB Midnight Navy Card Canvas
    ctx.fillStyle = '#00104E';
    ctx.fillRect(0, 0, 1080, 640);

    // Official VYAB Concentric Cobalt Rings Motif
    ctx.strokeStyle = '#123985';
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.arc(980, 120, 215, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(980, 120, 138, 0, Math.PI * 2);
    ctx.stroke();

    // Official VYAB Twin Coral Circles Bottom-Right
    ctx.fillStyle = '#F04533';
    ctx.beginPath();
    ctx.arc(990, 620, 74, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(888, 632, 32, 0, Math.PI * 2);
    ctx.fill();

    // Inner hairline frame
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 1024, 584);

    // Official 4-color VYAB signature squares top-left
    const colors = ['#F04533', '#1C69C7', '#FFD014', '#1CD07A'];
    colors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.fillRect(68 + idx * 26, 68, 16, 16);
    });

    // Kicker
    ctx.fillStyle = '#FFD014';
    ctx.font = '700 19px "Source Sans 3", sans-serif';
    ctx.fillText('VIETNAM YOUTH ADVISORY BOARD · 1ST COHORT FINALE BOOTH PASS', 68, 126);

    // Accent bar
    ctx.fillStyle = persona.accentHex;
    ctx.fillRect(68, 158, 110, 6);

    // Visitor Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 58px "Barlow Condensed", "Source Sans 3", sans-serif';
    ctx.fillText(displayName, 68, 244);

    // Persona Title
    ctx.fillStyle = '#FFD014';
    ctx.font = '700 30px "Barlow Condensed", "Source Sans 3", sans-serif';
    ctx.fillText(
      `${persona.code} — ${lang === 'vi' ? persona.titleVi : persona.titleEn}`,
      68,
      304
    );

    // Score & Description
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '400 22px "Source Sans 3", sans-serif';
    const scoreLine =
      lang === 'vi'
        ? `Hoàn thành Thử thách VYAB: ${correctCount}/${QUIZ_QUESTIONS.length} điểm`
        : `Completed VYAB Booth Challenge: ${correctCount}/${QUIZ_QUESTIONS.length} score`;
    ctx.fillText(scoreLine, 68, 368);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(68, 468);
    ctx.lineTo(1012, 468);
    ctx.stroke();

    // Footer metadata
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '500 19px "Source Sans 3", sans-serif';
    ctx.fillText('Sky Garden, EU Delegation to Viet Nam · 27 November 2026', 68, 520);
    ctx.fillText('Engage · Empower · Connect  |  EU Youth Action Plan 2022–2027', 68, 554);

    // Serial right
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 22px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(passSerial, 1012, 536);

    const link = document.createElement('a');
    link.download = `VYAB-Booth-Pass-${passSerial}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  // Voice Wall handlers
  const handleAddVoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = messageInput.trim();
    if (!cleaned) return;
    const topicMeta = VOICE_TOPICS.find((t) => t.key === topicInput) || VOICE_TOPICS[0];
    const newNote: VoiceNote = {
      id: `vn-${Date.now()}`,
      author: authorInput.trim() || (lang === 'vi' ? 'Bạn trẻ tại Booth' : 'Booth Visitor'),
      city: cityInput,
      topic: topicMeta.key,
      pillar: topicMeta.pillar,
      message: cleaned,
      votes: 1,
      createdAt: lang === 'vi' ? 'Vừa gửi tại Booth' : 'Just posted at Booth',
    };
    setVoices((prev) => [newNote, ...prev]);
    setUpvotedIds((prev) => [...prev, newNote.id]);
    setMessageInput('');
    setAuthorInput('');
    setWallFilter('all');
    setWallSubmitted(true);
    setTimeout(() => setWallSubmitted(false), 3200);
  };

  const handleToggleUpvote = (id: string) => {
    const already = upvotedIds.includes(id);
    setUpvotedIds((prev) => (already ? prev.filter((item) => item !== id) : [...prev, id]));
    setVoices((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, votes: Math.max(0, note.votes + (already ? -1 : 1)) } : note
      )
    );
  };

  const visibleVoices = voices.filter((v) => (wallFilter === 'all' ? true : v.topic === wallFilter));

  // Poll handlers
  const totalPollVotes = useMemo(
    () => Object.values(pollVotes).reduce((sum, v) => sum + v, 0),
    [pollVotes]
  );

  const handleCastPollVote = (optionId: string) => {
    if (userVotedOption === optionId) return;
    setPollVotes((prev) => {
      const next = { ...prev };
      if (userVotedOption && next[userVotedOption] > 0) {
        next[userVotedOption] -= 1;
      }
      next[optionId] = (next[optionId] || 0) + 1;
      return next;
    });
    setUserVotedOption(optionId);
  };

  return (
    <section id="booth" className="bg-[#00104E] text-white relative overflow-hidden">
      {/* Official VYAB concentric cobalt corner rings & twin coral circles */}
      <VyabConcentricRings className="absolute -right-28 -top-24 w-[400px] h-[400px] opacity-85" />
      <VyabCoralCircles className="absolute -bottom-6 -left-8 w-[240px] opacity-90" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28 relative z-10">
        {/* Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-7">
            <VyabKicker
              label={
                lang === 'vi'
                  ? '04 · Khu vực tương tác tại Booth VYAB'
                  : '04 · Interactive Booth Experience'
              }
              variant="on-dark"
              className="mb-4"
            />
            <h2 className="vy-title font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.08] text-white">
              {lang === 'vi'
                ? 'Cất lên tiếng nói của bạn cùng VYAB'
                : 'Make your voice heard at the VYAB Booth'}
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-[15px] leading-relaxed text-white/85">
              {lang === 'vi'
                ? 'Bốn hoạt động tương tác trực tiếp tại booth: giải đố nhận thẻ kỷ niệm, gửi tiếng nói thanh niên, bình chọn ưu tiên Khóa 2 và quét mã QR lưu Báo cáo VYAB hoặc mở nhanh khảo sát.'
                : 'Four hands-on booth stations: take the quiz for a personalized pass, post to the Youth Voice Wall, vote on Cohort 2 priorities, and scan QR codes to save the digital report or survey.'}
            </p>
          </div>
        </div>

        {/* Clean Segmented Station Switcher */}
        <div
          role="tablist"
          aria-label={lang === 'vi' ? 'Các hoạt động tại Booth' : 'Booth Activities'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 bg-[#000B38]/80 border border-white/15 rounded-2xl mb-10"
        >
          {(
            [
              {
                id: 'quiz',
                icon: Award,
                num: '01',
                titleVi: 'Thử thách & Thẻ Booth',
                titleEn: 'Quiz & Digital Pass',
              },
              {
                id: 'wall',
                icon: MessageSquarePlus,
                num: '02',
                titleVi: 'Bức tường Tiếng nói',
                titleEn: 'Youth Voice Wall',
              },
              {
                id: 'poll',
                icon: BarChart3,
                num: '03',
                titleVi: 'Bình chọn Khóa 2',
                titleEn: 'Cohort 2 Poll',
              },
              {
                id: 'qr',
                icon: QrCode,
                num: '04',
                titleVi: 'Mã QR Báo cáo & Khảo sát',
                titleEn: 'Report & Survey QR',
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center sm:justify-start gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#FFD014] text-[#00104E] shadow-md'
                    : 'text-white/85 hover:text-white hover:bg-white/8'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-mono text-xs opacity-70">{tab.num}</span>
                <span>{lang === 'vi' ? tab.titleVi : tab.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Station Panel */}
        <div className="bg-white text-[#00104E] rounded-2xl shadow-2xl border border-white/15 p-6 sm:p-8 md:p-12">
          <AnimatePresence mode="wait">
            {/* ==================== TAB 1: QUIZ & DIGITAL PASS ==================== */}
            {activeTab === 'quiz' && (
              <motion.div
                key="tab-quiz"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
              >
                {!quizStarted && !quizFinished && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7">
                      <p className="text-xs font-semibold text-[#1C69C7] mb-2">
                        {lang === 'vi'
                          ? '5 câu hỏi nhanh · Khoảng 60 giây · Tải thẻ kỷ niệm PNG'
                          : '5 quick questions · ~60 seconds · Downloadable PNG Pass'}
                      </p>
                      <h3 className="font-display text-3xl md:text-4xl font-extrabold text-[#00104E] tracking-tight leading-tight mb-4">
                        {lang === 'vi'
                          ? 'Bạn thuộc trụ cột hành động nào của VYAB?'
                          : 'Which VYAB action pillar fits your changemaker style?'}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-[#384664] mb-7 max-w-xl">
                        {lang === 'vi'
                          ? 'Nhập tên của bạn để mở khóa 5 câu hỏi thú vị về hành trình EU–Việt Nam và nhận ngay Thẻ Booth VYAB cá nhân hóa (Engage · Empower · Connect).'
                          : 'Enter your name to unlock 5 quick questions about VYAB’s 2024–2026 journey and generate your personalized VYAB Booth Pass.'}
                      </p>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setQuizStarted(true);
                        }}
                        className="flex flex-col sm:flex-row gap-3 max-w-lg"
                      >
                        <input
                          type="text"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          placeholder={
                            lang === 'vi'
                              ? 'Tên của bạn (hiển thị trên Thẻ Booth)...'
                              : 'Your name (printed on your Booth Pass)...'
                          }
                          maxLength={40}
                          className="flex-1 px-4 py-3 rounded-xl text-sm bg-[#F4F7FC] border border-[#00104E]/18 text-[#00104E] placeholder:text-[#6B7894] focus:outline-none focus:border-[#00104E]"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00104E] text-white text-sm font-bold hover:bg-[#123985] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>{lang === 'vi' ? 'Bắt đầu ngay' : 'Start challenge'}</span>
                          <ChevronRight className="w-4 h-4 text-[#FFD014]" />
                        </button>
                      </form>
                    </div>

                    {/* Preview Pass Silhouette */}
                    <div className="lg:col-span-5">
                      <div className="bg-[#00104E] text-white p-7 rounded-2xl border border-[#00104E] relative overflow-hidden shadow-xl">
                        <VyabConcentricRings className="absolute -right-24 -top-24 w-[220px] h-[220px] opacity-75" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <FourColorMark />
                            <span className="font-mono text-xs text-white/70">VYAB-26-XXX</span>
                          </div>
                          <p className="text-[11px] font-bold tracking-[0.14em] text-[#FFD014] mb-1">
                            {lang === 'vi' ? 'MẪU THẺ CHECK-IN BOOTH' : 'BOOTH PASS PREVIEW'}
                          </p>
                          <p className="font-display text-2xl font-extrabold text-white mb-2">
                            {visitorName.trim() ||
                              (lang === 'vi' ? 'Tên của bạn tại đây' : 'Your Name Here')}
                          </p>
                          <p className="text-xs text-[#FFD014] font-semibold mb-6">
                            Engage · Empower · Connect
                          </p>
                          <div className="border-t border-white/15 pt-4 flex items-center justify-between text-[11px] text-white/75">
                            <span>Sky Garden, EUD Hà Nội</span>
                            <span className="tabular-nums">27.11.2026</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {quizStarted && !quizFinished && (
                  <div className="max-w-3xl mx-auto">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-between text-xs font-semibold text-[#5B6885] mb-3 tabular-nums">
                      <span>
                        {lang === 'vi'
                          ? `Câu hỏi ${currentQIndex + 1} / ${QUIZ_QUESTIONS.length}`
                          : `Question ${currentQIndex + 1} of ${QUIZ_QUESTIONS.length}`}
                      </span>
                      <span>
                        {lang === 'vi'
                          ? `Điểm hiện tại: ${correctCount}`
                          : `Current score: ${correctCount}`}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#00104E]/10 mb-8 overflow-hidden">
                      <motion.div
                        className="h-full bg-[#1C69C7]"
                        initial={false}
                        animate={{
                          width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                        }}
                        transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
                      />
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#00104E] tracking-tight leading-snug mb-6">
                      {lang === 'vi' ? currentQuestion.questionVi : currentQuestion.questionEn}
                    </h3>

                    <div className="space-y-3 mb-6">
                      {currentQuestion.options.map((opt, idx) => {
                        const isSelected = selectedOptionId === opt.id;
                        const revealed = selectedOptionId !== null;
                        const isLastQ = currentQIndex === QUIZ_QUESTIONS.length - 1;

                        let stateClasses =
                          'border-[#00104E]/15 bg-white hover:border-[#00104E] text-[#00104E]';
                        if (revealed) {
                          if (opt.isCorrect && (isSelected || !isLastQ)) {
                            stateClasses =
                              'border-[#15B567] bg-[#15B567]/10 text-[#00104E]';
                          } else if (isSelected && !opt.isCorrect) {
                            stateClasses =
                              'border-[#F04533] bg-[#F04533]/10 text-[#00104E]';
                          } else {
                            stateClasses =
                              'border-[#00104E]/10 bg-[#F4F7FC] text-[#6B7894]';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={revealed}
                            onClick={() => handleSelectOption(opt.id)}
                            className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer disabled:cursor-default ${stateClasses}`}
                          >
                            <div className="flex items-start gap-3.5">
                              <span className="font-mono text-xs font-bold text-[#1C69C7] mt-0.5">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-sm md:text-[15px] font-semibold leading-snug">
                                {lang === 'vi' ? opt.labelVi : opt.labelEn}
                              </span>
                            </div>

                            {revealed && opt.isCorrect && (isSelected || !isLastQ) && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15B567] shrink-0">
                                <Check className="w-4 h-4" />
                                {isLastQ
                                  ? lang === 'vi'
                                    ? 'Đã chọn'
                                    : 'Selected'
                                  : lang === 'vi'
                                  ? 'Chính xác'
                                  : 'Correct'}
                              </span>
                            )}
                            {revealed && isSelected && !opt.isCorrect && (
                              <span className="text-xs font-bold text-[#F04533] shrink-0">
                                {lang === 'vi' ? 'Chưa đúng' : 'Incorrect'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {selectedOptionId && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="p-5 rounded-xl bg-[#F4F7FC] border border-[#00104E]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <p className="text-sm text-[#2A3754] leading-relaxed">
                            {lang === 'vi' ? currentQuestion.factVi : currentQuestion.factEn}
                          </p>
                          <button
                            type="button"
                            onClick={handleNextQuestion}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#00104E] text-white text-xs font-bold hover:bg-[#123985] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>
                              {currentQIndex + 1 === QUIZ_QUESTIONS.length
                                ? lang === 'vi'
                                  ? 'Nhận Thẻ Booth'
                                  : 'Generate Pass'
                                : lang === 'vi'
                                ? 'Câu tiếp theo'
                                : 'Next question'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#FFD014]" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {quizFinished && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Generated VYAB Branded Booth Pass */}
                    <div className="lg:col-span-7">
                      <div className="bg-[#00104E] text-white p-7 sm:p-9 rounded-2xl relative overflow-hidden shadow-xl">
                        <VyabConcentricRings className="absolute -right-24 -top-24 w-[240px] h-[240px] opacity-80" />
                        <VyabCoralCircles className="absolute -bottom-6 -right-8 w-[170px] opacity-90" />
                        <div
                          className="absolute inset-3 rounded-xl border border-white/20 pointer-events-none"
                          aria-hidden="true"
                        />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between gap-4 mb-6">
                            <FourColorMark />
                            <span className="font-mono text-xs text-white/80 tabular-nums">
                              {passSerial}
                            </span>
                          </div>

                          <p className="text-[11px] font-bold tracking-[0.16em] text-[#FFD014] mb-2">
                            {lang === 'vi'
                              ? 'THẺ CHECK-IN BOOTH · VYAB KHÓA 1'
                              : 'VYAB 1ST COHORT FINALE · BOOTH PASS'}
                          </p>
                          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                            {visitorName.trim() ||
                              (lang === 'vi' ? 'Khách Tham Quan Booth' : 'VYAB Booth Guest')}
                          </h3>
                          <p className="text-sm font-bold mb-4 text-[#FFD014]">
                            {PERSONA_INFO[matchedPillar].code} ·{' '}
                            {lang === 'vi'
                              ? PERSONA_INFO[matchedPillar].titleVi
                              : PERSONA_INFO[matchedPillar].titleEn}
                          </p>
                          <p className="text-sm text-white/85 leading-relaxed max-w-lg mb-7">
                            {lang === 'vi'
                              ? PERSONA_INFO[matchedPillar].descVi
                              : PERSONA_INFO[matchedPillar].descEn}
                          </p>

                          <div className="border-t border-white/15 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/75 tabular-nums">
                            <span>
                              {lang === 'vi'
                                ? `Kết quả thử thách: ${correctCount}/${QUIZ_QUESTIONS.length}`
                                : `Challenge Score: ${correctCount}/${QUIZ_QUESTIONS.length}`}
                            </span>
                            <span>Sky Garden, EUD Hà Nội · 27.11.2026</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download & Share Actions */}
                    <div className="lg:col-span-5">
                      <p className="text-xs font-bold text-[#15B567] mb-2">
                        {lang === 'vi' ? 'Hoàn thành xuất sắc!' : 'Challenge completed!'}
                      </p>
                      <h4 className="font-display text-3xl font-extrabold text-[#00104E] tracking-tight mb-3">
                        {lang === 'vi'
                          ? 'Lưu lại thẻ kỷ niệm của bạn'
                          : 'Save your personalized pass'}
                      </h4>
                      <p className="text-sm text-[#384664] leading-relaxed mb-6">
                        {lang === 'vi'
                          ? 'Tải ảnh thẻ PNG chất lượng cao để lưu niệm, check-in tại booth VYAB hoặc chia sẻ hành trình cùng bạn bè.'
                          : 'Download your high-resolution PNG card to keep as a booth souvenir or share your matched pillar on LinkedIn and Instagram.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleDownloadPass}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFD014] text-[#00104E] text-sm font-extrabold hover:bg-[#ffdc4a] transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>
                            {lang === 'vi' ? 'Tải Thẻ Booth (PNG)' : 'Download Pass (PNG)'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetQuiz}
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#00104E]/20 text-[#00104E] text-sm font-semibold hover:bg-[#F4F7FC] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{lang === 'vi' ? 'Lượt chơi mới' : 'Play again'}</span>
                        </button>
                      </div>

                      {downloadToast && (
                        <p className="mt-3 text-xs font-semibold text-[#15B567]">
                          {lang === 'vi'
                            ? 'Đã xuất file PNG Thẻ Booth thành công.'
                            : 'Your PNG Booth Pass has been downloaded.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== TAB 2: LIVE YOUTH VOICE WALL ==================== */}
            {activeTab === 'wall' && (
              <motion.div
                key="tab-wall"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
              >
                {/* Left: Composer Form */}
                <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#00104E]/12 pb-8 lg:pb-0 lg:pr-9">
                  <h3 className="font-display text-3xl font-extrabold text-[#00104E] tracking-tight mb-2">
                    {lang === 'vi'
                      ? 'Gửi tiếng nói của bạn'
                      : 'Pin your youth voice'}
                  </h3>
                  <p className="text-sm text-[#4B5978] leading-relaxed mb-6">
                    {lang === 'vi'
                      ? 'Bạn mong muốn hợp tác EU–Việt Nam ưu tiên điều gì cho thế hệ trẻ? Kiến nghị của bạn sẽ xuất hiện ngay trên Bức tường Booth.'
                      : 'What should EU–Viet Nam youth cooperation prioritize next? Post a short wish or policy recommendation live to the wall.'}
                  </p>

                  <form onSubmit={handleAddVoice} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#00104E] mb-1.5">
                          {lang === 'vi' ? 'Tên / Biệt danh' : 'Your name'}
                        </label>
                        <input
                          type="text"
                          value={authorInput}
                          onChange={(e) => setAuthorInput(e.target.value)}
                          maxLength={32}
                          placeholder={lang === 'vi' ? 'VD: Minh Anh' : 'e.g. Minh Anh'}
                          className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#00104E] mb-1.5">
                          {lang === 'vi' ? 'Thành phố' : 'City'}
                        </label>
                        <select
                          value={cityInput}
                          onChange={(e) => setCityInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E]"
                        >
                          {CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#00104E] mb-1.5">
                        {lang === 'vi' ? 'Chủ đề quan tâm' : 'Priority topic'}
                      </label>
                      <select
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E]"
                      >
                        {VOICE_TOPICS.map((t) => (
                          <option key={t.key} value={t.key}>
                            {lang === 'vi' ? t.labelVi : t.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#00104E]">
                          {lang === 'vi' ? 'Lời nhắn / Kiến nghị' : 'Your recommendation'}
                        </label>
                        <span className="font-mono text-[11px] text-[#6B7894] tabular-nums">
                          {messageInput.length}/220
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        maxLength={220}
                        required
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={
                          lang === 'vi'
                            ? 'Chia sẻ 1 ý tưởng hoặc kỳ vọng của bạn dành cho thanh niên Việt Nam & EU...'
                            : 'Share one concrete idea or wish for EU–Viet Nam youth programmes...'
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00104E] text-white text-sm font-bold hover:bg-[#123985] transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#FFD014]" />
                      <span>
                        {lang === 'vi' ? 'Ghim lên Bức tường Tiếng nói' : 'Post to Youth Wall'}
                      </span>
                    </button>

                    {wallSubmitted && (
                      <p className="text-xs font-semibold text-[#15B567]">
                        {lang === 'vi'
                          ? 'Cảm ơn bạn! Tiếng nói của bạn đã được ghim lên Bức tường Booth.'
                          : 'Thank you! Your voice has been pinned to the live wall.'}
                      </p>
                    )}
                  </form>
                </div>

                {/* Right: Live Wall Stream */}
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <p className="text-xs font-semibold text-[#5B6885] tabular-nums">
                      {lang === 'vi'
                        ? `${visibleVoices.length} tiếng nói đã ghi nhận`
                        : `${visibleVoices.length} voices collected`}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setWallFilter('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          wallFilter === 'all'
                            ? 'bg-[#00104E] text-white'
                            : 'bg-[#F4F7FC] text-[#4B5978] hover:text-[#00104E]'
                        }`}
                      >
                        {lang === 'vi' ? 'Tất cả' : 'All'}
                      </button>
                      {VOICE_TOPICS.slice(0, 3).map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setWallFilter(t.key)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                            wallFilter === t.key
                              ? 'bg-[#00104E] text-white'
                              : 'bg-[#F4F7FC] text-[#4B5978] hover:text-[#00104E]'
                          }`}
                        >
                          {lang === 'vi' ? t.labelVi : t.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-1">
                    {visibleVoices.map((note) => {
                      const upvoted = upvotedIds.includes(note.id);
                      const accent = PERSONA_INFO[note.pillar].accentHex;
                      return (
                        <motion.article
                          key={note.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-xl bg-[#F4F7FC] border border-[#00104E]/10 flex flex-col justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 text-xs text-[#5B6885] mb-2.5">
                              <span className="font-bold" style={{ color: accent }}>
                                {note.topic}
                              </span>
                              <span>{note.city}</span>
                            </div>
                            <p className="text-sm text-[#00104E] leading-relaxed">
                              “{note.message}”
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-[#00104E]/8 text-xs">
                            <span className="font-semibold text-[#00104E]">
                              {note.author} · <span className="text-[#6B7894] font-normal">{note.createdAt}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleUpvote(note.id)}
                              aria-pressed={upvoted}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer tabular-nums ${
                                upvoted
                                  ? 'bg-[#F04533]/12 text-[#F04533] font-bold'
                                  : 'text-[#5B6885] hover:bg-white hover:text-[#00104E]'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${upvoted ? 'fill-current' : ''}`} />
                              <span>{note.votes}</span>
                            </button>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== TAB 3: COHORT 2 PRIORITY POLL ==================== */}
            {activeTab === 'poll' && (
              <motion.div
                key="tab-poll"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <p className="text-xs font-semibold text-[#1C69C7] mb-2 tabular-nums">
                      {lang === 'vi'
                        ? `Khảo sát nhanh tại Booth · ${totalPollVotes} lượt bình chọn`
                        : `Live Booth Consultation · ${totalPollVotes} total votes`}
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl font-extrabold text-[#00104E] tracking-tight leading-tight">
                      {lang === 'vi'
                        ? 'Ưu tiên số 1 cho VYAB Khóa 2 (2026–2028)?'
                        : 'Top priority for VYAB Cohort 2 (2026–2028)?'}
                    </h3>
                  </div>

                  {userVotedOption && (
                    <button
                      type="button"
                      onClick={() => setUserVotedOption(null)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#4B5978] border border-[#00104E]/15 hover:text-[#00104E] hover:bg-[#F4F7FC] transition-colors self-start cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'vi' ? 'Cho người tiếp theo bình chọn' : 'Allow next visitor vote'}
                      </span>
                    </button>
                  )}
                </div>

                <div className="space-y-3.5">
                  {POLL_OPTIONS.map((opt) => {
                    const count = pollVotes[opt.id] || 0;
                    const pct = totalPollVotes > 0 ? Math.round((count / totalPollVotes) * 100) : 0;
                    const isPicked = userVotedOption === opt.id;
                    const accent = PERSONA_INFO[opt.pillar].accentHex;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleCastPollVote(opt.id)}
                        className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${
                          isPicked
                            ? 'border-[#00104E] bg-[#F4F7FC] shadow-sm'
                            : 'border-[#00104E]/12 bg-white hover:border-[#00104E]/45'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3 h-3 rounded-[3px] shrink-0"
                              style={{ backgroundColor: accent }}
                              aria-hidden="true"
                            />
                            <span className="text-sm md:text-base font-bold text-[#00104E]">
                              {lang === 'vi' ? opt.titleVi : opt.titleEn}
                            </span>
                            {isPicked && (
                              <span className="text-xs font-bold text-[#15B567] inline-flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                {lang === 'vi' ? 'Lựa chọn của bạn' : 'Your vote'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 font-mono text-xs tabular-nums shrink-0">
                            <span className="text-[#5B6885]">
                              {count} {lang === 'vi' ? 'phiếu' : 'votes'}
                            </span>
                            <span className="font-bold text-[#00104E] w-10 text-right">
                              {pct}%
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#4B5978] mb-3.5">
                          {lang === 'vi' ? opt.descVi : opt.descEn}
                        </p>

                        <div className="w-full h-2.5 rounded-full bg-[#00104E]/8 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: isPicked ? '#00104E' : accent }}
                            initial={false}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ==================== TAB 4: BOOTH QR CODE GENERATOR ==================== */}
            {activeTab === 'qr' && (
              <motion.div
                key="tab-qr"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
              >
                <BoothQrGenerator lang={lang} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
