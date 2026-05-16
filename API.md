# SegmentedChoice API Reference

The README gets you to a working control. This file is for the parts that are easier to understand once the quick start is out of the way: value ownership, geometry, slot hooks, CSS customization and the few sharp edges that matter in real apps.

If you only need the default segmented control, the README is probably enough. If you are changing layout mechanics, wiring analytics attrs, building a custom skin or using the component in forms, this reference should answer the "what owns this?" questions.

## Component Signature

```ts
import { SegmentedChoice } from 'react-segmented-choice';

type SegmentedChoiceValue = string;

type SegmentedChoiceProps<T extends SegmentedChoiceValue = string> = {
  options: readonly SegmentedChoiceOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  optionSizing?: 'equal' | 'content';
  optionDistribution?: 'space-between' | 'space-around';
  size?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
  loop?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  className?: string;
  styleNonce?: string;
  unstyled?: boolean;
  slotProps?: SegmentedChoiceSlotProps;
  geometry?: SegmentedChoiceGeometry;
};
```

## `options`

```ts
type SegmentedChoiceOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  accentColor?: string;
};
```

Field details:

- `value`: unique string identifier used in selection state.
- `label`: rendered content for the option.
- `ariaLabel`: strongly recommended for icon-only labels.
- `description`: secondary content under/alongside label depending on styles.
- `disabled`: disables only this option.
- `accentColor`: optional per-option accent used by indicator color logic.
  Supported formats are hex, alphabetic named colors, `rgb()/rgba()`, `hsl()/hsla()` and `var(--token)`.
  Unsupported values are ignored and warn in development.

## Top-Level Props

### Selection and State

- `value?: T`: controlled value. If set, the parent must pass the committed value back after `onValueChange`.
- `defaultValue?: T`: initial value for uncontrolled mode.
- `onValueChange?: (value: T) => void`: called when selection commits.

### Form

- `name?: string`: radio group name. If omitted, the component generates a stable internal name.
- `required?: boolean`: passed to the underlying radio inputs.

### Interaction

- `disabled?: boolean` (default: `false`): disables the whole control.
- `draggable?: boolean` (default: `true`): enables drag-to-select behavior.
- `loop?: boolean` (default: `true`): lets keyboard arrows wrap at the edges.

### Layout

- `orientation?: "horizontal" | "vertical"` (default: `"horizontal"`)
- `optionSizing?: "equal" | "content"` (default: `"equal"`)
- `optionDistribution?: "space-between" | "space-around"` (default: `"space-between"`)
- `size?: "sm" | "md" | "lg"` (default: `"md"`)

`optionSizing` controls option box dimensions:

- `equal` measures the widest option content and uses that width for every option box.
- `content` lets each option box follow its own content width.
- `geometry.optionSize` resolves sizing to fixed square option boxes and overrides `optionSizing`.

`optionDistribution` controls how option boxes sit inside the surface when the surface has extra space:

- `space-between` places spare space between option boxes.
- `space-around` also adds spare space before the first and after the last option.

Surface width itself comes from normal CSS layout. Without an explicit width, the root remains compact around its options.

### Accessibility

