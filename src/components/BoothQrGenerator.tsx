import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Compass,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import type { Lang } from '../data/vyabData';
import { FourColorMark, VyabConcentricRings, VyabCoralCircles } from './VyabBrandMark';

interface BoothQrGeneratorProps {
  lang: Lang;
}

type QrPresetId = 'report' | 'survey' | 'booth' | 'linkedin' | 'custom';

interface QrPreset {
  id: QrPresetId;
  icon: typeof FileText;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  defaultNoteVi: string;
  defaultNoteEn: string;
  getUrl: (origin: string) => string;
}

const QR_PRESETS: QrPreset[] = [
  {
    id: 'report',
    icon: FileText,
    titleVi: 'Báo cáo Nhiệm kỳ VYAB (PDF)',
    titleEn: 'VYAB Digital Report (PDF)',
    subtitleVi: 'Quét để xem & lưu bản PDF Báo cáo Khóa 1 (2024–2026)',
    subtitleEn: 'Scan to open & save the Cohort 1 Finale PDF Report',
    defaultNoteVi: 'Quét mã để lưu Báo cáo Nhiệm kỳ VYAB 2024–2026',
    defaultNoteEn: 'Scan to save the VYAB Inaugural Report 2024–2026',
    getUrl: (origin) => `${origin}/assets/aistudio/VYAB_Final_Event_ab822a57.pdf`,
  },
  {
    id: 'survey',
    icon: Compass,
    titleVi: 'Khảo sát & Bản đồ Chính sách',
    titleEn: 'Youth Policy Survey & Map',
    subtitleVi: 'Mở nhanh khảo sát suy nghĩ người trẻ về chính sách thời đại mới',
    subtitleEn: 'Jump directly to the New-Era Youth Policy Survey',
    defaultNoteVi: 'Quét để đóng góp tiếng nói lên Bản đồ Chính sách VYAB',
    defaultNoteEn: 'Scan to plot your voice onto the VYAB Policy Map',
    getUrl: (origin) => `${origin}/#policy-map`,
  },
  {
    id: 'booth',
    icon: Sparkles,
    titleVi: 'Khu vực Tương tác Booth',
    titleEn: 'Interactive Booth Hub',
    subtitleVi: 'Tham gia đố vui nhận thẻ Booth & Bức tường Thanh niên trên điện thoại',
    subtitleEn: 'Take the Booth Quiz & post to the Youth Voice Wall on mobile',
    defaultNoteVi: 'Quét để tham gia trải nghiệm trực tiếp tại Booth VYAB',
    defaultNoteEn: 'Scan to join the interactive VYAB Booth experience',
    getUrl: (origin) => `${origin}/#booth`,
  },
  {
    id: 'linkedin',
    icon: Globe,
    titleVi: 'Kết nối LinkedIn VYAB',
    titleEn: 'Official VYAB LinkedIn',
    subtitleVi: 'Theo dõi hoạt động & thông tin tuyển thành viên Khóa 2',
    subtitleEn: 'Follow announcements & Cohort 2 recruitment updates',
    defaultNoteVi: 'Kết nối cùng Vietnam Youth Advisory Board trên LinkedIn',
    defaultNoteEn: 'Connect with Vietnam Youth Advisory Board on LinkedIn',
    getUrl: () => 'https://www.linkedin.com/company/vyab/',
  },
  {
    id: 'custom',
    icon: Link2,
    titleVi: 'Liên kết tùy chỉnh',
    titleEn: 'Custom Booth Link',
    subtitleVi: 'Tạo mã QR cho biểu mẫu đăng ký, ảnh sự kiện hoặc tài liệu khác',
    subtitleEn: 'Generate a branded QR for forms, photo albums, or links',
    defaultNoteVi: 'Quét mã để truy cập liên kết từ Booth VYAB',
    defaultNoteEn: 'Scan to open this VYAB Booth resource',
    getUrl: () => '',
  },
];

