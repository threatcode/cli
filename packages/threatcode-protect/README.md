# @threatcode/protect

[![npm](https://img.shields.io/npm/v/@threatcode/protect)](https://www.npmjs.com/package/@threatcode/protect)
[![Known Vulnerabilities](https://threatcode.github.io/test/github/threatcode/threatcode/badge.svg)](https://threatcode.github.io/test/github/threatcode/threatcode)

![Threatcode](https://threatcode.github.io/style/asset/logo/threatcode-print.svg)

Patch vulnerable code in your project's dependencies. This package is officially maintained by [Threatcode](https://threatcode.github.io).

## Usage

You don't typically need to add the @threatcode/protect dependency manually. It'll be introduced when it's needed as part of [Threatcode's Fix PR service](https://support.threatcode.github.io/hc/en-us/articles/360011484018-Fixing-vulnerabilities).

To enable patches in your Fix PRs:

- Visit https://app.threatcode.github.io
- Go to "Org Settings" > "Integrations"
- Choose "Edit Settings" under your SCM integration.
- Under the "Fix Pull Request" section, ensure patches are enabled.

Threatcode will now include patches as part of its Fix PRs for your project.

## How it works

If there's a patch available for a vulnerability in your project, the Fix PR:

- Adds a `patch` entry to your `.threatcode` file.
- Adds `@threatcode/protect` to your `package.json`'s dependencies.
- Adds `@threatcode/protect` to your `package.json`'s [`prepare` script](https://docs.npmjs.com/cli/v7/using-npm/scripts).

```patch
 {
   "name": "my-project",
   "scripts": {
+    "prepare": "npm run threatcode-protect",
+    "threatcode-protect": "threatcode-protect"
   },
   "dependencies": {
+    "@threatcode/protect": "^1.657.0"
   }
 }
```

Now after you run npm install, @threatcode/protect will automatically download each patch configured in your .threatcode file and apply them to your installed dependencies.

## Migrating from `threatcode protect` to `@threatcode/protect`

`@threatcode/protect` is a standalone replacement for `threatcode protect`. They both do the same job, however:

- `@threatcode/protect` has zero dependencies.
- You don't need to include `threatcode` in your dependencies (which is a much larger package with many dependencies).

If you already have Threatcode Protect set up, you can migrate to `@threatcode/protect` by applying the following changes to your `package.json`:

```patch
 {
   "name": "my-project",
   "scripts": {
     "prepare": "npm run threatcode-protect",
-    "threatcode-protect": "threatcode protect"
+    "threatcode-protect": "threatcode-protect"
   },
   "dependencies": {
-    "threatcode": "^1.500.0"
+    "@threatcode/protect": "^1.657.0"
   }
 }
```

We have also created the [@threatcode/cli-protect-upgrade](https://www.npmjs.com/package/@threatcode/cli-protect-upgrade) npx script which you can use to update your project automatically. To use it, `cd` to the location containing the package.json to be updated and run:

```
npx @threatcode/cli-protect-upgrade
```

---

Made with 💜 by Threatcode
