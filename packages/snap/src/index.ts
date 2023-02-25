import { OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

// Handle outgoing transactions
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  console.log('Transaction insights transaction', transaction);

  const currentGasPrice = await ethereum.request<string>({
    method: 'eth_gasPrice',
  });

  return {
    content: panel([
      heading('Percent Snap'),
      text(`Current gas price: ${parseInt(currentGasPrice ?? '', 16)} wei`),
    ]),
  };
};
