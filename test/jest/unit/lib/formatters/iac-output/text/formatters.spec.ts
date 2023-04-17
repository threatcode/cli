import * as path from 'path';
import * as fs from 'fs';
import { IacOutputMeta } from '../../../../../../../src/lib/types';
import {
  formatThreatcodeIacTestTestData,
  formatTestData,
} from '../../../../../../../src/lib/formatters/iac-output/text';
import { FormattedResult } from '../../../../../../../src/cli/commands/test/iac/local-execution/types';
import { ThreatcodeIacTestOutput } from '../../../../../../../src/lib/iac/test/v2/scan/results';
import {
  FormattedOutputResultsBySeverity,
  IacTestData,
} from '../../../../../../../src/lib/formatters/iac-output/text/types';

describe('formatTestData', () => {
  const formattedResultFixtures: FormattedResult[] = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'formatted-results.json',
      ),
      'utf-8',
    ),
  );

  const testDataFixture: FormattedOutputResultsBySeverity = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'test-data.json',
      ),
      'utf-8',
    ),
  );

  const outputMeta: IacOutputMeta = {
    orgName: 'Shmulik.Kipod',
    projectName: 'project-name',
  };

  it('formats the test data correctly', () => {
    expect(
      formatTestData({
        oldFormattedResults: formattedResultFixtures,
        iacOutputMeta: outputMeta,
        ignoresCount: 3,
      }),
    ).toEqual(testDataFixture);
  });
});

describe('formatThreatcodeIacTestTestData', () => {
  const threatcodeIacTestOutputFixture: ThreatcodeIacTestOutput = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'threatcode-iac-test-results.json',
      ),
      'utf-8',
    ),
  );
  const threatcodeIacTestOutputWithSuppressionsFixture: ThreatcodeIacTestOutput = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'threatcode-iac-test-results-with-suppressions.json',
      ),
      'utf-8',
    ),
  );

  const testDataFixture: IacTestData = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'threatcode-iac-test-text-output-data.json',
      ),
      'utf-8',
    ),
  );
  const testDataWithSuppressionsFixture: IacTestData = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'threatcode-iac-test-text-output-data-with-suppressions.json',
      ),
      'utf-8',
    ),
  );

  it('formats the test data correctly', () => {
    const result = formatThreatcodeIacTestTestData(
      threatcodeIacTestOutputFixture.results,
      'project-name',
      'org-name',
    );

    expect(result).toEqual(testDataFixture);
  });

  it('formats the test data correctly when suppressions are present', () => {
    const result = formatThreatcodeIacTestTestData(
      threatcodeIacTestOutputWithSuppressionsFixture.results,
      'project-name',
      'org-name',
    );

    expect(result).toEqual(testDataWithSuppressionsFixture);
  });
});
