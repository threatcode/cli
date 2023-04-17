import * as svn from '../../../../src/lib/spotlight-vuln-notification';

describe('containsSpotlightVuln', () => {
  it('returns empty array if no spotlight vulns found', () => {
    const results = [
      {
        vulnerabilities: [
          {
            id: 'foo1',
          },
          {
            id: 'foo2',
          },
        ],
      },
    ];
    const foundSpotlightVulnIds = svn.containsSpotlightVulnIds(results);
    expect(foundSpotlightVulnIds).toEqual([]);
  });

  it('returns empty array if `results` has no `vulnerabilities`', () => {
    const results = [
      {
        info: 'foo',
      },
    ];
    const foundSpotlightVulnIds = svn.containsSpotlightVulnIds(results);
    expect(foundSpotlightVulnIds).toEqual([]);
  });

  it('returns empty array if a `vulnerabilities` item has no `id`', () => {
    const results = [
      {
        vulnerabilities: [
          {
            info: 'foo',
          },
        ],
      },
    ];
    const foundSpotlightVulnIds = svn.containsSpotlightVulnIds(results);
    expect(foundSpotlightVulnIds).toEqual([]);
  });

  it('identifies THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720', () => {
    const results = [
      {
        vulnerabilities: [
          {
            id: 'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
          },
        ],
      },
    ];
    const foundSpotlightVulnIds = svn.containsSpotlightVulnIds(results);
    expect(foundSpotlightVulnIds).toEqual([
      'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
    ]);
  });

  it('returns only a single instance of a vuln if it is found multiple times', () => {
    const results = [
      {
        vulnerabilities: [
          {
            id: 'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
            info: '1',
          },
          {
            id: 'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
            info: '2',
          },
        ],
      },
    ];
    const foundSpotlightVulnIds = svn.containsSpotlightVulnIds(results);
    expect(foundSpotlightVulnIds).toEqual([
      'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
    ]);
  });

  it('returns matched vulnId if found, even if the shape of another item in `results` is bad', () => {
    const results = [
      {
        info: 'bad because entirely missing the `vulnerabilities` key',
      },
      {
        vulnerabilities: [
          {
            info: 'bad because no id',
          },
          {
            id: 'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
          },
        ],
      },
    ];
    const foundSpotlightVulnIds = svn.containsSpotlightVulnIds(results);
    expect(foundSpotlightVulnIds).toEqual([
      'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
    ]);
  });
});
