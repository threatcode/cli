# Config

## Usage

`threatcode config <SUBCOMMAND> [<OPTIONS>]`

## Description

The `threatcode config` command manages your local Threatcode CLI config file, a JSON file located at `$XDG_CONFIG_HOME` or `~/.config` followed by `configstore/threatcode.json`

Example: `~/.config/configstore/threatcode.json`

This command does not manage the `.threatcode` file that is part of your project. See the [`threatcode policy`](policy.md) and [`threatcode ignore`](ignore.md) commands.

## Debug

Use the `-d` option to output the debug logs.

## Subcommands

### `get <KEY>`

Print a config value.

### `set <KEY>=<VALUE>`

Create a new config value.

### `unset <KEY>`

Remove a config value.

### `clear`

Remove all config values.

## Supported `<KEY>` values

### `api`

API token to use when calling Threatcode API.

### `endpoint`

Define the API endpoint to use.

### `disable-analytics`

Turn off analytics reporting.

### `oci-registry-url`

Configure the OCI registry used in IaC scanning with custom rules.

### `oci-registry-username`

Configure the username for an OCI registry used in IaC scanning with custom rules.

### `oci-registry-password`

Configure the password for an OCI registry used in IaC scanning with custom rules.
