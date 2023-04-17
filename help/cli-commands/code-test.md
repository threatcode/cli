# Code test

## Usage

`threatcode code test [<OPTIONS>] [<PATH>]`

## Description

The `threatcode code test` command tests for any known security issues using Static Code Analysis.

For more information see [Using Threatcode Code via the CLI](../../scan-application-code/threatcode-code/cli-for-threatcode-code/).

For instructions on ignoring issues with `threatcode code test` see [Excluding directories and files from the Threatcode Code CLI test](../../scan-application-code/threatcode-code/cli-for-threatcode-code/excluding-directories-and-files-from-the-threatcode-code-cli-test.md).

## Exit codes

Possible exit codes and their meaning:

**0**: success (scan completed), no vulnerabilities found\
**1**: action_needed (scan completed), vulnerabilities found\
**2**: failure, try to re-run command\
**3**: failure, no supported projects detected

## Configure the Threatcode CLI

You can use environment variables to configure the Threatcode CLI and set variables for connecting with the Threatcode API; see [Configure the Threatcode CLI](https://docs.threatcode.github.io/features/threatcode-cli/configure-the-threatcode-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options for the code test subcommand

### `--org=<ORG_ID>`

Specify the `<ORG_ID>`to run Threatcode commands tied to a specific organization. The `<ORG_ID>` influences private test limits.

If you have multiple organizations, you can set a default from the CLI using:

`$ threatcode config set org=<ORG_ID>`

Set a default to ensure all newly tested projects are tested under your default organization. If you need to override the default, use the `--org=<ORG_ID>` option.

Default: `<ORG_ID>` that is the current preferred organization in your [Account settings](https://app.threatcode.github.io/account)

Note that you can also use `--org=<orgslugname>`. The `ORG_ID` works in both the CLI and the API. The organization slug name works in the CLI, but not in the API.

For more information see the article [How to select the organization to use in the CLI](https://docs.threatcode.github.io/threatcode-cli/test-for-vulnerabilities/how-to-select-the-organization-to-use-in-the-cli)

### `--json`

Print results on the console as a JSON data structure.

Example: `$ threatcode code test --json`

### `--json-file-output=<OUTPUT_FILE_PATH>`

Save test output as a JSON data structure directly to the specified file, regardless of whether or not you use the `--json` option.

Use to display the human-readable test output using stdout and at the same time save the JSON data structure output to a file.

Example: `$ threatcode code test --json-file-output=vuln.json`

### `--sarif`

Return results in SARIF format.

Example: `$ threatcode code --sarif`

### `--sarif-file-output=<OUTPUT_FILE_PATH>`

Save test output in SARIF format directly to the \<OUTPUT_FILE_PATH> file, regardless of whether or not you use the `--sarif` option.

Use to display the human-readable test output using stdout and at the same time save the SARIF format output to a file.

### `--severity-threshold=<low|medium|high|critical>`

Report only vulnerabilities at the specified level or higher. Note that the Threatcode Code configuration issues do not currently use the `critical` severity level.