- `ariaLabel?: string`
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`

Use at least one group labelling strategy (`ariaLabel` or `ariaLabelledby`).

### Styling Entry Points

- `className?: string`: added on `.rsc-root`.
- `styleNonce?: string`: CSP nonce for the runtime stylesheet bucket. Use it when your app disallows inline styles without a nonce.
- `unstyled?: boolean` (default: `false`): removes the default visual skin while keeping DOM structure, semantics and layout logic.
- `geometry?: SegmentedChoiceGeometry`: behavior and measured layout tuning.
- `slotProps?: SegmentedChoiceSlotProps`: slot-level attrs, events and class hooks.

## Zero-inline Styling Contract

Rendered slots do not receive `style={...}` from the component.

What this means:

- public theming stays overrideable from external CSS
- `slotProps.style` is not public API and is ignored at runtime
- dynamic layout is written through an internal scoped stylesheet, not through element inline styles

This separation is intentional:

- public `--rsc-*` variables are for consumers
- internal `--_rsc-*` variables are runtime mechanics and are not public API

## Structural Validation

`SegmentedChoice` validates its option model before rendering.

- at least 2 options are required
- every `option.value` must be a unique string
- invalid structures return `null` and emit a dev warning
- radiogroup labelling requires `ariaLabel` or `ariaLabelledby`

This keeps runtime behavior deterministic for external consumers.

## CSP and Runtime Styles

Dynamic geometry is written into a shared document stylesheet rather than inline slot styles.

- pass `styleNonce` to attach a nonce to that stylesheet
- instances in one document reuse the same stylesheet when they share a nonce
- distinct `styleNonce` values create separate runtime style hosts in the same document

## SSR and Hydration

Server rendering does not emit the internal runtime stylesheet.

- rendering on the server does not access browser globals during render
- the runtime stylesheet is attached on the client during the first layout effect after hydration
- indicator geometry and measured layout settle on the client after hydration

## Mental Model

Think about the component in four layers:

1. `options`, selection props and interaction props define state and semantics.
2. `geometry` defines the measured layout contract: where the indicator moves, how the track is measured, whether anchors exist and whether explicit option or indicator sizing is active.
3. Public CSS variables, stable classes and stable data attributes define appearance.
4. `slotProps` lets an app attach integration metadata, event observers and extra class names to the rendered slots.

Use `geometry` when the layout math itself should change. Use CSS when the same mechanics should look different. Use `slotProps` when an outside system needs attributes, class names or event handlers on a specific slot.

## `geometry`

```ts
type SegmentedChoiceGeometrySize = {
  size?: number;
  width?: number;
  height?: number;
};

type SegmentedChoiceIndicatorTransition = 'smooth' | 'instant';

