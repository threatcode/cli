# IaC capture

## Usage

**Feature availability:** This feature is available in Threatcode CLI version v1.1117.0 or greater.

`threatcode iac capture [<OPTIONS>] [<PATH>]`

## Description

The `threatcode iac capture` command generates a mapping artifact that contains the minimum amount of information needed to generate, from Terraform state files, resource mappings from code to Cloud, such as resource IDs and names, and sends the mapping artifact to Threatcode.

Threatcode uses this information to link Cloud issues to their originating IaC files. The links can be viewed in the Threatcode Web UI.

For more information, see [Fix Cloud issues in IaC](https://docs.threatcode.github.io/scan-cloud-deployment/threatcode-cloud/threatcode-cloud-issues/fix-cloud-issues-in-iac)

For a list of related commands see the [threatcode iac](iac.md) help; `iac --help`

## Exit codes

Possible exit codes and their meaning:

**0**: success\
**1**: failed to capture one or more Terraform states

## Configure the Threatcode CLI

You can use environment variables and set variables for connecting with the Threatcode API; see [Configure the Threatcode CLI](https://docs.threatcode.github.io/threatcode-cli/configure-the-threatcode-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options

### `--org=<ORG_ID>`

Specify the `<ORG_ID>` to run Threatcode commands tied to a specific organization. Overrides the default `<ORG_ID>` that is the current preferred organization in your [Account settings](https://app.threatcode.github.io/account)

Note that you can also use `--org=<orgslugname>`. The `ORG_ID` works in both the CLI and the API. The organization slug name works in the CLI, but not in the API.

For more information see the article [How to select the organization to use in the CLI](https://docs.threatcode.github.io/threatcode-cli/test-for-vulnerabilities/how-to-select-the-organization-to-use-in-the-cli)

### `--stdin`

Generate the mapping artifact from Terraform state in the standard input instead of looking for state files in the `PATH`.

```
$ terraform pull | threatcode iac capture --stdin
```

### `PATH`

Optional argument to generate the mapping artifact from Terraform state file(s) in the PATH. Can either be a path to a directory, a path to a file, or a glob pattern.

```
$ threatcode iac capture /path/to/states/**/*.tfstate
```

## Examples for threatcode iac capture command

### Capture from all states in the current working directory

```
$ threatcode iac capture
```

### Capture from all files ending with .tfstate in a directory

```
$ threatcode iac capture /path/to/states/**/*.tfstate
```

### Capture from a single state file

```
$ threatcode iac capture /path/to/state.tfstate
```

### Capture from states pulled with Terraform in the standard input

```
$ terraform pull | threatcode iac capture --stdin
```
