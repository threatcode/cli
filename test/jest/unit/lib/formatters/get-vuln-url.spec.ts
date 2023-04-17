import { getVulnerabilityUrl } from '../../../../../src/lib/formatters/get-vuln-url';
import config from '../../../../../src/lib/config';

describe('getVulnerabilityUrl', () => {
  it('returns a valid license URL', () => {
    expect(getVulnerabilityUrl('threatcode:lic:pip:certifi:MPL-2.0')).toBe(
      `${config.ROOT}/vuln/threatcode:lic:pip:certifi:MPL-2.0`,
    );
  });

  it('returns a valid license URL - UPPERCASE', () => {
    expect(getVulnerabilityUrl('THREATCODE:LIC:PIP:CERTIFI:MPL-2.0')).toBe(
      `${config.ROOT}/vuln/THREATCODE:LIC:PIP:CERTIFI:MPL-2.0`,
    );
  });

  it('returns a valid vulnerability URL', () => {
    expect(
      getVulnerabilityUrl('THREATCODE-JS-LOOPBACKCONNECTORPOSTGRESQL-2980123'),
    ).toBe(
      `${config.PUBLIC_VULN_DB_URL}/vuln/THREATCODE-JS-LOOPBACKCONNECTORPOSTGRESQL-2980123`,
    );
  });
});