type SegmentedChoiceGeometry = {
  mode?: 'underlay' | 'overlay';
  dragScale?: boolean | number;
  optionSize?: number;
  anchor?: SegmentedChoiceGeometrySize;
  track?: {
    layout?: 'container' | 'center-span';
    style?: 'surface' | 'none';
  };
  indicator?: SegmentedChoiceGeometrySize & {
    style?: 'fill' | 'ring' | 'none';
    content?: 'none' | 'clone-active';
    transition?: SegmentedChoiceIndicatorTransition;
    inset?: number;
    borderWidth?: number;
  };
};
```

Defaults:

- `mode: "underlay"`
- `track.layout: "container"`
- `track.style: "surface"`
- `indicator.style: "fill"`
- `indicator.content: "none"`
- `indicator.transition: "smooth"`

During an active drag gesture, changing `options`, `orientation` or `geometry` cancels the in-flight drag.
The control resets the preview state and the user can start a new drag after the update.

### `mode`

- `"underlay"`: indicator participates as under-selection background.
- `"overlay"`: indicator behaves like moving handle above options.

Use `"underlay"` for classic segmented controls where selected state feels like a highlighted background behind the active option. Use `"overlay"` when the selected state should behave like a handle or capsule moving above the option labels.

### `dragScale`

- `false` or `undefined`: no extra drag scaling.
- `true`: scales to `1.1` while dragging.
- `number`: exact custom scale factor while dragging (for example `1.25`).

`dragScale` affects the indicator while an active pointer drag is in progress. It does not change option hitboxes or the committed value.

### `optionSize`

- Sets fixed square size for each option box.
- Uses internal runtime layout values; no additional public styling hook is required.

Use this for icon grids, compact tool pickers or any control where every option needs the same square target independent of label length. `optionSize` defines option-box dimensions; `optionDistribution` still controls how those boxes spread when the surface is wider than the boxes.

### `anchor`

- `size`: shorthand for square anchor.
- `width` and `height`: non-square anchor geometry.
- If `width`/`height` are provided, they override `size` per axis.

Anchors are invisible measurement targets by default. They are useful for overlay controls where the handle should move between compact targets inside wider option labels and they can be styled through `.rsc-option-anchor`.

### `track.layout`

- `"container"`: the track fills the control container.
- `"center-span"`: the track starts at the center of the first option and ends at the center of the last option, using anchors when present.

Use `"container"` for regular pill backgrounds. Use `"center-span"` for rail-like controls where the track should run through the option centers instead of filling the whole wrapper.

### `track.style`

- `"surface"`: applies the default track paint.
- `"none"`: keeps track geometry but removes default paint so CSS can draw the rail.

`track.style = "none"` does not remove the track element. It keeps the `.rsc-track` slot available so custom CSS can draw a line, gradient, timeline rail or no visible track at all.

### `indicator`

- `size`: shorthand for square indicator.
- `width` and `height`: non-square indicator geometry.
- `style`: `"fill" | "ring" | "none"`.
- `content`: `"none"` or `"clone-active"` (for overlay clone mode).
- `transition`: `"smooth"` or `"instant"`.
- `inset`: internal inset used in layout math.
- `borderWidth`: used by ring visuals and ring geometry calculations.

Axis precedence:

- width resolution: `indicator.width ?? indicator.size`
- height resolution: `indicator.height ?? indicator.size`

Explicit indicator sizing is useful when the indicator should be a fixed handle instead of matching the selected option content. The measured dimensions are applied through internal runtime layout variables.

### `indicator.transition`

`indicator.transition` controls selection indicator geometry motion.

- `"smooth"` is the default and animates position and size changes.
- `"instant"` updates position and size immediately.

This controls selection indicator motion only. It does not delay value changes, change selection semantics or change drag preview timing.

### `indicator.content = "clone-active"`

`"clone-active"` turns the indicator into a moving value capsule. In `overlay` mode, the cloned content follows the current preview target during drag: the option that would be selected on release.

It does not reorder options. The option model stays fixed; this is selection preview, not drag-and-drop list behavior.

Use it when the active value should travel with the handle, such as camera modes, compact icon + label pickers or controls that intentionally feel like a mini-slider. Skip it for heavy option content, dense controls where cloned content hurts readability or classic segmented controls where a plain selected highlight is clearer.

For most mode pickers, start with `indicator.content = "none"`. Reach for `clone-active` only when the moving value capsule is part of the intended interaction.

Recipe (`overlay + clone-active`):

```tsx
<SegmentedChoice
  ariaLabel="Camera mode"
  defaultValue="portrait"
  options={[
    { value: 'photo', label: 'Photo' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'video', label: 'Video' },
  ]}
  geometry={{
    mode: 'overlay',
    track: { layout: 'center-span', style: 'none' },
    indicator: {
      style: 'fill',
      content: 'clone-active',
    },
  }}
