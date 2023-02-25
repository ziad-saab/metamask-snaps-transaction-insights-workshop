# ETHDenver 2023 Workshop: Providing Transaction Insights with MetaMask 🦊 Snaps

Welcome to this ETHDenver 2023 workshop on [MetaMask 🦊 Snaps](https://metamask.io/snaps/)! In this workshop, we're going to extend the functionality of the MetaMask wallet by providing users with useful transaction insights. More specifically, for simple ETH transfers, we'll be showing users what percentage of the value of their ETH transfer they'd be paying in gas fees.

Doing so will require multiple steps. If you want to follow the workshop step-by-step, you'll find each incremental step in branches of the form `step-XX` in this repository:

1. [Step 1](/tree/step-01): Initialization,  cleanup, and setup
2. [Step 2](/tree/step-02): Setting up the snap for Transaction Insights
3. [Step 3](/tree/step-03): Enabling the Ethereum Provider in the snap

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

---

## Step 2: Setting up the snap for Transaction Insights

The template snap provided to you is setup to expose a JSON-RPC API with a simple `hello` command, which brings up a dialog box. In contrast, the snap we're creating for this workshop doesn't expose any API. Instead it provides transaction insights directly in the MetaMask transaction window. In this step, we'll be removing code and permissions related to the JSON-RPC API, adding basic transaction insights code, and testing the resulting snap. In the process, we'll also learn how to debug a snap.

### Removing JSON-RPC-related code and configuration

1. Remove all the code in `/packages/snap/src/index.ts`
2. In `/packages/snap/snap.manifest.json` remove the entries `snap_dialog` and `endowment:rpc` under `initialPermissions`

### Adding Transaction Insights code and configuration

1. In `/packages/snap/src/index.ts` add the following code:

    ```typescript
    import { OnTransactionHandler } from '@metamask/snaps-types';
    import { heading, panel, text } from '@metamask/snaps-ui';

    // Handle outgoing transactions
    export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
      console.log('Transaction insights transaction', transaction);

      return {
        content: panel([
          heading('Percent Snap'),
          text(
            'This snap will show you what percentage of your ETH transfers are paid in gas fees.',
          ),
        ]),
      };
    };
    ```

2. In `/packages/snap/snap.manifest.json`, make `initialPermissions` the following object:

    ```json
    {
        "endowment:transaction-insight": {}
    }
    ```

### Installing and testing the snap

1. From the root of the project, run `yarn start` or `npm start`. This will start two development servers: one for watching and compiling the snap, and another one for the React site. The snap bundle will be served from `localhost:8080`, and the site will be served from `localhost:8000`.

2. Open `http://localhost:8000` in your browser

3. Press the "Connect" button, and accept the permission request.

4. On the next screen, notice that the "Install Snap" dialog is telling you that the snap wants the permission to "Fetch and display transaction insights". Press "Approve & install".

5. From MetaMask, create a new ETH transfer

6. On the confirmation window, you'll see a new tab named "ETHDENVER 2023 PERCENT SNAP". Switch to that tab. Note that it's the switching to the tab that activates the `onTransaction` export of your snap to be called.

7. Notice the Custom UI output from the snap.

8. If you look in your browser's dev tools for the `console.log` that we setup, you'll notice that it's not there. That's because `console.log`s from your snap are happening inside the extension. In the next section, we'll see how to debug a snap.

### Debugging your snap

1. Go to `chrome://extensions/`

2. On the top right-hand corner, make sure that "Developer mode" is on

3. Find MetaMask Flask, and click on "Details"

4. Under "Inspect views", click on `background.html`

5. Go back to the MetaMask transaction window, and switch back to the "ETHDENVER 2023 PERCENT SNAP". You should now see the result of your `console.log` in the new developer tools window linked to `background.html`

## Step 3: Enabling the Ethereum Provider in the snap

To show the end user the percentage of their transfer that they're paying in gas fees, we have to know the current gas price. We can easily get this by calling the `eth_gasPrice` method using the global Ethereum provider made available to snaps.

To use the global Ethereum provider, we have to request permission for it. Open the file at `/packages/snap/snap.manifest.json`, and change the `initialPermissions` to:

```json
{
  "endowment:transaction-insight": {},
  "endowment:ethereum-provider": {}
}
```
