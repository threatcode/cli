import * as theme from './theme';
import * as createDebug from 'debug';
import { EOL } from 'os';
import config from './config';
import { getVulnerabilityUrl } from './formatters/get-vuln-url';

const debug = createDebug('threatcode-spotlight-vuln-notification');

const spotlightVulnIds = ['THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720'];

export function containsSpotlightVulnIds(results: any[]): string[] {
  try {
    const spotlightVulnsFound = new Set<string>();
    for (const r of results) {
      if (r.vulnerabilities) {
        for (const v of r.vulnerabilities) {
          if (spotlightVulnIds.includes(v.id)) {
            spotlightVulnsFound.add(v.id);
          }
        }
      }
    }
    return [...spotlightVulnsFound];
  } catch (err) {
    debug('Error in containsSpotlightVulnIds()', err);
    return [];
  }
}

type VulnerabilityId = string;

export function notificationForSpotlightVulns(
  foundSpotlightVulnsIds: VulnerabilityId[],
) {
  try {
    if (foundSpotlightVulnsIds.length > 0) {
      let message = '';
      for (const vulnId of spotlightVulnIds) {
        if (vulnId === 'THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720') {
          message += theme.color.severity.critical(
            `${theme.icon.WARNING} WARNING: Critical severity vulnerabilities were found with Log4j!` +
              EOL,
          );

          for (const vulnId of foundSpotlightVulnsIds) {
            message += `  - ${vulnId} (See ${getVulnerabilityUrl(vulnId)})`;
          }

          message += EOL + EOL;
          message +=
            theme.color.severity.critical(
              `We highly recommend fixing this vulnerability. If it cannot be fixed by upgrading, see mitigation information here:`,
            ) +
            EOL +
            `  - ${config.PUBLIC_VULN_DB_URL}/vuln/THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720` +
            EOL +
            `  - https://threatcode.io/blog/log4shell-remediation-cheat-sheet/` +
            EOL;
        }
      }
      return message;
    }
    return '';
  } catch (err) {
    debug('Error in notificationForSpotlightVulns()', err);
    return '';
  }
}
