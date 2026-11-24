import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Compass,
  Download,
  FileSpreadsheet,
  Maximize2,
  Minimize2,
  Plus,
  Send,
  X,
} from 'lucide-react';
import type { Lang } from '../data/vyabData';
import {
  INITIAL_POLICY_RESPONSES,
  POLICY_APPROACHES,
  POLICY_DOMAINS,
  SURVEY_CITIES,
  type PolicyApproachId,
  type PolicyDomain,
  type PolicyDomainId,
  type PolicySurveyResponse,
} from '../data/policyMapData';
import { FourColorMark, VyabKicker } from './VyabBrandMark';
import { DomainBadge, DomainVignette, FolkCrane, SwirlCloud } from './PolicyIllustrations';

interface YouthPolicyMapSectionProps {
  lang: Lang;
}

const STORAGE_POLICY_MAP_KEY = 'vyab_policy_map_responses_v1';
const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PositionedNode {
  response: PolicySurveyResponse;
  x: number;
  y: number;
  domain: PolicyDomain;
}

export function YouthPolicyMapSection({ lang }: YouthPolicyMapSectionProps) {
  const [responses, setResponses] = useState<PolicySurveyResponse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POLICY_MAP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage failure
    }
    return INITIAL_POLICY_RESPONSES;
  });

  // Survey Form State
  const [primaryDomain, setPrimaryDomain] = useState<PolicyDomainId>('green-climate');
  const [secondaryDomain, setSecondaryDomain] = useState<PolicyDomainId | ''>('');
  const [approach, setApproach] = useState<PolicyApproachId>('co-design');
  const [keyword, setKeyword] = useState('');
  const [thought, setThought] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [ageGroup, setAgeGroup] = useState<'16–19' | '20–24' | '25–30'>('20–24');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [showSurveyDrawer, setShowSurveyDrawer] = useState(true);

  // Map Interaction State
  const [focusedDomainId, setFocusedDomainId] = useState<PolicyDomainId | 'all'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POLICY_MAP_KEY, JSON.stringify(responses));
    } catch {
      // ignore
    }
  }, [responses]);

  // Escape key closes fullscreen exhibition map
  useEffect(() => {
    if (!isFullscreenMap) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreenMap(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreenMap]);

  // Compute domain statistics (primary = 1 weight, secondary = 0.5 weight for interest heat, plus primary count)
  const domainStats = useMemo(() => {
    const counts: Record<PolicyDomainId, number> = {
      'green-climate': 0,
      'digital-ai': 0,
      'green-jobs': 0,
      'education-mobility': 0,
      'health-wellbeing': 0,
      'youth-governance': 0,
    };
    const mentions: Record<PolicyDomainId, number> = { ...counts };

    responses.forEach((r) => {
      counts[r.primaryDomain] += 1;
      mentions[r.primaryDomain] += 1;
      if (r.secondaryDomain && r.secondaryDomain !== r.primaryDomain) {
        mentions[r.secondaryDomain] += 1;
      }
    });

    const total = responses.length || 1;
    return POLICY_DOMAINS.map((domain) => ({
      domain,
      primaryCount: counts[domain.id],
      totalMentions: mentions[domain.id],
      sharePct: Math.round((counts[domain.id] / total) * 100),
    })).sort((a, b) => b.primaryCount - a.primaryCount);
  }, [responses]);

  const approachStats = useMemo(() => {
    const counts: Record<PolicyApproachId, number> = {
      'co-design': 0,
      accessible: 0,
      'funding-skills': 0,
      'beyond-cities': 0,
    };
    responses.forEach((r) => {
      counts[r.approach] += 1;
    });
    const total = responses.length || 1;
    return POLICY_APPROACHES.map((item) => ({
      ...item,
      count: counts[item.id],
      pct: Math.round((counts[item.id] / total) * 100),
    })).sort((a, b) => b.count - a.count);
  }, [responses]);

  // Deterministically arrange individual youth thought nodes in clean rings around their policy hub
  const positionedNodes = useMemo<PositionedNode[]>(() => {
    const grouped: Record<PolicyDomainId, PolicySurveyResponse[]> = {
      'green-climate': [],
      'digital-ai': [],
      'green-jobs': [],
      'education-mobility': [],
      'health-wellbeing': [],
      'youth-governance': [],
    };
    responses.forEach((r) => grouped[r.primaryDomain].push(r));

    const nodes: PositionedNode[] = [];
    POLICY_DOMAINS.forEach((domain) => {
      const list = grouped[domain.id];
      const stat = domainStats.find((s) => s.domain.id === domain.id);
      const hubRadius = 54 + Math.min(14, (stat?.primaryCount || 0) * 1.6);

      list.forEach((resp, idx) => {
        const ring = Math.floor(idx / 8);
        const posInRing = idx % 8;
        const countInRing = Math.min(8, list.length - ring * 8);
        const baseAngle = (Math.atan2(domain.cy - 290, domain.cx - 500) + Math.PI * 0.15);
        const angle =
          baseAngle + (posInRing / Math.max(1, countInRing)) * Math.PI * 2 + ring * 0.4;
        const orbitRadius = hubRadius + 20 + ring * 16;

        const x = Math.max(36, Math.min(964, domain.cx + Math.cos(angle) * orbitRadius));
        const y = Math.max(36, Math.min(544, domain.cy + Math.sin(angle) * orbitRadius));

        nodes.push({ response: resp, x, y, domain });
      });
    });

    return nodes;
  }, [responses, domainStats]);

  // Cross-domain bridges (when a participant selects both primary + secondary policy domains)
  const crossDomainLinks = useMemo(() => {
    const pairCounts = new Map<string, { from: PolicyDomain; to: PolicyDomain; count: number }>();
    responses.forEach((r) => {
      if (!r.secondaryDomain || r.secondaryDomain === r.primaryDomain) return;
      const key = [r.primaryDomain, r.secondaryDomain].sort().join('--');
      const existing = pairCounts.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        const from = POLICY_DOMAINS.find((d) => d.id === r.primaryDomain);
        const to = POLICY_DOMAINS.find((d) => d.id === r.secondaryDomain);
        if (from && to) pairCounts.set(key, { from, to, count: 1 });
      }
    });
    return Array.from(pairCounts.values());
  }, [responses]);

  const selectedNode = useMemo(
    () => positionedNodes.find((n) => n.response.id === selectedNodeId) || null,
    [positionedNodes, selectedNodeId]
  );

  const visibleResponses = useMemo(() => {
    if (focusedDomainId === 'all') return responses;
    return responses.filter(
      (r) => r.primaryDomain === focusedDomainId || r.secondaryDomain === focusedDomainId
    );
  }, [responses, focusedDomainId]);

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedThought = thought.trim();
    const cleanedKeyword = keyword.trim();
    if (!cleanedThought) return;

    const newResponse: PolicySurveyResponse = {
      id: `pr-${Date.now()}`,
      name: name.trim() || (lang === 'vi' ? 'Thanh niên tại Triển lãm' : 'Exhibition Visitor'),
      city,
      ageGroup,
      primaryDomain,
      secondaryDomain:
        secondaryDomain && secondaryDomain !== primaryDomain ? secondaryDomain : undefined,
      approach,
      keyword:
        cleanedKeyword ||
        (POLICY_DOMAINS.find((d) => d.id === primaryDomain)?.shortVi ?? 'Chính sách mới'),
      thought: cleanedThought,
      createdAt: lang === 'vi' ? 'Vừa đóng góp' : 'Just submitted',
    };

    setResponses((prev) => [newResponse, ...prev]);
    setJustAddedId(newResponse.id);
    setSelectedNodeId(newResponse.id);
    setFocusedDomainId('all');
    setThought('');
    setKeyword('');
    setName('');
    setSecondaryDomain('');

    setTimeout(() => {
      setJustAddedId((curr) => (curr === newResponse.id ? null : curr));
    }, 5000);
  };

  // Export High-Resolution Post-Exhibition Big Policy Map Poster (2400x1400 PNG)
  const handleExportBigMapPng = () => {
    const W = 2400;
    const H = 1400;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Official VYAB Midnight Navy Background
    ctx.fillStyle = '#00104E';
    ctx.fillRect(0, 0, W, H);

    // Subtle VYAB Concentric Cobalt Rings Top-Right
    ctx.strokeStyle = '#123985';
    ctx.lineWidth = 42;
    ctx.beginPath();
    ctx.arc(W - 90, 90, 290, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W - 90, 90, 185, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle Outer Frame
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, W - 88, H - 88);

    // Official 4-color VYAB brand squares
    const brandColors = ['#F04533', '#1C69C7', '#FFD014', '#1CD07A'];
    brandColors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.fillRect(88 + idx * 28, 86, 18, 18);
    });

    // Header Title
    ctx.fillStyle = '#FFD014';
    ctx.font = '700 22px "Source Sans 3", sans-serif';
    ctx.fillText(
      'VIETNAM YOUTH ADVISORY BOARD (VYAB) · EXHIBITION COLLECTIVE POLICY MAP',
      216,
      102
    );

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 60px "Barlow Condensed", "Source Sans 3", sans-serif';
    ctx.fillText(
      lang === 'vi'
        ? 'Bản Đồ Chính Sách Thanh Niên Thời Đại Mới'
        : 'New-Era Youth Policy Constellation Map',
      88,
      182
    );

    ctx.fillStyle = '#FFD014';
    ctx.font = '600 24px "Source Sans 3", sans-serif';
    ctx.fillText(
      lang === 'vi'
        ? `Tổng hợp ${responses.length} tiếng nói thanh niên tại Triển lãm VYAB · Khóa 1 (2024–2026)`
        : `Synthesizing ${responses.length} youth voices from the VYAB Exhibition · Cohort 1 (2024–2026)`,
      88,
      226
    );

    // Map Coordinate Mapping (Left 1560px area)
    const mapOffsetX = 60;
    const mapOffsetY = 260;
    const scaleX = 1.54;
    const scaleY = 1.72;
    const mapX = (x: number) => mapOffsetX + x * scaleX;
    const mapY = (y: number) => mapOffsetY + y * scaleY;

    // Subtle Orbital Rings around Core (500, 290)
    const coreX = mapX(500);
    const coreY = mapY(290);
    [180, 340, 490].forEach((r) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(coreX, coreY, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Cross-domain links
    crossDomainLinks.forEach((link) => {
      ctx.strokeStyle = 'rgba(255, 208, 20, 0.28)';
      ctx.lineWidth = Math.min(6, 1.5 + link.count * 1.1);
      ctx.beginPath();
      ctx.moveTo(mapX(link.from.cx), mapY(link.from.cy));
      ctx.lineTo(mapX(link.to.cx), mapY(link.to.cy));
      ctx.stroke();
    });

    // Hub spokes from core
    POLICY_DOMAINS.forEach((d) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(coreX, coreY);
      ctx.lineTo(mapX(d.cx), mapY(d.cy));
      ctx.stroke();
    });

    // Individual youth nodes + connections to hub
    positionedNodes.forEach((node) => {
      const nx = mapX(node.x);
      const ny = mapY(node.y);
      const hx = mapX(node.domain.cx);
      const hy = mapY(node.domain.cy);

      ctx.strokeStyle = `${node.domain.color}55`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      ctx.fillStyle = node.domain.color;
      ctx.beginPath();
      ctx.arc(nx, ny, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Policy Hubs
    POLICY_DOMAINS.forEach((d) => {
      const stat = domainStats.find((s) => s.domain.id === d.id);
      const count = stat?.primaryCount || 0;
      const pct = stat?.sharePct || 0;
      const radius = 44 + Math.min(36, count * 4.5);
      const hx = mapX(d.cx);
      const hy = mapY(d.cy);

      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(hx, hy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '700 30px "Source Sans 3", sans-serif';
      ctx.fillText(`${pct}%`, hx, hy + 5);
      ctx.font = '600 18px "Source Sans 3", sans-serif';
      ctx.fillText(lang === 'vi' ? d.shortVi : d.shortEn, hx, hy + radius + 28);
    });

    // Center VYAB Core
    ctx.fillStyle = '#000B38';
    ctx.beginPath();
    ctx.arc(coreX, coreY, 68, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFD014';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '800 34px "Barlow Condensed", "Source Sans 3", sans-serif';
    ctx.fillText('VYAB', coreX, coreY + 4);
    ctx.fillStyle = '#FFD014';
    ctx.font = '600 15px "Source Sans 3", sans-serif';
    ctx.fillText('2024–2026', coreX, coreY + 28);

    // Right Column Summary Sidebar (x = 1660..2310)
    ctx.textAlign = 'left';
    const sideX = 1660;
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sideX - 36, 260);
    ctx.lineTo(sideX - 36, 1280);
    ctx.stroke();

    ctx.fillStyle = '#FFD014';
    ctx.font = '700 20px "Source Sans 3", sans-serif';
    ctx.fillText(
      lang === 'vi' ? 'MỨC ĐỘ QUAN TÂM CHÍNH SÁCH' : 'TOP POLICY PRIORITIES',
      sideX,
      304
    );

    domainStats.forEach((item, idx) => {
      const y = 360 + idx * 92;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 22px "Source Sans 3", sans-serif';
      ctx.fillText(
        `${idx + 1}. ${lang === 'vi' ? item.domain.shortVi : item.domain.shortEn}`,
        sideX,
        y
      );
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.textAlign = 'right';
      ctx.font = '600 22px monospace';
      ctx.fillText(`${item.sharePct}% (${item.primaryCount})`, 2308, y);
      ctx.textAlign = 'left';

      // Progress bar
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(sideX, y + 16, 648, 14);
      ctx.fillStyle = item.domain.color;
      ctx.fillRect(sideX, y + 16, Math.max(12, (648 * item.sharePct) / 100), 14);
    });

    // Emerging Keywords List
    ctx.fillStyle = '#FFD014';
    ctx.font = '700 20px "Source Sans 3", sans-serif';
    ctx.fillText(
      lang === 'vi' ? 'TỪ KHÓA NỔI BẬT TỪ NGƯỜI TRẺ' : 'EMERGING YOUTH KEYWORDS',
      sideX,
      960
    );

    const keywords = Array.from(new Set(responses.map((r) => r.keyword))).slice(0, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '600 21px "Source Sans 3", sans-serif';
    keywords.forEach((kw, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      ctx.fillText(`·  ${kw}`, sideX + col * 320, 1012 + row * 44);
    });

    // Footer line
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 18px "Source Sans 3", sans-serif';
    ctx.fillText(
      'Engage · Empower · Connect  |  Sky Garden, EU Delegation to Viet Nam · 27 November 2026',
      88,
      1316
    );

    const link = document.createElement('a');
    link.download = `VYAB-Youth-Policy-Map-${responses.length}-voices.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setExportMessage(
      lang === 'vi'
        ? 'Đã xuất Poster Bản đồ Chính sách (2400×1400 PNG) sẵn sàng trình chiếu.'
        : 'Exported high-resolution Policy Map Poster (2400×1400 PNG).'
    );
    setTimeout(() => setExportMessage(null), 3500);
  };

  // Export raw survey data as UTF-8 CSV for post-exhibition policy synthesis
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Name',
      'City',
      'AgeGroup',
      'PrimaryDomain',
      'SecondaryDomain',
      'DesiredApproach',
      'Keyword',
      'Thought',
      'Timestamp',
    ];
    const escapeCell = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    const rows = responses.map((r) =>
      [
        r.id,
        r.name,
        r.city,
        r.ageGroup,
        r.primaryDomain,
        r.secondaryDomain || '',
        r.approach,
        r.keyword,
        r.thought,
        r.createdAt,
      ]
        .map(escapeCell)
        .join(',')
    );
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VYAB-Youth-Policy-Survey-${responses.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExportMessage(
      lang === 'vi'
        ? `Đã tải tệp CSV tổng hợp ${responses.length} phản hồi khảo sát.`
        : `Downloaded CSV dataset with ${responses.length} survey responses.`
    );
    setTimeout(() => setExportMessage(null), 3500);
  };

  const hubRadiusFor = (count: number) => 50 + Math.min(14, count * 1.6);

  // Gentle bow for "silk ribbon" connectors between two points
  const ribbonPath = (x1: number, y1: number, x2: number, y2: number, bend = 0.18) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return `M${x1} ${y1} Q${mx - dy * bend} ${my + dx * bend} ${x2} ${y2}`;
  };

  const renderConstellationSvg = (large = false) => {
    const uid = large ? 'vymap-lg' : 'vymap';
    return (
    <div className="relative w-full bg-[#FFF7E4] rounded-2xl border-4 border-[#010C44] shadow-xl overflow-hidden">
      <svg
        viewBox="0 0 1000 580"
        className={`w-full h-auto block select-none ${large ? 'max-h-[72vh]' : ''}`}
        role="img"
        aria-label={
          lang === 'vi'
            ? 'Bản đồ minh họa chính sách thanh niên thời đại mới VYAB'
            : 'VYAB illustrated New-Era Youth Policy Map'
        }
      >
        <defs>
          <pattern id={`${uid}-waves`} width="120" height="22" patternUnits="userSpaceOnUse">
            <path
              d="M0 11 Q15 4 30 11 T60 11 T90 11 T120 11"
              fill="none"
              stroke="#F1D9A0"
              strokeWidth="1.1"
            />
          </pattern>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" stopColor="#FFE38A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFE38A" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-medal`}>
            <circle r="58" />
          </clipPath>
        </defs>

        {/* Illustrated backdrop: cream paper, flowing lines, golden clouds, hills */}
        <rect width="1000" height="580" fill="#FFF7E4" />
        <rect width="1000" height="580" fill={`url(#${uid}-waves)`} />
        <path
          d="M0 0 H300 C270 34 214 22 190 50 C166 78 118 62 96 88 C72 114 30 104 0 132 Z"
          fill="#FFE3A3"
        />
        <path
          d="M0 0 H170 C150 22 116 16 100 34 C84 52 44 46 0 74 Z"
          fill="#FCCB6B"
          opacity="0.75"
        />
        <path
          d="M1000 0 H700 C730 34 786 22 810 50 C834 78 882 62 904 88 C928 114 970 104 1000 132 Z"
          fill="#FFE3A3"
        />
        <path
          d="M1000 0 H830 C850 22 884 16 900 34 C916 52 956 46 1000 74 Z"
          fill="#FCCB6B"
          opacity="0.75"
        />
        <g fill="none" stroke="#E8A90C" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
          <path d="M120 40 a8 8 0 1 1 8 8 a14 14 0 1 1 -15 -16" />
          <path d="M880 40 a8 8 0 1 0 -8 8 a14 14 0 1 0 15 -16" />
        </g>
        <g transform="translate(360 70)">
          <SwirlCloud x={0} y={0} s={2.1} fill="#FFFFFF" />
        </g>
        <g transform="translate(650 300)">
          <SwirlCloud x={0} y={0} s={1.6} fill="#FFFFFF" />
        </g>
        <g transform="translate(330 330)">
          <SwirlCloud x={0} y={0} s={1.5} fill="#FFFFFF" />
        </g>
        <FolkCrane x={620} y={52} s={1.9} />
        <FolkCrane x={380} y={250} s={1.2} wingA="#FFCD0E" wingB="#2573BE" flip />
        <path
          d="M0 520 C120 480 220 500 320 515 C420 530 520 490 640 500 C760 510 860 480 1000 500 V580 H0 Z"
          fill="#9ED9C9"
          opacity="0.75"
        />
        <path
          d="M0 548 C150 522 300 562 450 546 C600 530 760 566 1000 540 V580 H0 Z"
          fill="#6CC79A"
          opacity="0.75"
        />
        <circle cx="968" cy="580" r="62" fill="#EF3E38" />
        <circle cx="886" cy="580" r="20" fill="#EF3E38" />
        <g transform="translate(36 556)">
          <rect width="12" height="12" rx="3" fill="#EF3E38" />
          <rect x="16" width="12" height="12" rx="3" fill="#2573BE" />
          <rect x="32" width="12" height="12" rx="3" fill="#FFCD0E" />
          <rect x="48" width="12" height="12" rx="3" fill="#23CC83" />
        </g>

        {/* Cross-domain ribbons (when youth link 2 policies together) */}
        <g fill="none" strokeLinecap="round">
          {crossDomainLinks.map((link, idx) => {
            const dimmed =
              focusedDomainId !== 'all' &&
              link.from.id !== focusedDomainId &&
              link.to.id !== focusedDomainId;
            return (
              <path
                key={`${link.from.id}-${link.to.id}-${idx}`}
                d={ribbonPath(link.from.cx, link.from.cy, link.to.cx, link.to.cy, 0.12)}
                stroke="#EF3E38"
                strokeOpacity={dimmed ? 0.06 : Math.min(0.55, 0.2 + link.count * 0.08)}
                strokeWidth={Math.min(4, 1.2 + link.count * 0.6)}
                strokeDasharray="1 7"
              />
            );
          })}
        </g>

        {/* Golden spokes from the VYAB sun to each policy medallion */}
        <g fill="none" strokeLinecap="round">
          {POLICY_DOMAINS.map((domain) => {
            const dimmed = focusedDomainId !== 'all' && focusedDomainId !== domain.id;
            return (
              <path
                key={`spoke-${domain.id}`}
                d={ribbonPath(500, 290, domain.cx, domain.cy, 0.1)}
                stroke="#E8A90C"
                strokeOpacity={dimmed ? 0.2 : 0.85}
                strokeWidth={2.4}
                strokeDasharray="2 7"
              />
            );
          })}
        </g>

        {/* Individual youth voices: berries orbiting their medallion */}
        <g>
          {positionedNodes.map((node) => {
            const isDimmed =
              focusedDomainId !== 'all' &&
              node.domain.id !== focusedDomainId &&
              node.response.secondaryDomain !== focusedDomainId;
            const isSelected = selectedNodeId === node.response.id;
            const isNewest = justAddedId === node.response.id;

            return (
              <g key={node.response.id}>
                <line
                  x1={node.domain.cx}
                  y1={node.domain.cy}
                  x2={node.x}
                  y2={node.y}
                  stroke={node.domain.color}
                  strokeOpacity={isDimmed ? 0.08 : isSelected ? 0.85 : 0.4}
                  strokeWidth={isSelected ? 2 : 1.2}
                />

                {isNewest && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill="none"
                    stroke="#EF3E38"
                    strokeWidth={2}
                    initial={{ scale: 0.5, opacity: 0.9 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: 2 }}
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 10 : 7}
                  fill={isSelected ? '#FFCD0E' : node.domain.color}
                  fillOpacity={isDimmed ? 0.2 : 1}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2.6 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setSelectedNodeId(node.response.id)}
                >
                  <title>{`${node.response.keyword} — ${node.response.name} (${node.response.city})`}</title>
                </circle>
                {!isDimmed && (
                  <circle
                    cx={node.x - 2}
                    cy={node.y - 2.2}
                    r={1.6}
                    fill="#FFFFFF"
                    opacity={0.75}
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* 6 illustrated policy medallions */}
        <g>
          {POLICY_DOMAINS.map((domain) => {
            const stat = domainStats.find((s) => s.domain.id === domain.id);
            const count = stat?.primaryCount || 0;
            const pct = stat?.sharePct || 0;
            const radius = hubRadiusFor(count);
            const isActive = focusedDomainId === domain.id;
            const isDimmed = focusedDomainId !== 'all' && !isActive;
            const label = lang === 'vi' ? domain.shortVi : domain.shortEn;
            const labelW = label.length * 7.4 + 28;
            const badge = { x: radius * 0.76, y: radius * 0.68 };

            return (
              <g
                key={domain.id}
                transform={`translate(${domain.cx} ${domain.cy})`}
                className="cursor-pointer"
                onClick={() =>
                  setFocusedDomainId((curr) => (curr === domain.id ? 'all' : domain.id))
                }
                opacity={isDimmed ? 0.4 : 1}
                role="button"
                aria-label={`${label}: ${pct}%`}
              >
                <circle r={radius + 14} fill={`url(#${uid}-glow)`} />
                <circle
                  r={radius + 7}
                  fill="none"
                  stroke="#E8A90C"
                  strokeWidth={2.4}
                  strokeDasharray="0.5 6"
                  strokeLinecap="round"
                />
                <circle r={radius + 2.5} fill="#FFFFFF" />
                <g transform={`scale(${radius / 58})`}>
                  <g clipPath={`url(#${uid}-medal)`}>
                    <DomainVignette id={domain.id} prefix={uid} />
                  </g>
                </g>
                <circle
                  r={radius}
                  fill="none"
                  stroke={isActive ? '#FFCD0E' : domain.color}
                  strokeWidth={isActive ? 6 : 4.5}
                />

                <g transform={`translate(${badge.x} ${badge.y})`}>
                  <circle r={18} fill="#010C44" stroke="#FFCD0E" strokeWidth={2.2} />
                  <text
                    y={4.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="13.5"
                    fontWeight="800"
                    fontFamily="Barlow Condensed, sans-serif"
                  >
                    {pct}%
                  </text>
                </g>

                <g transform={`translate(0 ${radius + 10})`}>
                  <rect
                    x={-labelW / 2}
                    width={labelW}
                    height={24}
                    rx={12}
                    fill={isActive ? domain.color : '#010C44'}
                  />
                  <text
                    y={16.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Source Sans 3, sans-serif"
                  >
                    {label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Central VYAB sun */}
        <g
          className="cursor-pointer"
          transform="translate(500 290)"
          onClick={() => {
            setFocusedDomainId('all');
            setSelectedNodeId(null);
          }}
        >
          <circle r={84} fill={`url(#${uid}-glow)`} />
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M-6 -52 L0 -68 L6 -52 Z"
              fill={i % 2 ? '#E8A90C' : '#FFCD0E'}
              transform={`rotate(${i * 22.5})`}
            />
          ))}
          <circle r={50} fill="#010C44" stroke="#FFCD0E" strokeWidth={3} />
          <circle r={43} fill="none" stroke="#072A6A" strokeWidth={5} />
          <text
            y={6}
            textAnchor="middle"
            fontSize="30"
            fontWeight="900"
            fontFamily="Barlow Condensed, sans-serif"
            letterSpacing="1"
          >
            <tspan fill="#EF3E38">V</tspan>
            <tspan fill="#2573BE">Y</tspan>
            <tspan fill="#FFCD0E">A</tspan>
            <tspan fill="#23CC83">B</tspan>
          </text>
          <text
            y={24}
            textAnchor="middle"
            fill="#FFCD0E"
            fontSize="11"
            fontWeight="700"
            fontFamily="Source Sans 3, sans-serif"
            letterSpacing="1.2"
          >
            {responses.length} {lang === 'vi' ? 'Ý KIẾN' : 'VOICES'}
          </text>
        </g>
      </svg>

      {/* Interactive Node Detail Floating Card inside Map Canvas */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="sm:absolute sm:bottom-4 sm:left-4 sm:right-4 lg:right-auto lg:max-w-md bg-[#000B38]/96 backdrop-blur-md rounded-xl border border-white/25 p-5 text-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-x-2 text-xs">
                <span
                  className="font-bold"
                  style={{ color: selectedNode.domain.color }}
                >
                  {lang === 'vi' ? selectedNode.domain.shortVi : selectedNode.domain.shortEn}
                </span>
                <span className="text-white/40" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#FFD014] font-semibold">{selectedNode.response.keyword}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                aria-label={lang === 'vi' ? 'Đóng thẻ ý kiến' : 'Close node card'}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-white/95 mb-3">
              “{selectedNode.response.thought}”
            </p>
            <p className="text-xs text-white/65 tabular-nums">
              {selectedNode.response.name} · {selectedNode.response.city} ·{' '}
              {selectedNode.response.ageGroup} · {selectedNode.response.createdAt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    );
  };

  return (
    <section id="policy-map" className="vy-edge-right bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
        {/* Section Official VYAB Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <VyabKicker
              label={
                lang === 'vi'
                  ? '05 · Khảo sát & Bản đồ Chính sách Thanh niên'
                  : '05 · New-Era Youth Policy Survey & Map'
              }
              variant="navy-bar"
              className="mb-4"
            />
            <h2 className="vy-title font-display text-4xl md:text-5xl font-extrabold text-[#00104E] tracking-tight leading-[1.08]">
              {lang === 'vi'
                ? 'Người trẻ nghĩ gì về chính sách thời đại mới?'
                : 'Mapping what young people truly care about'}
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-[15px] leading-relaxed text-[#384664]">
              {lang === 'vi'
                ? 'Mỗi lượt khảo sát tại booth sẽ lập tức kết nối thành một điểm sáng trên Bản đồ Chính sách lớn — tổng hợp mối quan tâm thực sự của thế hệ trẻ để xuất thành bản đồ tổng kết sau triển lãm VYAB.'
                : 'Every visitor survey adds a live node to our collective Policy Constellation — revealing emerging priorities and generating an exhibition-ready summary map for VYAB.'}
            </p>
          </div>
        </div>

        {/* Action Toolbar: Survey Toggle + Big Map Exhibition Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#00104E]/12">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSurveyDrawer((v) => !v)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                showSurveyDrawer
                  ? 'bg-[#00104E] text-white'
                  : 'bg-white border border-[#00104E]/20 text-[#00104E] hover:bg-[#00104E] hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {showSurveyDrawer
                  ? lang === 'vi'
                    ? 'Ẩn bảng khảo sát (Mở rộng Bản đồ)'
                    : 'Expand Map Full Width'
                  : lang === 'vi'
                  ? 'Đóng góp khảo sát của bạn'
                  : 'Contribute Your Voice'}
              </span>
            </button>

            <span className="text-xs font-medium text-[#5B6885] pl-2 tabular-nums">
              {lang === 'vi'
                ? `Đã ghi nhận ${responses.length} góc nhìn chính sách`
                : `${responses.length} policy perspectives mapped`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreenMap(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#00104E]/18 text-[#00104E] text-xs font-bold hover:bg-[#00104E] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Bản đồ Tổng kết lớn' : 'Big Exhibition Map'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportBigMapPng}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FFD014] text-[#00104E] text-xs font-extrabold hover:bg-[#ffdc4a] transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Xuất Poster Map (PNG)' : 'Export Map Poster (PNG)'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#00104E]/18 text-[#00104E] text-xs font-semibold hover:bg-[#00104E] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Tải dữ liệu (CSV)' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {exportMessage && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[#15B567]/10 border border-[#15B567]/30 text-xs font-semibold text-[#0F6E40] flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{exportMessage}</span>
          </div>
        )}

        {/* Main Workspace: Survey Composer + Live Interactive Policy Constellation Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Interactive Youth Policy Survey Form */}
          {showSurveyDrawer && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
              className="lg:col-span-5 bg-white rounded-2xl border border-[#00104E]/12 p-6 sm:p-7 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#00104E]/10">
                <div>
                  <p className="text-xs font-bold text-[#1C69C7]">
                    {lang === 'vi' ? 'Khảo sát nhanh · 45 giây' : 'Quick Survey · 45 sec'}
                  </p>
                  <h3 className="font-display text-2xl font-extrabold text-[#00104E] tracking-tight mt-0.5">
                    {lang === 'vi'
                      ? 'Góp một điểm sáng lên Bản đồ'
                      : 'Add your point to the Policy Map'}
                  </h3>
                </div>
                <Compass className="w-5 h-5 text-[#1C69C7] shrink-0" aria-hidden="true" />
              </div>

              <form onSubmit={handleSubmitSurvey} className="space-y-5">
                {/* 1. Primary Policy Domain Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#00104E] mb-2">
                    {lang === 'vi'
                      ? '1. Chính sách bạn quan tâm nhất trong thời đại mới'
                      : '1. Policy domain you care most about'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {POLICY_DOMAINS.map((domain) => {
                      const active = primaryDomain === domain.id;
                      return (
                        <button
                          key={domain.id}
                          type="button"
                          onClick={() => {
                            setPrimaryDomain(domain.id);
                            if (secondaryDomain === domain.id) setSecondaryDomain('');
                          }}
                          aria-pressed={active}
                          className={`text-left pl-1.5 pr-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                            active
                              ? 'border-[#010C44] bg-[#010C44] text-white'
                              : 'border-[#010C44]/14 bg-[#FFF7E4] text-[#2A3754] hover:border-[#010C44]/50'
                          }`}
                        >
                          <DomainBadge
                            id={domain.id}
                            color={active ? '#FFCD0E' : domain.color}
                            className="w-10 h-10 shrink-0"
                          />
                          <span className="leading-tight">
                            {lang === 'vi' ? domain.shortVi : domain.shortEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Optional Secondary Link (Creates Constellation Bridges!) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#00104E] mb-1.5">
                      {lang === 'vi' ? '2. Lĩnh vực liên kết (tùy chọn)' : '2. Linked domain (optional)'}
                    </label>
                    <select
                      value={secondaryDomain}
                      onChange={(e) =>
                        setSecondaryDomain(e.target.value as PolicyDomainId | '')
                      }
                      className="w-full px-3 py-2 rounded-lg text-xs bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E]"
                    >
                      <option value="">
                        {lang === 'vi' ? '— Không chọn thêm —' : '— None —'}
                      </option>
                      {POLICY_DOMAINS.filter((d) => d.id !== primaryDomain).map((d) => (
                        <option key={d.id} value={d.id}>
                          {lang === 'vi' ? d.shortVi : d.shortEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00104E] mb-1.5">
                      {lang === 'vi' ? 'Từ khóa đại diện (2–4 từ)' : 'Core keyword (2–4 words)'}
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder={
                        lang === 'vi' ? 'VD: AI minh bạch, Việc làm xanh' : 'e.g. Ethical AI, Green Jobs'
                      }
                      className="w-full px-3 py-2 rounded-lg text-xs bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] placeholder:text-[#6B7894] focus:outline-none focus:border-[#00104E]"
                    />
                  </div>
                </div>

                {/* 3. Desired Policy Approach */}
                <div>
                  <label className="block text-xs font-bold text-[#00104E] mb-1.5">
                    {lang === 'vi'
                      ? '3. Bạn mong chính sách thay đổi theo cách nào?'
                      : '3. How should policy evolve for young people?'}
                  </label>
                  <select
                    value={approach}
                    onChange={(e) => setApproach(e.target.value as PolicyApproachId)}
                    className="w-full px-3 py-2.5 rounded-lg text-xs bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E]"
                  >
                    {POLICY_APPROACHES.map((item) => (
                      <option key={item.id} value={item.id}>
                        {lang === 'vi' ? item.labelVi : item.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Open Thought on Policy in the New Era */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#00104E]">
                      {lang === 'vi'
                        ? '4. Suy nghĩ của bạn về chính sách trong thời đại mới'
                        : '4. Your thought on policy in the new era'}
                    </label>
                    <span className="font-mono text-[11px] text-[#6B7894] tabular-nums">
                      {thought.length}/200
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    required
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    placeholder={
                      lang === 'vi'
                        ? 'Điều gì bạn mong các nhà hoạch định chính sách Việt Nam & EU lắng nghe nhất lúc này?'
                        : 'What do you most want Viet Nam & EU policymakers to hear from your generation?'
                    }
                    className="w-full px-3 py-2.5 rounded-lg text-xs sm:text-sm bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] placeholder:text-[#6B7894] focus:outline-none focus:border-[#00104E] resize-none"
                  />
                </div>

                {/* 5. Respondent Demographics (Optional Name + City + Age) */}
                <div className="grid grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    maxLength={28}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'vi' ? 'Tên (tùy chọn)' : 'Name'}
                    className="px-3 py-2 rounded-lg text-xs bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] placeholder:text-[#6B7894] focus:outline-none focus:border-[#00104E]"
                  />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label={lang === 'vi' ? 'Thành phố' : 'City'}
                    className="px-2.5 py-2 rounded-lg text-xs bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E]"
                  >
                    {SURVEY_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    value={ageGroup}
                    onChange={(e) =>
                      setAgeGroup(e.target.value as '16–19' | '20–24' | '25–30')
                    }
                    aria-label={lang === 'vi' ? 'Độ tuổi' : 'Age group'}
                    className="px-2.5 py-2 rounded-lg text-xs bg-[#F4F7FC] border border-[#00104E]/15 text-[#00104E] focus:outline-none focus:border-[#00104E] tabular-nums"
                  >
                    <option value="16–19">16–19</option>
                    <option value="20–24">20–24</option>
                    <option value="25–30">25–30</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00104E] text-white text-xs sm:text-sm font-bold hover:bg-[#123985] transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#FFD014]" />
                  <span>
                    {lang === 'vi'
                      ? 'Vẽ tiếng nói của tôi lên Bản đồ'
                      : 'Plot my voice onto the Policy Map'}
                  </span>
                </button>
              </form>
            </motion.div>
          )}

          {/* RIGHT / FULL-WIDTH: Live Interactive Youth Policy Constellation Map */}
          <div className={showSurveyDrawer ? 'lg:col-span-7' : 'lg:col-span-12'}>
            {/* Cluster Filter Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFocusedDomainId('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    focusedDomainId === 'all'
                      ? 'bg-[#00104E] text-white'
                      : 'bg-white border border-[#00104E]/14 text-[#4B5978] hover:text-[#00104E]'
                  }`}
                >
                  {lang === 'vi' ? 'Toàn cảnh (6 cụm)' : 'All 6 Clusters'}
                </button>
                {domainStats.map(({ domain, primaryCount }) => (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() =>
                      setFocusedDomainId((curr) => (curr === domain.id ? 'all' : domain.id))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 tabular-nums ${
                      focusedDomainId === domain.id
                        ? 'bg-[#00104E] text-white'
                        : 'bg-white border border-[#00104E]/14 text-[#384664] hover:border-[#00104E]/45'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                      style={{ backgroundColor: domain.color }}
                      aria-hidden="true"
                    />
                    <span>{lang === 'vi' ? domain.shortVi : domain.shortEn}</span>
                    <span className="opacity-65">({primaryCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {renderConstellationSvg(false)}

            <p className="mt-2.5 text-xs text-[#5B6885] leading-relaxed">
              {lang === 'vi'
                ? 'Hướng dẫn: Nhấn vào từng cụm chính sách để lọc chuyên sâu, hoặc nhấn vào từng điểm sáng để đọc suy nghĩ trực tiếp của người trẻ. Các đường nối màu vàng biểu thị mối liên kết giữa hai lĩnh vực chính sách.'
                : 'Tip: Click any policy hub to isolate that cluster, or click individual nodes to read youth thoughts. Gold bridges indicate cross-domain policy connections.'}
            </p>
          </div>
        </div>

        {/* Bottom Analytical Synthesis Strip: What Youth Truly Care About */}
        <div className="mt-12 pt-10 border-t border-[#00104E]/12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Column 1: Top Ranked Priorities */}
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5B6885] mb-4">
              {lang === 'vi'
                ? 'Thứ hạng mối quan tâm của thanh niên'
                : 'Ranked Youth Policy Priorities'}
            </p>
            <div className="space-y-3.5">
              {domainStats.map(({ domain, primaryCount, sharePct }, idx) => (
                <div key={domain.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#00104E]">
                      0{idx + 1}. {lang === 'vi' ? domain.titleVi : domain.titleEn}
                    </span>
                    <span className="font-mono text-[#384664] tabular-nums shrink-0 ml-2">
                      {sharePct}% · {primaryCount}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#00104E]/8 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: domain.color }}
                      initial={false}
                      animate={{ width: `${Math.max(4, sharePct)}%` }}
                      transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: How Youth Want Policy Made */}
          <div className="lg:col-span-3 lg:border-l border-[#00104E]/10 lg:pl-8">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5B6885] mb-4">
              {lang === 'vi'
                ? 'Kỳ vọng cách làm chính sách'
                : 'How Youth Want Policy Built'}
            </p>
            <div className="divide-y divide-[#00104E]/10">
              {approachStats.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-[#00104E] leading-snug">
                      {lang === 'vi' ? item.labelVi : item.labelEn}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#1C69C7] tabular-nums shrink-0">
                      {item.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Recent Filtered Perspectives Feed */}
          <div className="lg:col-span-4 lg:border-l border-[#00104E]/10 lg:pl-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5B6885]">
                {lang === 'vi' ? 'Tiếng nói mới nhất trên bản đồ' : 'Latest Mapped Perspectives'}
              </p>
              <span className="font-mono text-[11px] text-[#5B6885] tabular-nums">
                {visibleResponses.length}
              </span>
            </div>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {visibleResponses.slice(0, 6).map((item) => {
                const domain = POLICY_DOMAINS.find((d) => d.id === item.primaryDomain);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedNodeId(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl bg-white border transition-colors cursor-pointer ${
                      selectedNodeId === item.id
                        ? 'border-[#00104E] shadow-sm'
                        : 'border-[#00104E]/10 hover:border-[#00104E]/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
                      <span
                        className="font-bold"
                        style={{ color: domain?.color || '#00104E' }}
                      >
                        {item.keyword}
                      </span>
                      <span className="text-[#6B7894] tabular-nums">
                        {item.city} · {item.ageGroup}
                      </span>
                    </div>
                    <p className="text-xs text-[#2A3754] leading-relaxed line-clamp-2">
                      “{item.thought}”
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN BIG EXHIBITION MAP MODAL (For Post-Exhibition Big Screen Showcase) */}
      <AnimatePresence>
        {isFullscreenMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#000B38] text-white flex flex-col justify-between p-5 sm:p-8 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={
              lang === 'vi'
                ? 'Bản đồ Tổng kết Chính sách Thanh niên VYAB'
                : 'VYAB Post-Exhibition Youth Policy Map'
            }
          >
            <div className="max-w-[1360px] w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/15">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <FourColorMark />
                  <span className="font-mono text-xs font-bold text-[#FFD014] tabular-nums">
                    {lang === 'vi'
                      ? `TỔNG KẾT TRIỂN LÃM VYAB · ${responses.length} TIẾNG NÓI THANH NIÊN`
                      : `VYAB EXHIBITION SYNTHESIS · ${responses.length} YOUTH VOICES`}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {lang === 'vi'
                    ? 'Bản Đồ Chính Sách Thanh Niên Thời Đại Mới'
                    : 'New-Era Youth Policy Constellation Map'}
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportBigMapPng}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD014] text-[#00104E] text-xs font-extrabold hover:bg-[#ffdc4a] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'Xuất Poster PNG' : 'Export Poster PNG'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreenMap(false)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/25 text-white text-xs font-semibold hover:bg-white hover:text-[#00104E] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'Thu nhỏ' : 'Exit Fullscreen'}</span>
                </button>
              </div>
            </div>

            <div className="max-w-[1360px] w-full mx-auto my-5 flex-1 flex items-center">
              {renderConstellationSvg(true)}
            </div>

            <div className="max-w-[1360px] w-full mx-auto pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              {domainStats.map(({ domain, sharePct, primaryCount }) => (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() =>
                    setFocusedDomainId((curr) => (curr === domain.id ? 'all' : domain.id))
                  }
                  className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    focusedDomainId === domain.id
                      ? 'border-[#FFD014] bg-white/10'
                      : 'border-white/12 bg-white/4 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="font-mono font-bold text-white tabular-nums">
                      {sharePct}%
                    </span>
                    <span className="text-white/60 tabular-nums">({primaryCount})</span>
                  </div>
                  <p className="text-white/90 font-semibold truncate">
                    {lang === 'vi' ? domain.shortVi : domain.shortEn}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
