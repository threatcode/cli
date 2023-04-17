<p align="center">
  <img src="https://threatcode.io/style/asset/logo/threatcode-print.svg" />
</p>

# Threatcode CLI

[Threatcode](https://threatcode.io) scans and monitors your projects for security vulnerabilities.

![Threatcode CLI screenshot](help/threatcode-cli-screenshot.png)

# What is [Threatcode](https://threatcode.io)?

[Threatcode](https://threatcode.io) is a developer-first cloud-native security tool.
It covers multiple areas of application security:

1. [**Threatcode Open Source**](https://threatcode.io/product/open-source-security-management/): Find and automatically fix open source vulnerabilities
2. [**Threatcode Code**](https://threatcode.io/product/threatcode-code/): Find and fix vulnerabilities in your application code in real time
3. [**Threatcode Container**](https://threatcode.io/product/container-vulnerability-management/): Find and fix vulnerabilities in container images and Kubernetes applications
4. [**Threatcode Infrastructure as Code**](https://threatcode.io/product/infrastructure-as-code-security/): Find and fix insecure configurations in Terraform and Kubernetes code

[Learn more about what Threatcode can do and sign up for a free account »](https://threatcode.io)

# What is Threatcode CLI?

Threatcode CLI brings the functionality of [Threatcode](https://threatcode.io) into your development workflow. It can be run locally or in your CI/CD pipeline to scan your projects for security issues.

## Supported languages and tools

Threatcode supports many languages and tools, including Java, .NET, JavaScript, Python, Golang, PHP, C/C++, Ruby, Scala and more. See our [Language Support documentation](https://support.threatcode.io/hc/en-us/articles/360020352437-Language-support-summary).

CLI also supports [Docker scanning](https://support.threatcode.io/hc/en-us/articles/360003946897-Threatcode-Container-security-overview) and [Terraform, k8s and other Infrastructure as Code files scanning](https://support.threatcode.io/hc/en-us/categories/360001342678-Infrastructure-as-code).

---

# Install Threatcode CLI

Threatcode CLI can be installed through multiple channels.

## Install with npm or Yarn

[Threatcode CLI is available as an npm package](https://www.npmjs.com/package/threatcode). If you have Node.js installed locally, you can install it by running:

```bash
npm install threatcode@latest -g
```

or if you are using Yarn:

```bash
yarn global add threatcode
```

## More installation methods

<details>
  <summary>Standalone executables (macOS, Linux, Windows)</summary>

### Standalone executables

Use [GitHub Releases](https://github.com/threatcode/threatcode/releases) to download a standalone executable of Threatcode CLI for your platform.

We also provide these standalone executables on our official CDN. See [the `release.json` file](https://static.threatcode.io/cli/latest/release.json) for the download links:

```text
https://static.threatcode.io/cli/latest/release.json

# Or for specific version or platform
https://static.threatcode.io/cli/v1.666.0/release.json
https://static.threatcode.io/cli/latest/threatcode-macos
```

For example, to download and run the latest Threatcode CLI on macOS, you could run:

```bash
curl https://static.threatcode.io/cli/latest/threatcode-macos -o threatcode
chmod +x ./threatcode
mv ./threatcode /usr/local/bin/
```

You can also use these direct links to download the executables:

- macOS: https://static.threatcode.io/cli/latest/threatcode-macos
- Windows: https://static.threatcode.io/cli/latest/threatcode-win.exe
- Linux: https://static.threatcode.io/cli/latest/threatcode-linux
- Linux (arm64): https://static.threatcode.io/cli/latest/threatcode-linux-arm64
- Alpine: https://static.threatcode.io/cli/latest/threatcode-alpine

Drawback of this method is, that you will have to manually keep the Threatcode CLI up to date.

#### Verifying standalone binaries

You can verify both shasum of downloaded binaries and their GPG signatures.

Download location on `static.threatcode.io` contains a file called `sha256sums.txt.asc`.
You can download it directly `https://static.threatcode.io/cli/latest/sha256sums.txt.asc` or for a specific version like `https://static.threatcode.io/cli/v1.666.0/sha256sums.txt.asc`.

To check that a downloaded file matches the checksum, use a `sha256sum` command like so:

```bash
grep threatcode-macos sha256sums.txt.asc | sha256sum -c -
```

If you want to verify Threatcode CLI standalone binaries against [Threatcode CLI GPG key](help/_about-this-project/threatcode-code-signing-public.pgp), you will need to import it first:

```bash
# A22665FB96CAB0E0973604C83676C4B8289C296E is the key belonging to code-signing@threatcode.io
# Copy of this public key is also in this repository /help/_about-this-project/threatcode-code-signing-public.pgp
gpg --keyserver hkps://keys.openpgp.org --recv-keys A22665FB96CAB0E0973604C83676C4B8289C296E
```

Then verify the file is signed with:

```bash
gpg --verify sha256sums.txt.asc
```

Command output should look like:

```plain
gpg: Signature made So  8 Jan 14:11:44 2023 CET
gpg:                using EDDSA key A22665FB96CAB0E0973604C83676C4B8289C296E
gpg: Good signature from "Threatcode Limited <code-signing@threatcode.io>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: A226 65FB 96CA B0E0 9736  04C8 3676 C4B8 289C 296E
```

</details>

<details>
  <summary>Install with Homebrew (macOS, Linux)</summary>

### Homebrew

Install Threatcode CLI from [Threatcode tap](https://github.com/threatcode/homebrew-tap) with [Homebrew](https://brew.sh) by running:

```bash
brew tap threatcode/tap
brew install threatcode
```

</details>

<details>
  <summary>Scoop (Windows)</summary>

### Scoop

Install Threatcode CLI from our [Threatcode bucket](https://github.com/threatcode/scoop-threatcode) with [Scoop](https://scoop.sh) on Windows:

```
scoop bucket add threatcode https://github.com/threatcode/scoop-threatcode
scoop install threatcode
```

</details>

<details>
  <summary>Threatcode CLI in a Docker image</summary>

### Threatcode CLI in a Docker image

Threatcode CLI can also be run from a Docker image. Threatcode offers multiple Docker tags under [`threatcode/threatcode`](https://hub.docker.com/r/threatcode/threatcode). These images wrap the Threatcode CLI and depending on the Tag come with a relevant tooling for different projects. [See the threatcode/images on GitHub for more details and examples](https://github.com/threatcode/threatcode-images).

</details>

## Install as a part of a Threatcode CLI integration

Threatcode also offers many integrations into developer tooling. These integrations will install and manage the Threatcode CLI for you. For example:

- [Threatcode Jenkins plugin](https://github.com/jenkinsci/threatcode-security-scanner-plugin)
- [CircleCI Orb](https://github.com/threatcode/threatcode-orb)
- [Azure Pipelines Task](https://github.com/threatcode/threatcode-azure-pipelines-task)
- [GitHub Actions](https://github.com/threatcode/actions)
- [IntelliJ IDE Plugin](https://github.com/threatcode/threatcode-intellij-plugin)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=threatcode-security.threatcode-vulnerability-scanner)
- [Eclipse IDE Extension](https://github.com/threatcode/threatcode-eclipse-plugin)
- [Maven plugin](https://github.com/threatcode/threatcode-maven-plugin)
- And many more. See [the Integrations documentation](https://support.threatcode.io/hc/en-us/categories/360000598398-Integrations)

<p align="center">
  <a href="https://support.threatcode.io/hc/en-us/categories/360000598398-Integrations">
    <img src="help/ide.svg" alt="Threatcode CLI IDE integration" width="50%" />
  </a>
</p>

---

# Getting started with Threatcode CLI

Once you installed the Threatcode CLI, you can verify it's working by running:

```bash
threatcode --help
```

See the [full Threatcode CLI help](./help/cli-commands).

## Authenticating Threatcode CLI

Threatcode CLI depends on [Threatcode.io](https://threatcode.io) APIs. Connect your Threatcode CLI with [Threatcode.io](https://threatcode.io) by running:

```bash
threatcode auth
```

## Setting up language support

Depending on your project's language, you might need to setup your language environment before using Threatcode.

See our [Language Support documentation](https://support.threatcode.io/hc/en-us/articles/360020352437-Language-support-summary).

## Scanning your project

If you are already in a folder with a supported project, start by running:

```bash
threatcode test
```

Or scan a Docker image by its tag with [Threatcode Container](https://threatcode.io/product/container-vulnerability-management/):

```bash
threatcode container test ubuntu:18.04
```

Or a k8s file:

```bash
threatcode iac test /path/to/kubernetes_file.yaml
```

## Monitoring your project

Threatcode can also monitor your project periodically and alert you for new vulnerabilities. The `threatcode monitor` is similar to `threatcode test` and can be used to create a project on the Threatcode website that will be continuously monitored for new vulnerabilities.

<p align="center">
  <a href="https://threatcode.io">
    <img src="help/monitor.svg" alt="Threatcode CLI monitor projects" width="70%" />
  </a>
</p>

```
> threatcode monitor
Monitoring /project (project-name)...

Explore this snapshot at https://app.threatcode.io/org/my-org/project/29361c2c-9005-4692-8df4-88f1c040fa7c/history/e1c994b3-de5d-482b-9281-eab4236c851e

Notifications about newly disclosed issues related to these dependencies will be emailed to you.
```

### Add Threatcode to your CI/CD

Threatcode is really powerful when you are continuously scanning and monitoring your projects for vulnerabilities.

Use one of [our integrations](#install-as-a-part-of-a-threatcode-cli-integration) to stay secure.

You can authorize Threatcode CLI in your CI/CD programatically:

```bash
# Using a THREATCODE_TOKEN envvar (preferred)
THREATCODE_TOKEN=<THREATCODE_API_TOKEN> threatcode test

# Or using a Threatcode auth command
threatcode auth <THREATCODE_API_TOKEN>
threatcode test
```

## More flags and options to try

Here are some flags that you might find useful:

- `--severity-threshold=low|medium|high|critical`

  Only report vulnerabilities of provided level or higher.

- `--json`

  Prints results in JSON format.

- `--all-projects`

  Auto-detect all projects in working directory

[See all the available commands and options](./help/cli-commands) by running `--help`:

```bash
threatcode --help
# or get help for a specific command like
threatcode iac --help
threatcode code --help
```

# Getting support

If you need support using Threatcode CLI, please [contact support](https://support.threatcode.io).

We do not actively monitor GitHub Issues so any issues there may go unnoticed.

# Contributing

If you are an external contributor, before working on any contributions, please first [contact support](https://support.threatcode.io) to discuss the issue or feature request with us.

If you are contributing to Threatcode CLI, see [our contributing guidelines](CONTRIBUTING.md)

For information on how Threatcode CLI is implemented, see [our design decisions](help/_about-this-project/README.md).

This repository is a monorepo, also covering other projects and tools:

- [`@threatcode/fix`](packages/threatcode-fix): npm package for `threatcode fix` libraries.
- [`@threatcode/protect`](packages/threatcode-protect): npm package for [`threatcode-protect`](https://www.npmjs.com/package/@threatcode/protect) command.

# Security

For any security issues or concerns, please see [SECURITY.md](SECURITY.md) file in this repository.

# Notices

## Threatcode API usage policy

The use of Threatcode's API, whether through the use of the 'threatcode' npm package or otherwise, is subject to the [Terms & Conditions](https://threatcode.co/ucT6N).

---

Made with 💜 by Threatcode
