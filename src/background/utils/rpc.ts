import axios from 'axios';
import { CHAINS } from '@debank/common';
import rpcService, { getUniqueId } from 'background/service/rpc';
import { openapiService } from '../service';
import { GetTxResponse } from '../service/openapi';

interface RequestParams {
  method: string;
  params: any[];
  chainServerId: string;
}

export const requestRPC = async ({
  method,
  params,
  chainServerId,
}: RequestParams) => {
  const chain = Object.values(CHAINS).find(
    (item) => item.serverId === chainServerId
  );

  if (!chain || !chain.rpc) {
    throw new Error(`No RPC found for ${chainServerId}`);
  }
  if (rpcService.hasCustomRPC(chain.enum)) {
    return rpcService.requestCustomRPC(chain.enum, method, params);
  }
  const { data } = await axios.post(chain.rpc, {
    id: getUniqueId(),
    jsonrpc: '2.0',
    method,
    params,
  });
  if (data?.error) {
    throw data.error;
  }
  return data?.result;
};

export const getTx = async (
  chainId: string,
  hash: string,
  gasPrice: number
): Promise<GetTxResponse> => {
  const result = await openapiService.getTx(chainId, hash, gasPrice);
  if (result.code === -2) {
    const chain = Object.values(CHAINS).find((i) => i.serverId === chainId);
    if (!chain) throw `chainId ${chainId} not found`;
    const res = await requestRPC({
      method: 'eth_getTransactionReceipt',
      params: [hash],
      chainServerId: chainId,
    });
    if (res) {
      return {
        ...res,
        code: 0,
        hash,
        status: Number(res.status) === 0 ? -1 : 1,
        gas_used: Number(res.gasUsed),
        gasPrice: Number(res.effectiveGasPrice),
        token: {
          amount: 0,
          chain: chain.serverId,
          decimals: 18,
          display_symbol: chain.nativeTokenSymbol,
          id: chain.nativeTokenAddress,
          is_core: true,
          is_verified: true,
          is_wallet: true,
          logo_url: chain.nativeTokenLogo,
          name: chain.nativeTokenSymbol,
          optimized_symbol: chain.nativeTokenSymbol,
          price: 0,
          symbol: chain.nativeTokenSymbol,
          time_at: 0,
        },
      };
    } else {
      return {
        status: 0,
        blockHash: '',
        blockNumber: '',
        from: '',
        gas: '',
        gasPrice: '',
        hash: hash,
        input: '',
        nonce: '',
        to: '',
        transactionIndex: '',
        value: '',
        type: '',
        v: '',
        r: '',
        s: '',
        front_tx_count: 0,
        code: 0,
        gas_used: 0,
        token: {
          amount: 0,
          chain: chain.serverId,
          decimals: 18,
          display_symbol: chain.nativeTokenSymbol,
          id: chain.nativeTokenAddress,
          is_core: true,
          is_verified: true,
          is_wallet: true,
          logo_url: chain.nativeTokenLogo,
          name: chain.nativeTokenSymbol,
          optimized_symbol: chain.nativeTokenSymbol,
          price: 0,
          symbol: chain.nativeTokenSymbol,
          time_at: 0,
        },
      };
    }
  }
  return result;
};
