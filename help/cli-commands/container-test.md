# Container test

## Usage

`threatcode container test [<OPTIONS>] [<IMAGE>]`

## Description

The `threatcode container test` command tests container images for any known vulnerabilities.

For more information see [Threatcode CLI for container security](https://docs.threatcode.github.io/products/threatcode-container/threatcode-cli-for-container-security)

## Exit codes

Possible exit codes and their meaning:

**0**: success (scan completed), no vulnerabilities found\
**1**: action_needed (scan completed), vulnerabilities found\
**2**: failure, try to re-run command\
**3**: failure, no supported projects detected

## Configure the Threatcode CLI

You can use environment variables to configure the Threatcode CLI and set variables for connecting with the Threatcode API.

There are environment variables that apply to the container command; see [Configure the Threatcode CLI](https://docs.threatcode.github.io/features/threatcode-cli/configure-the-threatcode-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options

### `--print-deps`

Print the dependency tree before sending it for analysis.

### `--org=<ORG_ID>`

Specify the `<ORG_ID>` to run Threatcode commands tied to a specific organization. The `<ORG_ID>` influences some features availability and private test limits.

If you have multiple organizations, you can set a default from the CLI using:

`$ threatcode config set org=<ORG_ID>`

Set a default to ensure all newly tested and monitored projects are tested and monitored under your default organization. If you need to override the default, use the `--org=<ORG_ID>` option.

Default: `<ORG_ID>` that is the current preferred organization in your [Account settings](https://app.threatcode.github.io/account)

Note that you can also use `--org=<orgslugname>`. The `ORG_ID` works in both the CLI and the API. The organization slug name works in the CLI, but not in the API.

For more information see the article [How to select the organization to use in the CLI](https://docs.threatcode.github.io/threatcode-cli/test-for-vulnerabilities/how-to-select-the-organization-to-use-in-the-cli)

### `--file=<FILE_PATH>`

For more detailed advice, include the path to the Dockerfile for the image.

### `--project-name=<PROJECT_NAME>`

Specify a custom Threatcode project name.

### `--policy-path=<PATH_TO_POLICY_FILE>`

Manually pass a path to a `.threatcode` policy file.

### `--json`

Print results ion the console as a JSON data structure.

Example: `$ threatcode container test --json`

### `--json-file-output=<OUTPUT_FILE_PATH>`

Save test output in JSON format as a JSON data structure directly to the specified file, regardless of whether or not you use the `--json` option.

Use to display the human-readable test output using stdout and at the same time save the JSON data structure output to a file.

Example: `$ threatcode container test --json-file-output=vuln.json`

### `--sarif`

Return results in SARIF format. Note this requires the test to be run with `--file` as well.

### `--sarif-file-output=<OUTPUT_FILE_PATH>`

Save test output in SARIF format directly to the `<OUTPUT_FILE_PATH>` file, regardless of whether or not you use the `--sarif` option. Note this requires the test to be run with `--file` as well.

This is especially useful if you want to display the human-readable test output using stdout and at the same time save the SARIF format output to a file.

### `--severity-threshold=<low|medium|high|critical>`

Report only vulnerabilities at the specified level or higher.

### `--fail-on=<all|upgradable>`

Fail only when there are vulnerabilities that can be fixed.

- `all`: fail when there is at least one vulnerability that can be either upgraded or patched.
- `upgradable`: fail when there is at least one vulnerability that can be upgraded.

To fail on any vulnerability (the default behavior), do not use the `--fail-on` option. If vulnerabilities do not have a fix and this option is being used, tests pass.

### `--app-vulns`

Allow detection of vulnerabilities in your application dependencies from container images, as well as from the operating system, all in one single scan.

In CLI versions 1.1090.0 (2023-01-24) and higher, Threatcode scans for application dependencies in your image by default; you do not need to specify the `--app-vulns` flag.

In CLI versions 1.962.0 through v1.1089.0, use the `--app-vulns` option with the the `--json` option to see the operating system as well as application vulnerabilities in JSON format in the results.

For more information see [Detecting application vulnerabilities in container images](https://docs.threatcode.github.io/products/threatcode-container/getting-around-the-threatcode-container-ui/detecting-application-vulnerabilities-in-container-images)

### `--exclude-app-vulns`

Allow disabling scans for app vulnerabilities; in CLI versions 1.1090.0 (2023-01-24) and higher, `app-vulns` is enabled by default.

In earlier releases, cannot be used with `--app-vulns`.

For more information see [Detecting application vulnerabilities in container images](https://docs.threatcode.github.io/products/threatcode-container/getting-around-the-threatcode-container-ui/detecting-application-vulnerabilities-in-container-images)

### `--nested-jars-depth`

When `app-vulns` is enabled, use the `--nested-jars-depth` option to set how many levels of nested jars Threatcode is to unpack. Depth must be a number.

### `--exclude-base-image-vulns`

Do not show vulnerabilities introduced only by the base image. Available when using `threatcode container test` only.

### `--platform=<PLATFORM>`

For multi-architecture images, specify the platform to test.

Supported platforms are: `linux/amd64`, `linux/arm64`, `linux/riscv64`, `linux/ppc64le`, `linux/s390x`, `linux/386`, `linux/arm/v7`, or `linux/arm/v6`

### `--username=<CONTAINER_REGISTRY_USERNAME>`

Specify a username to use when connecting to a container registry. This is ignored in favor of local Docker binary credentials when Docker is present.

### `--password=<CONTAINER_REGISTRY_PASSWORD>`

Specify a password to use when connecting to a container registry. This is ignored in favor of local Docker binary credentials when Docker is present.

## Examples for the container test command

### Scan Docker images

`$ threatcode container test <image>`

### Option to get more information including base image remediation

`--file=path/to/Dockerfile`

### Scan a Docker image created using the given Dockerfile and with a specified policy path

`$ threatcode container test app:latest --file=Dockerfile`

`$ threatcode container test app:latest --file=Dockerfile --policy-path=path/to/.threatcode`

For more information and examples see [Advanced Threatcode Container CLI usage](https://docs.threatcode.github.io/threatcode-container/threatcode-cli-for-container-security/advanced-threatcode-container-cli-usage)
