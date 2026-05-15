export type AxisOrientation = 'horizontal' | 'vertical';

export type IndexedAxisBounds = {
  index: number;
  start: number;
  end: number;
  center: number;
  size: number;
};

export function distance(a: number, b: number) {
  return Math.abs(a - b);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export type RelativeBoxLayout = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export function getAxisCoordinate(
  orientation: AxisOrientation,
  point: Pick<PointerEvent, 'clientX' | 'clientY'>
) {
  return orientation === 'horizontal' ? point.clientX : point.clientY;
}

export function getAxisBounds(orientation: AxisOrientation, rect: DOMRect): IndexedAxisBounds {
  const start = orientation === 'horizontal' ? rect.left : rect.top;
  const end = orientation === 'horizontal' ? rect.right : rect.bottom;

  return {
    index: -1,
    start,
    end,
    center: start + (end - start) / 2,
    size: end - start,
  };
}

export function getRelativeBoxLayout({
  containerRect,
  height,
  left,
  scrollLeft,
  scrollTop,
  top,
  width,
}: {
  containerRect: DOMRect;
  height: number;
  left: number;
  scrollLeft: number;
  scrollTop: number;
  top: number;
  width: number;
}) {
  return {
    height,
    width,
    x: left - containerRect.left + scrollLeft,
    y: top - containerRect.top + scrollTop,
  } satisfies RelativeBoxLayout;
}

export function getCenteredBoxLayout({
  anchorRect,
  containerRect,
  height,
  scrollLeft,
  scrollTop,
  width,
}: {
  anchorRect: DOMRect;
  containerRect: DOMRect;
  height: number;
  scrollLeft: number;
  scrollTop: number;
  width: number;
}) {
  return {
    height,
    width,
    x: anchorRect.left - containerRect.left + scrollLeft + anchorRect.width / 2 - width / 2,
    y: anchorRect.top - containerRect.top + scrollTop + anchorRect.height / 2 - height / 2,
  } satisfies RelativeBoxLayout;
}

export function findNearestEnabledIndex(coordinate: number, bounds: readonly IndexedAxisBounds[]) {
  if (bounds.length === 0) {
    return -1;
  }

  let nearest = bounds[0];
  let smallestDistance = distance(coordinate, nearest.center);

  for (const candidate of bounds.slice(1)) {
    const candidateDistance = distance(coordinate, candidate.center);
    if (candidateDistance < smallestDistance) {
      nearest = candidate;
      smallestDistance = candidateDistance;
    }
  }

  return nearest.index;
}

export function resolveCommitIndex(
  coordinate: number,
  bounds: readonly IndexedAxisBounds[],
  {
    currentIndex = -1,
    lastDirection = 0,
    tieThreshold = 0.5,
  }: {
    currentIndex?: number;
    lastDirection?: -1 | 0 | 1;
    tieThreshold?: number;
  } = {}
) {
  if (bounds.length === 0) {
    return -1;
  }

  let smallestDistance = Number.POSITIVE_INFINITY;
  let tiedBounds: IndexedAxisBounds[] = [];

  for (const candidate of bounds) {
    const candidateDistance = distance(coordinate, candidate.center);

    if (candidateDistance < smallestDistance - tieThreshold) {
      smallestDistance = candidateDistance;
      tiedBounds = [candidate];
      continue;
    }

    if (distance(candidateDistance, smallestDistance) <= tieThreshold) {
      tiedBounds.push(candidate);
    }
  }

  if (tiedBounds.length === 1) {
    return tiedBounds[0]?.index ?? -1;
  }

  if (lastDirection > 0) {
    return tiedBounds.reduce((winner, candidate) =>
      candidate.center > winner.center ? candidate : winner
    ).index;
  }

  if (lastDirection < 0) {
    return tiedBounds.reduce((winner, candidate) =>
      candidate.center < winner.center ? candidate : winner
    ).index;
  }

  const current = tiedBounds.find(candidate => candidate.index === currentIndex);
  if (current) {
    return current.index;
  }

  return tiedBounds[0]?.index ?? -1;
}
