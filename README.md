# ETHDenver 2023 Workshop: Providing Transaction Insights with MetaMask 🦊 Snaps 🔥

Welcome to this ETHDenver 2023 workshop on [MetaMask 🦊 Snaps](https://metamask.io/snaps/)! In this workshop, we're going to extend the functionality of the MetaMask wallet by providing users with useful transaction insights. More specifically, for simple ETH transfers, we'll be showing users what percentage of the value of their ETH transfer they'd be paying in gas fees.

Doing so will require multiple steps. If you want to follow the workshop step-by-step, you'll find each incremental step in branches of the form `step-XX` in this repository:

1. [Step 1](/tree/step-01): [Initialization,  cleanup, and setup](#step-1-initialization-cleanup-and-setup)
2. [Step 2](/tree/step-02): [Setting up the snap for Transaction Insights](#step-2-setting-up-the-snap-for-transaction-insights)
3. [Step 3](/tree/step-03): [Enabling the Ethereum Provider in the snap](#step-3-enabling-the-ethereum-provider-in-the-snap)
4. [Step 4](/tree/step-04): [Fetching the gas price](#step-4-fetching-the-gas-price)
5. [Step 5](/tree/step-05): [Showing the gas price in the transaction insights UI](#step-5-showing-the-gas-price-in-the-transaction-insights-ui)
6. [Step 6](/tree/step-06): [Calculating and displaying the total gas that would be paid](#step-6-calculating-and-displaying-the-total-gas-that-would-be-paid)
7. [Step 7](/tree/step-07): [Calculating and displaying the percentage of gas fees](#step-7-calculating-and-displaying-the-percentage-of-gas-fees)
8. [Step 8](/tree/step-08): [Displaying a different UI for contract interactions](#step-8-displaying-a-different-ui-for-contract-interactions)

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

Since you've made some changes to your snap, you'll have to reinstall it. Go back to the Dapp and press the "Reconnect" button. In the "Install snap" window, you'll see a new permission request to "Access the Ethereum provider". Press "Approve & install".

## Step 4: Fetching the gas price

To fetch the gas price, we can simply use the `ethereum` global. Add this code between the `console.log` and the `return` in the `onTransaction` export of your snap:

```typescript
const currentGasPrice = await ethereum.request({
  method: 'eth_gasPrice',
});

console.log('Current gas price', currentGasPrice);
```

Reinstall the snap, go back to the MetaMask transaction window, and switch to the "ETHDENVER 2023 PERCENT SNAP" tab. This will activate the `onTransaction` callback. In the developer tools window you should see a `console.log` like `Current gas price 0x66b04938`. The gas price is returned as a hex string in wei.

## Step 5: Showing the gas price in the transaction insights UI

In this step, we'll remove the `console.log` for the `currentGasPrice`. Instead, we'll display the current gas price in wei in the transaction insights UI.

1. Remove the `console.log` for the `currentGasPrice

2. Replace the `return` statement in the `onTransaction` with the following:

    ```typescript
    return {
      content: panel([
        heading('Percent Snap'),
        text(`Current gas price: ${parseInt(currentGasPrice ?? '', 16)} wei`),
      ]),
    };
    ```

## Step 6: Calculating and displaying the total gas that would be paid

When implementing transaction insights, we get access to the following fields in the `transaction` object:

```json
{
  "from": "sender address",
  "gas": "0x5208",
  "maxFeePerGas": "0x1014e7ff3c",
  "maxPriorityFeePerGas": "0x59682f00",
  "to": "receiver address",
  "type": "0x2",
  "value": "0x16345785d8a0000"
}
```

We can roughly calculate the gas fees that the user would pay like this:

```typescript
const transactionGas = parseInt(transaction.gas as string, 16);
const currentGasPriceInWei = parseInt(currentGasPrice ?? '', 16);
const maxFeePerGasInWei = parseInt(transaction.maxFeePerGas as string, 16);
const maxPriorityFeePerGasInWei = parseInt(
  transaction.maxPriorityFeePerGas as string,
  16,
);

const gasFees = Math.min(
  maxFeePerGasInWei * transactionGas,
  (currentGasPriceInWei + maxPriorityFeePerGasInWei) * transactionGas,
);
```

Let's update the Custom UI output to show that:

```typescript
return {
  content: panel([
    heading('Percent Snap'),
    text(
      `As setup, this transaction would cost **${
        gasFees / 1_000_000_000
      }** gwei in gas.`,
    ),
  ]),
};
```

Reinstall your snap, then reload the "PERCENT SNAP" transaction insights tab. You should now see a message like:

> As setup, this transaction would cost **238377.74415** gwei in gas.

## Step 7: Calculating and displaying the percentage of gas fees

Calculating the percentage of gas fees paid should now be easy:

```typescript
const transactionValueInWei = parseInt(transaction.value as string, 16);
const gasFeesPercentage = (gasFees / (gasFees + transactionValueInWei)) * 100;

return {
  content: panel([
    heading('Percent Snap'),
    text(
      `As setup, you are paying **${gasFeesPercentage.toFixed(
        2,
      )}%** in gas fees for this transaction.`,
    ),
  ]),
};
```

Reinstall your snap, reactivate the "PERCENT SNAP" tab, and you should see a message like this:

> As setup, you are paying **0.17%** in gas fees for this transaction.

Well done! One more step to go 🔥

## Step 8: Displaying a different UI for contract interactions

Our transaction insights snap should only display a percentage if the user is doing a regular ETH transfer. For contract interactions, we should display a UI that conveys that message. Let's add this code to the beginning of our `onTransaction` export:

```typescript
if (typeof transaction.data === 'string' && transaction.data !== '0x') {
  return {
    content: panel([
      heading('Percent Snap'),
      text(
        'This snap only provides transaction insights for simple ETH transfers.',
      ),
    ]),
  };
}
```

This completes the creation of our snap. Good work 🦊♥️

## What about accounts and key management?

In this workshop I chose to focus on the Transaction Insights feature of MetaMask Snaps. If you'd like to see a similar workshop on accounts and key management, make sure to reach out to me to let me know. Meanwhile, check out our [documentation on MetaMask Snaps Accounts & Key Management](https://docs.metamask.io/guide/snaps-concepts.html#accounts-and-key-management).

## Where to go from here?

The Snaps platform is extremely powerful. In addition to letting you provide transaction insights, Snaps also allow you to:

- [Derive private keys for different coin types](https://docs.metamask.io/guide/snaps-concepts.html#accounts-and-key-management)
- [Derive snap-specific entropy](https://docs.metamask.io/guide/snaps-rpc-api.html#snap-getentropy)
- [Run cronjobs](https://docs.metamask.io/guide/snaps-exports.html#oncronjob)
- [Display notifications](https://docs.metamask.io/guide/snaps-rpc-api.html#snap-notify)
- [Store encrypted data in the snaps' sandbox](https://docs.metamask.io/guide/snaps-rpc-api.html#snap-managestate)

We're excited to see what you'll be building with Snaps 🚀👨🏻‍🚀🌕🧀🔥 You can reach out to us on the following resources:

- [Discord in the `#snaps-dev` channel](https://discord.com/channels/697535391594446898/697538943498977400)
- [GitHub Discussions for `@metamask/snaps-monorepo`](https://github.com/MetaMask/snaps-monorepo/discussions)
- [Twitter @MetaMaskDev](https://twitter.com/MetaMaskDev)

## Reach out to me

- [Ziad Saab's Twitter](https://twitter.com/ZiadMTL)
- [Ziad Saab's Telegram](https://t.me/ziadmtl)

## Thank you

Thank you for taking the time to go through this workshop, and learing more about [MetaMask Snaps](https://metamask.io/snaps/) 🧡