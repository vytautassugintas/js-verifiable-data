import { TxExecutor } from 'lib/proto';
import { IRawTX } from 'lib/models/IRawTX';
import { Transaction } from 'web3-core';
import Web3 from 'web3';

export async function submitTransaction(web3: Web3, txData: IRawTX) {
  return new Promise<Transaction>(async (success, reject) => {
    try {
      await web3.eth.sendTransaction({
        from: txData.from,
        to: txData.to,
        nonce: Number(txData.nonce),
        gasPrice: txData.gasPrice,
        gas: txData.gasLimit,
        value: txData.value,
        data: txData.data,
      })
        .on('transactionHash', async (hash) => {
          const transaction = await web3.eth.getTransaction(hash);
          success(transaction);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const createTxExecutor = (web3: Web3): TxExecutor => {
  return async (txData: IRawTX) => {
    const tx = await submitTransaction(web3, txData);
    return web3.eth.getTransactionReceipt(tx.hash);
  };
};