/>
```

## `slotProps`

```ts
type SegmentedChoiceSlotProps = {
  root?: Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'aria-orientation' | 'role' | 'style'
  >;
  list?: Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>;
  track?: Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>;
  indicator?: Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>;
  indicatorContent?: Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>;
  option?: Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'style'>;
  optionAnchor?: Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>;
  optionContent?: Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>;
  optionLabel?: Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>;
  optionDescription?: Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>;
};
```

What `slotProps` is for:

- add `className`
- add `data-*` attributes
- add non-conflicting `aria-*` attributes
- attach event handlers

What it is not for:

- inline styling (`style`) is not part of public API and is ignored.
- owning root radiogroup semantics such as `role`, `ariaLabel`, `ariaLabelledby`, `ariaDescribedby` or `aria-orientation`.

Handler ordering:

- internal list pointer/focus handlers run before `slotProps.list` handlers
- user handlers should observe or augment list interactions, not depend on canceling internal drag/commit logic with `preventDefault()`

Slot map:

| `slotProps` key     | Rendered slot                                    |
| ------------------- | ------------------------------------------------ |
| `root`              | outer `.rsc-root` radiogroup                     |
| `list`              | `.rsc-list` interaction/layout container         |
| `track`             | `.rsc-track` visual track                        |
| `indicator`         | `.rsc-indicator` moving selection element        |
| `indicatorContent`  | `.rsc-indicator-content` clone-content wrapper   |
| `option`            | each `.rsc-option` `<label>`                     |
| `optionAnchor`      | `.rsc-option-anchor` measurement/visual target   |
| `optionContent`     | `.rsc-option-content` visible option wrapper     |
| `optionLabel`       | `.rsc-option-label` primary label wrapper        |
| `optionDescription` | `.rsc-option-description` secondary text wrapper |

Use `slotProps` when you need to attach integration metadata, event observers or extra class names to one of these slots.
Use CSS selectors against the stable class hooks below when you only need visual styling.

Example:

```tsx
<SegmentedChoice
  ariaLabel="Density"
  defaultValue="comfortable"
  options={[
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
  ]}
  slotProps={{
    root: { className: 'density-choice', 'data-qa': 'density-choice' },
    list: { onPointerDown: event => trackPointerDown(event.pointerType) },
    option: { 'data-track': 'density-option' },
    optionLabel: { className: 'density-choice__label' },
  }}
/>
```

## Stable Class Hooks

These are the stable selectors for the slots listed in the `slotProps` map:

```css
.rsc-root
.rsc-list
.rsc-track
.rsc-indicator
.rsc-indicator-content
.rsc-option
.rsc-option-input
.rsc-option-anchor
.rsc-option-content
.rsc-option-label
.rsc-option-description
```

Use `.rsc-root` or your own root `className` to scope a theme.
Use `.rsc-option`, `.rsc-option-content`, `.rsc-option-label` and `.rsc-option-description` for option styling.
Use `.rsc-track`, `.rsc-indicator`, `.rsc-indicator-content` and `.rsc-option-anchor` for geometry-driven visuals such as rails, handles, cloned content, anchors, rings or release feedback.

The `.rsc-option-input` hook exists because the native radio input is part of the public DOM structure. In normal styling, leave the input visually hidden and style the visible option slots instead.

Class hooks describe structure. Data attributes describe state and resolved configuration. In most custom themes, use both together:

```css
.billing-range .rsc-option[data-selected='true'] .rsc-option-content {
  color: #111827;
}
```

## Stable Data Attributes

Root attrs:

- `data-orientation`: `"horizontal"` or `"vertical"` for axis-specific CSS.
- `data-size`: `"sm"`, `"md"` or `"lg"` for density-specific overrides.
- `data-disabled`: `"true"` when the whole control is disabled.
- `data-unstyled`: `"true"` when the default visual skin is disabled.
- `data-dragging`: `"true"` during an active pointer drag.
- `data-drag-released`: briefly `"true"` after pointer drag release or cancel, useful for optional CSS-only release feedback.

Option attrs:

- `data-selected`: `"true"` on the committed selected option.
- `data-disabled`: `"true"` when the option or whole control is disabled.
- `data-focus-visible`: `"true"` when keyboard-visible focus treatment should appear.
- `data-has-description`: `"true"` when `option.description` is present.
- `data-previewed`: `"true"` on the option currently targeted during an active drag. It can differ from `data-selected` until pointer release commits the value.

Internal runtime selectors use `data-rsc-*`. They are owned by the bundled stylesheet and scoped runtime layout system and are not supported as public customization API.

## Data Attribute Scoping Best Practices

Rule:

- Always scope option-state selectors by component hooks such as `.rsc-root` and `.rsc-option`.
- Prefer a user-owned class on the root when styling one control instance.
- Avoid global bare `[data-*]` selectors. These attrs use simple names and may exist elsewhere in your app.

Do:

```css
.my-choice .rsc-option[data-selected='true'] .rsc-option-content {
  color: #111827;
}

