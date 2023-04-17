# IAC update-exclude-policy

## Usage

`threatcode iac update-exclude-policy [<OPTIONS>]`

## Description

The `threatcode iac update-exclude-policy` generates exclude policy rules to be used by `threatcode iac describe`.

For a list of related commands see the [threatcode iac](iac.md) help; `iac --help`

For more information see [Ignore resources](https://docs.threatcode.io/products/threatcode-infrastructure-as-code/detect-drift-and-manually-created-resources/ignore-resources)

## Exit codes

Possible exit codes and their meaning:

**0**: success, exclude rules generated successfully\
**1**: error, something wrong happened during exclude rules generation

## Configure the Threatcode CLI

You can use environment variables to configure the Threatcode CLI and set variables for connecting with the Threatcode API. See [Configure the Threatcode CLI](https://docs.threatcode.io/threatcode-cli/configure-the-threatcode-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options

### `--exclude-changed`

Exclude resources that changed on cloud provider.

### `--exclude-missing`

Exclude missing resources.

### `--exclude-unmanaged`

Exclude resources not managed by IaC.

## Example

```
$ threatcode iac describe --json --all | threatcode iac update-exclude-policy
```
