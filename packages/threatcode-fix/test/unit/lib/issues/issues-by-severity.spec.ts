import { getIssueCountBySeverity } from '../../../../src/lib/issues/issues-by-severity';
import { IssuesData, SEVERITY } from '../../../../src/types';

describe('getIssueCountBySeverity', () => {
  it('correctly returns when no issues', () => {
    const issueData = [];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: [],
      high: [],
      low: [],
      medium: [],
    });
  });

  it('correctly returns when all severities are present', () => {
    const issueData: IssuesData[] = [
      {
        'THREATCODE-1': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'THREATCODE-1',
        },
      },
      {
        'THREATCODE-2': {
          title: 'High severity issue',
          severity: SEVERITY.HIGH,
          id: 'THREATCODE-2',
        },
      },
      {
        'THREATCODE-3': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'THREATCODE-3',
        },
      },
      {
        'THREATCODE-4': {
          title: 'High severity issue',
          severity: SEVERITY.LOW,
          id: 'THREATCODE-4',
        },
      },
    ];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: ['THREATCODE-1'],
      high: ['THREATCODE-2'],
      low: ['THREATCODE-4'],
      medium: ['THREATCODE-3'],
    });
  });

  it('correctly returns when some severities are present', () => {
    const issueData: IssuesData[] = [
      {
        'THREATCODE-1': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'THREATCODE-1',
        },
      },
      {
        'THREATCODE-2': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'THREATCODE-2',
        },
      },
      {
        'THREATCODE-3': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'THREATCODE-3',
        },
      },
      {
        'THREATCODE-4': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'THREATCODE-4',
        },
      },
      {
        'THREATCODE-5': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'THREATCODE-5',
        },
      },
    ];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: ['THREATCODE-1', 'THREATCODE-2', 'THREATCODE-3'],
      high: [],
      low: [],
      medium: ['THREATCODE-4', 'THREATCODE-5'],
    });
  });
});