.my-choice.rsc-root[data-dragging='true'] .rsc-indicator {
  box-shadow: 0 10px 24px rgb(15 23 42 / 0.18);
}

.my-choice.rsc-root[data-drag-released='true'] .rsc-indicator {
  animation: my-choice-release 180ms ease-out;
}

.my-choice .rsc-option[data-previewed='true'] .rsc-option-label {
  color: #2563eb;
}
```

Don't:

```css
[data-selected='true'] {
  color: red;
}
```

## Stable CSS Variables

These are public `--rsc-*` tokens intended for external CSS overrides.

Import `react-segmented-choice/styles.css` before your app or component CSS so
your overrides can naturally customize these variables and stable `.rsc-*`
hooks.

### Surface and color

| Variable                  | What it controls                                         |
| ------------------------- | -------------------------------------------------------- |
| `--rsc-bg`                | Base background fallback for the control.                |
| `--rsc-surface`           | Default track/surface fill for the bundled skin.         |
| `--rsc-border-color`      | Inset border color for the default surface track.        |
| `--rsc-text-color`        | Default option text color.                               |
| `--rsc-active-text-color` | Selected, hover, indicator and active option text color. |

### Typography

| Variable                      | What it controls                                 |
| ----------------------------- | ------------------------------------------------ |
| `--rsc-font-family`           | Font family applied to the root and option text. |
| `--rsc-font-weight`           | Font weight for labels and descriptions.         |
| `--rsc-line-height`           | Line height for labels and descriptions.         |
| `--rsc-letter-spacing`        | Letter spacing for labels and descriptions.      |
| `--rsc-font-size`             | Primary option label font size.                  |
| `--rsc-description-font-size` | Secondary description font size.                 |

### Layout and spacing

| Variable                 | What it controls                                                    |
| ------------------------ | ------------------------------------------------------------------- |
| `--rsc-border-radius`    | Radius for the container track in the bundled skin.                 |
| `--rsc-container-offset` | Default inset used by the bundled skin.                             |
| `--rsc-padding`          | List padding; defaults to `--rsc-container-offset`.                 |
| `--rsc-gap`              | Gap between option slots.                                           |
| `--rsc-label-gap`        | Gap between label/description content and cloned indicator content. |

### Option sizing

| Variable                      | What it controls                                  |
| ----------------------------- | ------------------------------------------------- |
| `--rsc-option-min-size`       | Minimum block size for visible option content.    |
| `--rsc-option-padding-block`  | Vertical padding inside visible option content.   |
| `--rsc-option-padding-inline` | Horizontal padding inside visible option content. |
| `--rsc-option-radius`         | Radius for option content and the indicator.      |

### Track

| Variable           | What it controls                       |
| ------------------ | -------------------------------------- |
| `--rsc-track-size` | Rail thickness for center-span tracks. |

### Indicator

| Variable                       | What it controls                                                                                                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--rsc-indicator-bg`           | Default fill color used by the indicator token.                                                                                                                                   |
| `--rsc-indicator-color`        | Indicator fill or ring color; defaults to `--rsc-indicator-bg`.                                                                                                                   |
| `--rsc-indicator-border-width` | Public fallback border width for ring indicators.                                                                                                                                 |
| `--rsc-indicator-shadow`       | Box shadow for fill indicators and focused overlay handles.                                                                                                                       |
| `--rsc-indicator-hover-bg`     | Optional overlay fill hover color override. Without it, overlay fill hover preserves the active `accentColor`; controls without an active accent use the default gray hover fill. |

### Focus and disabled state

| Variable                 | What it controls                                 |
| ------------------------ | ------------------------------------------------ |
| `--rsc-focus-ring-color` | Outline color for keyboard-visible focus states. |
| `--rsc-disabled-opacity` | Root opacity when the whole control is disabled. |

## Public vs Internal Variables

Public:

- documented `--rsc-*` variables in this section
- safe to override from external CSS

