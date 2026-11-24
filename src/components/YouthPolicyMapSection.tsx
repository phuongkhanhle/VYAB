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
      const hubRadius = 30 + Math.min(24, (stat?.primaryCount || 0) * 3.2);

      list.forEach((resp, idx) => {
        const ring = Math.floor(idx / 8);
        const posInRing = idx % 8;
        const countInRing = Math.min(8, list.length - ring * 8);
        const baseAngle = (Math.atan2(domain.cy - 290, domain.cx - 500) + Math.PI * 0.15);
        const angle =
          baseAngle + (posInRing / Math.max(1, countInRing)) * Math.PI * 2 + ring * 0.4;
        const orbitRadius = hubRadius + 28 + ring * 22;

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
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      'VIETNAM YOUTH ADVISORY BOARD (VYAB) · EXHIBITION COLLECTIVE POLICY MAP',
      216,
      102
    );

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 60px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      lang === 'vi'
        ? 'Bản Đồ Chính Sách Thanh Niên Thời Đại Mới'
        : 'New-Era Youth Policy Constellation Map',
      88,
      182
    );

    ctx.fillStyle = '#FFD014';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
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
      ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${pct}%`, hx, hy + 5);
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
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
    ctx.font = '800 34px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillText('VYAB', coreX, coreY + 4);
    ctx.fillStyle = '#FFD014';
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
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
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      lang === 'vi' ? 'MỨC ĐỘ QUAN TÂM CHÍNH SÁCH' : 'TOP POLICY PRIORITIES',
      sideX,
      304
    );

    domainStats.forEach((item, idx) => {
      const y = 360 + idx * 92;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
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
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      lang === 'vi' ? 'TỪ KHÓA NỔI BẬT TỪ NGƯỜI TRẺ' : 'EMERGING YOUTH KEYWORDS',
      sideX,
      960
    );

    const keywords = Array.from(new Set(responses.map((r) => r.keyword))).slice(0, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
    keywords.forEach((kw, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      ctx.fillText(`·  ${kw}`, sideX + col * 320, 1012 + row * 44);
    });

    // Footer line
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
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

  const renderConstellationSvg = (large = false) => (
    <div className="relative w-full bg-[#00104E] rounded-2xl border border-[#123985]/70 shadow-xl overflow-hidden">
      <svg
        viewBox="0 0 1000 580"
        className={`w-full h-auto block select-none ${large ? 'max-h-[72vh]' : ''}`}
        role="img"
        aria-label={
          lang === 'vi'
            ? 'Bản đồ chòm sao chính sách thanh niên thời đại mới VYAB'
            : 'VYAB New-Era Youth Policy Constellation Map'
        }
      >
        {/* Subtle Concentric Orbit Guides */}
        <g stroke="rgba(255,255,255,0.09)" fill="none">
          <circle cx="500" cy="290" r="118" strokeDasharray="3 5" />
          <circle cx="500" cy="290" r="218" />
          <circle cx="500" cy="290" r="320" strokeDasharray="2 6" />
        </g>

        {/* Cross-Domain Intersections (when youth link 2 policies together) */}
        <g>
          {crossDomainLinks.map((link, idx) => {
            const dimmed =
              focusedDomainId !== 'all' &&
              link.from.id !== focusedDomainId &&
              link.to.id !== focusedDomainId;
            return (
              <line
                key={`${link.from.id}-${link.to.id}-${idx}`}
                x1={link.from.cx}
                y1={link.from.cy}
                x2={link.to.cx}
                y2={link.to.cy}
                stroke="#FFD014"
                strokeOpacity={dimmed ? 0.05 : Math.min(0.48, 0.16 + link.count * 0.08)}
                strokeWidth={Math.min(3.5, 1 + link.count * 0.6)}
              />
            );
          })}
        </g>

        {/* Spokes connecting VYAB Core to each of the 6 Policy Hubs */}
        <g>
          {POLICY_DOMAINS.map((domain) => {
            const dimmed = focusedDomainId !== 'all' && focusedDomainId !== domain.id;
            return (
              <line
                key={`spoke-${domain.id}`}
                x1={500}
                y1={290}
                x2={domain.cx}
                y2={domain.cy}
                stroke="rgba(255,255,255,0.22)"
                strokeOpacity={dimmed ? 0.08 : 0.25}
                strokeWidth={1.2}
              />
            );
          })}
        </g>

        {/* Individual Youth Response Nodes orbiting their Policy Hub */}
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
                  strokeOpacity={isDimmed ? 0.08 : isSelected ? 0.85 : 0.38}
                  strokeWidth={isSelected ? 1.8 : 1}
                />

                {isNewest && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill="none"
                    stroke="#FFD014"
                    strokeWidth={2}
                    initial={{ scale: 0.5, opacity: 0.9 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: 2 }}
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 9.5 : 6.5}
                  fill={isSelected ? '#FFD014' : node.domain.color}
                  fillOpacity={isDimmed ? 0.2 : 0.95}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2.4 : 1.3}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setSelectedNodeId(node.response.id)}
                >
                  <title>{`${node.response.keyword} — ${node.response.name} (${node.response.city})`}</title>
                </circle>
              </g>
            );
          })}
        </g>

        {/* 6 Scaled Policy Domain Hubs */}
        <g>
          {POLICY_DOMAINS.map((domain) => {
            const stat = domainStats.find((s) => s.domain.id === domain.id);
            const count = stat?.primaryCount || 0;
            const pct = stat?.sharePct || 0;
            const radius = 29 + Math.min(22, count * 3.1);
            const isActive = focusedDomainId === domain.id;
            const isDimmed = focusedDomainId !== 'all' && !isActive;

            return (
              <g
                key={domain.id}
                className="cursor-pointer"
                onClick={() =>
                  setFocusedDomainId((curr) => (curr === domain.id ? 'all' : domain.id))
                }
                opacity={isDimmed ? 0.35 : 1}
              >
                <circle
                  cx={domain.cx}
                  cy={domain.cy}
                  r={radius + 6}
                  fill={domain.color}
                  fillOpacity={isActive ? 0.26 : 0.14}
                />
                <circle
                  cx={domain.cx}
                  cy={domain.cy}
                  r={radius}
                  fill={domain.color}
                  stroke={isActive ? '#FFD014' : '#FFFFFF'}
                  strokeWidth={isActive ? 3 : 1.8}
                />
                <text
                  x={domain.cx}
                  y={domain.cy + 4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="16"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {pct}%
                </text>
                <text
                  x={domain.cx}
                  y={domain.cy + radius + 19}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12.5"
                  fontWeight="600"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {lang === 'vi' ? domain.shortVi : domain.shortEn}
                </text>
              </g>
            );
          })}
        </g>

        {/* Central VYAB Core Hub */}
        <g
          className="cursor-pointer"
          onClick={() => {
            setFocusedDomainId('all');
            setSelectedNodeId(null);
          }}
        >
          <circle
            cx={500}
            cy={290}
            r={46}
            fill="#000B38"
            stroke="#FFD014"
            strokeWidth={3}
          />
          <text
            x={500}
            y={287}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="20"
            fontWeight="800"
            fontFamily="Outfit, Plus Jakarta Sans, sans-serif"
          >
            VYAB
          </text>
          <text
            x={500}
            y={305}
            textAnchor="middle"
            fill="#FFD014"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
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

  return (
    <section id="policy-map" className="bg-[#F4F7FC] border-b border-[#00104E]/10">
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
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#00104E] tracking-tight leading-[1.08]">
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
                          className={`text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                            active
                              ? 'border-[#00104E] bg-[#00104E] text-white'
                              : 'border-[#00104E]/14 bg-[#F4F7FC] text-[#2A3754] hover:border-[#00104E]/50'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                            style={{ backgroundColor: domain.color }}
                            aria-hidden="true"
                          />
                          <span className="truncate">
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
