# ETHDenver 2023 Workshop: Providing Transaction Insights with MetaMask 🦊 Snaps

Welcome to this ETHDenver 2023 workshop on [MetaMask 🦊 Snaps](https://metamask.io/snaps/)! In this workshop, we're going to extend the functionality of the MetaMask wallet by providing users with useful transaction insights. More specifically, for simple ETH transfers, we'll be showing users what percentage of the value of their ETH transfer they'd be paying in gas fees.

Doing so will require multiple steps. If you want to follow the workshop step-by-step, you'll find each incremental step in branches of the form `step-XX` in this repository:

1. [Step 1](/tree/step-01): Initialization,  cleanup, and setup

## Step 1: Initialization, cleanup, and setup

In this first step, we'll be initializing a new Snaps project using the [Snaps CLI](https://github.com/MetaMask/snaps-monorepo/tree/main/packages/snaps-cli). We'll then cleanup the project by removing some unneeded files. Finally, we'll make the project our own by giving it a name other than "Example Snap".

### Creating a new snap project

Creating a new snap project is done using the Snaps CLI. First, install the CLI globally:

```sh
yarn global add @metamask/snaps-cli
# or
npm i -g @metamask/snaps-cli
```

This will add an `mm-snap` command in your path. Secondly, you'll use this command to create a new snap project:

```sh
mm-snap init ethdenver-snaps-workshop
```

### Cleaning up the initial project

The initial project includes some MetaMask organization-specific files. These can be cleaned up by running the cleanup script from the root of the project:

```sh
./scripts/cleanup.sh
```

Running this script will delete unneeded files, delete the script itself, and commit the changes automatically.

### Customizing the snap

The initial project has generic names in multiple places. Here we will edit some files to customize the project:

* Edit `/package.json`:

    * Modify the `name` field to be unique to your project
    * Optionally add a `description`
    * Customize or remove `homepage`, `repository`, `author`, and `license`

* Edit `/packages/snap/package.json` and `/packages/snap/snap.manifest.json`:

    The Snaps manifest file -- `/packages/snap/snap.manifest.json` is specified in the [Snaps Publishing Specification](https://github.com/MetaMask/SIPs/blob/main/SIPS/sip-9.md). Refer to the specification, and edit the `proposedName`, `description`, and `repository` fields, matching them in `/packages/snap/package.json` as described in the spec. In a further step, we'll be editing `initialPermissions`. When publishing the snap to NPM, you'll also need to edit the `location.packageName` field to match that of `/packages/snap/package.json`

* Edit `/packages/site/package.json`:

    This is the same pattern as before. The `site` workspace is where the static React site lives. Normally it won't be published to NPM so the `name` field matters less, but feel free to make any changes necessary in there.

* Optionally edit or remove any configurations related to ESLint, Prettier, Editorconfig, etc. to match your preferences or those of your organization.

### Optional additional setup for Visual Studio Code

If coding your snap with Visual Studio Code, you can create or update the file `/.vscode/settings.json` with the following settings. This will make VSCode automatically fix linting errors when saving a file:

```json
{
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.codeActionsOnSave.mode": "all",
  "editor.tabSize": 2
}
```
