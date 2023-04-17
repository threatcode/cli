import { SEVERITY } from '../../../threatcode-test/legacy';

export interface TestConfig {
  paths: string[];
  iacCachePath: string;
  userRulesBundlePath?: string;
  userPolicyEnginePath?: string;
  userRulesClientURL?: string;
  report: boolean;
  severityThreshold?: SEVERITY;
  targetReference?: string;
  targetName?: string;
  remoteRepoUrl?: string;
  policy?: string;
  scan: string;
  varFile?: string;
  depthDetection?: number;
  cloudContext?: string;
  threatcodeCloudEnvironment?: string;
  insecure?: boolean;
  org?: string;
  customRules?: boolean;
  experimental?: boolean;
}
