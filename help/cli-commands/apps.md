# threatcode apps -- Create and manage your Threatcode Apps

# Usage

`threatcode apps <COMMAND> [<OPTIONS>]`

## Description

Threatcode Apps are integrations that extend the functionality of the Threatcode platform. They provide you with an opportunity to mould your Threatcode experience to suit your specific needs.

[For more information see our user docs](https://docs.threatcode.io/features/integrations/threatcode-apps)

## Commands

**_Note: All `apps` commands are only accessible behind the `--experimental` flag and the behaviour can change at any time, without prior notice. You are kindly advised to use all the commands with caution_**

### `create`

Create a new Threatcode App.

## Options

### `--interactive`

Use the command in interactive mode.

### `--org=<ORG_ID>`

(Required for the `create` command)
Specify the `<ORG_ID>` to create the Threatcode App under.

### `--name=<THREATCODE_APP_NAME>`

(Required for the `create` command)
The name of Threatcode App that will be displayed to the user during the authentication flow.

### `--redirect-uris=<REDIRECT_URIS>`

(Required for the `create` command)
A comma separated list of redirect URIs. This will form a list of allowed redirect URIs to call back after authentication.

### `--scopes=<SCOPES>`

(Required for the `create` command)
A comma separated list of scopes required by your Threatcode App. This will form a list of scopes that your app is allowed to request during authorization. You can read more about the allowed scopes in our [docs](https://docs.threatcode.io/threatcode-apps/getting-started-with-threatcode-apps/create-an-app-via-the-api#requesting-scopes).

## Examples

### `Create Threatcode App`

\$ threatcode apps create --experimental --org=48ebb069-472f-40f4-b5bf-d2d103bc02d4 --name='My Awesome App' --redirect-uris=https://example1.com,https://example2.com --scopes=org.read,org.report.read

### `Create Threatcode App Interactive Mode`

\$ threatcode apps create --experimental --interactive
