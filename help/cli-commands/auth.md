# Auth

## Usage

`threatcode auth [<API_TOKEN>] [<OPTIONS>]`

## Description

The `threatcode auth` command authenticates your machine to associate the Threatcode CLI with your Threatcode account.

Running `$ threatcode auth` opens a browser window with prompts to log in to your Threatcode account and authenticate. No repository permissions are needed at this stage, only your email address.

When you have authenticated you can start using the CLI; see [Getting started with the CLI](https://docs.threatcode.github.io/threatcode-cli/getting-started-with-the-cli)

## Value

In some environments and configurations you must use the `<API_TOKEN>`; see [Authenticate the CLI with your account](https://docs.threatcode.github.io/features/threatcode-cli/authenticate-the-cli-with-your-account)

The value may be a user token or a service account; see [Service accounts](https://docs.threatcode.github.io/features/integrations/managing-integrations/service-accounts)

In a CI/CD environment use the `THREATCODE_TOKEN` environment variable; see [Configure the Threatcode CLI](https://docs.threatcode.github.io/features/threatcode-cli/configure-the-threatcode-cli)

After setting this environment variable you can use CLI commands.

## Debug

Use the `-d` option to output the debug logs.
