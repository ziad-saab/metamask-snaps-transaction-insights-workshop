import { OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

// Handle outgoing transactions
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  console.log('Transaction insights transaction', transaction);

  const currentGasPrice = await ethereum.request({
    method: 'eth_gasPrice',
  });

  console.log('Current gas price', currentGasPrice);

  return {
    content: panel([
      heading('Percent Snap'),
      text(
        'This snap will show you what percentage of your ETH transfers are paid in gas fees.',
      ),
    ]),
  };
};
