import { describe } from 'vitest';

import { registerSegmentedChoiceBehaviorSuite } from './SegmentedChoice.behavior.suite';
import { registerSegmentedChoiceStateContractSuite } from './SegmentedChoice.stateContract.suite';

describe('SegmentedChoice', () => {
  registerSegmentedChoiceStateContractSuite();
  registerSegmentedChoiceBehaviorSuite();
});
