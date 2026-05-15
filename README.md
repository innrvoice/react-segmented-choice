# react-segmented-choice

[![codecov](https://codecov.io/gh/innrvoice/react-segmented-choice/branch/master/graph/badge.svg)](https://codecov.io/gh/innrvoice/react-segmented-choice)
[![bundle size](https://codecov.io/github/innrvoice/react-segmented-choice/branch/master/graph/bundle/react-segmented-choice-esm/badge.svg)](https://app.codecov.io/github/innrvoice/react-segmented-choice/bundles/master/react-segmented-choice-esm)

`react-segmented-choice` is an accessible segmented control for immediate single-choice selection in React.

It is built for controls that should feel like real form inputs, not just clickable tabs: native radio semantics, keyboard behavior, drag-to-select, CSS-first theming and geometry hooks for custom indicator layouts.

Typical use cases:

- report ranges, billing periods, density switches and mode pickers
- icon controls where every option should keep a stable target
- custom segmented controls that still need form and accessibility behavior

Browse practical customization examples and architecture stories in the hosted [Storybook](https://sb.segmentedchoice.visiofutura.com/).

## Install

```bash
pnpm add react-segmented-choice
# or
npm install react-segmented-choice
# or
yarn add react-segmented-choice
```

Import bundled styles once:

```tsx
import 'react-segmented-choice/styles.css';
```

## Quick Start

```tsx
import { SegmentedChoice } from 'react-segmented-choice';
import 'react-segmented-choice/styles.css';

export function ReportRange() {
  return (
    <SegmentedChoice
      ariaLabel="Report range"
      defaultValue="week"
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  );
}
```

## Value Type (`string` only)

`SegmentedChoiceValue` is `string`. Option values are the public selection contract, so use stable IDs even when the selected domain object is richer than a string.

For complex domain values, keep external mapping by ID:

```tsx
const items = [
  { id: 'plan-free', plan: { seats: 1, tier: 'free' } },
  { id: 'plan-pro', plan: { seats: 10, tier: 'pro' } },
] as const;

const byId = Object.fromEntries(items.map(x => [x.id, x.plan]));

<SegmentedChoice
  ariaLabel="Plan"
  value={selectedId}
  onValueChange={id => {
    setSelectedId(id);
    setSelectedPlan(byId[id]);
  }}
  options={items.map(x => ({ value: x.id, label: x.plan.tier }))}
/>;
```

## Public API

The component has one main entry point and a small set of supporting types. The README keeps the surface map short; `API.md` has the prop-by-prop reference and longer customization examples.

Exports:

- `SegmentedChoice`
- types: `SegmentedChoiceProps`, `SegmentedChoiceOption`, `SegmentedChoiceValue`, `SegmentedChoiceGeometry`, `SegmentedChoiceSlotProps`
- geometry/types: `SegmentedChoiceTrackLayout`, `SegmentedChoiceTrackStyle`, `SegmentedChoiceIndicatorStyle`, `SegmentedChoiceIndicatorContentMode`, `SegmentedChoiceIndicatorTransition`
- typography helpers: `SEGMENTED_CHOICE_FONT_FAMILY`, `SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS`, `getSegmentedChoiceTypographyTokens`, `SegmentedChoiceTypographyTokens`

Top-level props:

- `options`, `value`, `defaultValue`, `onValueChange`, `name`
- `disabled`, `required`, `orientation`, `optionSizing`, `optionDistribution`, `size`
- `draggable`, `loop`
- `ariaLabel`, `ariaLabelledby`, `ariaDescribedby`
- `className`, `styleNonce`, `unstyled`, `slotProps`, `geometry`

Layout props worth knowing early:

- `optionSizing` controls option box dimensions: `equal` uses the widest measured option content for every option, `content` lets each option follow its own content width and `geometry.optionSize` switches to fixed square option boxes.
- `optionDistribution` controls option placement when the surface has extra space. The default is `space-between`; `space-around` adds outer breathing room too. Surface width itself still comes from normal CSS layout.

Structural runtime guarantees:

- `options` must contain at least 2 entries
- every `options[i].value` must be a unique string
- invalid option structures render nothing and warn in development
- the radiogroup must be labelled with `ariaLabel` or `ariaLabelledby`

For complete prop-by-prop reference with examples, see `API.md`.

Option fields:

- `value`: unique string selection value
- `label`: rendered option content
- `ariaLabel`: accessible label for icon-only or non-text labels
- `description`: optional secondary content
- `disabled`: disables one option
- `accentColor`: optional per-option indicator color, sanitized before runtime CSS injection

### `geometry`

Use `geometry` for mechanics and measured layout: underlay vs overlay, track span, explicit option/anchor/indicator sizing, drag scale, indicator paint mode, cloned indicator content and indicator transition behavior.

```ts
geometry?: {
  mode?: "underlay" | "overlay";
  dragScale?: boolean | number;
  optionSize?: number;
  anchor?: {
    size?: number;
    width?: number;
    height?: number;
  };
  track?: {
    layout?: "container" | "center-span";
    style?: "surface" | "none";
  };
  indicator?: {
    size?: number;
    width?: number;
    height?: number;
    style?: "fill" | "ring" | "none";
    content?: "none" | "clone-active";
    transition?: "smooth" | "instant";
    inset?: number;
    borderWidth?: number;
  };
}
```

Defaults:

- `geometry.mode = "underlay"`
- `geometry.track.layout = "container"`
- `geometry.track.style = "surface"`
- `geometry.indicator.style = "fill"`
- `geometry.indicator.content = "none"`
- `geometry.indicator.transition = "smooth"`

`geometry.indicator.transition` controls selection indicator geometry motion:

- `"smooth"` animates selection indicator position and size changes.
- `"instant"` updates selection indicator geometry without movement or resize animation.

This affects the selection indicator only. It does not delay value changes or alter drag preview behavior.

### `slotProps`

`slotProps` is for external attrs/events/class hooks only:

- allowed: `className`, `data-*`, non-conflicting `aria-*`, handlers (`onPointerEnter`, etc.)
- not supported: `style`

`style` is intentionally ignored at runtime even if forced through a cast.

For `slotProps.list`, internal pointer/focus handlers run before user-provided handlers.
Use list-level handlers to observe or augment interactions, not to override the built-in drag/commit flow.

Root radiogroup semantics stay controlled by top-level props such as `ariaLabel`, `ariaLabelledby` and `ariaDescribedby`.

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
    root: { 'data-qa': 'density-choice' },
    option: { 'data-track': 'density-option' },
  }}
/>
```

## CSS-First Customization Contract

`SegmentedChoice` does not write `style={...}` onto its rendered slots.

The public styling surface is intentionally CSS-first:

- stable `.rsc-*` classes for slot targeting
- core state `data-*` attrs for state-specific styling
- public `--rsc-*` variables for theme tokens
- no rendered slot inline styles, so external CSS can still override variables such as `--rsc-surface`

Runtime geometry is different from theme styling. Measured layout values are written through an internal scoped stylesheet, not through element inline styles.

### CSP-safe runtime styles

Dynamic layout values are injected into a shared document stylesheet.

- pass `styleNonce` when your app uses strict CSP without `unsafe-inline`
- instances in the same document share one runtime style host per nonce value
- controls with different `styleNonce` values create separate runtime style hosts

### Stable class hooks

- `.rsc-root`, `.rsc-list`, `.rsc-track`, `.rsc-indicator`, `.rsc-indicator-content`
- `.rsc-option`, `.rsc-option-input`, `.rsc-option-anchor`, `.rsc-option-content`
- `.rsc-option-label`, `.rsc-option-description`

Use class hooks for stable slot targeting. Use data attrs for semantic state and interaction state.

### Stable root data attrs

- `data-orientation`, `data-size`
- `data-disabled`, `data-unstyled`, `data-dragging`, `data-drag-released`

`data-dragging` marks an active pointer drag. `data-drag-released` is briefly `true` after a pointer drag ends so CSS can add optional release feedback such as a bounce or glow. The default stylesheet does not animate release.

### Stable option data attrs

- `data-selected`, `data-disabled`, `data-focus-visible`
- `data-has-description`, `data-previewed`

`data-previewed` marks the option currently targeted during an active drag. It can differ from `data-selected` until the drag commits.

### Stable CSS variables

Always active:

- `--rsc-bg`, `--rsc-surface`, `--rsc-border-color`, `--rsc-border-radius`
- `--rsc-font-family`, `--rsc-font-weight`, `--rsc-line-height`, `--rsc-letter-spacing`
- `--rsc-font-size`, `--rsc-description-font-size`
- `--rsc-container-offset`, `--rsc-padding`, `--rsc-gap`, `--rsc-label-gap`
- `--rsc-disabled-opacity`
- `--rsc-option-min-size`, `--rsc-option-padding-block`, `--rsc-option-padding-inline`, `--rsc-option-radius`
- `--rsc-track-size`
- `--rsc-text-color`, `--rsc-active-text-color`
- `--rsc-indicator-bg`, `--rsc-indicator-color`
- `--rsc-indicator-border-width`, `--rsc-indicator-shadow`, `--rsc-focus-ring-color`

Optional public override:

- `--rsc-indicator-hover-bg` overrides the overlay fill hover color. Without it, overlay fill hover preserves active `accentColor`; controls without an active accent use the default gray hover fill.

### Public vs internal CSS variables

Public variables are the documented `--rsc-*` tokens above. They are safe to theme from external CSS.

Internal runtime selectors and variables use `data-rsc-*` and `--_rsc-*`. They are implementation details used by the bundled stylesheet and scoped runtime layout rules, not supported customization API.

### SSR and Hydration

Server rendering does not emit the internal runtime stylesheet.

- SSR markup is safe to render without touching `window`, `document` or `navigator`
- the scoped runtime CSS is installed on the client after hydration during the first layout effect
- plan for the indicator and measured geometry to settle on the client after hydration

## API Precedence

1. Component state and `geometry` define mechanics/layout.
2. Internal runtime stylesheet applies instance-scoped layout values.
3. Public CSS variables define theme and visual output.
4. Class/data selectors define contextual styling.
5. `slotProps` adds attrs/events/class names to slots.

Use `geometry` for behavior/geometry, CSS for appearance.

`unstyled` means "remove the default visual skin", not "headless DOM primitive". Structure, semantics, slots and layout logic still come from the component.

For deeper guidance, examples and sentence-level descriptions of each stable class/data hook, read `API.md`.

## Storybook

The hosted Storybook contains practical customization patterns, architecture stories, interaction demos and real-world segmented control examples.

It covers:

- getting-started usage and state variants
- geometry and indicator architecture
- CSS-first customization patterns
- rails, thumbnails, filters and toggle-like controls
- keyboard, pointer, drag and accessibility interaction behavior
- styling examples built only on the documented public API

Run Storybook locally with `pnpm storybook` or browse and examine the hosted examples at [sb.segmentedchoice.visiofutura.com](https://sb.segmentedchoice.visiofutura.com/).

## Browser Support

The supported baseline is current and previous major releases of:

- Chrome / Edge
- Safari

The library is tested with Chromium and WebKit in CI.

## Visual Regression Workflow

```bash
pnpm test:visual
pnpm test:visual:update
```

`test:visual` builds Storybook and runs screenshot diffs against the curated `tags: ["visual"]` stories.

## Accessibility

- Native radio inputs and radiogroup semantics
- Arrow/Home/End keyboard support
- Disabled options skipped in keyboard navigation
- Immediate form compatibility via shared `name`
- For non-text labels, pass `ariaLabel` per option

## Security / SBOM

Tagged releases publish a CycloneDX SBOM generated from the pnpm lockfile.

The SBOM can be used by security and compliance tooling to inspect dependency metadata.

## Quality Gates

- Format: `pnpm format:check`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Build/declaration output: `pnpm build`
- Unit: `pnpm test:unit`
- Storybook interactions: `pnpm test:storybook`
- Source/build contract: `pnpm test:contract`
- Package sanity: `pnpm pack:check`
- Visual regression: `pnpm test:visual`
- Coverage: `pnpm test:coverage`

CI runs formatting, lint, unit coverage, package build, public contract checks, package-content checks, Storybook browser tests and Chromium/WebKit visual regression.

`prepack` runs: build -> contract check -> pack check.

## Supported Versions

- React: `^18.2.0 || ^19.0.0`
- Node: `>=20.19.0`
