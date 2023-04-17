import * as theme from '../../../lib/theme';

export default function wizard() {
  console.log(
    theme.color.status.warn(
      `\n${theme.icon.WARNING} WARNING: Threatcode wizard was removed at 31 March 2022.\nPlease use 'threatcode ignore' instead: https://updates.threatcode.github.io/threatcode-wizard-and-threatcode-protect-removal-224137 \n`,
    ),
  );
}
