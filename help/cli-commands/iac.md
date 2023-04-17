# IaC

## Usage

`threatcode iac <COMMAND> [<OPTIONS>] [<PATH>]`

## Description

The `threatcode iac` commands find and report security issues in Infrastructure as Code files; detect, track, and alert on infrastructure drift and unmanaged resources; and create a .driftigore file.

For more information see [Threatcode CLI for Infrastructure as Code](https://docs.threatcode.github.io/scan-cloud-deployment/threatcode-infrastructure-as-code/threatcode-cli-for-infrastructure-as-code)

## `threatcode iac` commands and the help docs

All the `threatcode iac` commands are listed here with the help options:

- [iac test](iac-test.md); `iac test --help`: tests for any known security issue
- [iac capture](iac-capture.md); `iac capture --help`: generates mapping artifacts by accessing Terraform state configurations&#x20;
- [iac describe](iac-describe.md); `iac describe --help`: detects infrastructure drift and unmanaged cloud resources\
  Example: `threatcode iac describe --only-unmanaged`
- [iac update-exclude-policy](iac-update-exclude-policy.md); `iac update-exclude-policy --help`: auto-generates `.threatcode` exclusions for cloud resources\
  Example: `threatcode iac describe --json --all | threatcode iac update-exclude-policy`
