import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { Lang } from '../data/vyabData';
import { FourColorMark } from './VyabBrandMark';

export interface AboutGalleryPhoto {
  src: string;
  altVi: string;
  altEn: string;
  locationVi: string;
  locationEn: string;
  dateVi: string;
  dateEn: string;
  captionVi: string;
  captionEn: string;
}

interface AboutPhotoLightboxProps {
  photos: AboutGalleryPhoto[];
  activeIndex: number | null;
  lang: Lang;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AboutPhotoLightbox({
  photos,
  activeIndex,
  lang,
  onClose,
  onSelectIndex,
}: AboutPhotoLightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0);

  const isOpen = activeIndex !== null && photos[activeIndex] !== undefined;
  const current = isOpen ? photos[activeIndex] : null;

  useEffect(() => {
    setZoomed(false);
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setDirection(1);
        onSelectIndex((activeIndex + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        setDirection(-1);
        onSelectIndex((activeIndex - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, photos.length, onClose, onSelectIndex]);

  const handlePrev = () => {
    if (activeIndex === null) return;
    setDirection(-1);
    onSelectIndex((activeIndex - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    if (activeIndex === null) return;
    setDirection(1);
    onSelectIndex((activeIndex + 1) % photos.length);
  };

  return (
    <AnimatePresence>
      {isOpen && current && activeIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[#000B38]/96 backdrop-blur-md text-white flex flex-col justify-between p-4 sm:p-6 md:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'vi' ? current.altVi : current.altEn}
        >
          {/* Top Bar: Counter, Title Metadata, Zoom & Close */}
          <div
            className="max-w-[1280px] w-full mx-auto flex items-center justify-between gap-4 pb-4 border-b border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <FourColorMark className="hidden sm:inline-flex shrink-0" />
              <span className="font-mono text-xs text-white/75 tabular-nums shrink-0">
                0{activeIndex + 1} / 0{photos.length}
              </span>
              <span className="text-white/30" aria-hidden="true">
                ·
              </span>
              <p className="text-xs sm:text-sm text-white/85 truncate">
                {lang === 'vi'
                  ? `${current.locationVi} · ${current.dateVi}`
                  : `${current.locationEn} · ${current.dateEn}`}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={
                  zoomed
                    ? lang === 'vi'
                      ? 'Thu nhỏ ảnh'
                      : 'Zoom out'
                    : lang === 'vi'
                    ? 'Phóng to ảnh'
                    : 'Zoom in'
                }
                className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-lg text-xs font-semibold text-white/90 border border-white/20 hover:bg-[#FFD014] hover:text-[#00104E] hover:border-[#FFD014] transition-colors cursor-pointer whitespace-nowrap"
              >
                {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {zoomed
                    ? lang === 'vi'
                      ? 'Thu nhỏ'
                      : 'Reset'
                    : lang === 'vi'
                    ? 'Phóng to'
                    : 'Zoom'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label={lang === 'vi' ? 'Đóng trình xem ảnh' : 'Close lightbox'}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/20 text-white hover:bg-[#FFD014] hover:text-[#00104E] hover:border-[#FFD014] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage: High-Resolution Image + Prev / Next Arrows */}
          <div
            className="relative flex-1 max-w-[1280px] w-full mx-auto flex items-center justify-center my-4 sm:my-6 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label={lang === 'vi' ? 'Ảnh trước' : 'Previous photo'}
              className="absolute left-0 sm:left-2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-[#00104E]/90 border border-white/25 text-white hover:bg-[#FFD014] hover:text-[#00104E] hover:border-[#FFD014] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Animated High-Res Photo Frame */}
            <div className="w-full h-full flex items-center justify-center px-12 sm:px-16 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.src}
                  custom={direction}
                  initial={{ opacity: 0, x: direction >= 0 ? 28 : -28, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction >= 0 ? -28 : 28, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
                  className="relative max-w-full max-h-full flex items-center justify-center"
                >
                  <div className="rounded-xl border-2 border-[#FFD014]/60 bg-[#00104E] p-1.5 sm:p-2 shadow-2xl overflow-hidden">
                    <img
                      src={current.src}
                      alt={lang === 'vi' ? current.altVi : current.altEn}
                      referrerPolicy="no-referrer"
                      onClick={() => setZoomed((z) => !z)}
                      className={`max-h-[58vh] sm:max-h-[64vh] max-w-[82vw] lg:max-w-[960px] w-auto h-auto rounded-lg object-contain transition-transform duration-300 ease-out select-none ${
                        zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                      }`}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label={lang === 'vi' ? 'Ảnh tiếp theo' : 'Next photo'}
              className="absolute right-0 sm:right-2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-[#00104E]/90 border border-white/25 text-white hover:bg-[#FFD014] hover:text-[#00104E] hover:border-[#FFD014] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Bar: Editorial Caption + Thumbnail Carousel Strip */}
          <div
            className="max-w-[1280px] w-full mx-auto pt-4 border-t border-white/15 flex flex-col md:flex-row md:items-end justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                {lang === 'vi' ? current.altVi : current.altEn}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed mt-1">
                {lang === 'vi' ? current.captionVi : current.captionEn}
              </p>
            </div>

            {/* Thumbnail Strip */}
            <div
              className="flex items-center gap-2.5 shrink-0"
              role="tablist"
              aria-label={lang === 'vi' ? 'Chọn ảnh trong bộ sưu tập' : 'Select gallery photo'}
            >
              {photos.map((photo, idx) => {
                const selected = idx === activeIndex;
                return (
                  <button
                    key={photo.src}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={lang === 'vi' ? photo.altVi : photo.altEn}
                    onClick={() => {
                      setDirection(idx > activeIndex ? 1 : -1);
                      onSelectIndex(idx);
                    }}
                    className={`relative w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden transition-all cursor-pointer ${
                      selected
                        ? 'ring-2 ring-[#FFD014] opacity-100'
                        : 'opacity-45 hover:opacity-80 ring-1 ring-white/20'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
