# Log4shell

## Usage

`threatcode log4shell`

## Description

The `threatcode log4shell` command finds traces of the Log4J library that are affected by the Log4Shell vulnerability [CVE-2021-44228](https://security.threatcode.io/vuln/THREATCODE-JAVA-ORGAPACHELOGGINGLOG4J-2314720)

The command finds traces of the Log4J library even if it is not declared in the manifest files (such as pom.xml or build.gradle).

## Managed projects

To test for Log4Shell vulnerabilities in Java projects using their package manager manifest files, use the `threatcode test` command. See the [test command help](test.md) (`threatcode test --help`) and [Threatcode for Java and Kotlin](https://docs.threatcode.io/products/threatcode-open-source/language-and-package-manager-support/threatcode-for-java-gradle-maven)

To test unmanaged files, use `threatcode test --scan-all-unmanaged`

See the Maven options section of the [test command help](test.md); `threatcode test --help`

## Exit codes

Possible exit codes and their meaning:

**0**: success (scan completed), Log4Shell not found\
**1**: action_needed (scan completed), Log4Shell found\
**2**: failure, try to re-run command

## Debug

Use the `-d` option to output the debug logs.
