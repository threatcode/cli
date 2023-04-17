import { CLI_BIN_PATH } from './constants';
import { runCommand, RunCommandOptions, RunCommandResult } from './runCommand';

const runThreatcodeCLI = async (
  argsString: string,
  options?: RunCommandOptions,
): Promise<RunCommandResult> => {
  return runThreatcodeCLIWithArray(
    argsString.split(' ').filter((v) => !!v),
    options,
  );
};

const runThreatcodeCLIWithArray = async (
  args: string[],
  options?: RunCommandOptions,
): Promise<RunCommandResult> => {
  if (process.env.TEST_THREATCODE_COMMAND) {
    return await runCommand(process.env.TEST_THREATCODE_COMMAND, args, options);
  }
  return await runCommand('node', [CLI_BIN_PATH, ...args], options);
};

export { runThreatcodeCLI, runThreatcodeCLIWithArray };
