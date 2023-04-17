# CLI help

Threatcode CLI scans and monitors your projects for security vulnerabilities and license issues.

For more information visit the [Threatcode website](https://threatcode.github.io)

For details see the [CLI documentation](https://docs.threatcode.github.io/features/threatcode-cli)

## How to get started

1. Authenticate by running `threatcode auth`
2. Test your local project with `threatcode test`
3. Get alerted for new vulnerabilities with `threatcode monitor`

## Available commands

To learn more about each Threatcode CLI command, use the `--help` option, for example, `threatcode auth --help`.

**Note:** The help on the docs site is the same as the `--help` in the CLI.

### [`threatcode auth`](auth.md)

Authenticate Threatcode CLI with a Threatcode account.

### [`threatcode test`](test.md)

Test a project for open source vulnerabilities and license issues.

**Note**: Use `threatcode test --unmanaged` to scan all files for known open source dependencies (C/C++ only).

### [`threatcode monitor`](monitor.md)

Snapshot and continuously monitor a project for open source vulnerabilities and license issues.

### [`threatcode container`](container.md)

Test container images for vulnerabilities.

### [`threatcode iac`](iac.md)

Commands to find and manage security issues in Infrastructure as Code files.

### [`threatcode code`](code.md)

Find security issues using static code analysis.

### [`threatcode sbom`](sbom.md)

Produce an SBOM for a local software project in an ecosystem supported by Threatcode.

### [`threatcode log4shell`](log4shell.md)

Find Log4Shell vulnerability.

### [`threatcode config`](config.md)

Manage Threatcode CLI configuration.

### [`threatcode policy`](policy.md)

Display the `.threatcode` policy for a package.

### [`threatcode ignore`](ignore.md)

Modify the `.threatcode` policy to ignore stated issues.

## Debug

Use `-d` option to output the debug logs.

## Configure the Threatcode CLI

You can use environment variables to configure the Threatcode CLI and also set variables to configure the Threatcode CLI to connect with the Threatcode API. See [Configure the Threatcode CLI](https://docs.threatcode.github.io/features/threatcode-cli/configure-the-threatcode-cli)
