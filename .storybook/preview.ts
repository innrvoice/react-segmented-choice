import type { Preview } from '@storybook/react-vite';

import '../src/SegmentedChoice/SegmentedChoice.css';
import './preview.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    options: {
      storySort: {
        order: [
          'Showcase',
          ['SegmentedChoice Demo'],
          'Basics',
          ['Variants', 'States'],
          'Architecture',
          ['Geometry And Styling'],
          'Customization',
          ['Examples'],
        ],
      },
    },
    controls: {
      exclude: [
        'ariaDescribedby',
        'ariaLabel',
        'ariaLabelledby',
        'className',
        'name',
        'onValueChange',
        'options',
        'slotProps',
        'styleNonce',
        'unstyled',
        'value',
        'defaultValue',
        'visual',
      ],
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        type: 'code',
      },
      controls: {
        exclude: [
          'ariaDescribedby',
          'ariaLabel',
          'ariaLabelledby',
          'className',
          'name',
          'onValueChange',
          'options',
          'slotProps',
          'styleNonce',
          'unstyled',
          'value',
          'defaultValue',
          'visual',
        ],
      },
    },
  },
};

export default preview;