Internal:

- `--_rsc-*`
- `data-rsc-*`
- owned by component runtime layout logic
- not covered by semver or public docs

Do not build app-level styling contracts on top of `--_rsc-*` or `data-rsc-*`.

## Practical Examples

This section keeps compact code examples close to the API reference. For broader runnable examples, use Storybook locally with `pnpm storybook` or browse the hosted build at [sb.segmentedchoice.visiofutura.com](https://sb.segmentedchoice.visiofutura.com/).

### 1) Controlled value

```tsx
const [value, setValue] = useState('week');

<SegmentedChoice
  ariaLabel="Range"
  value={value}
  onValueChange={setValue}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>;
```

Use controlled mode when selection is owned by app state, URL state, a form library or another external store. The component calls `onValueChange` when a new value commits and the parent passes that value back through `value`.

### 2) Uncontrolled value

```tsx
<SegmentedChoice
  ariaLabel="Default report range"
  defaultValue="week"
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  onValueChange={value => {
    rememberLastRange(value);
  }}
/>
```

Use uncontrolled mode when the control can manage its own selected value after the initial render. `defaultValue` is the initial selection; if it is missing or invalid, the component falls back to the first enabled option.

### 3) Icon or non-text labels

```tsx
<SegmentedChoice
  ariaLabel="Text alignment"
  defaultValue="center"
  options={[
    { value: 'left', label: <AlignLeftIcon />, ariaLabel: 'Align left' },
    { value: 'center', label: <AlignCenterIcon />, ariaLabel: 'Align center' },
    { value: 'right', label: <AlignRightIcon />, ariaLabel: 'Align right' },
  ]}
/>
```

When `label` is not readable text, provide `ariaLabel` on the option. The group itself still needs `ariaLabel` or `ariaLabelledby`.

### 4) Overlay with non-square indicator and anchor

```tsx
<SegmentedChoice
  ariaLabel="Tip"
  defaultValue="10"
  className="tip-choice"
  options={[
    { value: '5', label: '5%' },
    { value: '10', label: '10%' },
    { value: '15', label: '15%' },
  ]}
  geometry={{
    mode: 'overlay',
    dragScale: true,
    track: { layout: 'center-span', style: 'none' },
    anchor: { width: 20, height: 13 },
    indicator: {
      width: 40,
      height: 25,
      style: 'fill',
      content: 'none',
    },
  }}
/>
```

```css
.tip-choice.rsc-root .rsc-track {
  --rsc-track-size: 6px;
  background: #dbeafe;
}

.tip-choice.rsc-root .rsc-option-anchor {
  background: #93c5fd;
}

.tip-choice.rsc-root .rsc-option-label {
  margin-top: 50px;
}
```

This pattern uses `center-span` to position the track from the first option center to the last option center. The styled `.rsc-track` becomes the visible rail, explicit anchors provide compact targets and a fixed indicator moves along that rail.

With `track.style = "none"`, the component does not draw the default surface; the visible rail and label placement are yours to style with CSS. You can keep labels centered and size the anchors around them, move labels above or below the rail or use another layout that fits your design. This example moves the labels below the rail only to keep the rail shape easy to read.

### 5) Overlay with `clone-active`

```tsx
<SegmentedChoice
  ariaLabel="Editor mode"
  defaultValue="compose"
  options={[
    { value: 'draft', label: 'Draft' },
    { value: 'compose', label: 'Compose' },
    { value: 'review', label: 'Review' },
  ]}
  geometry={{
    mode: 'overlay',
    indicator: {
      style: 'fill',
      content: 'clone-active',
    },
    track: { style: 'none' },
  }}
/>
```

Use `clone-active` when the moving overlay should carry the active option content. It previews the target selection during drag and does not reorder options.

### 6) Slot-level analytics attrs

```tsx
<SegmentedChoice
  ariaLabel="Density"
  defaultValue="comfortable"
  options={[
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
  ]}
  slotProps={{
    root: { 'data-qa': 'density-choice' },
    option: { 'data-track': 'density-option' },
    indicator: { 'aria-hidden': 'true' },
  }}
/>
```

### 7) Scoped option-state styling

```tsx
<SegmentedChoice
  ariaLabel="Theme"
  defaultValue="system"
  className="my-choice"
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>
```

```css
.my-choice .rsc-option:first-of-type .rsc-option-content,
.my-choice .rsc-option:last-of-type .rsc-option-content {
  font-weight: 600;
}

.my-choice .rsc-option[data-selected='true'] .rsc-option-content {
  color: #111827;
}

.my-choice .rsc-option[data-disabled='true'] .rsc-option-content {
  opacity: 0.45;
}

.my-choice .rsc-option[data-previewed='true'] .rsc-option-label {
  color: #2563eb;
}
```

`data-selected` is the committed value. `data-previewed` is the drag target and only appears while dragging.

### 8) CSS-first theming

```tsx
<SegmentedChoice
  ariaLabel="Theme"
  defaultValue="system"
  className="my-theme-choice"
  options={[
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'System' },
    { value: 'dark', label: 'Dark' },
  ]}
/>
```

```css
.my-theme-choice {
  --rsc-surface: #0f172a;
  --rsc-text-color: #93c5fd;
  --rsc-active-text-color: #f8fafc;
  --rsc-indicator-color: #2563eb;
  --rsc-border-color: #1e293b;
}
```

### 9) `unstyled` with custom CSS

```tsx
<SegmentedChoice
  ariaLabel="Billing period"
  defaultValue="monthly"
  className="billing-period"
  unstyled
  options={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ]}
/>
```

```css
.billing-period {
  --rsc-text-color: #64748b;
  --rsc-active-text-color: #0f172a;
  --rsc-focus-ring-color: rgb(37 99 235 / 0.35);
}

.billing-period .rsc-list {
  gap: 4px;
}

.billing-period .rsc-option-content {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.billing-period .rsc-option[data-selected='true'] .rsc-option-content {
  background: #dbeafe;
  border-color: #60a5fa;
}
```

`unstyled` removes the bundled visual skin, not the behavior or DOM structure. The stable slots, radio semantics, keyboard behavior, drag behavior and geometry logic still apply.

### 10) Complex domain objects through string IDs

```tsx
const plans = [
  { id: 'plan-free', value: { seats: 1, tier: 'free' } },
  { id: 'plan-pro', value: { seats: 10, tier: 'pro' } },
] as const;

const byId = new Map(plans.map(plan => [plan.id, plan.value]));

<SegmentedChoice
  ariaLabel="Plan"
  defaultValue="plan-free"
  options={plans.map(plan => ({
    value: plan.id,
    label: plan.value.tier,
  }))}
  onValueChange={id => {
    const selectedPlan = byId.get(id);
    if (selectedPlan) {
      savePlan(selectedPlan);
    }
  }}
/>;
```

Keep rich values in your app model and pass stable string IDs to the component. This keeps DOM values, form behavior and TypeScript generics aligned with the public `SegmentedChoiceValue = string` contract.

## Guidance: `geometry` vs CSS vs `slotProps`

Use this split to avoid API confusion:

- `geometry`: mechanics and layout math.
- internal runtime stylesheet: instance-scoped layout values.
- CSS variables and selectors: look and theme.
- `slotProps`: attrs/events/class hooks for integration.

If a customization can be expressed in CSS, prefer CSS over adding new JS props.

For drag feedback, `data-dragging` marks the active pointer drag phase.
`data-drag-released` is briefly `true` after a pointer drag ends and is intended for optional CSS-only release feedback.
The library exposes this state hook but does not ship a default release animation.

## Browser Support

The supported baseline is current and previous major versions of Chrome, Edge and Safari.

Visual regression runs in CI on Chromium and WebKit.