const QR_COLORS = [
  { hex: '#00104E', labelVi: 'Midnight Navy VYAB', labelEn: 'VYAB Midnight Navy' },
  { hex: '#1C69C7', labelVi: 'Xanh Cobalt EU', labelEn: 'EU Cobalt' },
  { hex: '#C93222', labelVi: 'Đỏ San Hô VYAB', labelEn: 'VYAB Coral' },
  { hex: '#108A4E', labelVi: 'Xanh Ngọc Thanh Niên', labelEn: 'Youth Emerald' },
];

export function BoothQrGenerator({ lang }: BoothQrGeneratorProps) {
  const origin = useMemo(() => {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin;
    }
    return 'https://vyab.vietnam.eu';
  }, []);

  const [presetId, setPresetId] = useState<QrPresetId>('report');
  const [customUrl, setCustomUrl] = useState('https://www.linkedin.com/company/vyab/');
  const [customCaption, setCustomCaption] = useState('');
  const [qrColor, setQrColor] = useState('#00104E');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrError, setQrError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activePreset = QR_PRESETS.find((p) => p.id === presetId) || QR_PRESETS[0];

  const targetUrl = useMemo(() => {
    if (presetId === 'custom') {
      return customUrl.trim() || `${origin}/#policy-map`;
    }
    return activePreset.getUrl(origin);
  }, [presetId, customUrl, activePreset, origin]);

  const effectiveCaption =
    customCaption.trim() ||
    (lang === 'vi' ? activePreset.defaultNoteVi : activePreset.defaultNoteEn);

  useEffect(() => {
    let cancelled = false;
    setQrError(null);

    QRCode.toDataURL(targetUrl, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: qrColor,
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) {
          setQrError(
            lang === 'vi'
              ? 'Liên kết quá dài hoặc chưa hợp lệ để tạo mã QR.'
              : 'Unable to encode this URL into a QR code.'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [targetUrl, qrColor, lang]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadPlainQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `VYAB-QR-${presetId}.png`;
    link.href = qrDataUrl;
    link.click();
    setStatusMessage(
      lang === 'vi'
        ? 'Đã tải ảnh mã QR độ phân giải cao (640×640 PNG).'
        : 'Downloaded high-resolution QR code (640×640 PNG).'
    );
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDownloadStandeePoster = async () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Official VYAB Midnight Navy Standee Card
    ctx.fillStyle = '#00104E';
    ctx.fillRect(0, 0, 1080, 1440);

    // Official VYAB Concentric Cobalt Rings Top-Right
    ctx.strokeStyle = '#123985';
    ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.arc(980, 120, 230, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(980, 120, 145, 0, Math.PI * 2);
    ctx.stroke();

    // Official VYAB Twin Coral Circles Bottom-Left
    ctx.fillStyle = '#F04533';
    ctx.beginPath();
    ctx.arc(92, 1390, 96, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(216, 1412, 42, 0, Math.PI * 2);
    ctx.fill();

    // Inner White Hairline Frame
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 996, 1356);

    // VYAB Official 4-Color Squares Centered Top
    const colors = ['#F04533', '#1C69C7', '#FFD014', '#1CD07A'];
    const startX = 540 - (4 * 20 + 3 * 12) / 2;
    colors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.fillRect(startX + idx * 32, 92, 20, 20);
    });

    // Top Kicker
    ctx.fillStyle = '#FFD014';
    ctx.textAlign = 'center';
    ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText('VIETNAM YOUTH ADVISORY BOARD · 2024–2026', 540, 158);

    // Main Geometric Display Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 52px "Big Shoulders Display", "Be Vietnam Pro", sans-serif';
    ctx.fillText(
      lang === 'vi' ? activePreset.titleVi : activePreset.titleEn,
      540,
      236
    );

    // White Framed QR Container with Generous Quiet Zone
    const boxSize = 680;
    const boxX = (1080 - boxSize) / 2;
    const boxY = 300;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(boxX, boxY, boxSize, boxSize);

    // VYAB Yellow Accent Rule at Top of QR Box
    ctx.fillStyle = '#FFD014';
    ctx.fillRect(boxX, boxY, boxSize, 12);

    // Draw Real Scannable QR Image
    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise<void>((resolve) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => resolve();
    });
    ctx.drawImage(qrImg, boxX + 50, boxY + 55, 580, 580);

    // Caption below QR
    ctx.fillStyle = '#FFD014';
    ctx.font = '700 28px "Big Shoulders Display", "Be Vietnam Pro", sans-serif';
    ctx.fillText(effectiveCaption.slice(0, 54), 540, 1068);

    // Shortened URL display
    const cleanDisplayUrl = targetUrl.replace(/^https?:\/\//, '');
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '400 20px monospace';
    ctx.fillText(
      cleanDisplayUrl.length > 56 ? `${cleanDisplayUrl.slice(0, 53)}...` : cleanDisplayUrl,
      540,
      1124
    );

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 1210);
    ctx.lineTo(960, 1210);
    ctx.stroke();

    // Footer Credits
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '500 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Engage · Empower · Connect', 540, 1272);
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.font = '400 18px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Sky Garden, EU Delegation to Viet Nam · 27 November 2026', 540, 1316);

    const link = document.createElement('a');
    link.download = `VYAB-Booth-Standee-QR-${presetId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setStatusMessage(
      lang === 'vi'
        ? 'Đã tải Poster QR trưng bày tại bàn Booth (1080×1440 PNG).'
        : 'Downloaded print-ready Booth QR Standee Poster (1080×1440 PNG).'
    );
    setTimeout(() => setStatusMessage(null), 3200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left: Destination Selector & Booth Customization */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#1C69C7] mb-2">
            {lang === 'vi'
              ? 'Quét nhanh bằng camera điện thoại · Tải báo cáo & mở khảo sát tức thì'
              : 'Instant phone camera scan · Save the digital report or open the survey'}
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-extrabold text-[#00104E] tracking-tight leading-tight mb-2">
            {lang === 'vi'
              ? 'Trình tạo mã QR dành cho Booth VYAB'
              : 'VYAB Booth QR Code Generator'}
          </h3>
          <p className="text-sm text-[#384664] leading-relaxed">
            {lang === 'vi'
              ? 'Chọn tài liệu hoặc khu vực tương tác bạn muốn chia sẻ. Khách tham quan có thể quét trực tiếp trên màn hình hoặc tải mẫu bảng QR trưng bày đặt tại bàn booth.'
              : 'Choose a digital resource or interactive station to generate a scannable QR code on the spot—ready for visitors to scan or download as a tabletop standee.'}
          </p>
        </div>

        {/* Preset Destination Selector */}
        <div>
          <label className="block text-xs font-bold text-[#00104E] mb-2.5">
            {lang === 'vi' ? '1. Chọn điểm đến cho mã QR' : '1. Choose QR destination'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {QR_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const selected = preset.id === presetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setPresetId(preset.id);
                    setCustomCaption('');
                  }}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    selected
                      ? 'border-[#00104E] bg-[#00104E] text-white shadow-sm'
                      : 'border-[#00104E]/14 bg-[#F4F7FC] text-[#00104E] hover:border-[#00104E]/45'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      selected ? 'text-[#FFD014]' : 'text-[#1C69C7]'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold leading-snug">
                      {lang === 'vi' ? preset.titleVi : preset.titleEn}
                    </p>
                    <p
                      className={`text-[11px] leading-relaxed mt-0.5 ${
                        selected ? 'text-white/75' : 'text-[#5B6885]'
                      }`}
                    >
                      {lang === 'vi' ? preset.subtitleVi : preset.subtitleEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom URL Input (when Custom is active) */}
        {presetId === 'custom' && (
          <div>
            <label className="block text-xs font-bold text-[#00104E] mb-1.5">
              {lang === 'vi' ? 'Đường dẫn liên kết (URL)' : 'Destination URL'}
            </label>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#F4F7FC] border border-[#00104E]/18 text-[#00104E] focus:outline-none focus:border-[#00104E]"
            />
          </div>
        )}

        {/* Caption & High-Contrast Brand Color */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <label className="block text-xs font-bold text-[#00104E] mb-1.5">
              {lang === 'vi'
                ? '2. Ghi chú trên thẻ QR (tùy chọn)'
                : '2. Booth card caption (optional)'}
            </label>
            <input
              type="text"
              maxLength={60}
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              placeholder={lang === 'vi' ? activePreset.defaultNoteVi : activePreset.defaultNoteEn}
              className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] placeholder:text-[#6B7894] focus:outline-none focus:border-[#00104E]"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-[#00104E] mb-1.5">
              {lang === 'vi' ? '3. Tông màu mã QR' : '3. QR Ink Tone'}
            </label>
            <div className="flex items-center gap-2 pt-1">
              {QR_COLORS.map((swatch) => {
                const active = qrColor === swatch.hex;
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => setQrColor(swatch.hex)}
                    aria-label={lang === 'vi' ? swatch.labelVi : swatch.labelEn}
                    aria-pressed={active}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-transform cursor-pointer ${
                      active
                        ? 'border-[#00104E] ring-2 ring-[#FFD014] scale-105'
                        : 'border-[#00104E]/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {active && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copy & Open Link Utility Bar */}
        <div className="p-3.5 rounded-xl bg-[#F4F7FC] border border-[#00104E]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-mono text-xs text-[#384664] truncate min-w-0" title={targetUrl}>
            {targetUrl}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00104E]/18 text-[#00104E] text-xs font-semibold hover:bg-[#00104E] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#15B567]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>
                {copied
                  ? lang === 'vi'
                    ? 'Đã sao chép'
                    : 'Copied'
                  : lang === 'vi'
                  ? 'Sao chép'
                  : 'Copy link'}
              </span>
            </button>
            <a
              href={targetUrl}
              target={presetId === 'report' || presetId === 'linkedin' || presetId === 'custom' ? '_blank' : undefined}
              rel={presetId === 'report' || presetId === 'linkedin' || presetId === 'custom' ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00104E]/18 text-[#00104E] text-xs font-semibold hover:bg-[#00104E] hover:text-white transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Mở thử' : 'Open'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right: Live Scannable VYAB Standee Preview & Export Buttons */}
      <div className="lg:col-span-5">
        <div className="bg-[#00104E] text-white p-6 sm:p-7 rounded-2xl relative overflow-hidden shadow-xl">
          <VyabConcentricRings className="absolute -right-24 -top-24 w-[240px] h-[240px] opacity-75" />
          <VyabCoralCircles className="absolute -bottom-6 -left-10 w-[160px] opacity-85" />
          <div
            className="absolute inset-3 rounded-xl border border-white/15 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-4">
              <FourColorMark />
              <span className="font-mono text-[11px] text-white/80 inline-flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-[#FFD014]" />
                SCAN READY
              </span>
            </div>

            <p className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-4">
              {lang === 'vi' ? activePreset.titleVi : activePreset.titleEn}
            </p>

            {/* White Scannable QR Frame with VYAB Yellow Top Accent */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full max-w-[250px] mb-4">
              <div className="h-2 w-full bg-[#FFD014]" aria-hidden="true" />
              <div className="p-4 aspect-square flex items-center justify-center">
                {qrError ? (
                  <p className="text-xs text-[#F04533] px-2">{qrError}</p>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={lang === 'vi' ? `Mã QR cho ${activePreset.titleVi}` : `QR code for ${activePreset.titleEn}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-[#5B6885]">
                    {lang === 'vi' ? 'Đang tạo mã QR...' : 'Generating QR...'}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs font-semibold text-[#FFD014] leading-relaxed max-w-xs mb-5">
              {effectiveCaption}
            </p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={handleDownloadStandeePoster}
                disabled={!qrDataUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#FFD014] text-[#00104E] text-xs font-extrabold hover:bg-[#ffdc4a] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Tải bảng QR Booth' : 'Download Standee'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPlainQr}
                disabled={!qrDataUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-white/30 text-white text-xs font-semibold hover:bg-white hover:text-[#00104E] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Tải ảnh QR (PNG)' : 'Plain QR (PNG)'}</span>
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <p className="mt-3 text-xs font-semibold text-[#15B567] flex items-center gap-1.5">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
}
