import * as theme from '../../../lib/theme';

export default function protectFunc() {
  console.log(
    theme.color.status.warn(
      `\n${theme.icon.WARNING} WARNING: Threatcode protect was removed at 31 March 2022.\nPlease use '@threatcode/protect' package instead: https://updates.threatcode.io/threatcode-wizard-and-threatcode-protect-removal-224137 \n`,
    ),
  );
}
