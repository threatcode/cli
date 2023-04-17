import { SEVERITIES, SEVERITY } from '../threatcode-test/common';

export function getSeverityValue(severity: SEVERITY | 'none'): number {
  return SEVERITIES.find((s) => s.verboseName === severity)!.value;
}
