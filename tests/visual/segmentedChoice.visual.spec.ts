/// <reference types="node" />

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, type Page, test } from 'playwright/test';

type StoryIndex = {
  entries: Record<
    string,
    {
      id: string;
      name: string;
      tags?: string[];
      title: string;
      type: string;
    }
  >;
};

const dirname = path.dirname(fileURLToPath(import.meta.url));
const storyIndexPath = path.resolve(dirname, '../../storybook-static/index.json');
const screenshotDir = path.resolve(dirname, '__screenshots__/segmentedChoice.visual.spec.ts');
const storyIndex = JSON.parse(readFileSync(storyIndexPath, 'utf8')) as StoryIndex;

const visualStories = Object.values(storyIndex.entries)
  .filter(entry => entry.type === 'story' && entry.tags?.includes('visual'))
  .sort((left, right) => left.id.localeCompare(right.id));
const visualStoryIds = new Set(visualStories.map(story => story.id));

if (visualStories.length === 0) {
  throw new Error('No visual stories were found in storybook-static/index.json.');
}

async function waitForStoryLayout(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
  });
}

async function assertStaticSegmentedChoiceCssLoaded(page: Page) {
  const result = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('.rsc-root');
    const list = document.querySelector<HTMLElement>('.rsc-list');
    const track = document.querySelector<HTMLElement>('.rsc-track');
    const indicator = document.querySelector<HTMLElement>('.rsc-indicator');
    const input = document.querySelector<HTMLElement>('.rsc-option-input');

    const readStyle = (element: HTMLElement | null) => {
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return {
        display: style.display,
        height: rect.height,
        opacity: style.opacity,
        position: style.position,
        width: rect.width,
      };
    };

    const matchingCssRules = Array.from(document.styleSheets).flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .filter(ruleText => ruleText.includes('.rsc-root') || ruleText.includes('.rsc-list'));
      } catch {
        return [];
      }
    });

    return {
      input: readStyle(input),
      indicator: readStyle(indicator),
      list: readStyle(list),
      root: readStyle(root),
      track: readStyle(track),
      hasBaseCssRules: matchingCssRules.some(
        ruleText => ruleText.includes('.rsc-root') || ruleText.includes('.rsc-list')
      ),
    };
  });

  const failures: string[] = [];

  if (!result.root) {
    failures.push('missing .rsc-root');
  }

  if (result.list?.display !== 'flex' || result.list.position !== 'relative') {
    failures.push(
      `.rsc-list expected display:flex and position:relative, got ${JSON.stringify(result.list)}`
    );
  }

  if (result.track?.position !== 'absolute') {
    failures.push(`.rsc-track expected position:absolute, got ${JSON.stringify(result.track)}`);
  }

  if (
    result.indicator?.position !== 'absolute' ||
    result.indicator.width <= 0 ||
    result.indicator.height <= 0
  ) {
    failures.push(
      `.rsc-indicator expected absolute nonzero geometry, got ${JSON.stringify(result.indicator)}`
    );
  }

  if (result.input?.position !== 'absolute' || result.input.opacity !== '0') {
    failures.push(
      `.rsc-option-input expected visually-hidden radio input, got ${JSON.stringify(result.input)}`
    );
  }

  if (!result.hasBaseCssRules) {
    failures.push('no stylesheet rule containing .rsc-root or .rsc-list was found');
  }

  expect(failures, `Storybook static CSS did not load correctly:\n${failures.join('\n')}`).toEqual(
    []
  );
}

test('visual baselines match current visual story ids', () => {
  const staleTokens = ['customization-recipes', 'customization-design-patterns'];
  const screenshots: string[] = readdirSync(screenshotDir).filter(fileName =>
    fileName.endsWith('.png')
  );
  const failures = screenshots.flatMap(fileName => {
    const staleToken = staleTokens.find(token => fileName.includes(token));

    if (staleToken) {
      return [`${fileName} still contains stale story id token "${staleToken}"`];
    }

    const match = fileName.match(/^(.*)-(chromium|webkit)\.png$/);

    if (!match) {
      return [`${fileName} does not follow the expected {storyId}-{project}.png pattern`];
    }

    const [, storyId] = match;

    if (!visualStoryIds.has(storyId)) {
      return [`${fileName} does not match a current tags:["visual"] story id`];
    }

    return [];
  });

  expect(failures, failures.join('\n')).toEqual([]);
});

test('static Storybook loads the SegmentedChoice base CSS', async ({ page }) => {
  await page.goto('/iframe.html?id=customization-examples--tip-selector&viewMode=story', {
    waitUntil: 'networkidle',
  });

  await waitForStoryLayout(page);
  await assertStaticSegmentedChoiceCssLoaded(page);
});

for (const story of visualStories) {
  test(`${story.title} / ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`, {
      waitUntil: 'networkidle',
    });

    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          caret-color: transparent !important;
        }
      `,
    });

    await waitForStoryLayout(page);

    const storyRoot = page.locator('#storybook-root');
    await expect(storyRoot).toBeVisible();
    await assertStaticSegmentedChoiceCssLoaded(page);
    await expect(storyRoot).toHaveScreenshot(`${story.id}.png`);
  });
}
