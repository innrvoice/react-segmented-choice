import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedChoice } from '../../index';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
} from '../shared/SegmentedChoiceStoryControls';
import {
  ArcadeDifficulty as arcadeDifficultyBaseStory,
  CommandScopePicker as commandScopePickerBaseStory,
  AntdFilterBar as antdFilterBarBaseStory,
  EditorialTone as editorialToneBaseStory,
  FigmaToolRail as figmaToolRailBaseStory,
  GlassDock as glassDockBaseStory,
  SpotifyMoodMixer as spotifyMoodMixerBaseStory,
} from './AdvancedExamples';
import {
  EmojiRing as emojiRingBaseStory,
  Impressions as impressionsBaseStory,
  IOSToggle as iosToggleBaseStory,
  MaterialToggle as materialToggleBaseStory,
  ModernThumbnail as modernThumbnailBaseStory,
  PrimaryScale as primaryScaleBaseStory,
  RangeLike as rangeLikeBaseStory,
  TipSelector as tipSelectorBaseStory,
  CameraModesCloneActive as cameraModesCloneActiveBaseStory,
} from './BasicExamples';

const meta = {
  title: 'Customization/Examples',
  component: SegmentedChoice,
  args: segmentedChoiceStoryArgs,
  argTypes: segmentedChoiceStoryArgTypes,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A curated set of distinct SegmentedChoice customization examples with controls and actions enabled.',
      },
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};

export const PrimaryScale: Story = {
  ...primaryScaleBaseStory,
  name: 'Primary Scale',
};

export const EmojiRing: Story = {
  ...emojiRingBaseStory,
  name: 'Emoji Ring',
};

export const TipSelector: Story = {
  ...tipSelectorBaseStory,
  name: 'Tip Selector',
  tags: ['visual'],
};

export const Impressions: Story = {
  ...impressionsBaseStory,
  name: 'Impressions',
  tags: ['visual'],
};

export const RangeLike: Story = {
  ...rangeLikeBaseStory,
  name: 'Range-like',
};

export const ModernThumbnail: Story = {
  ...modernThumbnailBaseStory,
  name: 'Modern Thumbnail',
  tags: ['visual'],
};

export const CameraModesCloneActive: Story = {
  ...cameraModesCloneActiveBaseStory,
  name: 'Camera Modes (clone-active)',
  tags: ['visual'],
};

export const AntStyleFilterBar: Story = {
  ...antdFilterBarBaseStory,
  name: 'Ant-style Filter Bar',
};

export const SpotifyMoodMixer: Story = {
  ...spotifyMoodMixerBaseStory,
  name: 'Spotify Mood Mixer',
  tags: ['visual'],
};

export const GlassDock: Story = {
  ...glassDockBaseStory,
  name: 'Glass Dock',
  tags: ['visual'],
};

export const ArcadeDifficulty: Story = {
  ...arcadeDifficultyBaseStory,
  name: 'Arcade Difficulty',
};

export const CommandScopePicker: Story = {
  ...commandScopePickerBaseStory,
  name: 'Command Scope Picker',
};

export const FigmaToolRail: Story = {
  ...figmaToolRailBaseStory,
  name: 'Figma Tool Rail',
};

export const EditorialToneSelector: Story = {
  ...editorialToneBaseStory,
  name: 'Editorial Tone Selector',
};

export const MaterialToggle: Story = {
  ...materialToggleBaseStory,
  name: 'Android-like Toggle',
  tags: ['visual'],
};

export const IOSToggle: Story = {
  ...iosToggleBaseStory,
  name: 'iOS-like Toggle',
  tags: ['visual'],
};
