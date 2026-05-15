import type { SegmentedChoiceSize } from './SegmentedChoice.types';

export type SegmentedChoiceColorTokens = {
  accent: string;
  accentHover: string;
  bg: string;
  border: string;
  focusRing: string;
  surface: string;
  text: string;
  textMuted: string;
};

export type SegmentedChoiceTypographyTokens = {
  fontFamily: string;
  fontSizes: Record<SegmentedChoiceSize, string>;
  descriptionFontSizes: Record<SegmentedChoiceSize, string>;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
};

export type SegmentedChoiceSizeTokens = {
  borderRadius: string;
  containerOffset: string;
  descriptionFontSize: string;
  fontSize: string;
  labelGap: string;
  optionMinSize: string;
  optionPaddingBlock: string;
  optionPaddingInline: string;
  optionRadius: string;
};

export const SEGMENTED_CHOICE_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif';

export const SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS: SegmentedChoiceTypographyTokens = {
  fontFamily: SEGMENTED_CHOICE_FONT_FAMILY,
  fontSizes: {
    sm: '12px',
    md: '14px',
    lg: '16px',
  },
  descriptionFontSizes: {
    sm: '10px',
    md: '12px',
    lg: '14px',
  },
  fontWeight: 500,
  lineHeight: 1.45,
  letterSpacing: '0px',
};

export const SEGMENTED_CHOICE_SIZE_TOKENS: Record<SegmentedChoiceSize, SegmentedChoiceSizeTokens> =
  {
    sm: {
      borderRadius: '8px',
      containerOffset: '2px',
      descriptionFontSize: SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS.descriptionFontSizes.sm,
      fontSize: SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS.fontSizes.sm,
      labelGap: '4px',
      optionMinSize: '28px',
      optionPaddingBlock: '4px',
      optionPaddingInline: '10px',
      optionRadius: '6px',
    },
    md: {
      borderRadius: '10px',
      containerOffset: '4px',
      descriptionFontSize: SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS.descriptionFontSizes.md,
      fontSize: SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS.fontSizes.md,
      labelGap: '6px',
      optionMinSize: '32px',
      optionPaddingBlock: '6px',
      optionPaddingInline: '12px',
      optionRadius: '7px',
    },
    lg: {
      borderRadius: '12px',
      containerOffset: '6px',
      descriptionFontSize: SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS.descriptionFontSizes.lg,
      fontSize: SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS.fontSizes.lg,
      labelGap: '8px',
      optionMinSize: '40px',
      optionPaddingBlock: '8px',
      optionPaddingInline: '16px',
      optionRadius: '8px',
    },
  };

export const SEGMENTED_CHOICE_COLOR_TOKENS: SegmentedChoiceColorTokens = {
  accent: '#E6E8EC',
  accentHover: '#E3E5E9',
  bg: '#FFFFFF',
  border: '#E4E4E7',
  focusRing: 'rgba(0, 0, 0, 0.08)',
  surface: '#F5F7FA',
  text: '#1A1D23',
  textMuted: '#71717A',
};

export function getSegmentedChoiceSizeTokens(size: SegmentedChoiceSize) {
  return SEGMENTED_CHOICE_SIZE_TOKENS[size];
}

export function getSegmentedChoiceColorTokens() {
  return SEGMENTED_CHOICE_COLOR_TOKENS;
}

export function getSegmentedChoiceTypographyTokens() {
  return SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS;
}
