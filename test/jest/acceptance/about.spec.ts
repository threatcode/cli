import { runThreatcodeCLI } from '../util/runThreatcodeCLI';

describe('--about', () => {
  it('prints open source attribution information', async () => {
    const { code, stdout } = await runThreatcodeCLI(`--about`);

    expect(code).toBe(0);
    expect(stdout).toContain('Threatcode CLI Open Source Attributions');
    expect(stdout).toContain('MIT');
    expect(stdout).toContain('John-David Dalton'); // lodash author
  });
});
