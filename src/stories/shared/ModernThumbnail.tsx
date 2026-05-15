import React from 'react';

import { SegmentedChoice } from '../../index';

export const modernThumbnailStoryStyles = `
  .demo-modern-thumbnail-chooser {
    position: relative;
    z-index: 2;

    --rsc-border-color: rgba(255, 255, 255, 0.14);
    --rsc-border-radius: 999px;
    --rsc-option-radius: 999px;
    --rsc-container-offset: 10px;
    --rsc-surface: rgba(9, 12, 18, 0.46);
    --modern-thumbnail-active-size: 67px;
    --rsc-option-padding-inline: 6px;
    --rsc-indicator-hover-bg: transparent;
  }

  .demo-modern-thumbnail-chooser .rsc-track {
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)),
      var(--rsc-surface);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.24),
      inset 0 -10px 20px rgba(255, 255, 255, 0.06),
      inset 0 12px 24px rgba(5, 8, 14, 0.16),
      0 14px 34px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(12px) saturate(145%);
    -webkit-backdrop-filter: blur(12px) saturate(145%);
  }

  .demo-modern-thumbnail-chooser:has(.rsc-option[data-selected="true"] .demo-modern-thumbnail-image--aurora),
  .demo-modern-thumbnail-chooser:has(.rsc-option[data-previewed="true"] .demo-modern-thumbnail-image--aurora) {
    --rsc-indicator-color: #ff2f9a;
  }

  .demo-modern-thumbnail-chooser:has(.rsc-option[data-selected="true"] .demo-modern-thumbnail-image--atelier),
  .demo-modern-thumbnail-chooser:has(.rsc-option[data-previewed="true"] .demo-modern-thumbnail-image--atelier) {
    --rsc-indicator-color: #ffb33f;
  }

  .demo-modern-thumbnail-chooser:has(.rsc-option[data-selected="true"] .demo-modern-thumbnail-image--shoreline),
  .demo-modern-thumbnail-chooser:has(.rsc-option[data-previewed="true"] .demo-modern-thumbnail-image--shoreline) {
    --rsc-indicator-color: #ff7ac8;
  }

  .demo-modern-thumbnail-chooser:has(.rsc-option[data-selected="true"] .demo-modern-thumbnail-image--studio),
  .demo-modern-thumbnail-chooser:has(.rsc-option[data-previewed="true"] .demo-modern-thumbnail-image--studio) {
    --rsc-indicator-color: #19f6ff;
  }

  .demo-modern-thumbnail-chooser:has(.rsc-option[data-selected="true"] .demo-modern-thumbnail-image--nightshift),
  .demo-modern-thumbnail-chooser:has(.rsc-option[data-previewed="true"] .demo-modern-thumbnail-image--nightshift) {
    --rsc-indicator-color: #35ff9a;
  }

  .demo-modern-thumbnail-image {
    position: relative;
    width: 55px;
    height: 55px;
    border-radius: 999px;
    overflow: hidden;
    display: block;
    box-sizing: border-box;
    border: 0;
    box-shadow: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .demo-modern-thumbnail-image-base,
  .demo-modern-thumbnail-image-liquid {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
  }

  .demo-modern-thumbnail-image-base {
    position: relative;
    z-index: 0;
  }

  .demo-modern-thumbnail-image .demo-modern-thumbnail-image-liquid {
    position: absolute;
    inset: -5px;
    z-index: 1;
    display: none;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    pointer-events: none;
  }

  .demo-modern-thumbnail-chooser.rsc-root .rsc-indicator {
    background: transparent;
    border-radius: 999px;
    border-color: transparent;
    box-shadow: none;
    outline: none;
    overflow: visible;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .demo-modern-thumbnail-chooser.rsc-root .rsc-indicator:hover,
  .demo-modern-thumbnail-chooser.rsc-root[data-dragging="true"] .rsc-indicator {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    outline: none;
  }

  .demo-modern-thumbnail-chooser.rsc-root .rsc-option-content {
    overflow: visible;
  }

  .demo-modern-thumbnail-chooser .rsc-indicator-content {
    overflow: visible;
    padding: 0;
    transform-origin: center;
  }

  .demo-modern-thumbnail-chooser.rsc-root[data-drag-released="true"] .rsc-indicator-content {
    animation: demo-modern-thumbnail-release-bounce 320ms cubic-bezier(0.22, 1.45, 0.36, 1) both;
  }

  .demo-modern-thumbnail-chooser.rsc-root
    .rsc-option[data-selected="true"]
    .demo-modern-thumbnail-image {
    border-color: transparent;
    box-shadow: none;
  }

  .demo-modern-thumbnail-chooser.rsc-root[data-drag-released="true"]
    .rsc-option[data-selected="true"]
    .demo-modern-thumbnail-image {
    opacity: 0;
  }

  .demo-modern-thumbnail-chooser .rsc-indicator-content .rsc-option-label {
    width: var(--modern-thumbnail-active-size);
    height: var(--modern-thumbnail-active-size);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
  }

  .demo-modern-thumbnail-chooser .rsc-indicator-content .demo-modern-thumbnail-image {
    width: var(--modern-thumbnail-active-size);
    height: var(--modern-thumbnail-active-size);
    border-color: transparent;
    background: transparent;
    box-shadow:
      inset 0 0 24px color-mix(in srgb, var(--rsc-indicator-color) 34%, transparent);
    backdrop-filter: blur(14px) saturate(170%);
    -webkit-backdrop-filter: blur(14px) saturate(170%);
  }

  .demo-modern-thumbnail-chooser .rsc-indicator-content .demo-modern-thumbnail-image::before {
    position: absolute;
    inset: 0;
    z-index: 4;
    border-radius: inherit;
    border: 1px solid
      color-mix(in srgb, var(--rsc-indicator-color) 50%, rgba(255, 255, 255, 0.08));
    pointer-events: none;
    content: "";
  }

  .demo-modern-thumbnail-chooser.rsc-root
    .rsc-option[data-focus-visible="true"]:not([data-selected="true"])
    .demo-modern-thumbnail-image {
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.88),
      0 0 0 5px color-mix(
        in srgb,
        var(--rsc-indicator-color) 34%,
        rgba(255, 255, 255, 0.1)
      ),
      inset 0 0 24px color-mix(
        in srgb,
        var(--rsc-indicator-color) 34%,
        transparent
      );
  }

  .demo-modern-thumbnail-chooser.rsc-root
    .rsc-option[data-focus-visible="true"]
    .rsc-option-anchor,
  .demo-modern-thumbnail-chooser.rsc-root .rsc-indicator.rsc-indicator {
    outline: none;
    box-shadow: none;
  }

  .demo-modern-thumbnail-chooser.rsc-root:has(
      .rsc-option[data-selected="true"][data-focus-visible="true"]
    )
    .rsc-indicator {
    outline: 1px solid rgba(255, 255, 255, 0.25);
    outline-offset: 5px;
    box-shadow:
      0 0 0 7px color-mix(in srgb, var(--rsc-indicator-color) 24%, transparent),
      0 18px 36px rgba(0, 0, 0, 0.22),
      0 0 26px color-mix(in srgb, var(--rsc-indicator-color) 32%, transparent);
  }

  .demo-modern-thumbnail-chooser
    .rsc-indicator-content
    .demo-modern-thumbnail-image
    .demo-modern-thumbnail-image-base {
    mask: radial-gradient(circle, #000 0%, #000 70%, rgba(0, 0, 0, 0.7) 84%, transparent 100%);
    -webkit-mask: radial-gradient(circle, #000 0%, #000 70%, rgba(0, 0, 0, 0.7) 84%, transparent 100%);
  }

  .demo-modern-thumbnail-chooser
    .rsc-indicator-content
    .demo-modern-thumbnail-image
    .demo-modern-thumbnail-image-liquid {
    display: block;
    opacity: 1;
    filter: blur(9px) saturate(225%) brightness(1.13);
    transform: scale(1.29);
    mask: radial-gradient(circle, transparent 0%, transparent 39%, rgba(0, 0, 0, 0.77) 60%, #000 100%);
    -webkit-mask: radial-gradient(circle, transparent 0%, transparent 39%, rgba(0, 0, 0, 0.77) 60%, #000 100%);
  }

  .demo-modern-thumbnail-chooser .rsc-indicator-content .demo-modern-thumbnail-image::after {
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: inherit;
    pointer-events: none;
    content: "";
    background:
      radial-gradient(
        circle,
        transparent 0%,
        transparent 44%,
        color-mix(in srgb, var(--rsc-indicator-color) 34%, transparent) 62%,
        color-mix(in srgb, var(--rsc-indicator-color) 54%, transparent) 76%,
        color-mix(in srgb, var(--rsc-indicator-color) 86%, transparent) 100%
      );
    mix-blend-mode: screen;
    opacity: 0.96;
    mask: radial-gradient(circle, transparent 0%, transparent 42%, rgba(0, 0, 0, 0.78) 60%, #000 100%);
    -webkit-mask: radial-gradient(circle, transparent 0%, transparent 42%, rgba(0, 0, 0, 0.78) 60%, #000 100%);
  }

  @keyframes demo-modern-thumbnail-release-bounce {
    0% {
      transform: scale(1);
    }

    44% {
      transform: scale(0.8);
    }

    76% {
      transform: scale(1.08);
    }

    100% {
      transform: scale(1);
    }
  }
`;

