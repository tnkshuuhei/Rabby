import { Account } from '@/background/service/preference';
import {
  KEYRING_CLASS,
  WALLET_BRAND_CONTENT,
  WALLET_BRAND_TYPES,
} from '@/constant';
import { AddressViewer } from '@/ui/component';
import useCurrentBalance from '@/ui/hooks/useCurrentBalance';
import { splitNumberByStep, useWallet } from '@/ui/utils';
import clsx from 'clsx';
import React from 'react';
import { WalletConnectAccount } from './WalletConnectAccount';
import { Chain } from '@debank/common';
import { LedgerAccount } from './LedgerAccount';
import { CommonAccount } from './CommonAccount';

export interface Props {
  account: Account;
  chain?: Chain;
}

export const AccountInfo: React.FC<Props> = ({ account, chain }) => {
  const [nickname, setNickname] = React.useState<string>();
  const [balance] = useCurrentBalance(account?.address);
  const displayBalance = splitNumberByStep((balance || 0).toFixed(2));
  const wallet = useWallet();

  const init = async () => {
    const result = await wallet.getAlianName(
      account?.address?.toLowerCase() || ''
    );
    setNickname(result);
  };

  React.useEffect(() => {
    init();
  }, [account]);

  return (
    <div
      className={clsx(
        'bg-[#EFF1FC] rounded-[8px]',
        'py-[14px] px-[16px]',
        'space-y-10'
      )}
    >
      <div className={clsx('flex items-center justify-between')}>
        <div className="space-x-6 flex items-center">
          <div className="text-gray-title text-15">{nickname}</div>
          <AddressViewer
            showArrow={false}
            address={account.address}
            className={clsx('text-13 text-gray-subTitle')}
          />
        </div>
        <div title={displayBalance}>${displayBalance}</div>
      </div>
      {account?.type === KEYRING_CLASS.WALLETCONNECT && (
        <WalletConnectAccount chain={chain} account={account} />
      )}
      {account?.type === KEYRING_CLASS.HARDWARE.LEDGER && <LedgerAccount />}
      {account?.type === KEYRING_CLASS.HARDWARE.ONEKEY && (
        <CommonAccount
          icon={WALLET_BRAND_CONTENT.ONEKEY.icon}
          tip="Import by OneKey"
        />
      )}
      {account?.type === KEYRING_CLASS.HARDWARE.TREZOR && (
        <CommonAccount
          icon={WALLET_BRAND_CONTENT.TREZOR.icon}
          tip="Import by Trezor"
        />
      )}
      {account?.type === KEYRING_CLASS.HARDWARE.BITBOX02 && (
        <CommonAccount
          icon={WALLET_BRAND_CONTENT.BITBOX02.icon}
          tip="Import by BitBox02"
        />
      )}
      {account?.brandName === WALLET_BRAND_TYPES.KEYSTONE && (
        <CommonAccount
          icon={WALLET_BRAND_CONTENT.Keystone.icon}
          tip="Import by Keystone"
        />
      )}
      {account?.brandName === WALLET_BRAND_TYPES.AIRGAP && (
        <CommonAccount
          icon={WALLET_BRAND_CONTENT.AirGap.icon}
          tip="Import by AirGap"
        />
      )}
      {account?.brandName === WALLET_BRAND_TYPES.COOLWALLET && (
        <CommonAccount
          icon={WALLET_BRAND_CONTENT.CoolWallet.icon}
          tip="Import by CoolWallet"
        />
      )}
    </div>
  );
};
