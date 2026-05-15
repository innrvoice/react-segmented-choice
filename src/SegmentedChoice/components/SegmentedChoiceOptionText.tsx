import React from 'react';

import { joinClassNames } from '../internal/classNames';
import type { NormalizedSlotProps } from '../internal/slotProps';

export function SegmentedChoiceOptionText({
  description,
  descriptionId,
  label,
  slots,
}: {
  description?: React.ReactNode;
  descriptionId?: string;
  label: React.ReactNode;
  slots: Pick<NormalizedSlotProps, 'optionDescription' | 'optionLabel'>;
}) {
  return (
    <>
      <span
        {...slots.optionLabel.props}
        className={joinClassNames('rsc-option-label', slots.optionLabel.className)}
      >
        {label}
      </span>
      {description ? (
        <span
          {...slots.optionDescription.props}
          className={joinClassNames('rsc-option-description', slots.optionDescription.className)}
          id={descriptionId}
        >
          {description}
        </span>
      ) : null}
    </>
  );
}