export function ModernThumbnailStyles() {
  return <style>{modernThumbnailStoryStyles}</style>;
}

export type ModernThumbnailSlide = {
  accentColor: string;
  thumbnail: string;
  title: string;
  value: string;
};

type ModernThumbnailProps = Omit<
  React.ComponentProps<typeof SegmentedChoice>,
  'ariaLabel' | 'className' | 'options' | 'geometry'
> & {
  ariaLabel?: string;
  className?: string;
  slides: readonly ModernThumbnailSlide[];
};

function ModernThumbnailImage({ src, value }: { src: string; value: string }) {
  return (
    <span className={`demo-modern-thumbnail-image demo-modern-thumbnail-image--${value}`}>
      <img alt="" className="demo-modern-thumbnail-image-base" draggable={false} src={src} />
      <img
        aria-hidden="true"
        className="demo-modern-thumbnail-image-liquid"
        draggable={false}
        src={src}
      />
    </span>
  );
}

export function ModernThumbnail({
  ariaLabel = 'Scene selection',
  className,
  optionSizing = 'content',
  slides,
  ...props
}: ModernThumbnailProps) {
  return (
    <>
      <ModernThumbnailStyles />
      <SegmentedChoice
        {...props}
        ariaLabel={ariaLabel}
        className={`demo-modern-thumbnail-chooser${className ? ` ${className}` : ''}`}
        optionSizing={optionSizing}
        options={slides.map(slide => ({
          value: slide.value,
          label: <ModernThumbnailImage src={slide.thumbnail} value={slide.value} />,
          ariaLabel: slide.title,
          accentColor: slide.accentColor,
        }))}
        geometry={{
          anchor: { size: 55 },
          dragScale: 1.5,
          indicator: {
            content: 'clone-active',
            size: 67,
            style: 'fill',
          },
          mode: 'overlay',
          track: {
            style: 'surface',
          },
        }}
      />
    </>
  );
}
