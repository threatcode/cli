import chalk from 'chalk';

export const THREATCODE_APP_NAME = 'threatcodeAppName';
export const THREATCODE_APP_REDIRECT_URIS = 'threatcodeAppRedirectUris';
export const THREATCODE_APP_SCOPES = 'threatcodeAppScopes';
export const THREATCODE_APP_CLIENT_ID = 'threatcodeAppClientId';
export const THREATCODE_APP_ORG_ID = 'threatcodeAppOrgId';
export const THREATCODE_APP_CONTEXT = 'context';
export const THREATCODE_APP_DEBUG = 'threatcode:apps';

export enum EValidSubCommands {
  CREATE = 'create',
}

export enum EAppsURL {
  CREATE_APP,
}

export const validAppsSubCommands = Object.values<string>(EValidSubCommands);

export const AppsErrorMessages = {
  orgRequired: `Option '--org' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'threatcode apps --help' or 'threatcode apps -h'.`,
  nameRequired: `Option '--name' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'threatcode apps --help' or 'threatcode apps -h'.`,
  redirectUrisRequired: `Option '--redirect-uris' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'threatcode apps --help' or 'threatcode apps -h'.`,
  scopesRequired: `Option '--scopes' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'threatcode apps --help' or 'threatcode apps -h'.`,
  invalidContext: `Option '--context' must be either 'tenant' or 'user'! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'threatcode apps --help' or 'threatcode apps -h'.`,
  useExperimental: `\n${chalk.redBright(
    "All 'apps' commands are only accessible behind the '--experimental' flag.",
  )}\n
The behaviour can change at any time, without prior notice.
You are kindly advised to use all the commands with caution.

${chalk.bold('Usage')}
  ${chalk.italic('threatcode apps <COMMAND> --experimental')}\n`,
};

export const CreateAppPromptData = {
  THREATCODE_APP_NAME: {
    name: THREATCODE_APP_NAME,
    message: `Name of the Threatcode App (visible to users when they install the Threatcode App)?`,
  },
  THREATCODE_APP_REDIRECT_URIS: {
    name: THREATCODE_APP_REDIRECT_URIS,
    message: `Your Threatcode App's redirect URIs (comma seprated list. ${chalk.yellowBright(
      ' Ex: https://example1.com,https://example2.com',
    )})?: `,
  },
  THREATCODE_APP_SCOPES: {
    name: THREATCODE_APP_SCOPES,
    message: `Your Threatcode App's permission scopes (comma separated list. ${chalk.yellowBright(
      ' Ex: org.read,org.report.read',
    )})?: `,
  },
  THREATCODE_APP_ORG_ID: {
    name: THREATCODE_APP_ORG_ID,
    message:
      'Please provide the org id under which you want to create your Threatcode App: ',
  },
  THREATCODE_APP_CONTEXT: {
    name: THREATCODE_APP_CONTEXT,
    message: 'Which context will your app operate under: ',
  },
};
